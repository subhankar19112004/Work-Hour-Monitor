import { useRef, useState } from "react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    setIsCameraOn(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOn(false);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg");

    stopCamera();
    onCapture(base64); // Pass image to parent
  };

  return (
    <div className="text-center mt-4">
      {!isCameraOn ? (
        <button
          onClick={startCamera}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Turn On Camera
        </button>
      ) : (
        <>
          <video ref={videoRef} autoPlay className="w-full max-w-md mx-auto rounded" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="mt-4">
            <button
              onClick={handleCapture}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Capture Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
