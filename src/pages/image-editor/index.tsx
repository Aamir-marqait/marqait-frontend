import { useRef, useState } from "react";
import { UploadCloud, Stars, Pencil } from "lucide-react";
import AIImageEditor from "../../components/image-editor/AIImageEditor";
import { ImageEditor } from "../../components/image-editor/image-editor";

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

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setFileName("");
    setEditMode(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className="space-y-8 ">
      {/* Page heading */}
      <section>
        <h1 className="heading-xl">{"Image Editor"}</h1>
        <p className="mt-2 subtle">
          {"Professional image editing powered by AI"}
        </p>
      </section>

      {/* Upload card */}
      <section className="card p-6 md:p-8">
        <h2 className="text-center text-xl font-semibold text-brand-700">
          {"Transform Your Images"}
        </h2>

        <div
          className="mt-6 rounded-xl2 border-2 border-dashed"
          style={{ borderColor: "rgba(124, 58, 237, 0.5)" }} // brand-600 at 50% for the dashed look
        >
          <div
            role="button"
            aria-label="Upload image by dropping a file or browsing"
            tabIndex={0}
            onClick={onBrowse}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onBrowse();
              }
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl2 px-6 py-16 text-center"
          >
            <div className="rounded-full bg-brand-50 p-3">
              <UploadCloud className="h-7 w-7 text-brand-600" aria-hidden />
            </div>
            <div className="space-y-1">
              <div className="font-medium text-ink-700">
                {"Drop file or browse"}
              </div>
              <div className="text-sm text-ink-500">
                {"Format: jpeg, .png & Max file size: 25 MB"}
              </div>
              {fileName && (
                <div className="text-xs text-ink-400">
                  {"Selected: "}
                  {fileName}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onBrowse}
              className="mt-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              {"Browse Files"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        {/* Optional small preview once selected */}
        {selectedImage && (
          <div className="mt-6">
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Selected preview"
                className="h-56 w-full object-cover"
              />
            </div>
            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-brand-700 hover:underline"
              >
                {"Upload a different image"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Mode chooser */}
      <section className="space-y-2">
        <h3 className="text-center text-lg font-semibold text-ink-900">
          {"Choose Your Editing Mode"}
        </h3>
        <p className="text-center subtle">
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

        {!selectedImage && (
          <p className="mt-2 text-center text-sm text-ink-500">
            {"Please upload an image to enable editing options."}
          </p>
        )}
      </section>
    </div>
  );
}
