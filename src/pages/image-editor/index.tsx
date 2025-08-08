import { useRef, useState } from "react";
import { Stars, Pencil } from "lucide-react";
import AIImageEditor from "../../components/image-editor/AIImageEditor";
import { ImageEditor } from "../../components/image-editor/image-editor";
import upload from "../../assets/image-editor/upload.svg";

type EditMode = "ai" | "manual" | null;

export default function ImageEditorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [editMode, setEditMode] = useState<EditMode>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // AI Image Editor
  if (editMode === "ai" && selectedImage) {
    return (
      <AIImageEditor
        originalImage={selectedImage}
        onBack={() => setEditMode(null)}
      />
    );
  }

  // Manual Canvas Editor
  if (editMode === "manual" && selectedImage) {
    return (
      <ImageEditor imageUrl={selectedImage} onClose={() => setEditMode(null)} />
    );
  }

  const editingDisabled = !selectedImage;

  return (
    <div className="p-8 bg-[#FAFAFB] min-h-screen">
      {/* Page heading */}
      <section className="mb-8">
        <h1 className="font-inter font-bold text-[32px] leading-none tracking-normal text-[#161E54]">
          {"Image Editor"}
        </h1>
        <p className="mt-2 font-inter font-normal text-[20px] leading-none tracking-normal text-[#4B4B4B]">
          {"Professional image editing powered by AI"}
        </p>
      </section>

      {/* Main content container */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl shadow-[6px_6px_54px_rgba(0,0,0,0.10)] px-8 py-1">
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

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setEditMode("ai")}
              disabled={editingDisabled}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-brand-50/30 p-5 text-left shadow-sm ring-brand-300 transition focus:outline-none focus:ring-2 ${
                editingDisabled
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-brand-50 p-2 text-brand-600">
                  <Stars className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <div className="text-base font-semibold text-ink-900">
                    {"Edit via Prompt"}
                  </div>
                  <div className="mt-1 text-sm text-ink-600">
                    {
                      "Use AI to transform your image with simple text descriptions."
                    }
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setEditMode("manual")}
              disabled={editingDisabled}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-brand-50/30 p-5 text-left shadow-sm ring-brand-300 transition focus:outline-none focus:ring-2 ${
                editingDisabled
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-brand-50 p-2 text-brand-600">
                  <Pencil className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <div className="text-base font-semibold text-ink-900">
                    {"Edit Manually"}
                  </div>
                  <div className="mt-1 text-sm text-ink-600">
                    {"Full control with professional editing tools and layers."}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
