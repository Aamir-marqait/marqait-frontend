/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Canvas, FabricObject } from "fabric";
import { CanvasEditor } from "./CanvasEditor";
import { ControlsPanel } from "./ControlsPanel";
import { CropTool, type CropData, type AspectRatio } from "./CropTool";
import { LeftPalette } from "./left-palette";
import { MoreVertical } from 'lucide-react';

export interface ImageEditorProps {
  imageUrl: string;
  onClose: () => void;
  aiGeneratedData?: {
    prompt?: string;
    textContent?: string;
    suggestedColors?: string[];
    style?: "modern" | "classic" | "creative" | "minimal";
  };
  onPublish?: (exportedImageUrl: string, metadata?: any) => void;
  onSchedule?: (exportedImageUrl: string, scheduleData: any) => void;
  draftId?: string;
}

export interface TextLayer {
  id: string;
  type: "heading" | "paragraph" | "emoji" | "custom";
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  textAlign: "left" | "center" | "right" | "justify";
  backgroundColor: string;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
  shadow?: { color: string; blur: number; offsetX: number; offsetY: number };
  gradient?: {
    enabled: boolean;
    startColor: string;
    endColor: string;
    direction: "vertical" | "horizontal";
  };
}

export interface MediaLayer {
  id: string;
  type: "image" | "emoji-media";
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  sepia: number;
  blur: number;
  grayscale: number;
}

export type { AspectRatio, CropData } from "./CropTool";

export function ImageEditor({
  imageUrl,
  onClose,
  aiGeneratedData,
  onPublish,
  onSchedule,
  draftId,
}: ImageEditorProps) {
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [mediaLayers, setMediaLayers] = useState<MediaLayer[]>([]);
  const [canvasRef, setCanvasRef] = useState<Canvas | null>(null);
  const [imageFilters, setImageFilters] = useState<ImageFilters>({
    brightness: 0,
    contrast: 0,
    sepia: 0,
    blur: 0,
    grayscale: 0,
  });

  // Crop
  const [isCropActive, setIsCropActive] = useState(false);
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("freeform");
  const [originalImageUrl, setOriginalImageUrl] = useState(imageUrl);

  // Init: keep original logic, only text defaults/colors adapted to UI
  useEffect(() => {
    const initializeEditor = async () => {
      if (draftId) {
        await loadFromDraft(draftId);
        return;
      }
      if (aiGeneratedData?.textContent) {
        const lines = aiGeneratedData.textContent.split("\n");
        const heading = lines[0];
        const paragraph = lines.slice(1).join("\n");
        const aiLayers: TextLayer[] = [];
        if (heading) {
          aiLayers.push({
            id: `ai-heading-${Date.now()}`,
            type: "heading",
            content: heading,
            x: 100,
            y: 50,
            fontSize: 32,
            color: aiGeneratedData.suggestedColors?.[0] || "#1F2937",
            fontFamily: getStyleFont(aiGeneratedData.style),
            fontWeight: "700",
            textAlign: "center",
            backgroundColor: "transparent",
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            opacity: 1,
          });
        }
        if (paragraph) {
          aiLayers.push({
            id: `ai-paragraph-${Date.now()}`,
            type: "paragraph",
            content: paragraph,
            x: 50,
            y: 120,
            fontSize: 16,
            color: aiGeneratedData.suggestedColors?.[1] || "#334155",
            fontFamily: getStyleFont(aiGeneratedData.style),
            fontWeight: "400",
            textAlign: "left",
            backgroundColor: "transparent",
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            opacity: 1,
          });
        }
        setTextLayers(aiLayers);
      }
    };
    initializeEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId, aiGeneratedData?.textContent]);

  const getStyleFont = (style?: string) => {
    switch (style) {
      case "modern":
      case "minimal":
        return "Inter, Arial, sans-serif";
      case "classic":
        return "Times New Roman, serif";
      case "creative":
        return "Comic Sans MS, cursive";
      default:
        return "Inter, Arial, sans-serif";
    }
  };

  // Layer helpers — unchanged functionality
  const sendToBack = (id: string) => {
    if (!canvasRef) return;
    const obj = canvasRef.getObjects().find(
      (o: FabricObject & { data?: { id: string } }) => o.data?.id === id
    );
    if (obj) {
      canvasRef.sendObjectToBack(obj);
      canvasRef.renderAll();
    }
  };

  const bringToFront = (id: string) => {
    if (!canvasRef) return;
    const obj = canvasRef.getObjects().find(
      (o: FabricObject & { data?: { id: string } }) => o.data?.id === id
    );
    if (obj) {
      canvasRef.bringObjectToFront(obj);
      canvasRef.renderAll();
    }
  };

  const updateMediaLayer = (id: string, updates: Partial<MediaLayer>) => {
    setMediaLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const addMediaLayer = (layer: MediaLayer) => {
    const pos = findOptimalPosition(layer.width, layer.height);
    setMediaLayers((prev) => [...prev, { ...layer, x: pos.x, y: pos.y }]);
  };

  const removeLayer = (id: string) => {
    setTextLayers((p) => p.filter((l) => l.id !== id));
    setMediaLayers((p) => p.filter((l) => l.id !== id));
    if (canvasRef) {
      const toRemove = canvasRef.getObjects().filter((o: any) => o.data?.id === id);
      toRemove.forEach((o) => canvasRef.remove(o));
      canvasRef.renderAll();
    }
  };

  const findOptimalPosition = (
    newObjWidth: number,
    newObjHeight: number,
    textType?: TextLayer["type"]
  ) => {
    if (!canvasRef) return { x: 100, y: 100 };
    const canvasWidth = 800;
    const canvasHeight = 600;
    const objects = canvasRef.getObjects();
    const margin = 20;

    const textObjects = objects.filter(
      (obj: any) => obj.data?.type === "text" && obj !== (canvasRef as any).backgroundImage
    );

    const headings = textObjects.filter((obj: any) => {
      const layer = textLayers.find((l) => l.id === obj.data?.id);
      return layer?.type === "heading";
    });
    const paragraphs = textObjects.filter((obj: any) => {
      const layer = textLayers.find((l) => l.id === obj.data?.id);
      return layer?.type === "paragraph";
    });

    if (textType === "heading") {
      const topY = margin;
      const centerX = (canvasWidth - newObjWidth) / 2;
      if (headings.length > 0) {
        const lowest = headings.reduce((lo, cur) => {
          const cb = cur.getBoundingRect();
          const lb = lo.getBoundingRect();
          return cb.top + cb.height > lb.top + lb.height ? cur : lo;
        });
        const newY = lowest.getBoundingRect().top + lowest.getBoundingRect().height + 20;
        return { x: centerX, y: newY };
      }
      return { x: centerX, y: topY };
    }

    if (textType === "paragraph") {
      let startY = margin + 60;
      if (headings.length > 0) {
        const lowest = headings.reduce((lo, cur) => {
          const cb = cur.getBoundingRect();
          const lb = lo.getBoundingRect();
          return cb.top + cb.height > lb.top + lb.height ? cur : lo;
        });
        startY = lowest.getBoundingRect().top + lowest.getBoundingRect().height + 30;
      }
      if (paragraphs.length > 0) {
        const lowest = paragraphs.reduce((lo, cur) => {
          const cb = cur.getBoundingRect();
          const lb = lo.getBoundingRect();
          return cb.top + cb.height > lb.top + lb.height ? cur : lo;
        });
        startY = Math.max(startY, lowest.getBoundingRect().top + lowest.getBoundingRect().height + 20);
      }
      return { x: margin + 20, y: startY };
    }

    const gridSize = 20;
    for (let y = margin; y <= canvasHeight - newObjHeight - margin; y += gridSize) {
      for (let x = margin; x <= canvasWidth - newObjWidth - margin; x += gridSize) {
        let overlaps = false;
        for (const obj of objects) {
          const d: any = obj;
          if (!d.data || obj === (canvasRef as any).backgroundImage) continue;
          const ob = obj.getBoundingRect();
          const nb = { left: x, top: y, width: newObjWidth, height: newObjHeight };
          if (!(
            nb.left + nb.width < ob.left ||
            ob.left + ob.width < nb.left ||
            nb.top + nb.height < ob.top ||
            ob.top + ob.height < nb.top
          )) {
            overlaps = true;
            break;
          }
        }
        if (!overlaps) return { x, y };
      }
    }
    return { x: 50 + objects.length * 20, y: 50 + objects.length * 20 };
  };

  const addTextLayer = (type: TextLayer["type"] = "custom", customContent?: string) => {
    const fontSize = type === "heading" ? 32 : type === "emoji" ? 48 : 16;
    const estWidth = (customContent || "New Text").length * (fontSize * 0.6);
    const estHeight = fontSize + 10;
    const pos = findOptimalPosition(estWidth, estHeight, type);

    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      type,
      content:
        customContent ||
        (type === "emoji" ? "😊" : type === "heading" ? "New Headline" : type === "paragraph" ? "Add body text" : "New Text"),
      x: pos.x,
      y: pos.y,
      fontSize,
      color: "#0F172A",
      fontFamily: type === "heading" ? "Inter, Arial Black, Arial" : "Inter, Arial",
      fontWeight: type === "heading" ? "700" : "400",
      textAlign: type === "emoji" ? "center" : type === "heading" ? "center" : "left",
      backgroundColor: "transparent",
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      opacity: 1,
      shadow: undefined,
      gradient: undefined,
    };
    setTextLayers((prev) => [...prev, newLayer]);
  };

  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const updateImageFilters = (filters: Partial<ImageFilters>) => {
    setImageFilters((prev) => ({ ...prev, ...filters }));
  };

  // Crop controls — unchanged logic
  const toggleCropTool = () => {
    setIsCropActive((v) => !v);
    setCropData(null);
  };
  const handleCropChange = (d: CropData | null) => setCropData(d);
  const handleCropAspectRatioChange = (r: AspectRatio) => setAspectRatio(r);

  const applyCrop = async () => {
    if (!canvasRef || !cropData) {
      alert("No crop area selected. Please select an area to crop first.");
      return;
    }
    try {
      const cropCanvas = document.createElement("canvas");
      const ctx = cropCanvas.getContext("2d");
      if (!ctx) return;
      const originalImg = new Image();
      originalImg.crossOrigin = "anonymous";
      originalImg.onload = () => {
        cropCanvas.width = Math.round(cropData.imageWidth);
        cropCanvas.height = Math.round(cropData.imageHeight);
        const srcX = Math.max(0, Math.round(cropData.imageX));
        const srcY = Math.max(0, Math.round(cropData.imageY));
        const srcWidth = Math.min(Math.round(cropData.imageWidth), originalImg.width - srcX);
        const srcHeight = Math.min(Math.round(cropData.imageHeight), originalImg.height - srcY);
        ctx.drawImage(originalImg, srcX, srcY, srcWidth, srcHeight, 0, 0, cropCanvas.width, cropCanvas.height);
        const croppedImageUrl = cropCanvas.toDataURL("image/png", 1.0);
        setOriginalImageUrl(croppedImageUrl);
        setTextLayers([]);
        setMediaLayers([]);
        setIsCropActive(false);
        setCropData(null);
      };
      originalImg.onerror = () => alert("Failed to load image for cropping. Please try again.");
      originalImg.src = originalImageUrl;
    } catch {
      alert("Crop failed. Please try again.");
    }
  };

  const cancelCrop = () => {
    setIsCropActive(false);
    setCropData(null);
  };

  // Export / Save / Publish / Schedule — unchanged
  const exportImage = async (format: "png" | "jpeg" | "pdf" = "png") => {
    if (!canvasRef) return;
    try {
      if (format === "pdf") {
        await exportToPDF();
      } else {
        const dataURL = canvasRef.toDataURL({
          format,
          quality: format === "jpeg" ? 0.9 : 1,
          multiplier: 2,
        });
        const link = document.createElement("a");
        link.download = `edited-image-${Date.now()}.${format}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // noop
    }
  };

  const exportToPDF = async () => {
    if (!canvasRef) return;
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const dataURL = canvasRef.toDataURL({ format: "jpeg", quality: 0.95, multiplier: 2 });
      const imgWidth = 297;
      const imgHeight = (canvasRef.height / canvasRef.width) * imgWidth;
      pdf.addImage(dataURL, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save(`edited-image-${Date.now()}.pdf`);
    } catch {
      exportImage("png");
    }
  };

  const saveAsDraft = (draftName?: string) => {
    if (!canvasRef) return null;
    try {
      const canvasState = canvasRef.toJSON();
      const projectData = {
        id: `draft-${Date.now()}`,
        name: draftName || `Draft ${new Date().toLocaleDateString()}`,
        timestamp: Date.now(),
        originalImageUrl: imageUrl,
        canvasState,
        textLayers,
        mediaLayers,
        imageFilters,
        canvasWidth: canvasRef.width,
        canvasHeight: canvasRef.height,
      };
      const existingDrafts = JSON.parse(localStorage.getItem("imageDrafts") || "[]");
      const updatedDrafts = [...existingDrafts, projectData];
      localStorage.setItem("imageDrafts", JSON.stringify(updatedDrafts));
      return projectData.id;
    } catch {
      return null;
    }
  };

  const loadFromDraft = async (draftId: string) => {
    try {
      const existingDrafts = JSON.parse(localStorage.getItem("imageDrafts") || "[]");
      const draft = existingDrafts.find((d: any) => d.id === draftId);
      if (!draft) return;
      setTextLayers(draft.textLayers);
      setMediaLayers(draft.mediaLayers);
      setImageFilters(draft.imageFilters);
      return draft.canvasState;
    } catch {
      // noop
    }
  };

  const publishImage = async () => {
    if (!canvasRef || !onPublish) return;
    try {
      const dataURL = canvasRef.toDataURL({ format: "png", quality: 1, multiplier: 2 });
      const metadata = {
        textLayers: textLayers.length,
        mediaLayers: mediaLayers.length,
        dimensions: { width: canvasRef.width, height: canvasRef.height },
        createdAt: Date.now(),
        aiPrompt: aiGeneratedData?.prompt,
      };
      onPublish(dataURL, metadata);
      onClose();
    } catch {
      // noop
    }
  };

  const scheduleImage = async () => {
    if (!canvasRef || !onSchedule) return;
    const scheduledTime = prompt('Schedule for when? (e.g., "2025-01-01 10:00")');
    if (!scheduledTime) return;
    try {
      const dataURL = canvasRef.toDataURL({ format: "png", quality: 1, multiplier: 2 });
      const scheduleData = {
        scheduledTime: new Date(scheduledTime),
        textContent: textLayers.map((l) => l.content).join(" "),
        metadata: {
          textLayers: textLayers.length,
          mediaLayers: mediaLayers.length,
          aiPrompt: aiGeneratedData?.prompt,
        },
      };
      onSchedule(dataURL, scheduleData);
      onClose();
    } catch {
      // noop
    }
  };

  // Centered "Hello World!" pure visual (doesn't affect canvas)
  const centerHello = useMemo(
    () => (
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-[16px] font-semibold text-[#1F2937]">{'Hello World!'}</div>
      </div>
    ),
    []
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="mx-auto my-4 w-full max-w-[1200px] rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-14 px-4 md:px-6 border-b border-neutral-200 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 text-neutral-600"
              aria-label="Back"
              title="Back"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="text-[15px] font-medium text-neutral-800">{'Editing the image'}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* overflow actions preserved */}
            <details className="relative">
              <summary className="list-none inline-flex h-9 items-center rounded-md px-2 text-neutral-500 hover:bg-neutral-100 cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-md border border-neutral-200 bg-white shadow-lg p-1">
                {onPublish && (
                  <button onClick={publishImage} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-50">Publish</button>
                )}
                {onSchedule && (
                  <button onClick={scheduleImage} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-50">Schedule</button>
                )}
                <div className="my-1 h-px bg-neutral-200" />
                <button onClick={() => exportImage("png")} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-50">Export PNG</button>
                <button onClick={() => exportImage("jpeg")} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-50">Export JPEG</button>
                <button onClick={() => exportImage("pdf")} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-50">Export PDF</button>
              </div>
            </details>

            <button
              onClick={() => { saveAsDraft(); }}
              className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-semibold text-white shadow-sm bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] hover:opacity-95"
            >
              {'Save'}
            </button>
          </div>
        </header>

        {/* Body: exact three-column layout */}
        <div className="flex w-full bg-white">
          {/* Left sidebar */}
          <aside className="w-[240px] flex-shrink-0 bg-[#F6F7F9] border-r border-neutral-200">
            <LeftPalette
              onAddTextLayer={(type, content) => addTextLayer(type, content)}
              onAddMediaLayer={(layer) => addMediaLayer(layer)}
            />
          </aside>

          {/* Center area */}
          <main className="min-h-[560px] flex-1 min-w-0 bg-white">
            <div className="px-4 md:px-6 py-4">
              <div className="relative min-h-[520px] border border-neutral-200 rounded-lg bg-white overflow-hidden">
                <CanvasEditor
                  imageUrl={originalImageUrl}
                  textLayers={textLayers}
                  mediaLayers={mediaLayers}
                  imageFilters={imageFilters}
                  onCanvasReady={setCanvasRef}
                  onTextLayerUpdate={updateTextLayer}
                  onMediaLayerUpdate={updateMediaLayer}
                />
                <CropTool
                  canvas={canvasRef}
                  isActive={isCropActive}
                  aspectRatio={aspectRatio}
                  onCropChange={handleCropChange}
                />
                {centerHello}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-neutral-200 px-4 md:px-6 py-3 bg-white">
              <div className="flex items-center justify-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50" disabled title="Undo">
                  {"↶"} {"Undo"}
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50" disabled title="Redo">
                  {"↷"} {"Redo"}
                </button>
              </div>
            </div>
          </main>

          {/* Right controls panel — ALWAYS visible on desktop */}
          <aside className="w-[320px] flex-shrink-0 border-l border-neutral-200 bg-white">
            <div className="h-full w-full overflow-y-auto p-0">
              <ControlsPanel
                textLayers={textLayers}
                mediaLayers={mediaLayers}
                imageFilters={imageFilters}
                onUpdateTextLayer={updateTextLayer}
                onUpdateMediaLayer={updateMediaLayer}
                onUpdateImageFilters={updateImageFilters}
                onAddTextLayer={addTextLayer}
                onAddMediaLayer={addMediaLayer}
                onRemoveLayer={removeLayer}
                onSendToBack={sendToBack}
                onBringToFront={bringToFront}
                // Crop props
                cropData={cropData}
                aspectRatio={aspectRatio}
                isCropActive={isCropActive}
                onToggleCrop={toggleCropTool}
                onCropAspectRatioChange={handleCropAspectRatioChange}
                onApplyCrop={applyCrop}
                onCancelCrop={cancelCrop}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
