"use client";

import { useEffect, useRef } from "react";
import QRCodeLib from "qrcode";

export default function QRCode({ url, size = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCodeLib.toCanvas(canvasRef.current, url, { width: size, margin: 2 }, (err) => {
        if (err) console.error("QR code generation failed:", err);
      });
    }
  }, [url, size]);

  if (!url) return null;

  return (
    <div className="inline-block rounded-xl bg-white p-3 shadow-sm">
      <canvas ref={canvasRef} width={size} height={size} className="block" />
    </div>
  );
}
