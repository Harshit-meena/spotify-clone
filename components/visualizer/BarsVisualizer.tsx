"use client";

import { useEffect, useRef } from "react";

interface Props {
  frequencyData: Uint8Array;
  isPlaying: boolean;
  color?: string;
  barCount?: number;
}

const BarsVisualizer = ({
  frequencyData,
  isPlaying,
  color = "#22c55e",
  barCount = 64,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!isPlaying) {
      // Draw flat bars when not playing
      const barWidth = (width / barCount) * 0.8;
      const gap = (width / barCount) * 0.2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        const barHeight = 2;
        const y = height / 2 - barHeight / 2;

        ctx.fillStyle = `${color}40`;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
      return;
    }

    const barWidth = (width / barCount) * 0.8;
    const gap = (width / barCount) * 0.2;
    const step = Math.floor(frequencyData.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const dataIndex = i * step;
      const value = frequencyData[dataIndex] || 0;
      const barHeight = (value / 255) * height * 0.9;

      const x = i * (barWidth + gap);
      const y = height - barHeight;

      // Gradient for each bar
      const gradient = ctx.createLinearGradient(x, y, x, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, `${color}BB`);
      gradient.addColorStop(1, `${color}44`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Mirror bars (top)
      const mirrorGradient = ctx.createLinearGradient(x, 0, x, barHeight * 0.3);
      mirrorGradient.addColorStop(0, `${color}22`);
      mirrorGradient.addColorStop(1, `${color}00`);

      ctx.fillStyle = mirrorGradient;
      ctx.beginPath();
      ctx.roundRect(x, 0, barWidth, barHeight * 0.3, [0, 0, 4, 4]);
      ctx.fill();
    }
  }, [frequencyData, isPlaying, color, barCount]);

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

export default BarsVisualizer;