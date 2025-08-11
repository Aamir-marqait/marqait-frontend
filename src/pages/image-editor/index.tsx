import { useRef, useState, useEffect } from "react";
import AIImageEditor from "../../components/image-editor/AIImageEditor";
import { ImageEditor } from "../../components/image-editor/image-editor";
import upload from "../../assets/image-editor/upload.svg";
import prompt from "../../assets/image-editor/prompt.svg";
import manually from "../../assets/image-editor/manually.svg";
import { Download } from "lucide-react";

type EditMode = "ai" | "manual" | null;

export default function ImageEditorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [hasGeneratedImages, setHasGeneratedImages] = useState<boolean>(false);
  const [onDownloadAll, setOnDownloadAll] = useState<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageHeadingRef = useRef<HTMLElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage((e.target?.result as string) ?? null);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const onBrowse = () => fileInputRef.current?.click();

  const handleChangeImage = () => {
    // Reset the current state first
    setSelectedImage(null);
    setFileName("");
    // Reset input value and trigger click
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const editingDisabled = !selectedImage;

  // Scroll to page heading when edit mode changes
  useEffect(() => {
    if (editMode && pageHeadingRef.current) {
      // Scroll to the page heading
      const scrollToHeading = () => {
        try {
          pageHeadingRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        } catch {
          // Fallback for older browsers
          window.scrollTo(0, 0);
        }
      };

      // Run immediately and with small delay
      scrollToHeading();
      setTimeout(scrollToHeading, 100);
    }
  }, [editMode]);

  // Scroll to top when entering edit mode
  const handleEditModeChange = (mode: EditMode) => {
    setEditMode(mode);
  };

  return (
    <div className="p-8 bg-[#FAFAFB] min-h-screen">
      {/* Page heading */}
      <section ref={pageHeadingRef} className="mb-8">
        <h1 className="font-inter font-bold text-[32px] leading-none tracking-normal text-[#161E54]">
          {"Image Editor"}
        </h1>
        <p className="mt-2 font-inter font-normal text-[20px] leading-none tracking-normal text-[#4B4B4B]">
          {"Professional image editing powered by AI"}
        </p>
      </section>

      {/* Main content container */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.10)] px-8 py-8">
        {/* AI Image Editor */}
        {editMode === "ai" && selectedImage ? (
          <AIImageEditor
            originalImage={selectedImage}
            onBack={() => handleEditModeChange(null)}
            onGeneratedImagesChange={setHasGeneratedImages}
            onSetDownloadAll={setOnDownloadAll}
          />
        ) : /* Manual Canvas Editor */
        editMode === "manual" && selectedImage ? (
          <ImageEditor
            imageUrl={selectedImage}
            onClose={() => handleEditModeChange(null)}
          />
        ) : (
          <>
            {/* Upload and mode chooser sections */}
            {/* Upload card */}
            <section className="card p-6 md:p-8 bg-[#FFFFFF]">
              <h2 className="font-inter font-bold text-[24px] leading-none tracking-normal text-center text-[#8F00FF]">
                {"Transform Your Images"}
              </h2>

              <div className="mt-6 w-[747px] h-[324px] rounded-lg border border-dashed border-[#8F00FF] mx-auto">
                {!selectedImage ? (
                  <div
                    role="button"
                    aria-label="Upload image by dropping a file or browsing"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onBrowse();
                      }
                    }}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl2 px-6 py-16 text-center h-full"
                  >
                    <div className="rounded-full bg-brand-50 p-3">
                      <img src={upload} alt="upload-logo" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-dm-sans font-medium text-base leading-6 text-[#181D27]">
                        {"Drop file or browse"}
                      </div>
                      <div className="font-dm-sans font-normal text-sm leading-5 text-[#6C606C]">
                        {"Format: .jpeg, .png & Max file size: 25 MB"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBrowse();
                      }}
                      className="cursor-pointer h-9 rounded-lg border border-[#8F00FF] opacity-100 gap-2 py-2 px-4 bg-gradient-to-r from-[#7000CC] via-[#8000E5] to-[#8E07F8] shadow-[0px_1px_2px_0px_#0A0D120D] font-inter font-semibold text-sm leading-5 text-white align-middle hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#8F00FF]"
                    >
                      {"Browse Files"}
                    </button>
                  </div>
                ) : (
                  <div className="relative h-full rounded-lg overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Selected preview"
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={handleChangeImage}
                        className="bg-white/90 hover:bg-white text-gray-700 text-sm font-medium px-3 py-1 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                    <div className="hidden top-4 right-4">
                      <button
                        type="button"
                        onClick={handleChangeImage}
                        className="bg-white/90 hover:bg-white text-gray-700 text-sm font-medium px-3 py-1 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        {fileName}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </section>

            {/* Mode chooser */}
            <section className="space-y-1">
              <h3 className="font-inter text-[#30005E] font-semibold text-xl leading-[100%] tracking-[0%] text-center text-ink-900">
                {"Choose Your Editing Mode"}
              </h3>
              <p className="font-inter font-normal text-base leading-[100%] tracking-[0%] text-center text-[#4B4B4B]">
                {"Select how you would like to edit your image"}
              </p>

              <div className="mt-4 flex justify-center gap-10">
                <div className="relative group">
                  <button
                    aria-label="Edit via Prompt. Use AI to transform your image with simple text descriptions."
                    className={`relative w-[338px] h-[198px] rounded-[12px] border-[1.61px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      editingDisabled
                        ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200"
                        : "bg-gradient-to-b from-[#F5EDFF] via-[#FAF6FF] to-[#FFFFFF] border-[#E0D3FA] shadow-[0px_6.42px_9.64px_-3.21px_rgba(16,24,40,0.03),0px_19.27px_25.7px_-6.42px_rgba(16,24,40,0.08)] cursor-pointer hover:shadow-card"
                    }`}
                    type="button"
                    onClick={() => handleEditModeChange("ai")}
                    disabled={editingDisabled}
                  >
                    <div className="text-center p-5">
                      <div className="mx-auto mb-6 flex w-[50px] h-[50px] items-center justify-center rounded-full bg-[#FFFFFF] opacity-100">
                        <img src={prompt} alt="prompt-based" />
                      </div>

                      {/* Heading */}
                      <h1 className="font-inter font-semibold text-xl leading-[100%] tracking-[0%] text-center text-[#161E54]">
                        Edit via Prompt
                      </h1>

                      {/* Description */}
                      <p className="mt-4 w-[266px] h-12 font-inter font-normal text-base leading-[150%] tracking-[0%] text-center align-middle text-[#4B4B4B] opacity-100 mx-auto">
                        Use AI to transform your image with simple text
                        descriptions.
                      </p>
                    </div>

                    <span
                      className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-[#E7DAFF]/60"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Hover tooltip for disabled state */}
                  {editingDisabled && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-200 text-black text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Upload an image first to enable editing
                      <div className=" absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <button
                    aria-label="Edit Manually. Full control with professional editing tools and layers."
                    className={`relative w-[338px] h-[198px] rounded-[12px] border-[1.61px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      editingDisabled
                        ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200"
                        : "bg-gradient-to-b from-[#F5EDFF] via-[#FAF6FF] to-[#FFFFFF] border-[#E0D3FA] shadow-[0px_6.42px_9.64px_-3.21px_rgba(16,24,40,0.03),0px_19.27px_25.7px_-6.42px_rgba(16,24,40,0.08)] cursor-pointer hover:shadow-card"
                    }`}
                    type="button"
                    onClick={() => handleEditModeChange("manual")}
                    disabled={editingDisabled}
                  >
                    <div className="text-center p-5">
                      <div className="mx-auto mb-6 flex w-[50px] h-[50px] items-center justify-center rounded-full bg-[#FFFFFF] opacity-100">
                        <img src={manually} alt="prompt-based" />
                      </div>

                      {/* Heading */}
                      <h1 className="font-inter font-semibold text-xl leading-[100%] tracking-[0%] text-center text-[#161E54]">
                        {"Edit Manually"}
                      </h1>

                      {/* Description */}
                      <p className="mt-4 w-[266px] h-12 font-inter font-normal text-base leading-[150%] tracking-[0%] text-center align-middle text-[#4B4B4B] opacity-100 mx-auto">
                        {
                          "Full control with professional editing tools and layers."
                        }
                      </p>
                    </div>

                    {/* Subtle outer ring to match screenshot edge treatment */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-[#E7DAFF]/60"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Hover tooltip for disabled state */}
                  {editingDisabled && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-200 text-black text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Upload an image first to enable editing
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Action buttons for generated images */}
      {editMode === "ai" && hasGeneratedImages && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => handleEditModeChange(null)}
            className="cursor-pointer inline-flex h-12 items-center gap-2 rounded-md bg-[#FFFFFF] border border-[#D0D5DD] px-6 font-inter font-semibold text-sm leading-5 tracking-normal text-[#344054] transition hover:bg-[#F8F9FB] shadow-[0px_1px_2px_0px_#1018280D]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onDownloadAll && onDownloadAll()}
            className="cursor-pointer inline-flex h-12 items-center gap-2 rounded-lg bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] border border-[#8F00FF] px-6 font-inter font-semibold text-sm leading-5 tracking-normal text-white transition hover:shadow-[0_10px_22px_rgba(106,0,255,0.28)] shadow-[0px_1px_2px_0px_#0A0D120D]"
          >
            <span aria-hidden="true" className="text-base leading-none">
              <Download className="h-5 w-5" />
            </span>
            Download
          </button>
        </div>
      )}
    </div>
  );
}
