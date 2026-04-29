"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import useLyrics from "@/hooks/useLyrics";
import { usePlayer } from "@/hooks/usePlayer";
import {useGetSongById} from "@/hooks/useGetSongById";
import {useLoadImage} from "@/hooks/useLoadImage";
import Image from "next/image";

export default function LyricsPage() {
  const player = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { song } = useGetSongById(player.activeId || "");
  const imageUrl = useLoadImage(song!);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    lines,
    isLoading,
    error,
    currentLineIndex,
    rawLyrics,
    source,
    songTitle,
    songAuthor,
  } = useLyrics(currentTime);

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

  // Simulate currentTime from player
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 0.5);
    }, 500);
    return () => clearInterval(interval);
  }, [player.activeId]);

  // Reset time on song change
  useEffect(() => {
    setCurrentTime(0);
  }, [player.activeId]);

  return (
    <div className="relative h-full overflow-hidden bg-black">

      {/* Blurred Background */}
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt="background"
              fill
              className="object-cover scale-110 blur-3xl opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-neutral-900 to-black" />
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">

        {/* Header */}
        <div className="flex-shrink-0 border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto w-full">

            {/* Song Info */}
            <div className="flex items-center gap-4">
              {/* Album Art */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-xl">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={song?.title || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <Music2 className="w-6 h-6 text-white/50" />
                  </div>
                )}
                {/* Playing Pulse */}
                {player.activeId && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 border-2 border-green-500/50 rounded-xl"
                  />
                )}
              </div>

              <div>
                <h2 className="text-white font-bold text-lg leading-tight">
                  {songTitle || "No Song Playing"}
                </h2>
                <p className="text-white/50 text-sm">
                  {songAuthor || "Play a song to see lyrics"}
                </p>
                {source && (
                  <span className="text-xs text-green-400/70">
                    {source === "database" ? "📀 From library" : "🌐 From web"}
                  </span>
                )}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Playing Indicator */}
              {player.activeId && (
                <div className="flex items-end gap-[3px] h-5">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 20, 4] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: i * 0.15,
                      }}
                      className="w-[3px] bg-green-500 rounded-full"
                    />
                  ))}
                </div>
              )}

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-9 h-9 bg-white/10 hover:bg-white/20
                  rounded-xl flex items-center justify-center transition"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Lyrics Area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-6 py-12"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
        >
          <div className="max-w-3xl mx-auto">

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="flex items-end gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 40, 8] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: i * 0.12,
                      }}
                      className="w-2 bg-green-500 rounded-full"
                    />
                  ))}
                </div>
                <p className="text-white/50 text-lg">
                  Loading lyrics...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <motion.p
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl"
                >
                  🎵
                </motion.p>
                <div className="text-center">
                  <p className="text-white text-2xl font-bold mb-2">
                    Lyrics Not Found
                  </p>
                  <p className="text-white/50 mb-8">
                    Lyrics are not available for "{songTitle}"
                  </p>
                </div>

                {/* How to Add Lyrics Instructions */}
                <div className="bg-white/5 border border-white/10
                  rounded-2xl p-6 text-left max-w-lg w-full"
                >
                  <p className="text-white font-bold mb-4 text-lg">
                    How to add lyrics:
                  </p>
                  <ol className="space-y-3 text-white/60 text-sm list-none">
                    {[
                      "Open Supabase Dashboard",
                      "Go to Table Editor → songs table",
                      `Find "${songTitle}" row`,
                      "Click on the lyrics column cell",
                      "Paste the lyrics (one line per line)",
                      "Save and refresh this page",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-green-500/20 text-green-400
                          rounded-full flex items-center justify-center
                          text-xs font-bold flex-shrink-0 mt-0.5"
                        >
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Tip */}
                  <div className="mt-5 p-4 bg-green-500/10 border
                    border-green-500/20 rounded-xl"
                  >
                    <p className="text-green-400 text-sm">
                      💡 <strong>Tip:</strong> Search on Google:
                      <span className="font-mono bg-black/30 px-2 py-0.5
                        rounded ml-1 text-green-300"
                      >
                        "{songTitle} {songAuthor} lyrics"
                      </span>
                    </p>
                  </div>

                  {/* SQL Command */}
                  <div className="mt-4 p-4 bg-black/30 rounded-xl">
                    <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">
                      Or run this SQL in Supabase:
                    </p>
                    <code className="text-green-400 text-xs font-mono break-all">
                      {`UPDATE songs SET lyrics = 'YOUR LYRICS' WHERE title = '${songTitle}';`}
                    </code>
                  </div>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-white/10
                    hover:bg-white/20 text-white px-6 py-3
                    rounded-2xl transition font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Page
                </button>
              </div>
            )}

            {/* No Song Playing */}
            {!isLoading && !error && !player.activeId && (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl"
                >
                  🎧
                </motion.div>
                <div className="text-center">
                  <p className="text-white text-2xl font-bold mb-2">
                    No Song Playing
                  </p>
                  <p className="text-white/50">
                    Play a song to see its lyrics here
                  </p>
                </div>
              </div>
            )}

            {/* Lyrics Lines */}
            <AnimatePresence>
              {!isLoading && lines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-center py-8"
                >
                  {lines.map((line, index) => {
                    const isCurrent = index === currentLineIndex;
                    const isPast = index < currentLineIndex;
                    const isNext = index === currentLineIndex + 1;

                    return (
                      <motion.p
                        key={index}
                        ref={(el) => {
                          lineRefs.current[index] = el;
                        }}
                        animate={{
                          scale: isCurrent ? 1.1 : isNext ? 1.02 : 1,
                          opacity: isCurrent
                            ? 1
                            : isPast
                            ? 0.25
                            : isNext
                            ? 0.6
                            : 0.4,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`
                          leading-relaxed transition-all cursor-default
                          ${isFullscreen ? "text-4xl" : "text-2xl"}
                          font-bold
                          ${isCurrent ? "text-white" : "text-white/40"}
                        `}
                      >
                        {isCurrent ? (
                          <span className="relative inline-block">
                            <span className="relative z-10">
                              {line.text}
                            </span>
                            {/* Green glow behind current line */}
                            <motion.span
                              animate={{ opacity: [0.2, 0.5, 0.2] }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                              }}
                              className="absolute inset-0 bg-green-500/20
                                blur-2xl rounded-full -z-10 scale-150"
                            />
                          </span>
                        ) : (
                          line.text
                        )}
                      </motion.p>
                    );
                  })}

                  {/* End Spacer */}
                  <div className="h-32" />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Bottom - Raw Lyrics Toggle */}
        {rawLyrics && !isLoading && (
          <div className="flex-shrink-0 border-t border-white/10 bg-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-4 px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-white/40 text-xs">
                  {lines.length} lines
                </span>
              </div>
              <span className="text-white/20">•</span>
              <span className="text-white/40 text-xs">
                {source === "database"
                  ? "Stored in your library"
                  : "Fetched from web"}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}