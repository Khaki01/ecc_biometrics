"use client";
import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Camera from "@/components/Camera";
import { useAuth } from "@/context/AuthContext";
import { authenticate } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [faceLocation, setFaceLocation] = useState<
    [number, number, number, number] | null
  >(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<"initial" | "camera">("initial");

  const handleCapture = async () => {
    if (!videoRef.current) return;

    setIsProcessing(true);
    setError("");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get 2D context");

      ctx.drawImage(videoRef.current, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
      );

      if (!blob) throw new Error("Failed to capture image");

      const token = await authenticate(blob);
      if (token && token.access_token) {
        login(token.access_token);
        router.push("/identify");
      }
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Only .jpg, .jpeg, and .png files are allowed.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const token = await authenticate(file);
      if (token && token.access_token) {
        login(token.access_token);
        router.push("/identify");
      }
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Biometric Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {mode === "initial" && (
          <div className="flex flex-col gap-4">
            <label className="w-full cursor-pointer">
              <span className="block w-full px-4 py-2 text-center bg-gray-700 text-white rounded-md hover:bg-gray-800 transition">
                Upload from Computer
              </span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => setMode("camera")}
            >
              Use Camera
            </button>
          </div>
        )}

        {mode === "camera" && (
          <>
            {videoRef != null && (
              <Camera
                videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                onFaceDetected={setFaceLocation}
              />
            )}

            <div className="mt-6 flex flex-col gap-4">
              <button
                disabled={!faceLocation || isProcessing}
                onClick={handleCapture}
                className={`w-full px-4 py-2 text-white rounded-md transition ${
                  faceLocation && !isProcessing
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-500 hover:bg-gray-700 hover:pointer-none:"
                }`}
              >
                Authenticate
              </button>

              {isProcessing && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              <button
                onClick={() => setMode("initial")}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
