/* eslint-disable @typescript-eslint/no-explicit-any */
// FAL AI client with fallback
let fal: any = null;

// Initialize FAL client dynamically
const initializeFalClient = async () => {
  if (fal) return fal;
  
  try {
    const falClient = await import("@fal-ai/client");
    fal = falClient.fal;
    
    // Configure FAL client
    fal.config({
      credentials: import.meta.env.VITE_FAL_KEY || ""
    });
    
    return fal;
  } catch {
    console.warn("FAL AI client not available");
    throw new Error("FAL AI client not installed. Run: npm install @fal-ai/client");
  }
};

interface EditAnalysis {
  type: string;
  enhancedPrompt: string;
  strength: number;
  guidance: number;
  steps: number;
  negativePrompt?: string;
}


interface GenerateImageResult {
  success: boolean;
  imageUrl?: string;
  data?: unknown;
  error?: string;
}

interface GenerateVariantsResult {
  success: boolean;
  images?: string[];
  data?: unknown;
  error?: string;
}

// Convert file to base64 data URL
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert image URL to base64
export const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

// Generate related prompt variations
const generatePromptVariations = (originalPrompt: string): string[] => {
  const variations: string[] = [];
  const lowerPrompt = originalPrompt.toLowerCase();
  
  // Always include the original prompt first
  variations.push(originalPrompt);
  
  // Generate creative variations based on prompt type
  if (lowerPrompt.includes('festive') || lowerPrompt.includes('celebration')) {
    variations.push(originalPrompt + ' with sparkles and glitter effects');
    variations.push(originalPrompt + ' in bright, vibrant colors');
  } else if (lowerPrompt.includes('remove')) {
    variations.push(originalPrompt + ' and replace with natural background');
    variations.push(originalPrompt + ' and fill with matching texture');
  } else if (lowerPrompt.includes('color')) {
    variations.push(originalPrompt + ' with enhanced saturation');
    variations.push(originalPrompt + ' with complementary color scheme');
  } else if (lowerPrompt.includes('style')) {
    variations.push(originalPrompt + ' with artistic enhancement');
    variations.push(originalPrompt + ' with modern aesthetic');
  } else {
    // Generic variations for other prompts
    variations.push(originalPrompt + ' with enhanced details');
    variations.push(originalPrompt + ' with improved lighting');
  }
  
  return variations.slice(0, 3); // Return only first 3 variations
};

// Analyze user prompt to determine best editing approach
const analyzePrompt = (prompt: string): EditAnalysis => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Object/Element replacement - Most careful approach
  if (lowerPrompt.includes('replace') || (lowerPrompt.includes('remove') && lowerPrompt.includes('with'))) {
    return {
      type: 'replacement',
      enhancedPrompt: `${prompt}. Keep the exact same background, lighting, and composition. Only replace the specified object while preserving everything else unchanged.`,
      strength: 0.3,
      guidance: 7.5,
      steps: 35,
      negativePrompt: 'distortion, blur, artifacts, composition change, lighting change, background change'
    };
  }
  
  // Text editing (change/replace text)
  if (lowerPrompt.includes('change') && (lowerPrompt.includes('text') || lowerPrompt.includes('to ') || lowerPrompt.includes('logo'))) {
    return {
      type: 'text_edit',
      enhancedPrompt: `${prompt}. Preserve the exact same image composition, background, and all other elements.`,
      strength: 0.25,
      guidance: 8.0,
      steps: 30,
      negativePrompt: 'blur, distortion, artifacts, composition change'
    };
  }
  
  // Object/text removal - More conservative
  if (lowerPrompt.includes('remove') || lowerPrompt.includes('delete') || lowerPrompt.includes('erase')) {
    return {
      type: 'removal',
      enhancedPrompt: `${prompt}. Seamlessly remove the specified element and fill the area naturally while keeping everything else exactly the same.`,
      strength: 0.4,
      guidance: 7.0,
      steps: 35,
      negativePrompt: 'artifacts, distortion, incomplete removal, blur, obvious edits'
    };
  }
  
  // Color/style changes - Very conservative
  if (lowerPrompt.includes('color') || lowerPrompt.includes('style') || lowerPrompt.includes('make')) {
    return {
      type: 'color_style',
      enhancedPrompt: `${prompt}. Change only the specified color/style while maintaining the exact same composition, lighting, and all other elements.`,
      strength: 0.2,
      guidance: 8.5,
      steps: 28,
      negativePrompt: 'composition change, object distortion, background change'
    };
  }
  
  // Object addition/modification
  if (lowerPrompt.includes('add') || lowerPrompt.includes('put') || lowerPrompt.includes('place')) {
    return {
      type: 'addition',
      enhancedPrompt: `${prompt}. Add the element naturally while preserving the existing composition and lighting.`,
      strength: 0.35,
      guidance: 7.5,
      steps: 32,
      negativePrompt: 'unrealistic, floating, poorly integrated, distortion'
    };
  }
  
  // Background changes
  if (lowerPrompt.includes('background') || lowerPrompt.includes('behind')) {
    return {
      type: 'background',
      enhancedPrompt: `${prompt}. Change only the background while keeping the main subject exactly the same.`,
      strength: 0.3,
      guidance: 8.0,
      steps: 30,
      negativePrompt: 'subject change, face alteration, clothing change, object distortion'
    };
  }
  
  // General/default editing - Most conservative
  return {
    type: 'general',
    enhancedPrompt: `${prompt}. Make the requested modification while preserving the original image structure, composition, and quality.`,
    strength: 0.25,
    guidance: 8.0,
    steps: 32,
    negativePrompt: 'unrealistic, distorted, composition change, quality loss'
  };
};

// Smart AI Image Editor - Handles all types of image modifications
export const generateImageWithFlux = async (
  imageData: string, 
  prompt: string
): Promise<GenerateImageResult> => {
  try {
    console.log('🎨 AI Image Editor - Processing request:', prompt);
    
    // Initialize FAL client
    const falClient = await initializeFalClient();
    
    // Analyze the prompt to determine edit type and optimal settings
    const editAnalysis = analyzePrompt(prompt);
    console.log('📝 Edit Analysis:', editAnalysis);
    
    // Use FLUX Pro Kontext for image-to-image editing
    const modelEndpoint = "fal-ai/flux-pro/kontext";
    
    const requestData: Record<string, unknown> = {
      prompt: editAnalysis.enhancedPrompt,
      image_url: imageData,
      strength: editAnalysis.strength,
      guidance_scale: editAnalysis.guidance,
      num_inference_steps: editAnalysis.steps
    };

    // Add optional parameters
    if (editAnalysis.negativePrompt) {
      requestData.negative_prompt = editAnalysis.negativePrompt;
    }

    console.log('Model:', modelEndpoint);
    console.log('Original prompt:', prompt);
    console.log('Request data:', requestData);

    // Call FAL.ai API
    const result = await falClient.subscribe(modelEndpoint, {
      input: requestData,
      logs: true,
      onQueueUpdate: (update: { status: string; logs?: Array<{ message: string }> }) => {
        console.log('Queue update:', update);
        if (update.status === "IN_PROGRESS") {
          console.log('Editing in progress...');
          if (update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      },
    });

    console.log('FAL.ai result:', result);

    // Handle response from FLUX Pro Kontext
    console.log('Result data:', result.data);
    console.log('Request ID:', result.requestId);
    
    if (result.data && result.data.images && result.data.images.length > 0) {
      return {
        success: true,
        imageUrl: result.data.images[0].url,
        data: result
      };
    } else if (result.data && result.data.image_url) {
      return {
        success: true,
        imageUrl: result.data.image_url,
        data: result
      };
    } else {
      throw new Error('No edited image generated');
    }

  } catch (error) {
    console.error('Error generating image with FAL.ai:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // More detailed error handling
    let errorMessage = 'Failed to generate image';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as { message: string }).message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Generate 3 image variants with different prompts
export const generateImageVariants = async (
  imageData: string, 
  originalPrompt: string
): Promise<GenerateVariantsResult> => {
  try {
    console.log('🎨 AI Image Variants - Processing request:', originalPrompt);
    
    // Generate 3 prompt variations
    const promptVariations = generatePromptVariations(originalPrompt);
    console.log('📝 Prompt Variations:', promptVariations);
    
    // Generate images for each prompt variation
    const imagePromises = promptVariations.map(async (prompt, index) => {
      try {
        console.log(`🔄 Generating variant ${index + 1}: ${prompt}`);
        const result = await generateImageWithFlux(imageData, prompt);
        return result.success ? result.imageUrl : null;
      } catch (error) {
        console.error(`Error generating variant ${index + 1}:`, error);
        return null;
      }
    });
    
    // Wait for all images to be generated
    const generatedImages = await Promise.all(imagePromises);
    
    // Filter out failed generations
    const successfulImages = generatedImages.filter(img => img !== null) as string[];
    
    if (successfulImages.length === 0) {
      throw new Error('Failed to generate any image variants');
    }
    
    return {
      success: true,
      images: successfulImages,
      data: { variations: promptVariations }
    };
    
  } catch (error) {
    console.error('Error generating image variants:', error);
    
    let errorMessage = 'Failed to generate image variants';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Helper function to validate image format
export const validateImageFormat = (imageData: string): boolean => {
  const validFormats = ['data:image/jpeg', 'data:image/jpg', 'data:image/png'];
  return validFormats.some(format => imageData.startsWith(format));
};

export default {
  generateImageWithFlux,
  generateImageVariants,
  validateImageFormat
};