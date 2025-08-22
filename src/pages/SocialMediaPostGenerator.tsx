// @typescript-eslint/no-unused-vars
import { useState, useEffect, useRef } from "react";
import {
  Download,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  Copy,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Edit3,
  Lightbulb,
  RotateCw,
} from "lucide-react";
import { useCreditStore } from "../stores/creditStore";
import { useSocialMediaEditStore } from "../stores/socialMediaEditStore";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { agentsService } from "../api/services";
import type { SocialMediaGeneratorRequest } from "../api/types";
import { generateImageVariants, validateImageFormat } from "../services/falAI";
import prompts from "../assets/image-editor/prompt.svg";

interface PostFormData {
  contentDescription: string;
  platform: string;
  contentType: string;
  carousel: boolean;
  brandName: string;
  targetAudience: string;
  additionalContext: string;
}

interface GeneratedPost {
  imageUrls: string[];
  caption: string;
  hashtags: string;
  bestTime: string;
}

const SocialMediaPostGenerator = () => {
  const { fetchCreditsBalance } = useCreditStore();
  const {
    currentImage,
    originalPost,
    currentImageIndex: editImageIndex,
    isEditing,
    updateCurrentImage,
    finishEdit,
    startEdit,
  } = useSocialMediaEditStore();

  const [formData, setFormData] = useState<PostFormData>({
    contentDescription: "",
    platform: "instagram",
    contentType: "post",
    carousel: false,
    brandName: "",
    targetAudience: "",
    additionalContext: "",
  });

  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const editDropdownRef = useRef<HTMLDivElement>(null);

  // Edit mode state
  const [editGeneratedImages, setEditGeneratedImages] = useState<string[]>([]);
  const [editPrompt, setEditPrompt] = useState<string>("");
  const [isEditGenerating, setIsEditGenerating] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Fetch credits on component mount
  useEffect(() => {
    fetchCreditsBalance();
  }, [fetchCreditsBalance]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editDropdownRef.current &&
        !editDropdownRef.current.contains(event.target as Node)
      ) {
        setIsEditDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    field: keyof PostFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleGenerate = async () => {
    if (!formData.contentDescription.trim()) {
      setError("Content description is required");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Map platform names - API uses 'x' instead of 'twitter'
      const platformMapping: Record<string, string> = {
        twitter: "x",
        instagram: "instagram",
        facebook: "facebook",
        linkedin: "linkedin",
      };

      // Prepare API request data
      const apiRequest: SocialMediaGeneratorRequest = {
        platform: platformMapping[formData.platform] || formData.platform,
        type: formData.contentType,
        context: formData.contentDescription.trim(),
      };

      // Add optional fields if provided
      if (formData.contentType === "post" && formData.carousel) {
        apiRequest.carousel = formData.carousel;
      }
      if (formData.brandName.trim()) {
        apiRequest.brand_name = formData.brandName.trim();
      }
      if (formData.targetAudience.trim()) {
        apiRequest.target_audience = formData.targetAudience.trim();
      }
      if (formData.additionalContext.trim()) {
        apiRequest.additional_context = formData.additionalContext.trim();
      }

      // Call the API - backend handles credit deduction
      const result = await agentsService.generateSocialMediaPost(apiRequest);

      // Clean and parse the output data
      const cleanedImageUrls = result.output_data.images.map((img) => {
        // Clean up malformed URLs (remove extra closing parentheses)
        let cleanUrl = img.url;
        if (cleanUrl.endsWith(")") && !cleanUrl.includes("(")) {
          cleanUrl = cleanUrl.slice(0, -1);
        }
        console.log("Original URL:", img.url);
        console.log("Cleaned URL:", cleanUrl);
        return cleanUrl;
      });

      // Clean up caption - remove escaped quotes and fix malformed link syntax
      let cleanedCaption = result.output_data.caption;
      if (typeof cleanedCaption === "string") {
        // Remove escaped quotes
        cleanedCaption = cleanedCaption.replace(/\\"/g, '"');
        // Fix malformed link syntax [Link text](url)) -> [Link text](url)
        cleanedCaption = cleanedCaption.replace(
          /\[([^\]]+)\]\(([^)]+)\)\)/g,
          "[$1]($2)"
        );
        // Remove any markdown links as they don't display well in social media
        cleanedCaption = cleanedCaption.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      }

      setGeneratedPost({
        imageUrls: cleanedImageUrls,
        caption: cleanedCaption,
        hashtags: result.output_data.hashtags.join(" "),
        bestTime: result.output_data.best_posting_times.join(", "),
      });

      // Reset loading states for new post
      setImageLoading(true);
      setImageError(false);

      // Debug: Check if imageUrls are valid
      console.log("Generated post imageUrls:", cleanedImageUrls);

      // Refresh credits after successful generation
      await fetchCreditsBalance();
    } catch (error: unknown) {
      // Backend returns appropriate error messages including credit errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Generation failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: "png" | "svg") => {
    if (!generatedPost?.imageUrls || generatedPost.imageUrls.length === 0)
      return;

    // Download current image or all images if multiple
    const imageToDownload = generatedPost.imageUrls[currentImageIndex];
    const link = document.createElement("a");
    const fileName =
      generatedPost.imageUrls.length > 1
        ? `social_media_post_${formData.platform}_${
            currentImageIndex + 1
          }_${Date.now()}`
        : `social_media_post_${formData.platform}_${Date.now()}`;

    if (format === "svg") {
      // Convert the current SVG data URL to downloadable SVG
      if (imageToDownload.startsWith("data:image/svg+xml;base64,")) {
        const svgData = atob(imageToDownload.split(",")[1]);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.svg`;
      }
    } else {
      // For PNG, we'll need to convert SVG to PNG using canvas
      if (imageToDownload.startsWith("data:image/svg+xml;base64,")) {
        atob(imageToDownload.split(",")[1]);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = formData.contentType === "story" ? 1080 : 1200;
          canvas.height = formData.contentType === "story" ? 1920 : 1200;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const downloadLink = document.createElement("a");
              downloadLink.href = url;
              downloadLink.download = `${fileName}.png`;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              URL.revokeObjectURL(url);
            }
          }, "image/png");
        };
        img.src = imageToDownload;
        return;
      } else {
        // If it's already a PNG or other format
        link.href = imageToDownload;
        link.download = `${fileName}.png`;
      }
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  };

  const handleCopy = async (text: string, type: "caption" | "hashtags") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "caption") {
        setCopiedCaption(true);
        setTimeout(() => setCopiedCaption(false), 2000);
      } else {
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleEditViaPrompt = () => {
    if (!generatedPost) return;

    startEdit(
      generatedPost.imageUrls[currentImageIndex],
      currentImageIndex,
      generatedPost
    );
    setIsEditDropdownOpen(false);

    // Clear edit state
    setEditGeneratedImages([]);
    setEditPrompt("");
    setEditError(null);
  };

  const handleEditGenerate = async () => {
    if (!editPrompt.trim() || isEditGenerating || !currentImage) return;
    setIsEditGenerating(true);
    setEditError(null);
    try {
      if (!validateImageFormat(currentImage)) {
        throw new Error("Invalid image format. Please use JPEG or PNG.");
      }
      const result = await generateImageVariants(currentImage, editPrompt);
      if (result.success && result.images) {
        setEditGeneratedImages(result.images);
      } else {
        throw new Error(result.error || "Failed to generate image variants");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setEditError(
        err instanceof Error
          ? err.message
          : "Failed to generate image variants. Please try again."
      );
    } finally {
      setIsEditGenerating(false);
    }
  };

  const handleEditRegenerate = async () => {
    if (!editPrompt.trim() || isEditGenerating || !currentImage) return;
    setIsEditGenerating(true);
    setEditError(null);
    try {
      if (!validateImageFormat(currentImage)) {
        throw new Error("Invalid image format. Please use JPEG or PNG.");
      }
      const result = await generateImageVariants(currentImage, editPrompt);
      if (result.success && result.images) {
        setEditGeneratedImages(result.images);
      } else {
        throw new Error(result.error || "Failed to regenerate image variants");
      }
    } catch (err) {
      console.error("Error regenerating image:", err);
      setEditError(
        err instanceof Error
          ? err.message
          : "Failed to regenerate image variants. Please try again."
      );
    } finally {
      setIsEditGenerating(false);
    }
  };

  const handleSaveEditedImage = (imageUrl: string) => {
    if (!imageUrl) return;

    // Update the current image in the store
    updateCurrentImage(imageUrl);

    // Update the generated post state to reflect the change
    if (originalPost) {
      const updatedImageUrls = [...originalPost.imageUrls];
      updatedImageUrls[editImageIndex] = imageUrl;
      setGeneratedPost({
        ...originalPost,
        imageUrls: updatedImageUrls,
      });
    }

    // Exit edit mode
    finishEdit();

    // Clear edit state
    setEditGeneratedImages([]);
    setEditPrompt("");
    setEditError(null);
  };

  const handleCancelEdit = () => {
    finishEdit();
    setEditGeneratedImages([]);
    setEditPrompt("");
    setEditError(null);
  };

  const onEditInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditGenerate();
    }
  };

  const handleBack = () => {
    setGeneratedPost(null);
    setError(null);
    setCopiedCaption(false);
    setCopiedHashtags(false);
    setIsImageModalOpen(false);
    setCurrentImageIndex(0);
    setImageLoading(true);
    setImageError(false);
  };

  const handlePrevImage = () => {
    if (generatedPost && generatedPost.imageUrls.length > 1) {
      setImageLoading(true);
      setImageError(false);
      setCurrentImageIndex((prev) =>
        prev === 0 ? generatedPost.imageUrls.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (generatedPost && generatedPost.imageUrls.length > 1) {
      setImageLoading(true);
      setImageError(false);
      setCurrentImageIndex((prev) =>
        prev === generatedPost.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const isFormValid = formData.contentDescription.trim();

  const handleImageIndicatorClick = (index: number) => {
    if (index !== currentImageIndex) {
      setImageLoading(true);
      setImageError(false);
    }
    setCurrentImageIndex(index);
  };

  return (
    <div className="p-8 bg-[#FAFAFB]">
      <section className="mb-8">
        <h1 className="font-inter font-bold text-[32px] leading-none tracking-normal text-[#161E54]">
          Social Media Post Generator
        </h1>
        <p className="mt-2 font-inter font-normal text-[20px] leading-none tracking-normal text-[#4B4B4B]">
          Create engaging social media content with AI-powered design tools
        </p>
      </section>

      <div className="bg-white border border-[#E0E0E0] rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.10)] px-8 py-8">
        {isEditing && currentImage ? (
          <>
            {/* Edit Interface */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleCancelEdit}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#8F00FF] bg-white px-3 font-inter font-semibold text-sm leading-5 tracking-normal text-[#8F00FF] transition hover:bg-[#faf5ff] shadow-[0px_1px_2px_0px_#1018280D] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Post
              </button>
            </div>

            <header className="mb-6">
              <h2 className="m-0 font-inter font-bold text-2xl leading-none tracking-normal text-[#161E54]">
                Edit Your Social Media Image
              </h2>
              <p className="mt-2 font-inter font-normal text-sm leading-none tracking-normal text-[#4B4B4B]">
                Describe how you want to transform your image
              </p>
            </header>

            {/* Edit Controls */}
            <section
              aria-label="Topic input and actions"
              className="grid grid-cols-[1fr_auto] items-end gap-4 mt-4 max-[840px]:grid-cols-1"
            >
              <div className="grid gap-2">
                <label
                  htmlFor="edit-topic"
                  className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651]"
                >
                  What changes do you want to make?
                  <span className="ml-0.5 text-[#ef4444]">*</span>
                </label>
                <input
                  id="edit-topic"
                  type="text"
                  inputMode="text"
                  placeholder="Eg: Make festive image with firecrackers"
                  autoComplete="off"
                  className="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 font-['Inter'] font-normal text-base leading-6 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  onKeyDown={onEditInputKeyDown}
                  aria-invalid={Boolean(editError)}
                  aria-describedby={editError ? "edit-error-text" : undefined}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="cursor-pointer inline-flex h-12 items-center gap-2 rounded-xl border border-[#8F00FF] bg-[#FFFFFF] px-4 font-['Inter'] font-semibold text-sm leading-5 tracking-normal text-[#8F00FF] transition hover:bg-[#faf5ff] shadow-[0px_1px_2px_0px_#1018280D]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleEditGenerate}
                  disabled={!editPrompt.trim() || isEditGenerating}
                  className="cursor-pointer inline-flex h-12 min-w-[122px] items-center justify-center gap-2 rounded-xl border border-[#8F00FF] px-5 font-['Inter'] font-semibold text-sm leading-5 tracking-normal text-white transition active:translate-y-px disabled:opacity-65 disabled:cursor-not-allowed  disabled:shadow-none bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] shadow-[0px_1px_2px_0px_#0A0D120D]"
                >
                  {isEditGenerating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <span
                        aria-hidden="true"
                        className="text-base leading-none"
                      >
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

            {/* Generated Variants Section */}
            {editGeneratedImages.length > 0 && (
              <section className="mt-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="m-0 font-inter font-bold text-2xl leading-none tracking-normal text-[#161E54]">
                    Generated Variants ({editGeneratedImages.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleEditRegenerate}
                    disabled={isEditGenerating}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-[#8F00FF] bg-white px-4 py-2 font-inter font-semibold text-sm leading-5 tracking-normal text-[#8F00FF] transition hover:bg-[#faf5ff] shadow-[0px_1px_2px_0px_#0A0D120D] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className="h-4 w-4" />
                    {isEditGenerating ? "Regenerating..." : "Regenerate"}
                  </button>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {editGeneratedImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative h-[300px] w-[300px] overflow-hidden bg-[#f0f2f6] border border-[#e7e8ee] rounded-lg"
                    >
                      <img
                        src={imageUrl}
                        alt={`Generated variant ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {/* Save button overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          onClick={() => handleSaveEditedImage(imageUrl)}
                          className="bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] text-white px-6 py-2 rounded-lg font-inter font-semibold text-sm hover:shadow-lg transition-all duration-200"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Original Image Preview */}
            {editGeneratedImages.length === 0 && (
              <section aria-label="Image preview" className="mt-5">
                <div className="relative h-[240px] w-[240px] overflow-hidden rounded border-[0.7px] border-[#E6E7EA] bg-[#FFFFFF] max-[840px]:h-[200px] max-[840px]:w-[200px]">
                  <img
                    src={currentImage}
                    alt="Selected to edit"
                    className="h-full w-full object-cover"
                  />
                </div>
              </section>
            )}

            {/* Pro Tip */}
            {editGeneratedImages.length === 0 && (
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
                    Be specific with your topic for better AI-generated content.
                    The more context you provide, the more tailored and
                    effective your image will be.
                  </p>
                </div>
              </section>
            )}

            {editError && (
              <div
                id="edit-error-text"
                role="alert"
                className="mt-3 rounded-xl border border-[#ffd4d4] bg-[#fff2f2] p-3 text-sm text-[#b42318]"
              >
                ⚠️ {editError}
              </div>
            )}
          </>
        ) : !generatedPost ? (
          <>
            {/* Form Section */}
            <h2 className="font-inter font-bold text-xl leading-none tracking-normal text-[#8F00FF] mb-6">
              Tell Us About Your Content
            </h2>

            <div className="max-w-4xl">
              <div className="space-y-5">
                {/* Content Description */}
                <div>
                  <label
                    htmlFor="contentDescription"
                    className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                  >
                    What kind of social media content do you want to create?
                    <span className="ml-0.5 text-[#ef4444]">*</span>
                  </label>
                  <textarea
                    id="contentDescription"
                    placeholder="e.g., 'Eid Mubarak post for my fashion brand'"
                    value={formData.contentDescription}
                    onChange={(e) =>
                      handleInputChange("contentDescription", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-[#D5D7DA] px-3 py-2 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D] resize-none"
                  />
                </div>

                {/* Platform and Content Type in Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="platform"
                      className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                    >
                      Which platform?
                    </label>
                    <select
                      id="platform"
                      value={formData.platform}
                      onChange={(e) =>
                        handleInputChange("platform", e.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D] bg-white"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">X (Twitter)</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contentType"
                      className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                    >
                      Content type?
                    </label>
                    <select
                      id="contentType"
                      value={formData.contentType}
                      onChange={(e) =>
                        handleInputChange("contentType", e.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D] bg-white"
                    >
                      <option value="post">Post</option>
                      <option value="story">Story</option>
                    </select>
                  </div>
                </div>

                {/* Optional Brand Context Section */}
                <div className="space-y-4">
                  <h3 className="font-inter font-semibold text-base text-[#8F00FF] mb-3">
                    Optional Brand Context
                  </h3>
                  {/* {formData.contentType === "post" && (
                    <div>
                      <label className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2">
                        Content Type
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.carousel}
                            onChange={(e) =>
                              handleInputChange("carousel", e.target.checked)
                            }
                            className="w-4 h-4 text-[#8F00FF] border-[#D5D7DA] rounded focus:ring-[#7c3aed]/20 focus:ring-2"
                          />
                          <span className="font-inter font-normal text-sm leading-5 tracking-normal text-[#414651]">
                            Create as carousel (multiple images)
                          </span>
                        </label>
                      </div>
                    </div>
                  )} */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="brandName"
                        className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                      >
                        Brand Name
                      </label>
                      <input
                        id="brandName"
                        type="text"
                        placeholder="e.g., TechFlow, FlowerShop"
                        value={formData.brandName}
                        onChange={(e) =>
                          handleInputChange("brandName", e.target.value)
                        }
                        maxLength={50}
                        className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="targetAudience"
                        className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                      >
                        Target Audience
                      </label>
                      <input
                        id="targetAudience"
                        type="text"
                        placeholder="e.g., young professionals, mothers"
                        value={formData.targetAudience}
                        onChange={(e) =>
                          handleInputChange("targetAudience", e.target.value)
                        }
                        maxLength={200}
                        className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="additionalContext"
                      className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                    >
                      Additional Context
                    </label>
                    <textarea
                      id="additionalContext"
                      placeholder="e.g., seasonal sale, product launch, holiday promotion"
                      value={formData.additionalContext}
                      onChange={(e) =>
                        handleInputChange("additionalContext", e.target.value)
                      }
                      rows={2}
                      maxLength={500}
                      className="w-full rounded-lg border border-[#D5D7DA] px-3 py-2 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D] resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleGenerate}
                    disabled={!isFormValid || isGenerating}
                    className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#8F00FF] px-4 font-['Inter'] font-semibold text-sm leading-5 tracking-normal text-white transition active:translate-y-px disabled:opacity-65 disabled:cursor-not-allowed disabled:shadow-none bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] shadow-[0px_1px_2px_0px_#0A0D120D] hover:shadow-[0_10px_22px_rgba(106,0,255,0.28)] cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Post
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 text-sm text-[#b42318]">
                  ⚠️ Oops! Something didn’t work as expected. Please try again
                  shortly.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-inter font-bold text-xl leading-none tracking-normal text-[#8F00FF]">
                Your Generated Post
              </h2>
              <button
                onClick={handleBack}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#8F00FF] bg-white px-3 font-inter font-semibold text-sm leading-5 tracking-normal text-[#8F00FF] transition hover:bg-[#faf5ff] shadow-[0px_1px_2px_0px_#1018280D] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Post & Buttons */}
              <div className="space-y-4">
                {/* Post Display */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Dialog
                      open={isImageModalOpen}
                      onOpenChange={setIsImageModalOpen}
                    >
                      <DialogTrigger asChild>
                        <button className="relative group cursor-pointer">
                          <>
                            {/* Always show the image */}
                            <img
                              src={generatedPost.imageUrls[currentImageIndex]}
                              alt="Generated Social Media Post"
                              className={`object-contain rounded-lg shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.02] ${
                                formData.contentType === "story"
                                  ? "w-60 h-[26.25rem]"
                                  : "w-80 h-80"
                              }`}
                              onLoad={() => {
                                console.log(
                                  "Main image loaded successfully:",
                                  generatedPost.imageUrls[currentImageIndex]
                                );
                                setImageLoading(false);
                              }}
                              onError={(e) => {
                                console.error(
                                  "Main image failed to load:",
                                  generatedPost.imageUrls[currentImageIndex],
                                  e
                                );
                                setImageLoading(false);
                                setImageError(true);
                              }}
                            />

                            {/* Show skeleton overlay only while loading */}
                            {imageLoading && !imageError && (
                              <div
                                className={`absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center ${
                                  formData.contentType === "story"
                                    ? "w-60 h-[26.25rem]"
                                    : "w-80 h-80"
                                }`}
                              >
                                <div className="text-gray-400">
                                  <svg
                                    className="w-12 h-12"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}

                            {/* Show error overlay if image failed */}
                            {imageError && (
                              <div
                                className={`absolute inset-0 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center ${
                                  formData.contentType === "story"
                                    ? "w-60 h-[26.25rem]"
                                    : "w-80 h-80"
                                }`}
                              >
                                <div className="text-red-400 mb-2">
                                  <svg
                                    className="w-12 h-12"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <p className="text-red-600 text-sm font-medium">
                                  Failed to load image
                                </p>
                              </div>
                            )}

                            {/* Hover overlay for zoom effect */}
                            {!imageError && (
                              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                <div className="bg-white/90 rounded-full p-2">
                                  <svg
                                    className="w-4 h-4 text-[#8F00FF]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-fit w-fit p-0 bg-transparent border-0 shadow-none">
                        <div className="relative bg-[#7000CC] p-[2px] rounded-xl">
                          <div className="relative bg-white rounded-xl overflow-hidden">
                            <button
                              onClick={() => setIsImageModalOpen(false)}
                              className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200"
                            >
                              <X className="h-4 w-4 text-[#4B4B4B]" />
                            </button>

                            {/* Navigation arrows in modal */}
                            {generatedPost.imageUrls.length > 1 && (
                              <>
                                <button
                                  onClick={handlePrevImage}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200"
                                >
                                  <ArrowLeft className="h-5 w-5 text-[#4B4B4B]" />
                                </button>
                                <button
                                  onClick={handleNextImage}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200"
                                >
                                  <ArrowRight className="h-5 w-5 text-[#4B4B4B]" />
                                </button>
                              </>
                            )}

                            <>
                              {/* Always show the modal image */}
                              <img
                                src={generatedPost.imageUrls[currentImageIndex]}
                                alt="Generated Social Media Post - Full View"
                                className={`block ${
                                  formData.contentType === "story"
                                    ? "w-[50vh] h-[88vh]"
                                    : "w-[80vh] h-[80vh]"
                                } object-cover`}
                                onLoad={() => {
                                  console.log(
                                    "Modal image loaded successfully:",
                                    generatedPost.imageUrls[currentImageIndex]
                                  );
                                  setImageLoading(false);
                                }}
                                onError={(e) => {
                                  console.error(
                                    "Modal image failed to load:",
                                    generatedPost.imageUrls[currentImageIndex],
                                    e
                                  );
                                  setImageLoading(false);
                                  setImageError(true);
                                }}
                              />

                              {/* Show skeleton overlay only while loading in modal */}
                              {imageLoading && !imageError && (
                                <div
                                  className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${
                                    formData.contentType === "story"
                                      ? "w-[50vh] h-[88vh]"
                                      : "w-[80vh] h-[80vh]"
                                  }`}
                                >
                                  <div className="text-gray-400">
                                    <svg
                                      className="w-16 h-16"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}

                              {/* Show error overlay if modal image failed */}
                              {imageError && (
                                <div
                                  className={`absolute inset-0 bg-red-50 border border-red-200 flex flex-col items-center justify-center ${
                                    formData.contentType === "story"
                                      ? "w-[50vh] h-[88vh]"
                                      : "w-[80vh] h-[80vh]"
                                  }`}
                                >
                                  <div className="text-red-400 mb-2">
                                    <svg
                                      className="w-16 h-16"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <p className="text-red-600 font-medium">
                                    Failed to load image
                                  </p>
                                </div>
                              )}
                            </>

                            {/* Image counter */}
                            {generatedPost.imageUrls.length > 1 && (
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {currentImageIndex + 1} /{" "}
                                {generatedPost.imageUrls.length}
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Navigation arrows for main view */}
                    {generatedPost.imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <ArrowLeft className="h-4 w-4 text-[#4B4B4B]" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <ArrowRight className="h-4 w-4 text-[#4B4B4B]" />
                        </button>
                      </>
                    )}

                    {/* Image indicators */}
                    {generatedPost.imageUrls.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {generatedPost.imageUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleImageIndicatorClick(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentImageIndex
                                ? "bg-[#8F00FF]"
                                : "bg-white/60 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleDownload("png")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] border border-[#8F00FF] px-4 font-inter font-semibold text-sm leading-5 tracking-normal text-white transition hover:shadow-[0_10px_22px_rgba(106,0,255,0.28)] shadow-[0px_1px_2px_0px_#0A0D120D] cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>

                  <div className="relative" ref={editDropdownRef}>
                    <button
                      onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#8F00FF] bg-white px-3 font-inter font-semibold text-sm leading-5 tracking-normal text-[#8F00FF] transition hover:bg-[#faf5ff] shadow-[0px_1px_2px_0px_#1018280D] cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {isEditDropdownOpen && (
                      <div className="absolute top-full -left-8 mt-1 min-w-36 bg-white border border-[#E0E0E0] rounded-lg shadow-lg z-10">
                        <button
                          onClick={handleEditViaPrompt}
                          className="w-full cursor-pointer px-4 py-2 text-left font-inter font-medium text-sm text-[#414651] hover:bg-[#F8F9FB] rounded-lg transition"
                        >
                          Edit Via Prompt
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Content Details */}
              <div className="bg-[#F5EDFF] rounded-xl p-6 border border-[#E0D3FA]">
                <h3 className="font-inter font-semibold text-lg text-[#8F00FF] mb-6 italic">
                  "Your Social Media Content Package"
                </h3>

                <div className="space-y-6">
                  {/* Caption Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651]">
                        Caption
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(generatedPost.caption, "caption")
                        }
                        className="inline-flex h-6 items-center gap-1 rounded border border-[#D5D7DA] bg-white px-2 font-inter font-medium text-xs text-[#414651] transition hover:bg-[#F8F9FB] cursor-pointer"
                      >
                        {copiedCaption ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        {copiedCaption ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="font-inter font-normal text-sm leading-5 tracking-normal text-[#4B4B4B] whitespace-pre-line bg-white rounded-lg border border-[#E0D3FA] p-3">
                      {generatedPost.caption}
                    </p>
                  </div>

                  {/* Hashtags Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651]">
                        Hashtags
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(generatedPost.hashtags, "hashtags")
                        }
                        className="inline-flex h-6 items-center gap-1 rounded border border-[#D5D7DA] bg-white px-2 font-inter font-medium text-xs text-[#414651] transition hover:bg-[#F8F9FB] cursor-pointer"
                      >
                        {copiedHashtags ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        {copiedHashtags ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="font-inter font-normal text-sm leading-5 tracking-normal text-[#4B4B4B] bg-white rounded-lg border border-[#E0D3FA] p-3">
                      {generatedPost.hashtags}
                    </p>
                  </div>

                  {/* Best Time Section */}
                  <div>
                    <h4 className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] mb-3">
                      Best Time to Post
                    </h4>
                    <div className="bg-white rounded-lg border border-[#E0D3FA] p-3">
                      <p className="font-inter font-semibold text-sm leading-5 tracking-normal text-[#4B4B4B] mb-2">
                        {generatedPost.bestTime}
                      </p>
                      <p className="font-inter font-normal text-xs leading-4 tracking-normal text-[#4B4B4B]">
                        Optimal posting time for{" "}
                        {formData.platform.charAt(0).toUpperCase() +
                          formData.platform.slice(1)}{" "}
                        based on audience engagement patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPostGenerator;
