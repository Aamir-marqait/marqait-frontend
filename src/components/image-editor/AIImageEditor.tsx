// import React, { useState } from "react";
// import {
//   generateImageWithFlux,
//   validateImageFormat,
// } from "../../services/falAI";

// interface AIImageEditorProps {
//   originalImage: string;
//   onBack: () => void;
// }

// const AIImageEditor: React.FC<AIImageEditorProps> = ({
//   originalImage,
//   onBack,
// }) => {
//   const [generatedImage, setGeneratedImage] = useState<string | null>(null);
//   const [prompt, setPrompt] = useState<string>("");
//   const [isGenerating, setIsGenerating] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleGenerateImage = async () => {
//     if (!prompt.trim()) return;

//     setIsGenerating(true);
//     setError(null);

//     try {
//       console.log("Starting image generation with prompt:", prompt);

//       // Validate image format
//       if (!validateImageFormat(originalImage)) {
//         throw new Error("Invalid image format. Please use JPEG or PNG.");
//       }

//       // Generate image using FAL.ai Flux with smart prompt analysis
//       const result = await generateImageWithFlux(originalImage, prompt);

//       if (result.success && result.imageUrl) {
//         setGeneratedImage(result.imageUrl);
//         console.log("Image generated successfully:", result.imageUrl);
//       } else {
//         throw new Error(result.error || "Failed to generate image");
//       }
//     } catch (error) {
//       console.error("Error generating image:", error);
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Failed to generate image. Please try again."
//       );
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleDownloadImage = async () => {
//     if (!generatedImage) return;

//     try {
//       const response = await fetch(generatedImage);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `ai-edited-image-${Date.now()}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading image:", error);
//       setError("Failed to download image");
//     }
//   };

//   const handleRegenerateImage = () => {
//     setGeneratedImage(null);
//     setError(null);
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "1400px",
//           margin: "0 auto",
//           background: "white",
//           borderRadius: "20px",
//           padding: "30px",
//           boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: "30px",
//           }}
//         >
//           <h1
//             style={{
//               color: "#333",
//               fontSize: "2rem",
//               fontWeight: "bold",
//               margin: 0,
//             }}
//           >
//             🎨 AI Image Editor
//           </h1>
//           <button
//             onClick={onBack}
//             style={{
//               background: "linear-gradient(135deg, #636e72 0%, #2d3436 100%)",
//               color: "white",
//               padding: "10px 25px",
//               borderRadius: "25px",
//               border: "none",
//               fontSize: "1rem",
//               fontWeight: "bold",
//               cursor: "pointer",
//               transition: "all 0.2s ease",
//             }}
//           >
//             ← Back
//           </button>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "30px",
//             marginBottom: "30px",
//           }}
//         >
//           <div>
//             <h3
//               style={{
//                 color: "#333",
//                 marginBottom: "15px",
//                 fontSize: "1.3rem",
//                 fontWeight: "bold",
//               }}
//             >
//               Original Image
//             </h3>
//             <div
//               style={{
//                 background: "#f8f9fa",
//                 borderRadius: "15px",
//                 padding: "20px",
//                 textAlign: "center",
//                 minHeight: "400px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <img
//                 src={originalImage}
//                 alt="Original"
//                 style={{
//                   maxWidth: "100%",
//                   maxHeight: "400px",
//                   borderRadius: "10px",
//                   boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
//                   objectFit: "contain",
//                 }}
//               />
//             </div>
//           </div>

//           <div>
//             <h3
//               style={{
//                 color: "#333",
//                 marginBottom: "15px",
//                 fontSize: "1.3rem",
//                 fontWeight: "bold",
//               }}
//             >
//               Edited Image
//             </h3>
//             <div
//               style={{
//                 background: "#f8f9fa",
//                 borderRadius: "15px",
//                 padding: "20px",
//                 textAlign: "center",
//                 minHeight: "400px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 border: generatedImage ? "none" : "2px dashed #ddd",
//               }}
//             >
//               {generatedImage ? (
//                 <img
//                   src={generatedImage}
//                   alt="Generated"
//                   style={{
//                     maxWidth: "100%",
//                     maxHeight: "400px",
//                     borderRadius: "10px",
//                     boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
//                     objectFit: "contain",
//                   }}
//                 />
//               ) : (
//                 <div
//                   style={{
//                     color: "#666",
//                     fontSize: "1.1rem",
//                     textAlign: "center",
//                   }}
//                 >
//                   {isGenerating ? (
//                     <div>
//                       <div
//                         style={{
//                           width: "40px",
//                           height: "40px",
//                           border: "4px solid #f3f3f3",
//                           borderTop: "4px solid #667eea",
//                           borderRadius: "50%",
//                           animation: "spin 1s linear infinite",
//                           margin: "0 auto 20px",
//                         }}
//                       ></div>
//                       <p>Editing image...</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <div
//                         style={{
//                           fontSize: "3rem",
//                           marginBottom: "15px",
//                           color: "#ddd",
//                         }}
//                       >
//                         🖼️
//                       </div>
//                       <p>Edited image will appear here</p>
//                       <p
//                         style={{
//                           fontSize: "0.9rem",
//                           color: "#999",
//                           marginTop: "10px",
//                         }}
//                       >
//                         Write an edit prompt below and click Generate
//                       </p>
//                       <div
//                         style={{
//                           background: "#e8f5e8",
//                           color: "#2d5016",
//                           padding: "15px",
//                           borderRadius: "12px",
//                           marginTop: "15px",
//                           fontSize: "0.9rem",
//                           border: "1px solid #4caf50",
//                           lineHeight: "1.4",
//                         }}
//                       >
//                         🎨 <strong>AI Image Editor:</strong> Edit your uploaded
//                         image with intelligent modifications
//                         <br />
//                         <div style={{ marginTop: "8px", fontSize: "0.8rem" }}>
//                           <strong>Try:</strong> "Remove all text from the image"
//                           • "Change the sky to purple" • "Add sunglasses to the
//                           person" • "Change background to beach" • "Make it look
//                           vintage"
//                         </div>
//                       </div>
//                       {error && (
//                         <div
//                           style={{
//                             background: "#ffe6e6",
//                             color: "#d63031",
//                             padding: "10px",
//                             borderRadius: "8px",
//                             marginTop: "15px",
//                             fontSize: "0.9rem",
//                             border: "1px solid #fab1a0",
//                           }}
//                         >
//                           ⚠️ {error}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             background: "#f8f9fa",
//             borderRadius: "15px",
//             padding: "25px",
//           }}
//         >
//           <h3
//             style={{
//               color: "#333",
//               marginBottom: "15px",
//               fontSize: "1.3rem",
//               fontWeight: "bold",
//             }}
//           >
//             ✍️ Describe How to Edit Your Image
//           </h3>
//           <div
//             style={{
//               display: "flex",
//               gap: "15px",
//               alignItems: "flex-end",
//             }}
//           >
//             <div style={{ flex: 1 }}>
//               <textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 placeholder="Describe how you want to edit the image... (e.g., 'Remove all text from the image', 'Change the sky to purple', 'Add sunglasses to the person', 'Change background to beach', 'Make it look vintage')"
//                 style={{
//                   width: "100%",
//                   minHeight: "80px",
//                   padding: "15px",
//                   borderRadius: "10px",
//                   border: "2px solid #e9ecef",
//                   fontSize: "1rem",
//                   fontFamily: "Arial, sans-serif",
//                   resize: "vertical" as const,
//                   outline: "none",
//                   transition: "border-color 0.2s ease",
//                 }}
//                 onFocus={(e) => (e.target.style.borderColor = "#667eea")}
//                 onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
//               />
//             </div>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 onClick={handleGenerateImage}
//                 disabled={!prompt.trim() || isGenerating}
//                 style={{
//                   background:
//                     !prompt.trim() || isGenerating
//                       ? "#ccc"
//                       : "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
//                   color: "white",
//                   padding: "15px 30px",
//                   borderRadius: "10px",
//                   border: "none",
//                   fontSize: "1.1rem",
//                   fontWeight: "bold",
//                   cursor:
//                     !prompt.trim() || isGenerating ? "not-allowed" : "pointer",
//                   transition: "all 0.2s ease",
//                   boxShadow:
//                     !prompt.trim() || isGenerating
//                       ? "none"
//                       : "0 5px 15px rgba(0, 184, 148, 0.4)",
//                   minWidth: "120px",
//                 }}
//               >
//                 {isGenerating ? "🔄" : "✨ Generate"}
//               </button>

//               {generatedImage && (
//                 <>
//                   <button
//                     onClick={handleDownloadImage}
//                     style={{
//                       background:
//                         "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
//                       color: "white",
//                       padding: "15px 25px",
//                       borderRadius: "10px",
//                       border: "none",
//                       fontSize: "1.1rem",
//                       fontWeight: "bold",
//                       cursor: "pointer",
//                       transition: "all 0.2s ease",
//                       boxShadow: "0 5px 15px rgba(116, 185, 255, 0.4)",
//                     }}
//                   >
//                     📥 Download
//                   </button>

//                   <button
//                     onClick={handleRegenerateImage}
//                     style={{
//                       background:
//                         "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
//                       color: "white",
//                       padding: "15px 25px",
//                       borderRadius: "10px",
//                       border: "none",
//                       fontSize: "1.1rem",
//                       fontWeight: "bold",
//                       cursor: "pointer",
//                       transition: "all 0.2s ease",
//                       boxShadow: "0 5px 15px rgba(162, 155, 254, 0.4)",
//                     }}
//                   >
//                     🔄 Regenerate
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AIImageEditor;

import React, { useState, useEffect } from "react";
import {
  generateImageWithFlux,
  validateImageFormat,
} from "../../services/falAI";

interface AIImageEditorProps {
  originalImage: string;
  onBack: () => void;
  onCancel?: () => void;
  onGeneratedImagesChange?: (hasImages: boolean) => void;
  onSetDownloadAll?: (downloadFn: (() => void) | null) => void;
}

const AIImageEditor: React.FC<AIImageEditorProps> = ({
  originalImage,
  onBack,
  onCancel,
  onGeneratedImagesChange,
  onSetDownloadAll,
}) => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadImage = async (imageUrl: string) => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-edited-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
      setError("Failed to download image");
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < generatedImages.length; i++) {
      await handleDownloadImage(generatedImages[i]);
      // Small delay between downloads to avoid overwhelming the browser
      if (i < generatedImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  // Notify parent when generated images change
  useEffect(() => {
    onGeneratedImagesChange?.(generatedImages.length > 0);
  }, [generatedImages.length, onGeneratedImagesChange]);

  // Set up download function for parent - but don't auto-trigger
  useEffect(() => {
    if (generatedImages.length > 0) {
      onSetDownloadAll?.(() => handleDownloadAll);
    } else {
      onSetDownloadAll?.(null);
    }
  }, [generatedImages.length, onSetDownloadAll]);

  const handleGenerateImage = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    try {
      if (!validateImageFormat(originalImage)) {
        throw new Error("Invalid image format. Please use JPEG or PNG.");
      }
      const result = await generateImageWithFlux(originalImage, prompt);
      if (result.success && result.imageUrl) {
        setGeneratedImages([result.imageUrl]);
      } else {
        throw new Error(result.error || "Failed to generate image");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate image. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateImage = () => {
    setGeneratedImages([]);
    setError(null);
  };

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  return (
    <>
      {/* Header */}
      <header className="mb-6">
        <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.02em]">
          Describe your desired changes
        </h1>
        <p className="mt-1 text-[14.5px] text-[#667085]">
          Tell our AI how you want to transform your image
        </p>
      </header>

      {/* Controls Row */}
      <section
        aria-label="Topic input and actions"
        className="grid grid-cols-[1fr_auto] items-end gap-4 mt-4 max-[840px]:grid-cols-1"
      >
        <div className="grid gap-2">
          <label
            htmlFor="topic"
            className="text-[13px] font-semibold text-[#1f2340]"
          >
            Topic<span className="ml-0.5 text-[#ef4444]">*</span>
          </label>
          <input
            id="topic"
            type="text"
            inputMode="text"
            placeholder="Eg: Make festive image with firecrackers"
            className="h-12 w-full rounded-xl border border-[#e7e8ee] px-4 text-[15px] text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={onInputKeyDown}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "error-text" : undefined}
          />
        </div>

        <div className="flex gap-3">
          {/* Upload = go back to previous step to pick another image */}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#9f67ff] bg-white px-4 text-[14.5px] font-semibold text-[#6d28d9] transition hover:bg-[#faf5ff]"
            aria-label="Upload a different image"
          >
            <span aria-hidden="true" className="text-base leading-none">
              ⤴︎
            </span>
            Upload
          </button>

          <button
            type="button"
            onClick={handleGenerateImage}
            disabled={!prompt.trim() || isGenerating}
            aria-disabled={!prompt.trim() || isGenerating}
            className="inline-flex h-12 min-w-[122px] items-center justify-center gap-2 rounded-xl border-0 px-5 text-[14.5px] font-bold text-white shadow-[0_8px_18px_rgba(106,0,255,0.25)] transition active:translate-y-px disabled:opacity-65 disabled:shadow-none bg-[linear-gradient(90deg,#c148ff_0%,#6a00ff_100%)] hover:shadow-[0_10px_22px_rgba(106,0,255,0.28)]"
          >
            {isGenerating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Generating…
              </>
            ) : (
              <>
                <span aria-hidden="true" className="text-base leading-none">
                  ⚡
                </span>
                Generate
              </>
            )}
          </button>
        </div>
      </section>

      {/* Generated Variant Section - only show if generated */}
      {generatedImages.length > 0 && (
        <section className="mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="m-0 text-[20px] font-bold text-[#1f2340]">
              Generated Variant
            </h2>
            <button
              type="button"
              onClick={handleRegenerateImage}
              className="inline-flex items-center gap-2 rounded-xl border border-[#9f67ff] bg-white px-4 py-2 text-[14.5px] font-semibold text-[#6d28d9] transition hover:bg-[#faf5ff]"
            >
              <span aria-hidden="true" className="text-base leading-none">
                🔄
              </span>
              Regenerate
            </button>
          </div>
          <div className="flex gap-4 flex-wrap">
            {generatedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative h-[300px] w-[300px] overflow-hidden rounded-xl bg-[#f0f2f6] border border-[#e7e8ee]"
              >
                <img
                  src={imageUrl}
                  alt={`Generated variant ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Thumbnail row - only show if no generated images */}
      {generatedImages.length === 0 && (
        <section aria-label="Image preview" className="mt-5">
          <div className="relative h-[240px] w-[240px] overflow-hidden rounded-xl bg-[#f0f2f6] max-[840px]:h-[200px] max-[840px]:w-[200px]">
            <img
              src={originalImage}
              alt="Selected to edit"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={onBack}
              title="Remove image"
              aria-label="Remove image"
              className="absolute right-2 top-2 grid h-[22px] w-[22px] place-items-center rounded-full bg-[#ff4d4f] text-[16px] leading-none text-white shadow"
            >
              ×
            </button>
          </div>
        </section>
      )}

      {/* Pro Tip - only show if no generated images */}
      {generatedImages.length === 0 && (
        <section
          role="note"
          aria-label="Pro Tip"
          className="mt-5 grid grid-cols-[auto_1fr] items-start gap-3 rounded-[14px] border border-[#efe5ff] bg-[#f4eaff] p-4"
        >
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#efe5ff] text-[#6d28d9]">
            <span aria-hidden="true">💡</span>
          </div>
          <div>
            <div className="mb-1 font-bold text-[#6d28d9]">Pro Tip</div>
            <p className="m-0 text-[14.5px] text-[#4b5563]">
              Be specific with your topic for better AI-generated content. The
              more context you provide, the more tailored and effective your
              image will be.
            </p>
          </div>
        </section>
      )}

      {error && (
        <div
          id="error-text"
          role="alert"
          className="mt-3 rounded-xl border border-[#ffd4d4] bg-[#fff2f2] p-3 text-sm text-[#b42318]"
        >
          ⚠️ {error}
        </div>
      )}
    </>
  );
};

export default AIImageEditor;
