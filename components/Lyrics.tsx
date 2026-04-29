"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Music2, Maximize2, Minimize2 } from "lucide-react";
import useLyrics from "@/hooks/useLyrics";
import {usePlayer} from "@/hooks/usePlayer";

interface Props {
  currentTime?: number;
  isVisible: boolean;
  onClose: () => void;
}

const Lyrics = ({ currentTime = 0, isVisible, onClose }: Props) => {
  const {
    lines,
    rawLyrics,
    isLoading,
    error,
    currentLineIndex,
    songTitle,
    songAuthor,
  } = useLyrics(currentTime);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to current line
  useEffect(() => {
    if (
      lineRefs.current[currentLineIndex] &&
      containerRef.current
    ) {
      lineRefs.current[currentLineIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLineIndex]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`
          fixed z-50 bg-black/95 backdrop-blur-2xl
          border border-white/10 overflow-hidden
          ${
            isFullscreen
              ? "inset-0 rounded-none"
              : "bottom-24 right-4 w-96 h-[500px] rounded-2xl shadow-2xl"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Music2 className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm truncate max-w-[200px]">
                {songTitle || "No Song Playing"}
              </p>
              <p className="text-white/50 text-xs truncate max-w-[200px]">
                {songAuthor}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 bg-white/10 hover:bg-white/20
                rounded-lg flex items-center justify-center transition"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-white" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-red-500/30
                rounded-lg flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Lyrics Content */}
        <div
          ref={containerRef}
          className="h-full overflow-y-auto pb-20 px-6 pt-4 
            scrollbar-thin scrollbar-thumb-white/10"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 32, 8] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.15,
                    }}
                    className="w-2 bg-green-500 rounded-full"
                  />
                ))}
              </div>
              <p className="text-white/50 text-sm">
                Loading lyrics...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-4xl">🎵</p>
              <p className="text-white/70 font-semibold text-center">
                {error}
              </p>
              <p className="text-white/40 text-sm text-center">
                Lyrics are not available for "{songTitle}"
              </p>
            </div>
          )}

          {/* No Song Playing */}
          {!isLoading && !error && lines.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl"
              >
                🎵
              </motion.p>
              <p className="text-white/50 text-center">
                Play a song to see lyrics
              </p>
            </div>
          )}

          {/* Lyrics Lines */}
          {!isLoading && lines.length > 0 && (
            <div className="space-y-4 py-8">
              {lines.map((line, index) => {
                const isCurrent = index === currentLineIndex;
                const isPast = index < currentLineIndex;
                const isFuture = index > currentLineIndex;

                return (
                  <motion.div
                    key={index}
                    ref={(el) => {
                      lineRefs.current[index] = el;
                    }}
                    animate={{
                      scale: isCurrent ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`
                      text-center transition-all duration-300 cursor-pointer
                      ${isFullscreen ? "text-3xl" : "text-lg"}
                      font-bold leading-relaxed
                      ${
                        isCurrent
                          ? "text-white drop-shadow-lg"
                          : isPast
                          ? "text-white/30"
                          : "text-white/50"
                      }
                    `}
                  >
                    {/* Current Line Highlight */}
                    {isCurrent && (
                      <motion.span
                        className="relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className="relative z-10">{line.text}</span>
                        <motion.span
                          className="absolute inset-0 bg-green-500/20 
                            blur-xl rounded-full -z-10"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      </motion.span>
                    )}

                    {/* Other Lines */}
                    {!isCurrent && line.text}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lyrics;