"use client";

import { motion } from "framer-motion";

const IntroSlide = () => {
  const year = new Date().getFullYear();

  return (
    <div className="h-full w-full bg-gradient-to-b 
      from-green-400 to-green-900 flex flex-col 
      items-center justify-center relative overflow-hidden"
    >
      {/* Background Music Notes */}
      {["🎵", "🎶", "🎸", "🥁", "🎹"].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          initial={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 800 - 400,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center z-10"
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-xl mb-2"
        >
          Your Year in Music
        </motion.p>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-8xl font-black mb-4"
        >
          {year}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white text-3xl font-bold"
        >
          WRAPPED
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-white/60 text-sm mt-8"
        >
          Tap to continue →
        </motion.p>
      </motion.div>
    </div>
  );
};

export default IntroSlide;