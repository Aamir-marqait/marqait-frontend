/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Canvas, FabricObject } from "fabric";
import { CanvasEditor } from "./CanvasEditor";
import { ControlsPanel } from "./ControlsPanel";
import { CropTool } from "./CropTool";
import type { AspectRatio, CropData } from "./CropTool";

interface ImageEditorProps {
  imageUrl: string;
  onClose: () => void;
  // AI Flow Integration
  aiGeneratedData?: {
    prompt?: string;
    textContent?: string;
    suggestedColors?: string[];
    style?: 'modern' | 'classic' | 'creative' | 'minimal';
  };
  onPublish?: (exportedImageUrl: string, metadata?: any) => void;
  onSchedule?: (exportedImageUrl: string, scheduleData: any) => void;
  draftId?: string; // For loading existing drafts
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
  // Text Effects
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
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

export function ImageEditor({ 
  imageUrl, 
  onClose, 
  aiGeneratedData,
  onPublish,
  onSchedule,
  draftId 
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

  // Crop tool state
  const [isCropActive, setIsCropActive] = useState(false);
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('freeform');
  const [originalImageUrl, setOriginalImageUrl] = useState(imageUrl);

  // AI Flow Integration: Initialize with AI-generated content or load draft
  useEffect(() => {
    const initializeEditor = async () => {
      // Load from draft if draftId provided
      if (draftId) {
        await loadFromDraft(draftId);
        return; // loadFromDraft handles state restoration
      }

      // Initialize with AI-generated data
      if (aiGeneratedData) {
        const aiTextLayers: TextLayer[] = [];
        
        // Add AI-generated heading
        if (aiGeneratedData.textContent) {
          const lines = aiGeneratedData.textContent.split('\n');
          const heading = lines[0];
          const paragraph = lines.slice(1).join('\n');

          if (heading) {
            aiTextLayers.push({
              id: `ai-heading-${Date.now()}`,
              type: 'heading',
              content: heading,
              x: 100,
              y: 50,
              fontSize: 32,
              color: aiGeneratedData.suggestedColors?.[0] || '#000000',
              fontFamily: getStyleFont(aiGeneratedData.style),
              fontWeight: 'bold',
              textAlign: 'center',
              backgroundColor: 'transparent',
              scaleX: 1,
              scaleY: 1,
              rotation: 0,
              opacity: 1,
            });
          }

          if (paragraph) {
            aiTextLayers.push({
              id: `ai-paragraph-${Date.now()}`,
              type: 'paragraph',
              content: paragraph,
              x: 50,
              y: 120,
              fontSize: 16,
              color: aiGeneratedData.suggestedColors?.[1] || '#333333',
              fontFamily: getStyleFont(aiGeneratedData.style),
              fontWeight: 'normal',
              textAlign: 'left',
              backgroundColor: 'transparent',
              scaleX: 1,
              scaleY: 1,
              rotation: 0,
              opacity: 1,
            });
          }
        }

        setTextLayers(aiTextLayers);
      }
    };

    initializeEditor();
  }, [draftId, aiGeneratedData]);

  // Helper function to get font based on AI style
  const getStyleFont = (style?: string) => {
    switch (style) {
      case 'modern': return 'Arial';
      case 'classic': return 'Times New Roman';
      case 'creative': return 'Comic Sans MS';
      case 'minimal': return 'Helvetica';
      default: return 'Arial';
    }
  };

  const sendToBack = (id: string) => {
    console.log('ImageEditor sendToBack called with:', id);
    
    if (!canvasRef) {
      console.log('Cannot call sendObjectToBack - canvas not available');
      return;
    }
    
    const obj = canvasRef.getObjects().find(
      (obj: FabricObject & { data?: { id: string } }) => obj.data?.id === id
    );
    
    if (obj) {
      console.log('✅ Found object to move behind:', obj.type);
      canvasRef.sendObjectToBack(obj);
      canvasRef.renderAll();
      console.log('✅ Object sent to back successfully');
    } else {
      console.log('❌ Object not found with id:', id);
    }
  };

  const bringToFront = (id: string) => {
    console.log('ImageEditor bringToFront called with:', id);
    
    if (!canvasRef) {
      console.log('Cannot call bringObjectToFront - canvas not available');
      return;
    }
    
    const obj = canvasRef.getObjects().find(
      (obj: FabricObject & { data?: { id: string } }) => obj.data?.id === id
    );
    
    if (obj) {
      console.log('✅ Found object to move to front:', obj.type);
      canvasRef.bringObjectToFront(obj);
      canvasRef.renderAll();
      console.log('✅ Object brought to front successfully');
    } else {
      console.log('❌ Object not found with id:', id);
    }
  };

  const updateMediaLayer = (id: string, updates: Partial<MediaLayer>) => {
    setMediaLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  const addMediaLayer = (layer: MediaLayer) => {
    const optimalPos = findOptimalPosition(layer.width, layer.height);
    const optimizedLayer = {
      ...layer,
      x: optimalPos.x,
      y: optimalPos.y
    };
    setMediaLayers((prev) => [...prev, optimizedLayer]);
  };

  const removeLayer = (id: string) => {
    setTextLayers((prev) => prev.filter((layer) => layer.id !== id));
    setMediaLayers((prev) => prev.filter((layer) => layer.id !== id));
    
    // Remove from canvas
    if (canvasRef) {
      const objectsToRemove = canvasRef.getObjects().filter(
        (obj: any) => obj.data?.id === id
      );
      objectsToRemove.forEach((obj) => canvasRef.remove(obj));
      canvasRef.renderAll();
    }
  };

  // Smart positioning with hierarchical layout - headings at top, paragraphs below
  const findOptimalPosition = (newObjWidth: number, newObjHeight: number, textType?: TextLayer["type"]) => {
    if (!canvasRef) return { x: 100, y: 100 };
    
    const canvasWidth = 800;
    const canvasHeight = 600;
    const objects = canvasRef.getObjects();
    const margin = 20;

    // Get existing text layers for hierarchical positioning
    const existingTextObjects = objects.filter((obj: any) => 
      obj.data?.type === 'text' && obj !== canvasRef.backgroundImage
    );

    // Find headings and their positions
    const headings = existingTextObjects.filter((obj: any) => {
      const correspondingLayer = textLayers.find(layer => layer.id === obj.data?.id);
      return correspondingLayer?.type === 'heading';
    });

    // Find paragraphs and their positions  
    const paragraphs = existingTextObjects.filter((obj: any) => {
      const correspondingLayer = textLayers.find(layer => layer.id === obj.data?.id);
      return correspondingLayer?.type === 'paragraph';
    });

    if (textType === 'heading') {
      // Position headings at the top
      const topY = margin;
      const centerX = (canvasWidth - newObjWidth) / 2;
      
      // If there are already headings, position below them
      if (headings.length > 0) {
        const lowestHeading = headings.reduce((lowest, current) => {
          const currentBottom = current.getBoundingRect().top + current.getBoundingRect().height;
          const lowestBottom = lowest.getBoundingRect().top + lowest.getBoundingRect().height;
          return currentBottom > lowestBottom ? current : lowest;
        });
        const newY = lowestHeading.getBoundingRect().top + lowestHeading.getBoundingRect().height + 20;
        return { x: centerX, y: newY };
      }
      
      return { x: centerX, y: topY };
    }

    if (textType === 'paragraph') {
      // Position paragraphs below headings
      let startY = margin + 60; // Default starting position
      
      // If there are headings, start below the lowest heading
      if (headings.length > 0) {
        const lowestHeading = headings.reduce((lowest, current) => {
          const currentBottom = current.getBoundingRect().top + current.getBoundingRect().height;
          const lowestBottom = lowest.getBoundingRect().top + lowest.getBoundingRect().height;
          return currentBottom > lowestBottom ? current : lowest;
        });
        startY = lowestHeading.getBoundingRect().top + lowestHeading.getBoundingRect().height + 30;
      }

      // Position paragraphs below existing paragraphs
      if (paragraphs.length > 0) {
        const lowestParagraph = paragraphs.reduce((lowest, current) => {
          const currentBottom = current.getBoundingRect().top + current.getBoundingRect().height;
          const lowestBottom = lowest.getBoundingRect().top + lowest.getBoundingRect().height;
          return currentBottom > lowestBottom ? current : lowest;
        });
        startY = Math.max(startY, lowestParagraph.getBoundingRect().top + lowestParagraph.getBoundingRect().height + 20);
      }

      const leftX = margin + 20; // Slightly indented from left
      return { x: leftX, y: startY };
    }

    // For other types (emoji, custom), use the original grid-based positioning
    const gridSize = 20;
    for (let y = margin; y <= canvasHeight - newObjHeight - margin; y += gridSize) {
      for (let x = margin; x <= canvasWidth - newObjWidth - margin; x += gridSize) {
        let overlaps = false;
        
        for (const obj of objects) {
          const objWithData = obj as any;
          if (!objWithData.data || obj === canvasRef.backgroundImage) continue;
          
          const objBounds = obj.getBoundingRect();
          const newBounds = { left: x, top: y, width: newObjWidth, height: newObjHeight };
          
          if (!(newBounds.left + newBounds.width < objBounds.left ||
                objBounds.left + objBounds.width < newBounds.left ||
                newBounds.top + newBounds.height < objBounds.top ||
                objBounds.top + objBounds.height < newBounds.top)) {
            overlaps = true;
            break;
          }
        }
        
        if (!overlaps) return { x, y };
      }
    }
    
    return { x: 50 + (objects.length * 20), y: 50 + (objects.length * 20) };
  };

  const addTextLayer = (
    type: TextLayer["type"] = "custom",
    customContent?: string
  ) => {
    // Estimate text dimensions for positioning
    const fontSize = type === "heading" ? 32 : type === "emoji" ? 48 : 16;
    const estimatedWidth = (customContent || "New Text").length * (fontSize * 0.6);
    const estimatedHeight = fontSize + 10;
    
    const optimalPos = findOptimalPosition(estimatedWidth, estimatedHeight, type);
    
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      type,
      content:
        customContent ||
        (type === "emoji"
          ? "😊"
          : type === "heading"
          ? "New Heading"
          : type === "paragraph"
          ? "New paragraph text"
          : "New Text"),
      x: optimalPos.x,
      y: optimalPos.y,
      fontSize,
      color: "#000000",
      fontFamily: type === "heading" ? "Arial Black" : "Arial",
      fontWeight: type === "heading" ? "bold" : "normal",
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
    setTextLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  const updateImageFilters = (filters: Partial<ImageFilters>) => {
    setImageFilters((prev) => ({ ...prev, ...filters }));
  };

  // Crop functionality
  const toggleCropTool = () => {
    setIsCropActive(!isCropActive);
    setCropData(null);
  };

  const handleCropChange = (newCropData: CropData | null) => {
    console.log('Crop data changed:', newCropData);
    setCropData(newCropData);
  };

  const handleCropAspectRatioChange = (newRatio: AspectRatio) => {
    setAspectRatio(newRatio);
  };

  const applyCrop = async () => {
    console.log('Apply crop called');
    console.log('Canvas ref:', !!canvasRef);
    console.log('Crop data:', cropData);
    
    if (!canvasRef || !cropData) {
      console.error('Missing canvas or crop data');
      alert('No crop area selected. Please select an area to crop first.');
      return;
    }

    try {
      console.log('Starting crop operation...');
      
      // Create a canvas for cropping
      const cropCanvas = document.createElement('canvas');
      const ctx = cropCanvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }

      // Load the original image
      const originalImg = new Image();
      originalImg.crossOrigin = 'anonymous';
      
      originalImg.onload = () => {
        console.log('Original image loaded:', {
          width: originalImg.width,
          height: originalImg.height
        });
        
        // Set crop canvas size to match the desired output
        cropCanvas.width = Math.round(cropData.imageWidth);
        cropCanvas.height = Math.round(cropData.imageHeight);

        // Use the precise image coordinates from the crop data
        const srcX = Math.max(0, Math.round(cropData.imageX));
        const srcY = Math.max(0, Math.round(cropData.imageY));
        const srcWidth = Math.min(Math.round(cropData.imageWidth), originalImg.width - srcX);
        const srcHeight = Math.min(Math.round(cropData.imageHeight), originalImg.height - srcY);

        console.log('Crop parameters:', {
          srcX, srcY, srcWidth, srcHeight,
          canvasWidth: cropCanvas.width,
          canvasHeight: cropCanvas.height
        });

        // Draw the cropped portion with exact coordinates
        ctx.drawImage(
          originalImg,
          srcX, srcY, srcWidth, srcHeight,
          0, 0, cropCanvas.width, cropCanvas.height
        );

        // Convert to data URL and update the image
        const croppedImageUrl = cropCanvas.toDataURL('image/png', 1.0);
        console.log('Cropped image URL generated, length:', croppedImageUrl.length);
        
        setOriginalImageUrl(croppedImageUrl);

        // Clear existing layers since we're changing the base image
        setTextLayers([]);
        setMediaLayers([]);

        // Exit crop mode
        setIsCropActive(false);
        setCropData(null);
        
        console.log('Crop operation completed successfully');
      };

      originalImg.onerror = (error) => {
        console.error('Failed to load original image for cropping:', error);
        alert('Failed to load image for cropping. Please try again.');
      };

      console.log('Loading original image from URL:', originalImageUrl.substring(0, 50) + '...');
      originalImg.src = originalImageUrl;
    } catch (error) {
      console.error('Crop failed:', error);
      alert('Crop failed. Please try again.');
    }
  };

  const cancelCrop = () => {
    setIsCropActive(false);
    setCropData(null);
  };

  // Enhanced Export System
  const exportImage = async (format: 'png' | 'jpeg' | 'pdf' = 'png') => {
    if (!canvasRef) return;

    try {
      if (format === 'pdf') {
        await exportToPDF();
      } else {
        const dataURL = canvasRef.toDataURL({
          format: format,
          quality: format === 'jpeg' ? 0.9 : 1,
          multiplier: 2, // Higher resolution
        });

        const link = document.createElement("a");
        link.download = `edited-image-${Date.now()}.${format}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const exportToPDF = async () => {
    if (!canvasRef) return;
    
    try {
      // Use jsPDF for PDF export
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const dataURL = canvasRef.toDataURL({
        format: 'jpeg',
        quality: 0.95,
        multiplier: 2,
      });
      
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvasRef.height / canvasRef.width) * imgWidth;
      
      pdf.addImage(dataURL, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`edited-image-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      // Fallback to PNG export
      exportImage('png');
    }
  };

  // Save as Draft / JSON State Management
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

      // Save to localStorage for now (can be replaced with database later)
      const existingDrafts = JSON.parse(localStorage.getItem('imageDrafts') || '[]');
      const updatedDrafts = [...existingDrafts, projectData];
      localStorage.setItem('imageDrafts', JSON.stringify(updatedDrafts));

      return projectData.id;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return null;
    }
  };

  const loadFromDraft = async (draftId: string) => {
    try {
      const existingDrafts = JSON.parse(localStorage.getItem('imageDrafts') || '[]');
      const draft = existingDrafts.find((d: any) => d.id === draftId);
      
      if (!draft) {
        console.error('Draft not found');
        return;
      }

      // Restore state
      setTextLayers(draft.textLayers);
      setMediaLayers(draft.mediaLayers);
      setImageFilters(draft.imageFilters);

      // Canvas will be restored via the canvasState when canvas is ready
      return draft.canvasState;
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  // Post-Edit Publishing Workflow
  const publishImage = async () => {
    if (!canvasRef || !onPublish) return;

    try {
      const dataURL = canvasRef.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });

      const metadata = {
        textLayers: textLayers.length,
        mediaLayers: mediaLayers.length,
        dimensions: {
          width: canvasRef.width,
          height: canvasRef.height,
        },
        createdAt: Date.now(),
        aiPrompt: aiGeneratedData?.prompt,
      };

      onPublish(dataURL, metadata);
      onClose();
    } catch (error) {
      console.error('Publishing failed:', error);
    }
  };

  const scheduleImage = async () => {
    if (!canvasRef || !onSchedule) return;

    const scheduledTime = prompt('Schedule for when? (e.g., "2025-01-01 10:00")');
    if (!scheduledTime) return;

    try {
      const dataURL = canvasRef.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });

      const scheduleData = {
        scheduledTime: new Date(scheduledTime),
        textContent: textLayers.map(l => l.content).join(' '),
        metadata: {
          textLayers: textLayers.length,
          mediaLayers: mediaLayers.length,
          aiPrompt: aiGeneratedData?.prompt,
        },
      };

      onSchedule(dataURL, scheduleData);
      onClose();
    } catch (error) {
      console.error('Scheduling failed:', error);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white dark:bg-gray-800 w-full min-h-[600px] flex relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to main"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Manual Editor
            </h2>
          </div>
          <div className="flex gap-2">
            {/* AI Flow Integration Buttons */}
            {onPublish && (
              <button
                onClick={publishImage}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                title="Publish to platform"
              >
                Publish
              </button>
            )}
            
            {onSchedule && (
              <button
                onClick={scheduleImage}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                title="Schedule for later"
              >
                Schedule
              </button>
            )}
            
            {/* Export Dropdown */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const format = e.target.value as 'png' | 'jpeg' | 'pdf';
                  if (format) exportImage(format);
                  e.target.value = '';
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Export as...</option>
                <option value="png">PNG (High Quality)</option>
                <option value="jpeg">JPEG (Compressed)</option>
                <option value="pdf">PDF Document</option>
              </select>
            </div>
            
            {/* Save as Draft */}
            <button
              onClick={() => {
                const draftId = saveAsDraft();
                if (draftId) {
                  alert('Draft saved successfully!');
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="Save current work as draft"
            >
              Save Draft
            </button>
            
          </div>
        </div>

        {/* Main Content */}
        <div className="flex w-full pt-16">
          {/* Canvas Area */}
          <div className="flex-1 p-4">
            <CanvasEditor
              imageUrl={originalImageUrl}
              textLayers={textLayers}
              mediaLayers={mediaLayers}
              imageFilters={imageFilters}
              onCanvasReady={setCanvasRef}
              onTextLayerUpdate={updateTextLayer}
              onMediaLayerUpdate={updateMediaLayer}
            />
            
            {/* Crop Tool Overlay */}
            <CropTool
              canvas={canvasRef}
              isActive={isCropActive}
              aspectRatio={aspectRatio}
              onCropChange={handleCropChange}
            />
          </div>

          {/* Controls Panel */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700">
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
        </div>
      </div>
    </div>
  );
}
