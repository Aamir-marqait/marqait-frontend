/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  Download,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronDown,
  Copy,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useCreditStore } from "../stores/creditStore";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";

interface PostFormData {
  contentDescription: string;
  platform: string;
  contentType: string;
}

interface GeneratedPost {
  imageUrls: string[];
  caption: string;
  hashtags: string;
  bestTime: string;
}

const SocialMediaPostGenerator = () => {
  const { fetchCreditsBalance } = useCreditStore();

  const [formData, setFormData] = useState<PostFormData>({
    contentDescription: "",
    platform: "instagram",
    contentType: "post",
  });

  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch credits on component mount
  useEffect(() => {
    fetchCreditsBalance();
  }, [fetchCreditsBalance]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        downloadDropdownRef.current &&
        !downloadDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDownloadDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (field: keyof PostFormData, value: string) => {
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
      // TODO: Replace with actual API call to generate social media post
      // const result = await agentService.generateSocialMediaPost(formData);
      // Backend will handle credit deduction internally

      // Mock generation for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generateCaption = () => {
        const baseContent = formData.contentDescription;
        const platform = formData.platform;

        if (platform === "twitter") {
          return baseContent.length > 240
            ? baseContent.substring(0, 237) + "..."
            : baseContent;
        }

        const enhancedCaption = `${baseContent} ✨\n\nWhat do you think? Let us know in the comments! 💭\n\n#${formData.platform}post #creativity #brand`;
        return enhancedCaption;
      };

      const generateHashtags = () => {
        const platformHashtags: Record<string, string[]> = {
          instagram: [
            "#instagram",
            "#insta",
            "#post",
            "#viral",
            "#trending",
            "#creative",
            "#brand",
            "#design",
            "#social",
            "#content",
          ],
          facebook: [
            "#facebook",
            "#social",
            "#community",
            "#share",
            "#engage",
            "#brand",
            "#marketing",
            "#content",
          ],
          twitter: [
            "#twitter",
            "#tweet",
            "#trending",
            "#viral",
            "#social",
            "#brand",
            "#content",
          ],
          linkedin: [
            "#linkedin",
            "#professional",
            "#business",
            "#networking",
            "#career",
            "#industry",
            "#corporate",
            "#brand",
          ],
        };

        const baseHashtags =
          platformHashtags[formData.platform] || platformHashtags.instagram;
        const selectedHashtags = baseHashtags.slice(0, 8);
        return selectedHashtags.join(" ");
      };

      const generateBestTime = () => {
        const bestTimes: Record<string, string> = {
          instagram: "Tuesday - Thursday, 11 AM - 1 PM",
          facebook: "Tuesday - Thursday, 9 AM - 10 AM",
          twitter: "Tuesday - Thursday, 9 AM - 10 AM",
          linkedin: "Tuesday - Thursday, 8 AM - 10 AM",
        };

        return (
          bestTimes[formData.platform] || "Tuesday - Thursday, 11 AM - 1 PM"
        );
      };

      const generateDummyPost = () => {
        const platformColors: Record<string, { bg: string; accent: string }> = {
          instagram: { bg: "#E1306C", accent: "#F77737" },
          facebook: { bg: "#1877F2", accent: "#42A5F5" },
          twitter: { bg: "#1DA1F2", accent: "#14171A" },
          linkedin: { bg: "#0A66C2", accent: "#004182" },
        };

        const colors = platformColors[formData.platform] || {
          bg: "#8F00FF",
          accent: "#E0D3FA",
        };

        // Story: 9:16 aspect ratio (1080x1920 standard)
        // Post: 1:1 aspect ratio (1080x1080 standard)
        const dimensions =
          formData.contentType === "story"
            ? { width: 540, height: 960 }
            : { width: 600, height: 600 };

        // Generate 1-3 images for carousel
        const imageCount = Math.floor(Math.random() * 3) + 1;
        const images = [];

        for (let i = 0; i < imageCount; i++) {
          const imageNumber = i + 1;
          const svgPost = `
            <svg width="${dimensions.width}" height="${
            dimensions.height
          }" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradient${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:${
                    colors.bg
                  };stop-opacity:1" />
                  <stop offset="100%" style="stop-color:${
                    colors.accent
                  };stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect width="${dimensions.width}" height="${
            dimensions.height
          }" fill="url(#gradient${i})"/>
              <rect x="20" y="20" width="${dimensions.width - 40}" height="${
            dimensions.height - 40
          }" fill="white" opacity="0.95" rx="15"/>
              <text x="${
                dimensions.width / 2
              }" y="80" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="${
            colors.bg
          }">SOCIAL MEDIA POST</text>
              <text x="${
                dimensions.width / 2
              }" y="120" font-family="Inter, Arial, sans-serif" font-size="16" text-anchor="middle" fill="${
            colors.accent
          }">${formData.platform.toUpperCase()} ${formData.contentType.toUpperCase()}</text>
              <text x="${
                dimensions.width / 2
              }" y="160" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="${
            colors.bg
          }">Image ${imageNumber}</text>
              <foreignObject x="40" y="180" width="${
                dimensions.width - 80
              }" height="${dimensions.height - 230}">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Inter, Arial, sans-serif; font-size: 14px; color: #333; text-align: center; padding: 20px; line-height: 1.5;">
                  ${
                    formData.contentDescription.length > 80
                      ? formData.contentDescription.substring(0, 80) + "..."
                      : formData.contentDescription
                  }
                </div>
              </foreignObject>
              <text x="${dimensions.width / 2}" y="${
            dimensions.height - 30
          }" font-family="Inter, Arial, sans-serif" font-size="12" text-anchor="middle" fill="${
            colors.bg
          }" opacity="0.8">Generated with MARQAIT</text>
            </svg>
          `;

          images.push(`data:image/svg+xml;base64,${btoa(svgPost)}`);
        }

        return images;
      };

      const postUrls = generateDummyPost();

      setGeneratedPost({
        imageUrls: postUrls,
        caption: generateCaption(),
        hashtags: generateHashtags(),
        bestTime: generateBestTime(),
      });

      // Refresh credits after generation (backend already deducted)
      await fetchCreditsBalance();
    } catch (error) {
      setError("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: "png" | "svg") => {
    if (!generatedPost?.imageUrls || generatedPost.imageUrls.length === 0) return;

    // Download current image or all images if multiple
    const imageToDownload = generatedPost.imageUrls[currentImageIndex];
    const link = document.createElement("a");
    const fileName = generatedPost.imageUrls.length > 1 
      ? `social_media_post_${formData.platform}_${currentImageIndex + 1}_${Date.now()}`
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

    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloadDropdownOpen(false);
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

  const handleBack = () => {
    setGeneratedPost(null);
    setError(null);
    setCopiedCaption(false);
    setCopiedHashtags(false);
    setIsImageModalOpen(false);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (generatedPost && generatedPost.imageUrls.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? generatedPost.imageUrls.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (generatedPost && generatedPost.imageUrls.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === generatedPost.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const isFormValid = formData.contentDescription.trim();

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
        {!generatedPost ? (
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
                      <option value="twitter">Twitter</option>
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
                <div className="mt-4 rounded-xl border border-[#ffd4d4] bg-[#fff2f2] p-3 text-sm text-[#b42318]">
                  ⚠️ {error}
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
                          <img
                            src={generatedPost.imageUrls[currentImageIndex]}
                            alt="Generated Social Media Post"
                            className={`object-contain rounded-lg shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.02] ${
                              formData.contentType === "story"
                                ? "w-60 h-[26.25rem]"
                                : "w-80 h-80"
                            }`}
                          />
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
                            
                            <img
                              src={generatedPost.imageUrls[currentImageIndex]}
                              alt="Generated Social Media Post - Full View"
                              className={`block ${
                                formData.contentType === "story"
                                  ? "w-[50vh] h-[88vh]"
                                  : "w-[80vh] h-[80vh]"
                              } object-cover`}
                            />
                            
                            {/* Image counter */}
                            {generatedPost.imageUrls.length > 1 && (
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {currentImageIndex + 1} / {generatedPost.imageUrls.length}
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
                            onClick={() => setCurrentImageIndex(index)}
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
                  <div className="relative" ref={downloadDropdownRef}>
                    <button
                      onClick={() =>
                        setIsDownloadDropdownOpen(!isDownloadDropdownOpen)
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] border border-[#8F00FF] px-4 font-inter font-semibold text-sm leading-5 tracking-normal text-white transition hover:shadow-[0_10px_22px_rgba(106,0,255,0.28)] shadow-[0px_1px_2px_0px_#0A0D120D] cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      Download
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {isDownloadDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E0E0E0] rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleDownload("png")}
                          className="w-full px-4 py-2 text-left font-inter font-medium text-sm text-[#414651] hover:bg-[#F8F9FB] rounded-t-lg transition"
                        >
                          Download PNG
                        </button>
                        <button
                          onClick={() => handleDownload("svg")}
                          className="w-full px-4 py-2 text-left font-inter font-medium text-sm text-[#414651] hover:bg-[#F8F9FB] rounded-b-lg transition"
                        >
                          Download SVG
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#8F00FF] bg-white px-3 font-inter font-semibold text-sm leading-5 tracking-normal text-[#8F00FF] transition hover:bg-[#faf5ff] shadow-[0px_1px_2px_0px_#1018280D] disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </button>
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
