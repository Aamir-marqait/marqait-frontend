/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef, useCallback } from 'react';
import { Canvas, FabricImage, FabricText, FabricObject } from 'fabric';
import * as fabric from 'fabric';
import type { TextLayer, MediaLayer, ImageFilters } from './ImageEditor';

interface CanvasEditorProps {
  imageUrl: string;
  textLayers: TextLayer[];
  mediaLayers: MediaLayer[];
  imageFilters: ImageFilters;
  onCanvasReady: (canvas: Canvas) => void;
  onTextLayerUpdate: (id: string, updates: Partial<TextLayer>) => void;
  onMediaLayerUpdate: (id: string, updates: Partial<MediaLayer>) => void;
}

export function CanvasEditor({ 
  imageUrl, 
  textLayers, 
  mediaLayers,
  imageFilters,
  onCanvasReady, 
  onTextLayerUpdate,
  onMediaLayerUpdate
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const backgroundImageRef = useRef<FabricImage | null>(null);

  // Layer ordering functions - simplified version
  const sendObjectToBack = useCallback((canvas: Canvas, objectId: string) => {
    console.log('🔄 sendObjectToBack called with:', objectId);
    
    const obj = canvas.getObjects().find(
      (obj: FabricObject & { data?: { id: string } }) => obj.data?.id === objectId
    );
    
    if (obj) {
      console.log('✅ Found object to move behind:', obj.type);
      // Simple approach: just send to back
      canvas.sendObjectToBack(obj);
      canvas.renderAll();
      console.log('✅ Object sent to back successfully');
      // Remove the callback that causes infinite recursion
    } else {
      console.log('❌ Object not found with id:', objectId);
    }
  }, []);

  const bringObjectToFront = useCallback((canvas: Canvas, objectId: string) => {
    console.log('🔄 bringObjectToFront called with:', objectId);
    
    const obj = canvas.getObjects().find(
      (obj: FabricObject & { data?: { id: string } }) => obj.data?.id === objectId
    );
    
    if (obj) {
      console.log('✅ Found object to move to front:', obj.type);
      canvas.bringObjectToFront(obj);
      canvas.renderAll();
      console.log('✅ Object brought to front successfully');
      // Remove the callback that causes infinite recursion
    } else {
      console.log('❌ Object not found with id:', objectId);
    }
  }, []);

  const addTextLayer = useCallback((canvas: Canvas, layer: TextLayer) => {
    // Ensure font is loaded before creating text object
    const loadFont = async (fontFamily: string) => {
      if (document.fonts && document.fonts.load) {
        try {
          await document.fonts.load(`16px "${fontFamily}"`);
        } catch (error) {
          console.warn(`Failed to load font: ${fontFamily}`, error);
        }
      }
    };

    const createTextObject = () => {
      // Create gradient fill if enabled
      let fillValue = layer.color;
      if (layer.gradient?.enabled) {
        const gradient = new fabric.Gradient({
          type: 'linear',
          coords: layer.gradient.direction === 'vertical' 
            ? { x1: 0, y1: 0, x2: 0, y2: layer.fontSize }
            : { x1: 0, y1: 0, x2: layer.fontSize * 3, y2: 0 },
          colorStops: [
            { offset: 0, color: layer.gradient.startColor },
            { offset: 1, color: layer.gradient.endColor }
          ]
        });
        fillValue = gradient as any;
      }

      const textObj = new FabricText(layer.content, {
        left: layer.x,
        top: layer.y,
        fontSize: layer.fontSize,
        fill: fillValue,
        fontFamily: layer.fontFamily,
        fontWeight: layer.fontWeight,
        textAlign: layer.textAlign,
        backgroundColor: layer.backgroundColor === 'transparent' ? '' : layer.backgroundColor,
        scaleX: layer.scaleX,
        scaleY: layer.scaleY,
        angle: layer.rotation,
        opacity: layer.opacity,
        selectable: true,
        editable: true,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: true,
        lockUniScaling: false,
        // Add better text wrapping for paragraphs
        splitByGrapheme: layer.type === 'paragraph',
        width: layer.type === 'paragraph' ? 300 : undefined,
        // Text shadow support
        shadow: layer.shadow ? new fabric.Shadow({
          color: layer.shadow.color,
          blur: layer.shadow.blur,
          offsetX: layer.shadow.offsetX,
          offsetY: layer.shadow.offsetY
        }) : undefined
      }) as FabricText & { data?: { id: string, type: string } };

      textObj.data = { id: layer.id, type: 'text' };
      canvas.add(textObj);
      canvas.renderAll();
    };

    // Load font and create text object
    loadFont(layer.fontFamily).then(createTextObject);
  }, []);

  const addMediaLayer = useCallback((canvas: Canvas, layer: MediaLayer) => {
    FabricImage.fromURL(layer.url).then((img) => {
      if (!img) return;
      
      img.set({
        left: layer.x,
        top: layer.y,
        scaleX: layer.scaleX,
        scaleY: layer.scaleY,
        angle: layer.rotation,
        opacity: layer.opacity,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: true,
        lockUniScaling: false
      });

      (img as FabricImage & { data?: { id: string, type: string } }).data = { 
        id: layer.id, 
        type: 'media' 
      };
      
      canvas.add(img);
      canvas.renderAll();
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas with enhanced controls
    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
      preserveObjectStacking: true
    });

    // Enable object controls
    canvas.selection = true;
    canvas.enableRetinaScaling = true;

    fabricCanvasRef.current = canvas;
    onCanvasReady(canvas);

    // Load background image as a regular object (not backgroundImage) for layer ordering
    FabricImage.fromURL(imageUrl).then((img) => {
      if (!img) return;
      
      // Scale image to fit canvas
      const scaleX = canvas.width! / img.width!;
      const scaleY = canvas.height! / img.height!;
      const scale = Math.min(scaleX, scaleY);
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: (canvas.width! - img.width! * scale) / 2,
        top: (canvas.height! - img.height! * scale) / 2,
        selectable: false,
        evented: false,
        name: 'backgroundImage'
      });

      // Add special data to identify as background
      (img as FabricImage & { data?: { id: string, type: string, isBackground: boolean } }).data = {
        id: 'background-image',
        type: 'background',
        isBackground: true
      };

      backgroundImageRef.current = img;
      canvas.add(img);
      canvas.sendObjectToBack(img); // Keep background at the bottom initially
      canvas.renderAll();
    });


    // Handle object modifications (drag, resize, rotate)
    canvas.on('object:modified', (e) => {
      const obj = e.target as (FabricText | FabricImage) & { data?: { id: string, type: string } };
      if (obj && obj.data) {
        const layerId = obj.data.id;
        const commonUpdates = {
          x: obj.left || 0,
          y: obj.top || 0,
          scaleX: obj.scaleX || 1,
          scaleY: obj.scaleY || 1,
          rotation: obj.angle || 0,
          opacity: obj.opacity || 1
        };
        
        if (obj.data.type === 'text') {
          onTextLayerUpdate(layerId, {
            ...commonUpdates,
            content: (obj as FabricText).text || '',
          });
        } else if (obj.data.type === 'media') {
          onMediaLayerUpdate(layerId, {
            ...commonUpdates,
            width: obj.width || 0,
            height: obj.height || 0
          });
        }
      }
    });

    // Handle object selection for better UX
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0] as FabricObject;
      if (obj) {
        obj.set({
          cornerColor: '#4F46E5',
          cornerStyle: 'circle',
          cornerSize: 10,
          transparentCorners: false,
          borderColor: '#4F46E5',
          borderDashArray: [5, 5]
        });
        canvas.renderAll();
      }
    });

    // Add keyboard shortcuts for layer ordering
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeObject = canvas.getActiveObject() as FabricObject & { data?: { id: string } };
      
      if (activeObject && activeObject.data?.id) {
        // Ctrl/Cmd + [ = Send to back (behind image)
        if ((e.ctrlKey || e.metaKey) && e.key === '[') {
          e.preventDefault();
          sendObjectToBack(canvas, activeObject.data.id);
        }
        // Ctrl/Cmd + ] = Bring to front
        else if ((e.ctrlKey || e.metaKey) && e.key === ']') {
          e.preventDefault();
          bringObjectToFront(canvas, activeObject.data.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, [imageUrl, onCanvasReady]);


  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Update existing text objects when textLayers change
    textLayers.forEach(async (layer) => {
      const existingObject = canvas.getObjects().find(
        (obj: FabricObject & { data?: { id: string } }) => obj.data?.id === layer.id
      ) as FabricText & { data?: { id: string } };

      if (existingObject) {
        // Load font before updating if it's a Google Font
        if (document.fonts && document.fonts.load) {
          try {
            await document.fonts.load(`${layer.fontSize}px "${layer.fontFamily}"`);
          } catch (error) {
            console.warn(`Failed to load font: ${layer.fontFamily}`, error);
          }
        }

        // Create gradient fill if enabled
        let fillValue = layer.color;
        if (layer.gradient?.enabled) {
          const gradient = new fabric.Gradient({
            type: 'linear',
            coords: layer.gradient.direction === 'vertical' 
              ? { x1: 0, y1: 0, x2: 0, y2: layer.fontSize }
              : { x1: 0, y1: 0, x2: layer.fontSize * 3, y2: 0 },
            colorStops: [
              { offset: 0, color: layer.gradient.startColor },
              { offset: 1, color: layer.gradient.endColor }
            ]
          });
          fillValue = gradient as any;
        }

        existingObject.set({
          text: layer.content,
          fontSize: layer.fontSize,
          fill: fillValue,
          left: layer.x,
          top: layer.y,
          fontFamily: layer.fontFamily,
          fontWeight: layer.fontWeight,
          textAlign: layer.textAlign,
          backgroundColor: layer.backgroundColor === 'transparent' ? '' : layer.backgroundColor,
          scaleX: layer.scaleX,
          scaleY: layer.scaleY,
          angle: layer.rotation,
          opacity: layer.opacity,
          shadow: layer.shadow ? new fabric.Shadow({
            color: layer.shadow.color,
            blur: layer.shadow.blur,
            offsetX: layer.shadow.offsetX,
            offsetY: layer.shadow.offsetY
          }) : undefined
        });
      }
    });

    // Update existing media objects when mediaLayers change
    mediaLayers.forEach(layer => {
      const existingObject = canvas.getObjects().find(
        (obj: FabricObject & { data?: { id: string } }) => obj.data?.id === layer.id
      ) as FabricImage & { data?: { id: string } };

      if (existingObject) {
        existingObject.set({
          left: layer.x,
          top: layer.y,
          scaleX: layer.scaleX,
          scaleY: layer.scaleY,
          angle: layer.rotation,
          opacity: layer.opacity
        });
      }
    });

    canvas.renderAll();
  }, [textLayers, mediaLayers]);

  // Apply image filters when they change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const backgroundImage = backgroundImageRef.current;
    if (!canvas || !backgroundImage) return;

    // Clear existing filters
    backgroundImage.filters = [];

    // Apply filters based on current state
    if (imageFilters.brightness !== 0) {
      backgroundImage.filters.push(new fabric.filters.Brightness({
        brightness: imageFilters.brightness / 100 // Convert to 0-1 range
      }));
    }

    if (imageFilters.contrast !== 0) {
      backgroundImage.filters.push(new fabric.filters.Contrast({
        contrast: imageFilters.contrast / 100 // Convert to 0-1 range
      }));
    }

    if (imageFilters.sepia > 0) {
      backgroundImage.filters.push(new fabric.filters.Sepia());
    }

    if (imageFilters.blur > 0) {
      backgroundImage.filters.push(new fabric.filters.Blur({
        blur: imageFilters.blur / 20 // Normalize blur value
      }));
    }

    if (imageFilters.grayscale > 0) {
      backgroundImage.filters.push(new fabric.filters.Grayscale());
    }

    // Apply the filters
    backgroundImage.applyFilters();
    canvas.renderAll();
  }, [imageFilters]);

  // Handle initial layer setup
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Add text layers
    textLayers.forEach(layer => {
      // Only add if not already present
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exists = canvas.getObjects().some((obj: any) => obj.data?.id === layer.id);
      if (!exists) {
        addTextLayer(canvas, layer);
      }
    });

    // Add media layers
    mediaLayers.forEach(layer => {
      // Only add if not already present
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exists = canvas.getObjects().some((obj: any) => obj.data?.id === layer.id);
      if (!exists) {
        addMediaLayer(canvas, layer);
      }
    });
  }, [textLayers, mediaLayers, addTextLayer, addMediaLayer]);

  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Drag • Resize • Rotate • Ctrl+[ (Behind) • Ctrl+] (Front)
        </div>
      </div>
    </div>
  );
}