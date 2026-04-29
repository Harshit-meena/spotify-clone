"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  Music2,
  BarChart2,
  Radio,
  Circle,
} from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import {useGetSongById} from "@/hooks/useGetSongById";
import {useLoadImage} from "@/hooks/useLoadImage";
import Image from "next/image";

type VisualizerMode = "bars" | "wave" | "circle" | "particles";

// ✅ Helper - hex color to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  const clampedOpacity = Math.min(1, Math.max(0, opacity));
  return `rgba(${r}, ${g}, ${b}, ${clampedOpacity})`;
};

const COLOR_THEMES = [
  { name: "Green",  color: "#22c55e" },
  { name: "Purple", color: "#a855f7" },
  { name: "Blue",   color: "#3b82f6" },
  { name: "Pink",   color: "#ec4899" },
  { name: "Orange", color: "#f97316" },
  { name: "Cyan",   color: "#06b6d4" },
];

// Generate animated frequency data
const generateFrequencyData = (
  frame: number,
  isPlaying: boolean,
  barCount: number
): number[] => {
  if (!isPlaying) {
    return Array(barCount).fill(0).map(() => Math.random() * 3 + 1);
  }

  return Array(barCount).fill(0).map((_, i) => {
    const bass   = Math.sin(frame * 0.08) * 0.5 + 0.5;
    const mid    = Math.sin(frame * 0.05 + i * 0.3) * 0.5 + 0.5;
    const treble = Math.sin(frame * 0.12 + i * 0.8) * 0.3 + 0.3;
    const random = Math.random() * 0.2;

    let base = 0;
    if (i < barCount * 0.15)     base = bass * 90 + 20;
    else if (i < barCount * 0.4) base = mid * 70 + 15;
    else if (i < barCount * 0.7) base = treble * 50 + 10;
    else                         base = Math.random() * 30 + 5;

    return Math.min(100, Math.max(2, base + random * 20));
  });
};

// ─── BARS VISUALIZER ───────────────────────────────────────────
const BarsViz = ({
  isPlaying,
  color,
}: {
  isPlaying: boolean;
  color: string;
}) => {
  const BAR_COUNT = 60;
  const [heights, setHeights] = useState<number[]>(
    Array(BAR_COUNT).fill(2)
  );
  const frameRef = useRef(0);
  const rafRef   = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      frameRef.current++;
      setHeights(
        generateFrequencyData(frameRef.current, isPlaying, BAR_COUNT)
      );
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex items-end justify-center gap-[3px] px-4 pb-4">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex-1 rounded-t-sm min-w-[3px]"
          style={{
            background: `linear-gradient(to top, ${hexToRgba(color, 1)}, ${hexToRgba(color, 0.5)})`,
            boxShadow: isPlaying ? `0 0 6px ${hexToRgba(color, 0.4)}` : "none",
            maxWidth: "16px",
          }}
        />
      ))}
    </div>
  );
};

// ─── WAVE VISUALIZER ───────────────────────────────────────────
const WaveViz = ({
  isPlaying,
  color,
}: {
  isPlaying: boolean;
  color: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef(0);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Draw 3 wave layers
      [1, 0.6, 0.3].forEach((opacity, layerIndex) => {
        ctx.beginPath();

        const points = 200;
        for (let i = 0; i <= points; i++) {
          const x     = (i / points) * W;
          const speed = isPlaying ? 1 : 0.1;

          const y =
            H / 2 +
            (isPlaying
              ? Math.sin(i * 0.05 + f * 0.08 * speed + layerIndex) *
                  (40 - layerIndex * 10) +
                Math.sin(i * 0.1 + f * 0.05 * speed) *
                  (20 - layerIndex * 5) +
                Math.sin(i * 0.02 + f * 0.03 * speed) *
                  (30 - layerIndex * 8)
              : Math.sin(i * 0.05 + layerIndex) * 3);

          if (i === 0) ctx.moveTo(x, y);
          else         ctx.lineTo(x, y);
        }

        // ✅ Fixed - hexToRgba
        ctx.strokeStyle = hexToRgba(color, opacity);
        ctx.lineWidth   = 3 - layerIndex;
        ctx.shadowBlur  = isPlaying ? 15 : 0;
        ctx.shadowColor = color;
        ctx.stroke();
      });

      // Fill area under wave
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x     = (i / 200) * W;
        const speed = isPlaying ? 1 : 0.1;
        const y =
          H / 2 +
          (isPlaying
            ? Math.sin(i * 0.05 + f * 0.08 * speed) * 40 +
              Math.sin(i * 0.1 + f * 0.05 * speed) * 20
            : Math.sin(i * 0.05) * 3);

        if (i === 0) ctx.moveTo(x, y);
        else         ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, H / 2, 0, H);
      grad.addColorStop(0, hexToRgba(color, 0.2)); // ✅ Fixed
      grad.addColorStop(1, hexToRgba(color, 0));   // ✅ Fixed

      ctx.fillStyle  = grad;
      ctx.shadowBlur = 0;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, color]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

// ─── CIRCLE VISUALIZER ─────────────────────────────────────────
const CircleViz = ({
  isPlaying,
  color,
}: {
  isPlaying: boolean;
  color: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef(0);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;

      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const R  = Math.min(W, H) * 0.28;

      ctx.clearRect(0, 0, W, H);

      const BAR_COUNT = 120;

      // Draw bars around circle
      for (let i = 0; i < BAR_COUNT; i++) {
        const angle  = (i / BAR_COUNT) * Math.PI * 2 + f * 0.01;
        const speed  = isPlaying ? 1 : 0.05;

        const barH = isPlaying
          ? Math.max(
              4,
              Math.sin(i * 0.2 + f * 0.08 * speed) * 40 +
                Math.sin(i * 0.5 + f * 0.05 * speed) * 25 +
                Math.random() * 15
            )
          : Math.sin(i * 0.2) * 3 + 4;

        const x1 = cx + Math.cos(angle) * R;
        const y1 = cy + Math.sin(angle) * R;
        const x2 = cx + Math.cos(angle) * (R + barH);
        const y2 = cy + Math.sin(angle) * (R + barH);

        // ✅ Fixed gradient
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, hexToRgba(color, 0.4));
        grad.addColorStop(1, hexToRgba(color, 1));

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 2.5;
        ctx.lineCap     = "round";
        ctx.shadowBlur  = isPlaying ? 8 : 0;
        ctx.shadowColor = color;
        ctx.stroke();
      }

      // Inner circle fill
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.85, 0, Math.PI * 2);
      ctx.fillStyle   = hexToRgba(color, 0.06); // ✅ Fixed
      ctx.shadowBlur  = isPlaying ? 20 : 5;
      ctx.shadowColor = color;
      ctx.fill();

      // Inner circle stroke
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.85, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(color, 0.25); // ✅ Fixed
      ctx.lineWidth   = 1.5;
      ctx.shadowBlur  = 0;
      ctx.stroke();

      // Pulsing center dot
      const pulse = isPlaying
        ? R * 0.15 + Math.sin(f * 0.1) * R * 0.05
        : R * 0.1;

      const dotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulse);
      dotGrad.addColorStop(0, hexToRgba(color, 1));  // ✅ Fixed
      dotGrad.addColorStop(1, hexToRgba(color, 0));  // ✅ Fixed

      ctx.beginPath();
      ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
      ctx.fillStyle  = dotGrad;
      ctx.shadowBlur = 0;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, color]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

// ─── PARTICLES VISUALIZER ──────────────────────────────────────
const ParticlesViz = ({
  isPlaying,
  color,
}: {
  isPlaying: boolean;
  color: string;
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const frameRef     = useRef(0);
  const rafRef       = useRef<number | null>(null);
  const particlesRef = useRef(
    Array.from({ length: 80 }, () => ({
      x:       Math.random() * 800,
      y:       Math.random() * 400,
      vx:      (Math.random() - 0.5) * 2,
      vy:      (Math.random() - 0.5) * 2,
      size:    Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      frameRef.current++;
      const f = frameRef.current;

      const W = canvas.width;
      const H = canvas.height;

      // Fade trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, W, H);

      const speed = isPlaying ? 1.5 : 0.3;

      particlesRef.current.forEach((p, idx) => {
        // Update position
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        if (isPlaying) {
          p.vx += (Math.random() - 0.5) * 0.3;
          p.vy += (Math.random() - 0.5) * 0.3;
          p.vx  = Math.max(-3, Math.min(3, p.vx));
          p.vy  = Math.max(-3, Math.min(3, p.vy));
        }

        // Wrap edges
        if (p.x < 0)  p.x = W;
        if (p.x > W)  p.x = 0;
        if (p.y < 0)  p.y = H;
        if (p.y > H)  p.y = 0;

        // ✅ Fixed opacity - always 0-1
        p.opacity = isPlaying
          ? Math.min(0.9, Math.max(0.1,
              Math.sin(f * 0.05 + idx * 0.3) * 0.4 + 0.6
            ))
          : 0.3;

        const pSize = p.size * (isPlaying ? 3 : 1.5);

        // ✅ Fixed gradient - hexToRgba
        const grad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, pSize
        );
        grad.addColorStop(0, hexToRgba(color, p.opacity));
        grad.addColorStop(1, hexToRgba(color, 0));

        ctx.beginPath();
        ctx.arc(p.x, p.y, pSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Connect nearby particles ✅ Fixed
        if (isPlaying) {
          particlesRef.current.forEach((p2, idx2) => {
            if (idx2 <= idx) return; // avoid duplicate lines
            const dx   = p.x - p2.x;
            const dy   = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100 && dist > 0) {
              const lineOpacity = Math.min(0.4, (1 - dist / 100) * 0.4);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = hexToRgba(color, lineOpacity); // ✅ Fixed
              ctx.lineWidth   = 0.5;
              ctx.stroke();
            }
          });
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, color]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = particlesRef.current.map((p) => ({
        ...p,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }));
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────
export default function VisualizerPage() {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId || "");
  const imageUrl = useLoadImage(song!);

  const [mode, setMode]               = useState<VisualizerMode>("bars");
  const [color, setColor]             = useState("#22c55e");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying]     = useState(false);

  // Sync playing state with player
  useEffect(() => {
    setIsPlaying(!!player.activeId);
  }, [player.activeId]);

  const MODE_OPTIONS = [
    { key: "bars"      as const, label: "Bars",      icon: BarChart2 },
    { key: "wave"      as const, label: "Wave",      icon: Radio     },
    { key: "circle"    as const, label: "Circle",    icon: Circle    },
    { key: "particles" as const, label: "Particles", icon: Music2    },
  ];

  return (
    <div
      className={`relative bg-black overflow-hidden
        ${isFullscreen ? "fixed inset-0 z-50" : "h-full"}`}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="background"
            fill
            className="object-cover opacity-10 blur-3xl scale-110"
          />
        )}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${hexToRgba(color, 0.12)}, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-6 gap-4">

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">

            {/* Rotating Album Art */}
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={
                isPlaying
                  ? { duration: 8, repeat: Infinity, ease: "linear" }
                  : { duration: 0.5 }
              }
              className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
              style={{
                boxShadow: isPlaying
                  ? `0 0 20px ${hexToRgba(color, 0.5)}`
                  : "none",
              }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={song?.title || ""}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: hexToRgba(color, 0.15) }}
                >
                  <Music2 className="w-6 h-6 text-white/30" />
                </div>
              )}
            </motion.div>

            {/* Song Info */}
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {song?.title || "No Song Playing"}
              </h2>
              <p className="text-white/50 text-sm">
                {song?.author || "Play a song to visualize"}
              </p>

              {/* Live Badge */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 mt-1"
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: color }}
                  />
                  <span
                    className="text-xs font-bold tracking-wider"
                    style={{ color }}
                  >
                    LIVE
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20
              rounded-xl flex items-center justify-center transition"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Visualizer Canvas */}
        <div
          className="flex-1 rounded-2xl overflow-hidden relative min-h-0"
          style={{
            border:     `1px solid ${hexToRgba(color, 0.15)}`,
            background: `radial-gradient(ellipse at center bottom, ${hexToRgba(color, 0.05)}, transparent)`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {mode === "bars" && (
                <BarsViz isPlaying={isPlaying} color={color} />
              )}
              {mode === "wave" && (
                <WaveViz isPlaying={isPlaying} color={color} />
              )}
              {mode === "circle" && (
                <CircleViz isPlaying={isPlaying} color={color} />
              )}
              {mode === "particles" && (
                <ParticlesViz isPlaying={isPlaying} color={color} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* No Song Overlay */}
          {!player.activeId && (
            <div className="absolute inset-0 flex flex-col items-center
              justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-4"
              >
                🎵
              </motion.div>
              <p className="text-white/60 text-lg font-semibold">
                Play a song to start visualization
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-shrink-0 flex flex-col gap-3">

          {/* Mode Selector */}
          <div className="flex items-center gap-4">
            <p className="text-white/40 text-xs uppercase tracking-wider w-16 flex-shrink-0">
              Style
            </p>
            <div className="flex gap-2 flex-wrap">
              {MODE_OPTIONS.map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl
                    text-sm font-semibold transition-all
                    ${
                      mode === key
                        ? "text-black shadow-lg"
                        : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                    }`}
                  style={
                    mode === key
                      ? {
                          background: color,
                          boxShadow: `0 4px 15px ${hexToRgba(color, 0.4)}`,
                        }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Themes */}
          <div className="flex items-center gap-4">
            <p className="text-white/40 text-xs uppercase tracking-wider w-16 flex-shrink-0">
              Color
            </p>
            <div className="flex gap-3 flex-wrap">
              {COLOR_THEMES.map((theme) => (
                <motion.button
                  key={theme.color}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setColor(theme.color)}
                  title={theme.name}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    background:    theme.color,
                    boxShadow:
                      color === theme.color
                        ? `0 0 12px ${theme.color}, 0 0 24px ${hexToRgba(theme.color, 0.4)}`
                        : "none",
                    transform:
                      color === theme.color ? "scale(1.25)" : "scale(1)",
                    outline:
                      color === theme.color ? "2px solid white" : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}