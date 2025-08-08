"use client";

import { useState } from "react";
import AIImageEditor from "../../components/image-editor/AIImageEditor";
import { ImageEditor } from "../../components/image-editor/image-editor";

type EditMode = "ai" | "manual" | null;

export default function ImageEditorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = (mode: "ai" | "manual") => {
    setEditMode(mode);
  };

  const handleCloseEditor = () => {
    setEditMode(null);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setEditMode(null);
  };

  // AI Image Editor
  if (editMode === "ai" && selectedImage) {
    return (
      <AIImageEditor originalImage={selectedImage} onBack={handleCloseEditor} />
    );
  }

  // Manual Canvas Editor
  if (editMode === "manual" && selectedImage) {
    return <ImageEditor imageUrl={selectedImage} onClose={handleCloseEditor} />;
  }

  return (
    <>
      <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            AI Image Editor
          </h1>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Choose an image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100
                           dark:file:bg-blue-900 dark:file:text-blue-300
                           dark:hover:file:bg-blue-800"
              />
            </div>

            {selectedImage && (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Uploaded image"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Your Editing Mode
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select how you'd like to edit your image
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleEditImage("ai")}
                  disabled={!selectedImage}
                  className={`font-semibold py-6 px-6 rounded-lg transition duration-200 ease-in-out transform text-center ${
                    selectedImage
                      ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  }`}
                >
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-lg font-bold mb-1">
                    Edit via Prompt
                  </div>
                  <div className="text-sm opacity-90">
                    AI-powered smart editing
                  </div>
                </button>

                <button
                  onClick={() => handleEditImage("manual")}
                  disabled={!selectedImage}
                  className={`font-semibold py-6 px-6 rounded-lg transition duration-200 ease-in-out transform text-center ${
                    selectedImage
                      ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  }`}
                >
                  <div className="text-2xl mb-2">✏️</div>
                  <div className="text-lg font-bold mb-1">Edit Manually</div>
                  <div className="text-sm opacity-90">
                    Canvas-based text overlays
                  </div>
                </button>
              </div>

              {!selectedImage && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Please select an image first to enable editing options
                </p>
              )}

              {selectedImage && (
                <div className="text-center">
                  <button
                    onClick={handleReset}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out"
                  >
                    🔄 Upload New Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
