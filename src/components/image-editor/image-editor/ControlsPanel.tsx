"use client";

import { useMemo } from "react";
import type { TextLayer, MediaLayer, ImageFilters } from "./ImageEditor";
import { CropControls } from "./CropTool";
import type { AspectRatio, CropData } from "./CropTool";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  SendToBack,
  BringToFront,
  Copy,
  Trash2,
  Droplet,
} from "lucide-react";

interface ControlsPanelProps {
  textLayers: TextLayer[];
  mediaLayers: MediaLayer[];
  imageFilters: ImageFilters;
  onUpdateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  onUpdateMediaLayer: (id: string, updates: Partial<MediaLayer>) => void;
  onUpdateImageFilters: (filters: Partial<ImageFilters>) => void;
  onAddTextLayer: (type?: TextLayer["type"], customContent?: string) => void;
  onAddMediaLayer: (layer: MediaLayer) => void;
  onRemoveLayer: (id: string) => void;
  onSendToBack?: (id: string) => void;
  onBringToFront?: (id: string) => void;
  // Crop functionality
  cropData?: CropData | null;
  aspectRatio?: AspectRatio;
  isCropActive?: boolean;
  onToggleCrop?: () => void;
  onCropAspectRatioChange?: (ratio: AspectRatio) => void;
  onApplyCrop?: () => void;
  onCancelCrop?: () => void;
}

/**
+ Visual-only helpers (no business logic change)
*/
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <div className="text-sm font-medium text-neutral-600 mb-2">{title}</div>
      {children}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "h-8 w-8 inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white",
        "text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function ControlsPanel({
  textLayers,
  mediaLayers,
  onUpdateTextLayer,
  onUpdateMediaLayer,
  onAddTextLayer,
  onRemoveLayer,
  onSendToBack,
  onBringToFront,
  // Crop
  cropData,
  aspectRatio = "freeform",
  isCropActive = false,
  onToggleCrop,
  onCropAspectRatioChange,
  onApplyCrop,
  onCancelCrop,
}: ControlsPanelProps) {
  // Choose an "active" text layer (latest). This mirrors many editors’ defaults.
  const activeText = useMemo(
    () => (textLayers.length > 0 ? textLayers[textLayers.length - 1] : null),
    [textLayers]
  );

  // Choose an "active" media layer (latest) for opacity-only demo control
  const activeMedia = useMemo(
    () => (mediaLayers.length > 0 ? mediaLayers[mediaLayers.length - 1] : null),
    [mediaLayers]
  );

  const handleDuplicate = () => {
    if (!activeText) return;
    onAddTextLayer(activeText.type, activeText.content);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white px-3 py-4 space-y-4">
      {/* Position */}
      <Section title="Position">
        <div className="flex flex-wrap gap-2">
          <IconBtn
            title="Align left"
            disabled={!activeText}
            onClick={() =>
              activeText &&
              onUpdateTextLayer(activeText.id, { textAlign: "left" })
            }
          >
            <AlignLeft className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            title="Align center"
            disabled={!activeText}
            onClick={() =>
              activeText &&
              onUpdateTextLayer(activeText.id, { textAlign: "center" })
            }
          >
            <AlignCenter className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            title="Align right"
            disabled={!activeText}
            onClick={() =>
              activeText &&
              onUpdateTextLayer(activeText.id, { textAlign: "right" })
            }
          >
            <AlignRight className="h-4 w-4" />
          </IconBtn>
          <IconBtn title="Justify" disabled>
            <AlignJustify className="h-4 w-4" />
          </IconBtn>

          {/* Spacing to resemble screenshot’s button group count */}
          <IconBtn title="Placeholder" disabled>
            {"·"}
          </IconBtn>
          <IconBtn title="Placeholder" disabled>
            {"·"}
          </IconBtn>
          <IconBtn title="Placeholder" disabled>
            {"·"}
          </IconBtn>
          <IconBtn title="Placeholder" disabled>
            {"·"}
          </IconBtn>
          <IconBtn title="Placeholder" disabled>
            {"·"}
          </IconBtn>
        </div>
      </Section>

      {/* Layer */}
      <Section title="Layer">
        <div className="flex items-center gap-2">
          <IconBtn
            title="Send to back"
            disabled={!activeText || !onSendToBack}
            onClick={() =>
              activeText && onSendToBack && onSendToBack(activeText.id)
            }
          >
            <SendToBack className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            title="Bring to front"
            disabled={!activeText || !onBringToFront}
            onClick={() =>
              activeText && onBringToFront && onBringToFront(activeText.id)
            }
          >
            <BringToFront className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            title="Duplicate"
            disabled={!activeText}
            onClick={handleDuplicate}
          >
            <Copy className="h-4 w-4" />
          </IconBtn>
          <div className="ml-auto" />
          <IconBtn
            title="Delete"
            disabled={!activeText}
            onClick={() => activeText && onRemoveLayer(activeText.id)}
          >
            <Trash2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </Section>

      {/* Text */}
      <Section title="Text">
        {/* Top row: font family + size */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={activeText?.fontFamily || "Inter"}
              onChange={(e) =>
                activeText &&
                onUpdateTextLayer(activeText.id, { fontFamily: e.target.value })
              }
              className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 pr-8 text-sm text-neutral-800"
              style={{ fontFamily: activeText?.fontFamily || "Inter" }}
              disabled={!activeText}
              title="Font family"
            >
              <option>Inter</option>
              <option>Arial</option>
              <option>Helvetica</option>
              <option>Times New Roman</option>
              <option>Georgia</option>
              <option>Verdana</option>
              <option>Comic Sans MS</option>
            </select>
          </div>
          <div className="relative w-[84px]">
            <select
              value={activeText?.fontSize || 24}
              onChange={(e) =>
                activeText &&
                onUpdateTextLayer(activeText.id, {
                  fontSize: parseInt(e.target.value, 10),
                })
              }
              className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 pr-7 text-sm text-neutral-800"
              disabled={!activeText}
              title="Font size"
            >
              {[12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Style buttons */}
        <div className="mt-2 flex flex-wrap gap-2">
          <IconBtn
            title="Bold"
            disabled={!activeText}
            onClick={() =>
              activeText &&
              onUpdateTextLayer(activeText.id, {
                fontWeight:
                  activeText.fontWeight === "700" ||
                  activeText.fontWeight === "bold"
                    ? "400"
                    : "700",
              })
            }
          >
            <Bold className="h-4 w-4" />
          </IconBtn>
          <IconBtn title="Italic (visual only)" disabled>
            <Italic className="h-4 w-4" />
          </IconBtn>
          <IconBtn title="Underline (visual only)" disabled>
            <Underline className="h-4 w-4" />
          </IconBtn>

          {/* Text and background color */}
          <div className="inline-flex items-center gap-2 ml-1">
            <div className="relative">
              <IconBtn title="Text color" disabled={!activeText}>
                <Droplet className="h-4 w-4" />
              </IconBtn>
              <input
                type="color"
                value={activeText?.color || "#111827"}
                onChange={(e) =>
                  activeText &&
                  onUpdateTextLayer(activeText.id, { color: e.target.value })
                }
                className="absolute left-0 top-0 h-8 w-8 opacity-0 cursor-pointer"
                disabled={!activeText}
                aria-label="Pick text color"
              />
            </div>
            <div className="relative">
              <IconBtn title="Background color" disabled={!activeText}>
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{
                    background:
                      !activeText ||
                      activeText.backgroundColor === "transparent"
                        ? "#10B981"
                        : activeText.backgroundColor,
                    outline: "2px solid #E5E7EB",
                    outlineOffset: "2px",
                  }}
                />
              </IconBtn>
              <input
                type="color"
                value={
                  activeText?.backgroundColor &&
                  activeText.backgroundColor !== "transparent"
                    ? activeText.backgroundColor
                    : "#10B981"
                }
                onChange={(e) =>
                  activeText &&
                  onUpdateTextLayer(activeText.id, {
                    backgroundColor: e.target.value,
                  })
                }
                className="absolute left-0 top-0 h-8 w-8 opacity-0 cursor-pointer"
                disabled={!activeText}
                aria-label="Pick background color"
              />
            </div>
          </div>
        </div>

        {/* Alignment row */}
        <div className="mt-2 flex flex-wrap gap-2">
          <IconBtn
            title="Align left"
            disabled={!activeText}
            onClick={() =>
              activeText &&
              onUpdateTextLayer(activeText.id, { textAlign: "left" })
            }
          >
            <AlignLeft className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            title="Align center"
            disabled={!activeText}
            onClick={() =>
              activeText &&
              onUpdateTextLayer(activeText.id, { textAlign: "center" })
            }
          >
            <AlignCenter className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            title="Align right"
            disabled={!activeText}
            onClick={() =>
              activeText &&
              onUpdateTextLayer(activeText.id, { textAlign: "right" })
            }
          >
            <AlignRight className="h-4 w-4" />
          </IconBtn>
          <IconBtn title="Justify (visual only)" disabled>
            <AlignJustify className="h-4 w-4" />
          </IconBtn>
        </div>
      </Section>

      {/* Text Effects */}
      <Section title="Text Effects">
        {/* Shadow toggle */}
        <div className="rounded-lg border border-neutral-200 p-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[#7C3AED]"
              checked={!!activeText?.shadow}
              onChange={(e) => {
                if (!activeText) return;
                if (e.target.checked) {
                  onUpdateTextLayer(activeText.id, {
                    shadow: {
                      color: "#4C1D95",
                      blur: 6,
                      offsetX: 4,
                      offsetY: 4,
                    },
                  });
                } else {
                  onUpdateTextLayer(activeText.id, { shadow: undefined });
                }
              }}
              disabled={!activeText}
            />
            <span className="text-sm text-neutral-700">Text Shadow</span>
          </label>

          {activeText?.shadow && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Color</div>
                <div className="relative inline-block">
                  <button
                    type="button"
                    className="h-8 w-24 inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white text-sm"
                  >
                    <Droplet className="h-4 w-4" />
                    <span>Pick</span>
                  </button>
                  <input
                    type="color"
                    value={activeText.shadow.color}
                    onChange={(e) =>
                      onUpdateTextLayer(activeText.id, {
                        shadow: {
                          ...activeText.shadow!,
                          color: e.target.value,
                        },
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Shadow color"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Blur</div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={activeText.shadow.blur}
                  onChange={(e) =>
                    onUpdateTextLayer(activeText.id, {
                      shadow: {
                        ...activeText.shadow!,
                        blur: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full accent-[#7C3AED]"
                />
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Offset (X)</div>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  value={activeText.shadow.offsetX}
                  onChange={(e) =>
                    onUpdateTextLayer(activeText.id, {
                      shadow: {
                        ...activeText.shadow!,
                        offsetX: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full accent-[#7C3AED]"
                />
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Offset (Y)</div>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  value={activeText.shadow.offsetY}
                  onChange={(e) =>
                    onUpdateTextLayer(activeText.id, {
                      shadow: {
                        ...activeText.shadow!,
                        offsetY: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full accent-[#7C3AED]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Gradient */}
        <div className="mt-3 rounded-lg border border-neutral-200 p-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-[#7C3AED]"
              checked={!!activeText?.gradient?.enabled}
              onChange={(e) => {
                if (!activeText) return;
                if (e.target.checked) {
                  onUpdateTextLayer(activeText.id, {
                    gradient: {
                      enabled: true,
                      startColor: activeText.color || "#111827",
                      endColor: "#10B981",
                      direction: "horizontal",
                    },
                  });
                } else {
                  onUpdateTextLayer(activeText.id, {
                    gradient: {
                      enabled: false,
                      startColor: activeText.color || "#111827",
                      endColor: "#10B981",
                      direction: "horizontal" as const,
                    },
                  });
                }
              }}
              disabled={!activeText}
            />
            <span className="text-sm text-neutral-700">Gradient Text</span>
          </label>

          {activeText?.gradient?.enabled && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-neutral-500 mb-1">Color 1</div>
                <div className="relative inline-block">
                  <button
                    type="button"
                    className="h-8 w-24 inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white text-sm"
                  >
                    <Droplet className="h-4 w-4" />
                    <span>Pick</span>
                  </button>
                  <input
                    type="color"
                    value={activeText.gradient.startColor}
                    onChange={(e) =>
                      onUpdateTextLayer(activeText.id, {
                        gradient: {
                          ...activeText.gradient!,
                          startColor: e.target.value,
                        },
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Gradient start color"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">Color 2</div>
                <div className="relative inline-block">
                  <button
                    type="button"
                    className="h-8 w-24 inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white text-sm"
                  >
                    <Droplet className="h-4 w-4" />
                    <span>Pick</span>
                  </button>
                  <input
                    type="color"
                    value={activeText.gradient.endColor}
                    onChange={(e) =>
                      onUpdateTextLayer(activeText.id, {
                        gradient: {
                          ...activeText.gradient!,
                          endColor: e.target.value,
                        },
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Gradient end color"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Opacity */}
          <div className="mt-3">
            <div className="text-xs text-neutral-500 mb-1">
              Opacity ({Math.round((activeText?.opacity ?? 1) * 100)}%)
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={activeText?.opacity ?? 1}
              onChange={(e) =>
                activeText &&
                onUpdateTextLayer(activeText.id, {
                  opacity: parseFloat(e.target.value),
                })
              }
              className="w-full accent-[#7C3AED]"
              disabled={!activeText}
            />
          </div>
        </div>
      </Section>

      {/* Optional: simple media opacity to keep parity if a media layer is selected */}
      {activeMedia && (
        <Section title="Image Opacity">
          <div className="text-xs text-neutral-500 mb-1">
            Opacity ({Math.round((activeMedia.opacity ?? 1) * 100)}%)
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={activeMedia.opacity}
            onChange={(e) =>
              onUpdateMediaLayer(activeMedia.id, {
                opacity: parseFloat(e.target.value),
              })
            }
            className="w-full accent-[#7C3AED]"
          />
        </Section>
      )}

      {/* Crop controls (kept, but compact to avoid visual clutter) */}
      {onToggleCrop && (
        <Section title="Crop">
          <CropControls
            aspectRatio={aspectRatio}
            onAspectRatioChange={onCropAspectRatioChange || (() => {})}
            onApplyCrop={onApplyCrop || (() => {})}
            onCancelCrop={onCancelCrop || (() => {})}
            isActive={isCropActive}
            cropData={cropData}
          />
        </Section>
      )}
    </div>
  );
}
