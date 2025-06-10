"use client";
import { useState } from "react";
import FaceResult, { FaceResultData } from "@/components/identify/FaceResult";
import { identify } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function IdentifyPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<FaceResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const handleUpload = async (file: Blob) => {
    if (!token) {
      setError("You must be logged in to identify.");
      return;
    }
    setLoading(true);
    setError("");
    setImage(URL.createObjectURL(file));

    try {
      const data = await identify(file, token);
      setResult({ ...data, image: file });
    } catch (err) {
      setError("Identification failed. Please try again." + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Face Identification</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {image ? (
              <img
                src={image}
                alt="Uploaded"
                className="max-h-80 mx-auto mb-4"
              />
            ) : (
              <div className="py-12">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-gray-600">
                  Drag & drop or click to upload
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                e.target.files[0] &&
                handleUpload(e.target.files[0])
              }
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Choose File
            </label>
          </div>

          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Identifying face...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Identification Result</h2>

          {result ? (
            <FaceResult result={result} />
          ) : (
            <div className="text-gray-500 text-center py-12">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <p className="mt-4">Upload an image to identify faces</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
