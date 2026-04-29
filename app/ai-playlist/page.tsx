"use client";

import { motion, AnimatePresence } from "framer-motion";
import useAIPlaylist from "@/hooks/useAIPlaylist";
import AIPlaylistForm from "./components/AIPlaylistForm";
import AIPlaylistResult from "./components/AIPlaylistResult";
import { Sparkles } from "lucide-react";

export default function AIPlaylistPage() {
  const {
    playlist,
    generatePlaylist,
    savePlaylist,
    isGenerating,
    resetPlaylist,
  } = useAIPlaylist();

  return (
    <div
      className="w-full min-h-full overflow-y-auto"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black relative">
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-start px-6 py-16">
          <div className="w-full max-w-2xl">

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex justify-center mb-4"
              >
                <Sparkles className="w-14 h-14 text-purple-400" />
              </motion.div>

              <h1 className="text-white text-4xl md:text-5xl font-black mb-3">
                AI Playlist Generator
              </h1>
              <p className="text-white/60 text-lg">
                Tell us your mood, AI will create the perfect playlist for you! 🤖🎵
              </p>
            </motion.div>

            {/* Form or Result */}
            <AnimatePresence mode="wait">
              {!playlist ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AIPlaylistForm
                    onGenerate={async (prompt) => {
                      await generatePlaylist(prompt);
                    }}
                    isGenerating={isGenerating}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AIPlaylistResult
                    playlist={playlist}
                    onSave={async () => await savePlaylist(playlist)}
                    onNew={resetPlaylist}
                  />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}