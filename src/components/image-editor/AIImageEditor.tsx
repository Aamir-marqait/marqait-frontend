/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import {
  generateImageWithFlux,
  validateImageFormat,
} from "../../services/falAI";
import { Lightbulb, Upload } from "lucide-react";
import prompts from "../../assets/image-editor/prompt.svg";

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
        await new Promise((resolve) => setTimeout(resolve, 500));
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
        <h1 className="m-0 font-inter font-bold text-2xl leading-none tracking-normal text-[#161E54]">
          Describe your desired changes
        </h1>
        <p className="mt-2 font-inter font-normal text-sm leading-none tracking-normal text-[#4B4B4B]">
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
            className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651]"
          >
            Topic<span className="ml-0.5 text-[#ef4444]">*</span>
          </label>
          <input
            id="topic"
            type="text"
            inputMode="text"
            placeholder="Eg: Make festive image with firecrackers"
            className="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 font-['Inter'] font-normal text-base leading-6 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
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
            className="cursor-pointer inline-flex h-12 items-center gap-2 rounded-xl border border-[#8F00FF] bg-[#FFFFFF] px-4 font-['Inter'] font-semibold text-sm leading-5 tracking-normal text-[#8F00FF] transition hover:bg-[#faf5ff] shadow-[0px_1px_2px_0px_#1018280D]"
            aria-label="Upload a different image"
          >
            <span aria-hidden="true" className="text-base leading-none">
              <Upload className="h-4 w-4" />
            </span>
            Upload
          </button>

          <button
            type="button"
            onClick={handleGenerateImage}
            aria-disabled={!prompt.trim() || isGenerating}
            className="cursor-pointer inline-flex h-12 min-w-[122px] items-center justify-center gap-2 rounded-xl border border-[#8F00FF] px-5 font-['Inter'] font-semibold text-sm leading-5 tracking-normal text-white transition active:translate-y-px disabled:opacity-65 disabled:shadow-none bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] shadow-[0px_1px_2px_0px_#0A0D120D]"
          >
            {isGenerating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Generating…
              </>
            ) : (
              <>
                <span aria-hidden="true" className="text-base leading-none">
                  <img
                    src={prompts}
                    alt="generate-logo"
                    className="filter brightness-0 invert h-6 w-6"
                  />
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
          <div className="relative h-[240px] w-[240px] overflow-hidden rounded border-[0.7px] border-[#E6E7EA] bg-[#FFFFFF] max-[840px]:h-[200px] max-[840px]:w-[200px]">
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
              className="absolute right-2 rounded-[4px] top-2 grid h-[22px] w-[22px] place-items-center text-[16px] leading-none bg-white text-red-600 shadow border border-gray-300"
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
          className="mt-5 grid grid-row-[auto_1fr] items-start gap-3 rounded-[14px] border border-[#efe5ff] bg-[#E9CDFF33] p-4"
        >
          <span
            aria-hidden="true"
            className="flex flex-row items-center gap-1 "
          >
            <Lightbulb className="h-[22px] w-[22px] text-[#8F00FF]" />
            <div className="font-inter font-semibold text-lg  tracking-wide text-[#8F00FF]">
              Pro Tip
            </div>
          </span>
          <div>
            <p className="font-inter font-normal text-[16px] leading-6 tracking-normal text-[#5d6576]">
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
