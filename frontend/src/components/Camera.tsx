import { useEffect } from "react";

interface CameraProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onFaceDetected: (location: [number, number, number, number] | null) => void;
}

export default function Camera({ videoRef, onFaceDetected }: CameraProps) {
  useEffect(() => {
    let stream: MediaStream | null = null;
    let faceDetectionInterval: NodeJS.Timeout | null = null;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Start face detection
        faceDetectionInterval = setInterval(detectFace, 500);
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const detectFace = () => {
      if (!videoRef.current) return;

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // This is a placeholder - in real app, you'd use a client-side face detection library
      // or send to backend for detection. For demo, we'll simulate detection
      const hasFace = Math.random() > 0.3;

      if (hasFace) {
        // Simulated face location (top, right, bottom, left)
        const faceLocation: [number, number, number, number] = [
          Math.random() * canvas.height * 0.6,
          canvas.width - Math.random() * canvas.width * 0.4,
          canvas.height - Math.random() * canvas.height * 0.4,
          Math.random() * canvas.width * 0.4,
        ];
        onFaceDetected(faceLocation);
      } else {
        onFaceDetected(null);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (faceDetectionInterval) {
        clearInterval(faceDetectionInterval);
      }
    };
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto max-h-[400px] object-contain"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="border-2 border-white border-dashed rounded-full w-48 h-48" />
      </div>
    </div>
  );
}
