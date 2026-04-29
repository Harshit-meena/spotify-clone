"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface Props {
  onGenerate: (prompt: string) => Promise<any>;
  isGenerating: boolean;
}

const MOOD_OPTIONS = [
  { label: "😢 Sad Songs", value: "sad love songs" },
  { label: "💪 Workout", value: "workout motivation beats" },
  { label: "🎉 Party", value: "party dance vibes" },
  { label: "📚 Study", value: "chill study music" },
  { label: "❤️ Romantic", value: "romantic songs" },
  { label: "😴 Sleep", value: "relaxing sleep music" },
];

const AIPlaylistForm = ({ onGenerate, isGenerating }: Props) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onGenerate(prompt.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Quick Mood Select */}
        <div>
          <p className="text-white/50 text-xs mb-3 uppercase tracking-wider font-semibold">
            Quick Select 👇
          </p>
          <div className="grid grid-cols-3 gap-2">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPrompt(option.value)}
                className={`px-3 py-3 rounded-2xl text-sm font-semibold
                  transition-all border
                  ${
                    prompt === option.value
                      ? "bg-purple-500 border-purple-400 text-white scale-105 shadow-lg"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <p className="text-white/50 text-xs mb-3 uppercase tracking-wider font-semibold">
            Or Type Your Mood 👇
          </p>
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'rainy day vibes', 'desi hip hop', 'focus music'..."
              className="w-full bg-white/5 border border-white/20
                text-white placeholder:text-white/30
                rounded-2xl px-5 py-4 pr-14 text-base
                focus:outline-none focus:border-purple-500
                focus:ring-2 focus:ring-purple-500/20 transition"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="absolute right-3 top-1/2 -translate-y-1/2
                w-10 h-10 bg-purple-500 hover:bg-purple-400
                disabled:opacity-30 disabled:cursor-not-allowed
                rounded-xl flex items-center justify-center transition"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-4 rounded-2xl font-black text-lg
            transition-all shadow-xl
            disabled:opacity-40 disabled:cursor-not-allowed
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:from-purple-500 hover:to-indigo-500
            text-white"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Your Playlist...
            </span>
          ) : (
            "✨ Generate Playlist"
          )}
        </button>

      </form>

      {/* Loading Animation */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20"
        >
          <div className="flex items-center justify-center gap-4">
            {["🤖", "🎵", "✨", "🎶", "💜"].map((emoji, i) => (
              <motion.span
                key={emoji}
                animate={{ y: [0, -12, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  delay: i * 0.15,
                }}
                className="text-2xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
          <p className="text-center text-white/60 text-sm mt-3">
            Finding perfect songs for "{prompt}" mood...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIPlaylistForm;