"use client";

import { useEffect, useRef } from "react";

interface Props {
  frequencyData: Uint8Array;
  isPlaying: boolean;
  color?: string;
}

const CircleVisualizer = ({
  frequencyData,
  isPlaying,
  color = "#22c55e",
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.25;
    const barCount = 128;

    ctx.clearRect(0, 0, width, height);

    // Slowly rotate
    rotationRef.current += isPlaying ? 0.005 : 0.001;

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `${color}15`;
    ctx.fill();
    ctx.strokeStyle = `${color}40`;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (!isPlaying) {
      // Static circle
      return;
    }

    const step = Math.floor(frequencyData.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const dataIndex = i * step;
      const value = frequencyData[dataIndex] || 0;
      const barHeight = (value / 255) * radius * 1.5;

      const angle =
        (i / barCount) * Math.PI * 2 + rotationRef.current;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `${color}88`);
      gradient.addColorStop(1, color);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Inner glow
    const glowRadius =
      radius * 0.6 +
      (frequencyData[0] / 255) * radius * 0.3;

    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, glowRadius
    );
    glowGradient.addColorStop(0, `${color}30`);
    glowGradient.addColorStop(1, `${color}00`);

    ctx.beginPath();
    ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

  }, [frequencyData, isPlaying, color]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default CircleVisualizer;