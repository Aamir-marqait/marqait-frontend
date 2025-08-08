import { useRef } from "react";
import { Upload } from "lucide-react";
import type { MediaLayer, TextLayer } from "./ImageEditor";

interface LeftPaletteProps {
  onAddTextLayer: (type: TextLayer["type"], customContent?: string) => void;
  onAddMediaLayer: (layer: MediaLayer) => void;
}

export function LeftPalette({
  onAddTextLayer,
  onAddMediaLayer,
}: LeftPaletteProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const layer: MediaLayer = {
        id: `media-${Date.now()}`,
        type: "image",
        url,
        x: 100,
        y: 100,
        width: img.width,
        height: img.height,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1,
      };
      onAddMediaLayer(layer);
    };
    img.crossOrigin = "anonymous";
    img.src = url;
    // Reset input to allow re-uploading the same file
    e.currentTarget.value = "";
  };

  const emojis = [
    "👌",
    "😎",
    "😍",
    "😊",
    "😉",
    "😏",
    "😂",
    "🤣",
    "😁",
    "😃",
    "😄",
    "😅",
    "🤩",
    "😘",
    "🥰",
    "😆",
    "🙂",
    "😇",
    "😌",
    "🥳",
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200 bg-neutral-50/60 p-4 gap-6">
      <h3 className="text-sm font-medium text-neutral-500">Elements</h3>

      <div className="space-y-2">
        <button
          onClick={() => onAddTextLayer("heading")}
          className="w-full text-left text-[15px] font-semibold text-neutral-800 hover:text-neutral-900 hover:bg-white border border-transparent hover:border-neutral-200 rounded-lg px-3 py-2 transition"
        >
          Add Headline
        </button>
        <button
          onClick={() => onAddTextLayer("paragraph")}
          className="w-full text-left text-sm text-neutral-600 hover:text-neutral-700 hover:bg-white border border-transparent hover:border-neutral-200 rounded-lg px-3 py-2 transition"
        >
          Add Body Text
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-500">Images</label>
        <button
          onClick={handleUploadClick}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-neutral-500">Shapes</label>
        <div className="grid grid-cols-4 gap-2">
          <button
            title="Square"
            aria-disabled
            className="aspect-square rounded-md bg-[#9BA4B5]/50 border border-neutral-200"
          />
          <button
            title="Circle"
            aria-disabled
            className="aspect-square rounded-full bg-[#9BA4B5]/50 border border-neutral-200"
          />
          <button
            title="Star"
            aria-disabled
            className="aspect-square grid place-items-center rounded-md border border-neutral-200 text-[#9BA4B5]/70 text-lg"
          >
            {"★"}
          </button>
          <button
            title="Triangle"
            aria-disabled
            className="aspect-square grid place-items-center rounded-md border border-neutral-200 text-[#9BA4B5]/70 text-lg"
          >
            {"▲"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-neutral-500">Emojis</label>
        <div className="grid grid-cols-5 gap-2">
          {emojis.map((e) => (
            <button
              key={e}
              onClick={() => onAddTextLayer("emoji", e)}
              className="h-8 w-8 grid place-items-center rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-base"
              aria-label={`Add emoji ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
