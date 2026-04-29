"use client";

import { useEffect, useRef } from "react";

interface Props {
  timeData: Uint8Array;
  isPlaying: boolean;
  color?: string;
}

const WaveVisualizer = ({
  timeData,
  isPlaying,
  color = "#22c55e",
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!isPlaying) {
      // Draw flat line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }

    // Draw waveform
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;

    const sliceWidth = width / timeData.length;
    let x = 0;

    for (let i = 0; i < timeData.length; i++) {
      const v = timeData[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);

    // Gradient stroke
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, `${color}00`);
    gradient.addColorStop(0.2, color);
    gradient.addColorStop(0.8, color);
    gradient.addColorStop(1, `${color}00`);

    ctx.strokeStyle = gradient;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.stroke();

    // Fill area under wave
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const fillGradient = ctx.createLinearGradient(0, 0, 0, height);
    fillGradient.addColorStop(0, `${color}30`);
    fillGradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = fillGradient;
    ctx.fill();

  }, [timeData, isPlaying, color]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default WaveVisualizer;