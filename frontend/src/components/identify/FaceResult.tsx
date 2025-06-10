import { useEffect, useRef } from "react";
export interface FaceResultData {
  matched: boolean;
  person_id?: string;
  distance: number;
  threshold: number;
  face_location?: [number, number, number, number]; // [top, right, bottom, left]
  image: Blob; // or File if it always comes from an <input>
}

export default function FaceResult({ result }: { result: FaceResultData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!result || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      if (!ctx) return;

      // Draw image
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Draw face bounding box
      if (result.face_location) {
        const [top, right, bottom, left] = result.face_location;
        const width = right - left;
        const height = bottom - top;

        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 3;
        ctx.strokeRect(left, top, width, height);

        // Draw confidence text
        ctx.fillStyle = "#10B981";
        ctx.font = "bold 16px Arial";
        ctx.fillText(
          `${(1 - result.distance).toFixed(2)} confidence`,
          left,
          top - 10
        );
      }
    };

    img.src = URL.createObjectURL(result.image);
  }, [result]);

  return (
    <div>
      <div className="mb-4">
        {result.matched ? (
          <div className="flex items-center text-green-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Match Found</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">No Match Found</span>
          </div>
        )}
      </div>

      {result.matched && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="font-medium">Identified as:</p>
          <p className="text-lg font-semibold">{result.person_id}</p>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full max-h-80 object-contain" />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Distance: {result.distance.toFixed(4)}</p>
        <p>Threshold: {result.threshold.toFixed(4)}</p>
      </div>
    </div>
  );
}
