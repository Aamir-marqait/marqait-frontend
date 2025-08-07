"use client";

import type { TextLayer, MediaLayer, ImageFilters } from "./ImageEditor";
import { CropControls } from "./CropTool";
import type { AspectRatio, CropData } from "./CropTool";

interface ControlsPanelProps {
  textLayers: TextLayer[];
  mediaLayers: MediaLayer[];
  imageFilters: ImageFilters;
  onUpdateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  onUpdateMediaLayer: (id: string, updates: Partial<MediaLayer>) => void;
  onUpdateImageFilters: (filters: Partial<ImageFilters>) => void;
  onAddTextLayer: (type?: TextLayer['type'], customContent?: string) => void;
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

const FONT_FAMILIES = [
  // System fonts
  'Arial',
  'Arial Black',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
  'Lucida Console',
  'Tahoma',
  
  // Google Fonts - Sans Serif
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Nunito',
  'Raleway',
  'Ubuntu',
  'PT Sans',
  'Oswald',
  
  // Google Fonts - Serif
  'Playfair Display',
  'Merriweather',
  'Libre Baskerville',
  'Crimson Text',
  
  // Google Fonts - Display/Decorative
  'Dancing Script',
  'Pacifico',
  'Lobster',
  'Righteous',
  'Bangers'
];

const FONT_WEIGHTS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Light' },
  { value: '300', label: 'Book' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi-Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra-Bold' },
  { value: '900', label: 'Black' }
];

const PRESET_EMOJIS = [
  "😊", "🎉", "❤️", "🔥", "👍", "✨", "💯", "🚀",
  "🌟", "🎯", "⚡", "🌈", "🎨", "🔮", "🎪", "🎭",
  "🎸", "🎤", "🎵", "🎶", "🎺", "🎻", "🥳", "🤩",
  "😍", "🤗", "😎", "🤯", "💝", "💖", "💕", "💘"
];

const PRESET_ICONS = [
  { name: "Star", emoji: "⭐" },
  { name: "Heart", emoji: "💖" },
  { name: "Lightning", emoji: "⚡" },
  { name: "Fire", emoji: "🔥" },
  { name: "Crown", emoji: "👑" },
  { name: "Diamond", emoji: "💎" },
  { name: "Trophy", emoji: "🏆" },
  { name: "Medal", emoji: "🥇" },
  { name: "Rocket", emoji: "🚀" },
  { name: "Target", emoji: "🎯" },
  { name: "Magic", emoji: "✨" },
  { name: "Rainbow", emoji: "🌈" }
];

export function ControlsPanel({
  textLayers,
  mediaLayers,
  imageFilters,
  onUpdateTextLayer,
  onUpdateMediaLayer,
  onUpdateImageFilters,
  onAddTextLayer,
  onAddMediaLayer,
  onRemoveLayer,
  onSendToBack,
  onBringToFront,
  // Crop props
  cropData,
  aspectRatio = 'freeform',
  isCropActive = false,
  onToggleCrop,
  onCropAspectRatioChange,
  onApplyCrop,
  onCancelCrop,
}: ControlsPanelProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newMediaLayer: MediaLayer = {
          id: `media-${Date.now()}`,
          type: 'image',
          url: imageUrl,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          opacity: 1
        };
        onAddMediaLayer(newMediaLayer);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmojiLayer = (emoji: string) => {
    // Create a custom emoji layer by calling addTextLayer with custom content
    onAddTextLayer('emoji', emoji);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Layer Controls
      </h3>

      {/* Crop Tool Controls */}
      <CropControls
        aspectRatio={aspectRatio}
        onAspectRatioChange={onCropAspectRatioChange || (() => {})}
        onApplyCrop={onApplyCrop || (() => {})}
        onCancelCrop={onCancelCrop || (() => {})}
        isActive={isCropActive}
        cropData={cropData}
      />

      {/* Add New Elements */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Add Elements
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => onAddTextLayer('heading')}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
            disabled={isCropActive}
          >
            + Heading
          </button>
          <button
            onClick={() => onAddTextLayer('paragraph')}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
            disabled={isCropActive}
          >
            + Paragraph
          </button>
        </div>
        
        {/* Crop Tool Toggle Button */}
        {onToggleCrop && (
          <button
            onClick={onToggleCrop}
            className={`w-full mb-3 px-3 py-2 rounded-md text-sm transition-colors ${
              isCropActive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {isCropActive ? '🚫 Exit Crop' : '✂️ Crop Image'}
          </button>
        )}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Image/Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isCropActive}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Image Filters */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Image Filters
        </h4>
        <div className="space-y-3">
          {/* Brightness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brightness ({imageFilters.brightness})
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={imageFilters.brightness}
              onChange={(e) => onUpdateImageFilters({ brightness: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contrast ({imageFilters.contrast})
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={imageFilters.contrast}
              onChange={(e) => onUpdateImageFilters({ contrast: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Sepia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sepia ({Math.round(imageFilters.sepia * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={imageFilters.sepia}
              onChange={(e) => onUpdateImageFilters({ sepia: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Blur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Blur ({imageFilters.blur}px)
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={imageFilters.blur}
              onChange={(e) => onUpdateImageFilters({ blur: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Grayscale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grayscale ({Math.round(imageFilters.grayscale * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={imageFilters.grayscale}
              onChange={(e) => onUpdateImageFilters({ grayscale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => onUpdateImageFilters({ 
              brightness: 0, 
              contrast: 0, 
              sepia: 0, 
              blur: 0, 
              grayscale: 0 
            })}
            className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Quick Emojis & Icons */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Quick Emojis & Icons
        </h4>
        <div className="grid grid-cols-6 gap-2 mb-3">
          {PRESET_EMOJIS.slice(0, 12).map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmojiLayer(emoji)}
              className="p-2 text-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                       rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_ICONS.slice(0, 8).map((icon) => (
            <button
              key={icon.name}
              onClick={() => addEmojiLayer(icon.emoji)}
              className="p-2 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                       rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={icon.name}
            >
              {icon.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Text Layers */}
      <div className="space-y-4">
        {textLayers.length === 0 && mediaLayers.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No elements added yet. Use the buttons above to add text, images, or emojis to your canvas.
            </p>
          </div>
        )}
        {textLayers.map((layer) => (
          <div key={layer.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                {layer.type} Text
              </h4>
              <div className="flex gap-2">
                {onSendToBack ? (
                  <button
                    onClick={() => {
                      console.log('Behind button clicked for layer:', layer.id);
                      onSendToBack(layer.id);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 border border-blue-300 rounded"
                    title="Send behind image (Ctrl+[)"
                  >
                    Behind
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">No Behind Function</span>
                )}
                {onBringToFront ? (
                  <button
                    onClick={() => {
                      console.log('Front button clicked for layer:', layer.id);
                      onBringToFront(layer.id);
                    }}
                    className="text-green-600 hover:text-green-700 text-xs px-2 py-1 border border-green-300 rounded"
                    title="Bring to front (Ctrl+])"
                  >
                    Front
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">No Front Function</span>
                )}
                <button
                  onClick={() => onRemoveLayer(layer.id)}
                  className="text-red-600 hover:text-red-700 text-xs px-2 py-1 border border-red-300 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                {layer.type === 'paragraph' ? (
                  <textarea
                    value={layer.content}
                    onChange={(e) => onUpdateTextLayer(layer.id, { content: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={layer.content}
                    onChange={(e) => onUpdateTextLayer(layer.id, { content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Font Family
                </label>
                <select
                  value={layer.fontFamily}
                  onChange={(e) => onUpdateTextLayer(layer.id, { fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: layer.fontFamily }}
                >
                  <optgroup label="System Fonts">
                    {FONT_FAMILIES.slice(0, 12).map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Google Fonts - Sans Serif">
                    {FONT_FAMILIES.slice(12, 24).map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Google Fonts - Serif">
                    {FONT_FAMILIES.slice(24, 28).map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Google Fonts - Decorative">
                    {FONT_FAMILIES.slice(28).map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Font Size, Weight, Alignment */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Size
                  </label>
                  <input
                    type="number"
                    value={layer.fontSize}
                    onChange={(e) => onUpdateTextLayer(layer.id, { fontSize: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weight
                  </label>
                  <select
                    value={layer.fontWeight}
                    onChange={(e) => onUpdateTextLayer(layer.id, { fontWeight: e.target.value as TextLayer['fontWeight'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FONT_WEIGHTS.map(weight => (
                      <option key={weight.value} value={weight.value}>{weight.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Align
                  </label>
                  <select
                    value={layer.textAlign}
                    onChange={(e) => onUpdateTextLayer(layer.id, { textAlign: e.target.value as TextLayer['textAlign'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={layer.color}
                    onChange={(e) => onUpdateTextLayer(layer.id, { color: e.target.value })}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Background
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={layer.backgroundColor === 'transparent' ? '#ffffff' : layer.backgroundColor}
                      onChange={(e) => onUpdateTextLayer(layer.id, { backgroundColor: e.target.value })}
                      className="flex-1 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <button
                      onClick={() => onUpdateTextLayer(layer.id, { backgroundColor: 'transparent' })}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 
                               text-gray-700 dark:text-gray-300 rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Opacity ({Math.round(layer.opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={layer.opacity}
                  onChange={(e) => onUpdateTextLayer(layer.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Text Effects */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Text Effects</h5>
                
                {/* Shadow Controls */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={layer.shadow !== undefined}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onUpdateTextLayer(layer.id, {
                            shadow: {
                              color: '#000000',
                              blur: 3,
                              offsetX: 2,
                              offsetY: 2,
                            }
                          });
                        } else {
                          onUpdateTextLayer(layer.id, { shadow: undefined });
                        }
                      }}
                      className="rounded"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Text Shadow
                    </label>
                  </div>
                  
                  {layer.shadow && (
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400">Color</label>
                        <input
                          type="color"
                          value={layer.shadow.color}
                          onChange={(e) => onUpdateTextLayer(layer.id, {
                            shadow: { ...layer.shadow!, color: e.target.value }
                          })}
                          className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400">Blur ({layer.shadow.blur})</label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={layer.shadow.blur}
                          onChange={(e) => onUpdateTextLayer(layer.id, {
                            shadow: { ...layer.shadow!, blur: parseInt(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400">Offset X ({layer.shadow.offsetX})</label>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          value={layer.shadow.offsetX}
                          onChange={(e) => onUpdateTextLayer(layer.id, {
                            shadow: { ...layer.shadow!, offsetX: parseInt(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400">Offset Y ({layer.shadow.offsetY})</label>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          value={layer.shadow.offsetY}
                          onChange={(e) => onUpdateTextLayer(layer.id, {
                            shadow: { ...layer.shadow!, offsetY: parseInt(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Gradient Controls */}
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={layer.gradient?.enabled || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onUpdateTextLayer(layer.id, {
                            gradient: {
                              enabled: true,
                              startColor: layer.color,
                              endColor: '#ff0000',
                              direction: 'vertical',
                            }
                          });
                        } else {
                          onUpdateTextLayer(layer.id, { 
                            gradient: { ...layer.gradient!, enabled: false }
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gradient Text
                    </label>
                  </div>
                  
                  {layer.gradient?.enabled && (
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400">Start Color</label>
                        <input
                          type="color"
                          value={layer.gradient.startColor}
                          onChange={(e) => onUpdateTextLayer(layer.id, {
                            gradient: { ...layer.gradient!, startColor: e.target.value }
                          })}
                          className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400">End Color</label>
                        <input
                          type="color"
                          value={layer.gradient.endColor}
                          onChange={(e) => onUpdateTextLayer(layer.id, {
                            gradient: { ...layer.gradient!, endColor: e.target.value }
                          })}
                          className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 dark:text-gray-400">Direction</label>
                        <select
                          value={layer.gradient.direction}
                          onChange={(e) => onUpdateTextLayer(layer.id, {
                            gradient: { ...layer.gradient!, direction: e.target.value as 'vertical' | 'horizontal' }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="vertical">Vertical</option>
                          <option value="horizontal">Horizontal</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Layers */}
      {mediaLayers.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Media Elements</h4>
          {mediaLayers.map((layer) => (
            <div key={layer.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-gray-900 dark:text-white capitalize">
                  {layer.type}
                </h5>
                <div className="flex gap-2">
                  {onSendToBack && (
                    <button
                      onClick={() => onSendToBack(layer.id)}
                      className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 border border-blue-300 rounded"
                      title="Send behind image (Ctrl+[)"
                    >
                      Behind
                    </button>
                  )}
                  {onBringToFront && (
                    <button
                      onClick={() => onBringToFront(layer.id)}
                      className="text-green-600 hover:text-green-700 text-xs px-2 py-1 border border-green-300 rounded"
                      title="Bring to front (Ctrl+])"
                    >
                      Front
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveLayer(layer.id)}
                    className="text-red-600 hover:text-red-700 text-xs px-2 py-1 border border-red-300 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Opacity ({Math.round(layer.opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={layer.opacity}
                  onChange={(e) => onUpdateMediaLayer(layer.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Smart Layout Tips */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
          Layer Controls ✨
        </h5>
        <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
          <li>• <strong>Behind</strong>: Move text behind background image</li>
          <li>• <strong>Front</strong>: Bring text to front layer</li>
          <li>• <strong>Shortcuts</strong>: Ctrl+[ (behind) / Ctrl+] (front)</li>
          <li>• Drag, resize, and rotate all elements</li>
          <li>• Google Fonts with live preview</li>
        </ul>
      </div>
    </div>
  );
}