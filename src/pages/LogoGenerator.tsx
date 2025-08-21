/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Download, Sparkles, RefreshCw, ChevronLeft } from "lucide-react";
import { LogoStyleModal } from "../components/ui/logo-style-modal";
import { Badge } from "../components/ui/badge";
import { useCreditStore } from "../stores/creditStore";
import { agentsService } from "../api/services";
import type { LogoGeneratorRequest } from "../api/types";

interface LogoFormData {
  companyName: string;
  companyDesc: string;
  preferredColors: string;
  tone: string;
  industryKeywords: string;
  style: string;
}

interface GeneratedLogo {
  imageUrl: string;
  explanation: string;
  successMetrics?: {
    recognition_projection?: string;
    market_impact_timeline?: string;
    competitive_advantage_score?: string;
    global_readiness_rating?: string;
  };
}

const LogoGenerator = () => {
  const { fetchCreditsBalance } = useCreditStore();

  const [formData, setFormData] = useState<LogoFormData>({
    companyName: "",
    companyDesc: "",
    preferredColors: "",
    tone: "",
    industryKeywords: "",
    style: "",
  });

  const [generatedLogo, setGeneratedLogo] = useState<GeneratedLogo | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  // Fetch credits on component mount
  useEffect(() => {
    fetchCreditsBalance();
  }, [fetchCreditsBalance]);

  const handleInputChange = (field: keyof LogoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleStyleSelect = (style: string) => {
    setFormData((prev) => ({ ...prev, style }));
    setError(null);
  };

  const handleGenerate = async () => {
    if (!formData.companyName.trim() || !formData.companyDesc.trim()) {
      setError("Company name and description are required");
      return;
    }
    if (!formData.style.trim()) {
      setError("Please select a logo style");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Map form style to API logo_type
      const styleMapping: Record<string, string> = {
        WORDMARK: "wordmark",
        LETTERMARK: "lettermark",
        PICTORIAL_MARK: "pictorial",
        ABSTRACT: "abstract",
        COMBINATION_MARK: "combination",
        EMBLEM: "emblem",
      };

      // Prepare API request data
      const apiRequest: LogoGeneratorRequest = {
        company_name: formData.companyName.trim(),
        company_description: formData.companyDesc.trim(),
        logo_type: styleMapping[formData.style] || formData.style.toLowerCase(),
      };

      // Add optional fields if provided
      if (formData.preferredColors.trim()) {
        apiRequest.preferred_colors = formData.preferredColors
          .split(",")
          .map((color) => color.trim());
      }
      if (formData.tone.trim()) {
        apiRequest.tone = formData.tone.trim();
      }
      if (formData.industryKeywords.trim()) {
        apiRequest.industry_keywords = formData.industryKeywords.trim();
      }

      // Call the API - backend handles credit deduction
      const result = await agentsService.generateLogo(apiRequest);

      setGeneratedLogo({
        imageUrl: result.output_data.logo_image_url,
        explanation:
          result.output_data.brand_analysis?.competitive_differentiation
            ?.market_positioning ||
          result.output_data.explanation ||
          "Your professional logo has been generated successfully.",
        successMetrics: result.output_data.brand_analysis?.success_metrics
          ? {
              recognition_projection:
                result.output_data.brand_analysis.success_metrics
                  .recognition_projection,
              market_impact_timeline:
                result.output_data.brand_analysis.success_metrics
                  .market_impact_timeline,
              competitive_advantage_score:
                result.output_data.brand_analysis.success_metrics
                  .competitive_advantage_score,
              global_readiness_rating:
                result.output_data.brand_analysis.success_metrics
                  .global_readiness_rating,
            }
          : undefined,
      });

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

  const handleDownload = async () => {
    if (!generatedLogo?.imageUrl) return;

    const fileName = `${formData.companyName.replace(
      /\s+/g,
      "_"
    )}_logo_${Date.now()}`;

    try {
      // Download as PNG
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width || 1024;
        canvas.height = img.height || 1024;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      };
      img.src = generatedLogo.imageUrl;
    } catch (error) {
      // Fallback: direct download
      const link = document.createElement("a");
      link.href = generatedLogo.imageUrl;
      link.download = `${fileName}.png`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBack = () => {
    setGeneratedLogo(null);
    setError(null);
  };

  const isFormValid =
    formData.companyName.trim() &&
    formData.companyDesc.trim() &&
    formData.style.trim();

  return (
    <div className="p-8 bg-[#FAFAFB]">
      <section className="mb-8">
        <h1 className="font-inter font-bold text-[32px] leading-none tracking-normal text-[#161E54]">
          Logo Generator
        </h1>
        <p className="mt-2 font-inter font-normal text-[20px] leading-none tracking-normal text-[#4B4B4B]">
          Create stunning logos for your brand with AI-powered design tools
        </p>
      </section>

      <div className="bg-white border border-[#E0E0E0] rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.10)] px-8 py-8">
        {!generatedLogo ? (
          <>
            {/* Form Section */}
            <h2 className="font-inter font-bold text-xl leading-none tracking-normal text-[#8F00FF] mb-6">
              Tell Us About Your Brand
            </h2>

            <div className="max-w-4xl">
              <div className="space-y-5">
                {/* Company Name and Description in Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                    >
                      Company Name
                      <span className="ml-0.5 text-[#ef4444]">*</span>
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="companyDesc"
                      className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                    >
                      Company Description
                      <span className="ml-0.5 text-[#ef4444]">*</span>
                    </label>
                    <input
                      id="companyDesc"
                      type="text"
                      placeholder="Brief description of your company"
                      value={formData.companyDesc}
                      onChange={(e) =>
                        handleInputChange("companyDesc", e.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
                    />
                  </div>
                </div>

                {/* Additional Brand Context Section */}
                <div className="space-y-4">
                  <h3 className="font-inter font-semibold text-base text-[#8F00FF] mb-3">
                    Additional Brand Context (Optional)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="preferredColors"
                        className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                      >
                        Preferred Colors
                      </label>
                      <input
                        id="preferredColors"
                        type="text"
                        placeholder="e.g., green, beige, blue"
                        value={formData.preferredColors}
                        onChange={(e) =>
                          handleInputChange("preferredColors", e.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tone"
                        className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                      >
                        Brand Tone
                      </label>
                      <input
                        id="tone"
                        type="text"
                        placeholder="e.g., earthy, modern, playful"
                        value={formData.tone}
                        onChange={(e) =>
                          handleInputChange("tone", e.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="industryKeywords"
                      className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2"
                    >
                      Industry Keywords
                    </label>
                    <input
                      id="industryKeywords"
                      type="text"
                      placeholder="e.g., sustainability, nature, minimalism"
                      value={formData.industryKeywords}
                      onChange={(e) =>
                        handleInputChange("industryKeywords", e.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 font-['Inter'] font-normal text-sm leading-5 tracking-normal text-[#1f2340] placeholder:text-[#98a2b3] outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#7c3aed]/20 shadow-[0px_1px_2px_0px_#0A0D120D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-inter font-medium text-sm leading-5 tracking-normal text-[#414651] block mb-2">
                    Logo Style
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setIsStyleModalOpen(true)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#8F00FF] bg-white px-4 font-['Inter'] font-semibold text-sm leading-5 tracking-normal text-[#8F00FF] transition hover:bg-[#faf5ff] shadow-[0px_1px_2px_0px_#0A0D120D] cursor-pointer"
                    >
                      {formData.style
                        ? "Update Logo Style"
                        : "Choose Logo Style"}
                    </button>
                    {formData.style && (
                      <div className="flex items-center">
                        <Badge className="bg-gradient-to-r from-[#7000CC] to-[#8F00FF] text-white border-0 px-3 py-1 text-sm font-medium">
                          {formData.style.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    )}
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
                        Generate Logo
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
                Your Generated Logo
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
              {/* Left Side - Logo & Buttons */}
              <div className="space-y-4">
                {/* Logo Display */}
                <div>
                  <img
                    src={generatedLogo.imageUrl}
                    alt={`${formData.companyName} Logo`}
                    className="w-80 h-80 mx-auto object-contain"
                  />
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] border border-[#8F00FF] px-4 font-inter font-semibold text-sm leading-5 tracking-normal text-white transition hover:shadow-[0_10px_22px_rgba(106,0,255,0.28)] shadow-[0px_1px_2px_0px_#0A0D120D] cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>

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

              <div className="bg-[#F5EDFF] rounded-xl p-6 border border-[#E0D3FA] flex flex-col justify-center">
                <h3 className="font-inter font-semibold text-lg text-[#8F00FF] mb-4 italic">
                  "Why This Logo Works for Your Company"
                </h3>

                <p className="font-inter font-normal text-base text-[#4B4B4B] leading-6 italic mb-4">
                  "{generatedLogo.explanation}"
                </p>

                {generatedLogo.successMetrics && (
                  <div className="space-y-3 pt-4 border-t border-[#E0D3FA]">
                    {generatedLogo.successMetrics.recognition_projection && (
                      <p className="font-inter font-normal text-sm text-[#4B4B4B] leading-5">
                        • {generatedLogo.successMetrics.recognition_projection}
                      </p>
                    )}

                    {generatedLogo.successMetrics
                      .competitive_advantage_score && (
                      <p className="font-inter font-normal text-sm text-[#4B4B4B] leading-5">
                        •{" "}
                        {
                          generatedLogo.successMetrics
                            .competitive_advantage_score
                        }
                      </p>
                    )}

                    {generatedLogo.successMetrics.market_impact_timeline && (
                      <p className="font-inter font-normal text-sm text-[#4B4B4B] leading-5">
                        • {generatedLogo.successMetrics.market_impact_timeline}
                      </p>
                    )}

                    {generatedLogo.successMetrics.global_readiness_rating && (
                      <p className="font-inter font-normal text-sm text-[#4B4B4B] leading-5">
                        • {generatedLogo.successMetrics.global_readiness_rating}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <LogoStyleModal
        open={isStyleModalOpen}
        onOpenChange={setIsStyleModalOpen}
        currentStyle={formData.style}
        onStyleSelect={handleStyleSelect}
      />
    </div>
  );
};

export default LogoGenerator;
