/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Download, Sparkles, RefreshCw, ChevronLeft, ChevronDown } from "lucide-react";
import { LogoStyleModal } from "../components/ui/logo-style-modal";
import { Badge } from "../components/ui/badge";
import { useCreditStore } from "../stores/creditStore";

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
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch credits on component mount
  useEffect(() => {
    fetchCreditsBalance();
  }, [fetchCreditsBalance]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setIsDownloadDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      // TODO: Replace with actual API call to generate logo
      // const result = await agentService.generateLogo(formData);
      // Backend will handle credit deduction internally
      
      // Mock generation for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      const generateExplanation = () => {
        const styleDescriptions: Record<string, string> = {
          WORDMARK:
            "typography-focused design that emphasizes your company name",
          LETTERMARK: "clean, memorable design using your company's initials",
          PICTORIAL_MARK: "iconic symbol that represents your brand identity",
          ABSTRACT: "unique geometric design that captures your brand essence",
          COMBINATION_MARK: "balanced combination of text and visual elements",
          EMBLEM:
            "traditional, badge-like design with integrated text and symbols",
        };

        const additionalContext = [];
        if (formData.preferredColors) {
          additionalContext.push(`incorporating your preferred colors (${formData.preferredColors})`);
        }
        if (formData.tone) {
          additionalContext.push(`maintaining a ${formData.tone} aesthetic`);
        }
        if (formData.industryKeywords) {
          additionalContext.push(`emphasizing key industry elements like ${formData.industryKeywords}`);
        }

        const contextText = additionalContext.length > 0 
          ? ` The design carefully considers your brand preferences by ${additionalContext.join(", ")}.`
          : "";

        return `This logo perfectly captures the essence of ${
          formData.companyName
        } through its ${
          styleDescriptions[formData.style] || "distinctive design approach"
        }. The design reflects your company's focus on ${formData.companyDesc.toLowerCase()}, creating a memorable brand identity that resonates with your target audience.${contextText} This logo will help establish trust and recognition in your market while maintaining a professional and modern appearance.`;
      };

      const generateDummyLogo = () => {
        const companyInitials = formData.companyName
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
          .substring(0, 3);

        const styleColors: Record<string, { bg: string; accent: string }> = {
          WORDMARK: { bg: "#8F00FF", accent: "#E0D3FA" },
          LETTERMARK: { bg: "#7000CC", accent: "#F5EDFF" },
          PICTORIAL_MARK: { bg: "#8000E5", accent: "#E7DAFF" },
          ABSTRACT: { bg: "#9000FF", accent: "#E5D7FF" },
          COMBINATION_MARK: { bg: "#7500DD", accent: "#E8DDFF" },
          EMBLEM: { bg: "#6500BB", accent: "#EBE3FF" },
        };

        const colors = styleColors[formData.style] || {
          bg: "#8F00FF",
          accent: "#E0D3FA",
        };

        // Create a simple SVG logo as data URL
        const svgLogo = `
          <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${
                  colors.bg
                };stop-opacity:1" />
                <stop offset="100%" style="stop-color:${
                  colors.accent
                };stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="400" height="400" fill="url(#gradient)"/>
            <circle cx="200" cy="150" r="60" fill="white" opacity="0.9"/>
            <text x="200" y="160" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="${
              colors.bg
            }">${companyInitials}</text>
            <text x="200" y="280" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="600" text-anchor="middle" fill="white">${
              formData.companyName
            }</text>
            <text x="200" y="320" font-family="Inter, Arial, sans-serif" font-size="14" text-anchor="middle" fill="white" opacity="0.8">${formData.style.toUpperCase()} STYLE</text>
          </svg>
        `;

        return `data:image/svg+xml;base64,${btoa(svgLogo)}`;
      };

      const logoUrl = generateDummyLogo();

      setGeneratedLogo({
        imageUrl: logoUrl,
        explanation: generateExplanation(),
      });

      // Refresh credits after generation (backend already deducted)
      await fetchCreditsBalance();

    } catch (error) {
      setError("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: 'png' | 'svg') => {
    if (!generatedLogo?.imageUrl) return;

    const link = document.createElement("a");
    const fileName = `${formData.companyName.replace(/\s+/g, "_")}_logo_${Date.now()}`;
    
    if (format === 'svg') {
      // Convert the current SVG data URL to downloadable SVG
      if (generatedLogo.imageUrl.startsWith('data:image/svg+xml;base64,')) {
        const svgData = atob(generatedLogo.imageUrl.split(',')[1]);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.svg`;
      }
    } else {
      // For PNG, we'll need to convert SVG to PNG using canvas
      if (generatedLogo.imageUrl.startsWith('data:image/svg+xml;base64,')) {
        atob(generatedLogo.imageUrl.split(',')[1]);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 800;
          canvas.height = 800;
          ctx?.drawImage(img, 0, 0, 800, 800);
          
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
          }, 'image/png');
        };
        img.src = generatedLogo.imageUrl;
        return;
      } else {
        // If it's already a PNG or other format
        link.href = generatedLogo.imageUrl;
        link.download = `${fileName}.png`;
      }
    }
    
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsDownloadDropdownOpen(false);
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
                          {formData.style.replace(/_/g, ' ')}
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
                  <div className="relative" ref={downloadDropdownRef}>
                    <button
                      onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] border border-[#8F00FF] px-4 font-inter font-semibold text-sm leading-5 tracking-normal text-white transition hover:shadow-[0_10px_22px_rgba(106,0,255,0.28)] shadow-[0px_1px_2px_0px_#0A0D120D] cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      Download
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {isDownloadDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E0E0E0] rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleDownload('png')}
                          className="w-full px-4 py-2 text-left font-inter font-medium text-sm text-[#414651] hover:bg-[#F8F9FB] rounded-t-lg transition"
                        >
                          Download PNG
                        </button>
                        <button
                          onClick={() => handleDownload('svg')}
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

              <div className="bg-[#F5EDFF] rounded-xl p-6 border border-[#E0D3FA] flex flex-col justify-center">
                <h3 className="font-inter font-semibold text-lg text-[#8F00FF] mb-4 italic">
                  "Why This Logo Works for Your Company"
                </h3>
                <p className="font-inter font-normal text-base text-[#4B4B4B] leading-6 italic">
                  "{generatedLogo.explanation}"
                </p>
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
