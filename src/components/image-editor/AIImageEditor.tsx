import React, { useState } from "react";
import { generateImageWithFlux, validateImageFormat } from "../../services/falAI";

interface AIImageEditorProps {
  originalImage: string;
  onBack: () => void;
}

const AIImageEditor: React.FC<AIImageEditorProps> = ({
  originalImage,
  onBack,
}) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Starting image generation with prompt:", prompt);

      // Validate image format
      if (!validateImageFormat(originalImage)) {
        throw new Error("Invalid image format. Please use JPEG or PNG.");
      }

      // Generate image using FAL.ai Flux with smart prompt analysis
      const result = await generateImageWithFlux(originalImage, prompt);

      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        console.log("Image generated successfully:", result.imageUrl);
      } else {
        throw new Error(result.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate image. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-edited-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image");
    }
  };

  const handleRegenerateImage = () => {
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              color: "#333",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            🎨 AI Image Editor
          </h1>
          <button
            onClick={onBack}
            style={{
              background: "linear-gradient(135deg, #636e72 0%, #2d3436 100%)",
              color: "white",
              padding: "10px 25px",
              borderRadius: "25px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ← Back
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#333",
                marginBottom: "15px",
                fontSize: "1.3rem",
                fontWeight: "bold",
              }}
            >
              Original Image
            </h3>
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "center",
                minHeight: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={originalImage}
                alt="Original"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  borderRadius: "10px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          <div>
            <h3
              style={{
                color: "#333",
                marginBottom: "15px",
                fontSize: "1.3rem",
                fontWeight: "bold",
              }}
            >
              Edited Image
            </h3>
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "center",
                minHeight: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: generatedImage ? "none" : "2px dashed #ddd",
              }}
            >
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    borderRadius: "10px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    color: "#666",
                    fontSize: "1.1rem",
                    textAlign: "center",
                  }}
                >
                  {isGenerating ? (
                    <div>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "4px solid #f3f3f3",
                          borderTop: "4px solid #667eea",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          margin: "0 auto 20px",
                        }}
                      ></div>
                      <p>Editing image...</p>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          fontSize: "3rem",
                          marginBottom: "15px",
                          color: "#ddd",
                        }}
                      >
                        🖼️
                      </div>
                      <p>Edited image will appear here</p>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#999",
                          marginTop: "10px",
                        }}
                      >
                        Write an edit prompt below and click Generate
                      </p>
                      <div
                        style={{
                          background: "#e8f5e8",
                          color: "#2d5016",
                          padding: "15px",
                          borderRadius: "12px",
                          marginTop: "15px",
                          fontSize: "0.9rem",
                          border: "1px solid #4caf50",
                          lineHeight: "1.4",
                        }}
                      >
                        🎨 <strong>AI Image Editor:</strong> Edit your uploaded
                        image with intelligent modifications
                        <br />
                        <div style={{ marginTop: "8px", fontSize: "0.8rem" }}>
                          <strong>Try:</strong> "Remove all text from the image"
                          • "Change the sky to purple" • "Add sunglasses to the
                          person" • "Change background to beach" • "Make it look
                          vintage"
                        </div>
                      </div>
                      {error && (
                        <div
                          style={{
                            background: "#ffe6e6",
                            color: "#d63031",
                            padding: "10px",
                            borderRadius: "8px",
                            marginTop: "15px",
                            fontSize: "0.9rem",
                            border: "1px solid #fab1a0",
                          }}
                        >
                          ⚠️ {error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "15px",
            padding: "25px",
          }}
        >
          <h3
            style={{
              color: "#333",
              marginBottom: "15px",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            ✍️ Describe How to Edit Your Image
          </h3>
          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to edit the image... (e.g., 'Remove all text from the image', 'Change the sky to purple', 'Add sunglasses to the person', 'Change background to beach', 'Make it look vintage')"
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "2px solid #e9ecef",
                  fontSize: "1rem",
                  fontFamily: "Arial, sans-serif",
                  resize: "vertical" as const,
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleGenerateImage}
                disabled={!prompt.trim() || isGenerating}
                style={{
                  background:
                    !prompt.trim() || isGenerating
                      ? "#ccc"
                      : "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
                  color: "white",
                  padding: "15px 30px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  cursor:
                    !prompt.trim() || isGenerating ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow:
                    !prompt.trim() || isGenerating
                      ? "none"
                      : "0 5px 15px rgba(0, 184, 148, 0.4)",
                  minWidth: "120px",
                }}
              >
                {isGenerating ? "🔄" : "✨ Generate"}
              </button>

              {generatedImage && (
                <>
                  <button
                    onClick={handleDownloadImage}
                    style={{
                      background:
                        "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                      color: "white",
                      padding: "15px 25px",
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 5px 15px rgba(116, 185, 255, 0.4)",
                    }}
                  >
                    📥 Download
                  </button>

                  <button
                    onClick={handleRegenerateImage}
                    style={{
                      background:
                        "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
                      color: "white",
                      padding: "15px 25px",
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 5px 15px rgba(162, 155, 254, 0.4)",
                    }}
                  >
                    🔄 Regenerate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIImageEditor;
