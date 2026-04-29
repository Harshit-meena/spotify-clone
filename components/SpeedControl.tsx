'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gauge } from 'lucide-react';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const SPEED_LABELS: Record<number, { emoji: string; label: string }> = {
  0.5:  { emoji: '🐢', label: 'Very Slow' },
  0.75: { emoji: '🚶', label: 'Slow'      },
  1:    { emoji: '✅', label: 'Normal'    },
  1.25: { emoji: '🚴', label: 'Fast'      },
  1.5:  { emoji: '🏃', label: 'Faster'    },
  1.75: { emoji: '⚡', label: 'Very Fast' },
  2:    { emoji: '🚀', label: '2x Speed'  },
};

interface SpeedControlProps {
  speed:    number;
  onChange: (speed: number) => void;
}

const SpeedControl = ({ speed, onChange }: SpeedControlProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSpeed = (s: number) => {
    onChange(s);

    // ✅ FIX: Directly sab audio elements ki speed change karo
    try {
      // Method 1: HTML audio elements
      document.querySelectorAll('audio').forEach(audio => {
        audio.playbackRate = s;
        audio.defaultPlaybackRate = s;
      });

      // Method 2: Howler global
      if ((window as any).Howler) {
        (window as any).Howler._howls?.forEach((howl: any) => {
          howl.rate(s);
        });
      }
    } catch (e) {
      console.error('Speed change error:', e);
    }
  };

  return (
    <>
      {/* ── Player Bar Button ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(p => !p)}
        className="px-2.5 py-1 rounded-md text-xs font-black transition-all"
        style={{
          background: isOpen || speed !== 1
            ? 'rgba(34,197,94,0.15)'
            : 'var(--bg-highlight)',
          color: isOpen || speed !== 1
            ? '#4ade80'
            : 'var(--text-secondary)',
          border: `1px solid ${isOpen || speed !== 1
            ? 'rgba(34,197,94,0.4)'
            : 'var(--border-subtle)'}`,
          minWidth: '46px',
        }}
        title="Playback Speed"
      >
        {speed}x
      </motion.button>

      {/* ── Speed Panel - Lyrics jaisa size ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{   opacity: 0, y: 20  }}
            // ✅ Same size as Lyrics: w-96 h-[500px]
            className="fixed z-50 bg-black/95 backdrop-blur-2xl border border-white/10 overflow-hidden bottom-24 right-4 w-96 h-[500px] rounded-2xl shadow-2xl"
          >
            {/* Header - Lyrics jaisa */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Gauge className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    Playback Speed
                  </p>
                  <p className="text-white/50 text-xs">
                    {SPEED_LABELS[speed].emoji} {SPEED_LABELS[speed].label} — {speed}x
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/10 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div
              className="h-full overflow-y-auto pb-20 px-4 pt-4"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* Current Speed Display */}
              <div
                className="mb-4 p-4 rounded-2xl flex flex-col items-center gap-2"
                style={{
                  background: 'rgba(29,185,84,0.08)',
                  border:     '1px solid rgba(29,185,84,0.15)',
                }}
              >
                {/* Bar Chart Visual */}
                <div className="flex items-end gap-1.5 h-10 w-full justify-center">
                  {SPEEDS.map((s) => (
                    <motion.div
                      key={s}
                      animate={{
                        height: `${(s / 2) * 100}%`,
                        background: s === speed
                          ? '#1DB954'
                          : 'rgba(255,255,255,0.1)',
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 rounded-t-sm cursor-pointer max-w-[28px]"
                      style={{ minHeight: 4 }}
                      onClick={() => handleSpeed(s)}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl">{SPEED_LABELS[speed].emoji}</span>
                  <p className="text-green-400 text-xl font-black">
                    {speed}x
                  </p>
                  <p className="text-white/50 text-sm">
                    {SPEED_LABELS[speed].label}
                  </p>
                </div>
              </div>

              {/* Speed List */}
              <div className="space-y-2">
                {SPEEDS.map((s) => {
                  const isActive = speed === s;
                  return (
                    <motion.button
                      key={s}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSpeed(s)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left"
                      style={{
                        background: isActive
                          ? 'rgba(29,185,84,0.15)'
                          : 'rgba(255,255,255,0.03)',
                        border: isActive
                          ? '1px solid rgba(29,185,84,0.35)'
                          : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base w-6 text-center">
                          {SPEED_LABELS[s].emoji}
                        </span>
                        <div>
                          <p
                            className="font-bold text-sm"
                            style={{
                              color: isActive
                                ? '#4ade80'
                                : 'rgba(255,255,255,0.85)',
                            }}
                          >
                            {s}x
                            {s === 1 && (
                              <span
                                className="ml-2 text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                                style={{
                                  background: 'rgba(255,255,255,0.1)',
                                  color:      'rgba(255,255,255,0.4)',
                                }}
                              >
                                Default
                              </span>
                            )}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                          >
                            {SPEED_LABELS[s].label}
                          </p>
                        </div>
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: '#1DB954' }}
                        >
                          <span className="text-black text-xs font-black">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Reset Button */}
              {speed !== 1 && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSpeed(1)}
                  className="w-full py-3 rounded-xl font-bold text-sm mt-3 transition-all"
                  style={{
                    background: 'rgba(29,185,84,0.1)',
                    border:     '1px solid rgba(29,185,84,0.25)',
                    color:      '#4ade80',
                  }}
                >
                  ↩ Reset to Normal (1x)
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpeedControl;