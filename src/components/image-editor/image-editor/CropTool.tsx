"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, Rect, FabricImage, FabricObject } from "fabric";

export type AspectRatio = 'freeform' | 'original' | '1:1' | '16:9' | '9:16' | '5:4' | '4:5' | '4:3' | '3:4' | '3:2' | '2:3';

interface CropToolProps {
  canvas: Canvas | null;
  isActive: boolean;
  aspectRatio: AspectRatio;
  onCropChange: (cropData: CropData | null) => void;
}

export interface CropData {
  // Coordinates relative to the background image
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
  // Canvas coordinates for visual reference
  canvasX: number;
  canvasY: number;
  canvasWidth: number;
  canvasHeight: number;
  aspectRatio: AspectRatio;
}

const ASPECT_RATIOS: Record<AspectRatio, { label: string; ratio?: number }> = {
  'freeform': { label: 'Freeform' },
  'original': { label: 'Original' },
  '1:1': { label: '1:1 (Square)', ratio: 1 },
  '16:9': { label: '16:9 (Landscape)', ratio: 16/9 },
  '9:16': { label: '9:16 (Portrait)', ratio: 9/16 },
  '5:4': { label: '5:4', ratio: 5/4 },
  '4:5': { label: '4:5', ratio: 4/5 },
  '4:3': { label: '4:3', ratio: 4/3 },
  '3:4': { label: '3:4', ratio: 3/4 },
  '3:2': { label: '3:2', ratio: 3/2 },
  '2:3': { label: '2:3', ratio: 2/3 },
};

export function CropTool({ canvas, isActive, aspectRatio, onCropChange }: CropToolProps) {
  const [cropBox, setCropBox] = useState<Rect | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<FabricImage | null>(null);
  const cropBoxRef = useRef<Rect | null>(null);

  // Get background image
  const getBackgroundImage = (): FabricImage | null => {
    if (!canvas) return null;
    
    const bgImg = canvas.getObjects().find(obj => {
      const objData = (obj as FabricObject & { data?: { isBackground?: boolean; type?: string } }).data;
      return objData?.isBackground || objData?.type === 'background';
    }) as FabricImage;
    
    return bgImg || null;
  };


  // Update crop data when crop box changes - simplified version
  const updateCropData = () => {
    if (!cropBoxRef.current || !backgroundImage) {
      console.log('No crop box or background image for crop data update');
      onCropChange(null);
      return;
    }

    const box = cropBoxRef.current;
    const canvasX = box.left || 0;
    const canvasY = box.top || 0;
    const canvasWidth = box.getScaledWidth();
    const canvasHeight = box.getScaledHeight();

    const imgBounds = backgroundImage.getBoundingRect();
    const imgOriginalWidth = backgroundImage.width || 1;
    const imgOriginalHeight = backgroundImage.height || 1;

    // Convert canvas coordinates to relative position within the scaled image
    const relativeX = (canvasX - imgBounds.left) / (imgBounds.width);
    const relativeY = (canvasY - imgBounds.top) / (imgBounds.height);
    const relativeWidth = canvasWidth / imgBounds.width;
    const relativeHeight = canvasHeight / imgBounds.height;

    // Convert to actual image coordinates
    const imageX = Math.max(0, Math.min(relativeX * imgOriginalWidth, imgOriginalWidth));
    const imageY = Math.max(0, Math.min(relativeY * imgOriginalHeight, imgOriginalHeight));
    const imageWidth = Math.max(1, Math.min(relativeWidth * imgOriginalWidth, imgOriginalWidth - imageX));
    const imageHeight = Math.max(1, Math.min(relativeHeight * imgOriginalHeight, imgOriginalHeight - imageY));

    const cropData = {
      imageX,
      imageY,
      imageWidth,
      imageHeight,
      canvasX,
      canvasY,
      canvasWidth,
      canvasHeight,
      aspectRatio,
    };

    console.log('Crop data updated:', cropData);
    onCropChange(cropData);
  };

  // Initialize crop box when tool becomes active
  useEffect(() => {
    if (!canvas || !isActive) {
      // Clean up existing crop boxes
      if (cropBox) {
        canvas?.remove(cropBox);
        setCropBox(null);
        cropBoxRef.current = null;
        onCropChange(null);
      }
      
      // Remove any orphaned crop boxes
      const allObjects = canvas?.getObjects() || [];
      allObjects.forEach(obj => {
        const objData = (obj as FabricObject & { data?: { isBackground?: boolean; type?: string } }).data;
        if (objData?.type === 'cropBox') {
          canvas?.remove(obj);
        }
      });
      
      canvas?.renderAll();
      return;
    }

    const bgImg = getBackgroundImage();
    if (!bgImg) {
      console.error('No background image found for cropping');
      return;
    }

    setBackgroundImage(bgImg);
    const imgBounds = bgImg.getBoundingRect();
    
    // Create initial crop box positioned over the background image
    const initialWidth = imgBounds.width * 0.7;
    const initialHeight = imgBounds.height * 0.7;
    const initialLeft = imgBounds.left + (imgBounds.width - initialWidth) / 2;
    const initialTop = imgBounds.top + (imgBounds.height - initialHeight) / 2;
    
    console.log('Creating crop box with initial bounds:', {
      initialLeft, initialTop, initialWidth, initialHeight,
      imgBounds
    });
    
    const newCropBox = new Rect({
      left: initialLeft,
      top: initialTop,
      width: initialWidth,
      height: initialHeight,
      fill: 'rgba(0, 0, 0, 0.3)',
      stroke: '#4F46E5',
      strokeWidth: 3,
      strokeDashArray: [10, 5],
      selectable: true,
      hasControls: true,
      hasBorders: true,
      hasRotatingPoint: false,
      transparentCorners: false,
      cornerColor: '#4F46E5',
      cornerStyle: 'circle',
      cornerSize: 12,
      lockRotation: true,
      borderColor: '#4F46E5',
      borderDashArray: [5, 5],
      // Set initial scaling behavior based on aspect ratio
      lockUniScaling: aspectRatio !== 'freeform',
      lockScalingX: false,
      lockScalingY: false,
    });

    // Add data to identify as crop box
    (newCropBox as FabricObject & { data?: { type: string; id: string } }).data = { type: 'cropBox', id: 'crop-overlay' };
    
    canvas.add(newCropBox);
    canvas.bringObjectToFront(newCropBox);
    canvas.setActiveObject(newCropBox);
    setCropBox(newCropBox);
    cropBoxRef.current = newCropBox;

    // Apply initial aspect ratio
    applyAspectRatio(newCropBox, aspectRatio, bgImg);
    
    // Set up event listeners
    const handleModified = () => {
      console.log('Crop box modified event');
      if (cropBoxRef.current) {
        constrainCropBoxToBounds(cropBoxRef.current, bgImg);
        updateCropData();
      }
    };

    const handleScaling = () => {
      console.log('Crop box scaling event');
      if (cropBoxRef.current && aspectRatio !== 'freeform') {
        constrainAspectRatio(cropBoxRef.current, aspectRatio, bgImg);
      }
      // Always update crop data after scaling
      updateCropData();
    };

    const handleMoving = () => {
      console.log('Crop box moving event');
      if (cropBoxRef.current) {
        constrainCropBoxToBounds(cropBoxRef.current, bgImg);
        updateCropData();
      }
    };

    // Add comprehensive event listeners
    newCropBox.on('modified', handleModified);
    newCropBox.on('scaling', handleScaling);
    newCropBox.on('moving', handleMoving);
    newCropBox.on('skewing', handleModified);
    newCropBox.on('rotating', handleModified);

    // Initial crop data update
    updateCropData();

    canvas.renderAll();

    return () => {
      if (cropBoxRef.current) {
        cropBoxRef.current.off('modified', handleModified);
        cropBoxRef.current.off('scaling', handleScaling);
        cropBoxRef.current.off('moving', handleMoving);
        cropBoxRef.current.off('skewing', handleModified);
        cropBoxRef.current.off('rotating', handleModified);
      }
    };
  }, [canvas, isActive, aspectRatio]);

  // Update crop box when aspect ratio changes
  useEffect(() => {
    if (cropBox && backgroundImage && canvas) {
      console.log('Applying aspect ratio change:', aspectRatio);
      
      // Make sure we're modifying the existing crop box, not creating a new one
      canvas.setActiveObject(cropBox);
      applyAspectRatio(cropBox, aspectRatio, backgroundImage);
      updateCropData();
      canvas.renderAll();
    }
  }, [aspectRatio]);

  // Constrain crop box to stay within image bounds
  const constrainCropBoxToBounds = (box: Rect, bgImg: FabricImage) => {
    const imgBounds = bgImg.getBoundingRect();
    const boxWidth = box.getScaledWidth();
    const boxHeight = box.getScaledHeight();

    let newLeft = box.left || 0;
    let newTop = box.top || 0;

    console.log('Constraining crop box:', {
      imgBounds,
      boxDimensions: { width: boxWidth, height: boxHeight },
      currentPosition: { left: newLeft, top: newTop }
    });

    // Constrain to image bounds with small margin
    const margin = 2;
    newLeft = Math.max(imgBounds.left + margin, Math.min(newLeft, imgBounds.left + imgBounds.width - boxWidth - margin));
    newTop = Math.max(imgBounds.top + margin, Math.min(newTop, imgBounds.top + imgBounds.height - boxHeight - margin));

    // If the crop box is too big for the image, resize it
    let adjustedWidth = boxWidth;
    let adjustedHeight = boxHeight;
    
    if (boxWidth > imgBounds.width - (margin * 2)) {
      adjustedWidth = imgBounds.width - (margin * 2);
      box.set({ width: adjustedWidth / (box.scaleX || 1) });
    }
    
    if (boxHeight > imgBounds.height - (margin * 2)) {
      adjustedHeight = imgBounds.height - (margin * 2);
      box.set({ height: adjustedHeight / (box.scaleY || 1) });
    }

    box.set({
      left: newLeft,
      top: newTop,
    });

    console.log('Constrained to:', { left: newLeft, top: newTop, width: adjustedWidth, height: adjustedHeight });
  };

  // Apply aspect ratio constraint
  const applyAspectRatio = (box: Rect, ratio: AspectRatio, bgImg: FabricImage) => {
    if (ratio === 'freeform') {
      // Freeform: Allow both width and height resize independently
      box.set({ 
        lockUniScaling: false,
        lockScalingX: false,
        lockScalingY: false,
      });
      console.log('Applied freeform constraints');
      constrainCropBoxToBounds(box, bgImg);
      return;
    }

    // Fixed aspect ratio: Lock uniform scaling (maintain ratio)
    let targetRatio: number;
    if (ratio === 'original') {
      const imgWidth = bgImg.getScaledWidth();
      const imgHeight = bgImg.getScaledHeight();
      targetRatio = imgWidth / imgHeight;
    } else {
      targetRatio = ASPECT_RATIOS[ratio].ratio || 1;
    }

    console.log('Applying aspect ratio:', ratio, 'targetRatio:', targetRatio);

    const imgBounds = bgImg.getBoundingRect();
    
    // Start with a reasonable size (60% of image)
    const baseSize = Math.min(imgBounds.width, imgBounds.height) * 0.6;
    let newWidth, newHeight;
    
    if (targetRatio >= 1) {
      // Landscape or square - constrain by width
      newWidth = baseSize;
      newHeight = baseSize / targetRatio;
    } else {
      // Portrait - constrain by height  
      newHeight = baseSize;
      newWidth = baseSize * targetRatio;
    }

    // Ensure dimensions fit within image bounds with margin
    const margin = 10;
    const maxWidth = imgBounds.width - (margin * 2);
    const maxHeight = imgBounds.height - (margin * 2);
    
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / targetRatio;
    }
    
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * targetRatio;
    }

    // Center the crop box within the image
    const centerX = imgBounds.left + imgBounds.width / 2;
    const centerY = imgBounds.top + imgBounds.height / 2;

    // Set new dimensions and position
    box.set({
      width: newWidth / (box.scaleX || 1),
      height: newHeight / (box.scaleY || 1),
      left: centerX - newWidth / 2,
      top: centerY - newHeight / 2,
      lockUniScaling: true, // This maintains aspect ratio during resize
      lockScalingX: false,
      lockScalingY: false,
    });

    console.log('Applied aspect ratio - new dimensions:', newWidth, 'x', newHeight, 'at position:', centerX - newWidth / 2, centerY - newHeight / 2);
    
    // Final constraint check
    constrainCropBoxToBounds(box, bgImg);
  };

  // Constrain aspect ratio during scaling
  const constrainAspectRatio = (box: Rect, ratio: AspectRatio, bgImg: FabricImage) => {
    if (ratio === 'freeform') return;

    let targetRatio: number;
    if (ratio === 'original') {
      const imgWidth = bgImg.getScaledWidth();
      const imgHeight = bgImg.getScaledHeight();
      targetRatio = imgWidth / imgHeight;
    } else {
      targetRatio = ASPECT_RATIOS[ratio].ratio || 1;
    }

    const currentWidth = box.getScaledWidth();
    const newHeight = currentWidth / targetRatio;
    
    box.set({
      height: newHeight / (box.scaleY || 1),
    });

    constrainCropBoxToBounds(box, bgImg);
  };

  return null;
}

export function CropControls({ 
  aspectRatio, 
  onAspectRatioChange, 
  onApplyCrop, 
  onCancelCrop, 
  isActive,
  cropData 
}: {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
  isActive: boolean;
  cropData?: CropData | null;
}) {
  if (!isActive) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
      <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-3">
        ✂️ Crop Tool Active
      </h4>
      
      <div className="space-y-3">
        {/* Aspect Ratio Selector */}
        <div>
          <label className="block text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">
            Aspect Ratio
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
            className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {Object.entries(ASPECT_RATIOS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Crop Status */}
        <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Status:</strong> {cropData ? `Crop area selected (${Math.round(cropData.imageWidth)}×${Math.round(cropData.imageHeight)})` : 'No crop area selected'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onApplyCrop}
            disabled={!cropData}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md text-sm transition-colors font-medium"
          >
            ✅ Apply Crop
          </button>
          <button
            onClick={onCancelCrop}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors font-medium"
          >
            ❌ Cancel
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
        <p className="text-xs text-yellow-800 dark:text-yellow-300">
          💡 <strong>Instructions:</strong> The semi-transparent overlay shows your crop area.<br/>
          {aspectRatio === 'freeform' ? (
            <>🔹 <strong>Freeform:</strong> Drag corners to resize width/height independently. Drag to move position.</>
          ) : (
            <>🔸 <strong>Fixed Ratio:</strong> Drag corners to resize (maintains aspect ratio). Drag to move position.</>
          )}
        </p>
      </div>
    </div>
  );
}