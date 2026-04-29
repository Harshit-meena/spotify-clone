"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  minutes?: number;
}

const MinutesSlide = ({ minutes = 0 }: Props) => {
  const [displayMinutes, setDisplayMinutes] = useState(0);

  // Counter Animation
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = minutes / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= minutes) {
        setDisplayMinutes(minutes);
        clearInterval(timer);
      } else {
        setDisplayMinutes(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [minutes]);

  const getMessage = () => {
    if (minutes > 50000) return "You basically lived here! 🏠";
    if (minutes > 20000) return "Music is your life! 🎵";
    if (minutes > 10000) return "Seriously dedicated! 🔥";
    if (minutes > 5000) return "You love music! ❤️";
    return "Great start! 🎶";
  };

  return (
    <div className="h-full w-full bg-gradient-to-b 
      from-blue-600 to-purple-900 flex flex-col 
      items-center justify-center p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-white/70 text-lg mb-4">
          This year you listened for
        </p>

        <motion.div
          className="text-white text-9xl font-black mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
        >
          {displayMinutes.toLocaleString()}
        </motion.div>

        <p className="text-green-400 text-3xl font-bold mb-8">
          minutes of music
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="bg-white/10 rounded-2xl p-6 backdrop-blur"
        >
          <p className="text-white text-xl font-semibold">
            {getMessage()}
          </p>
          <p className="text-white/60 text-sm mt-2">
            That's {Math.floor(minutes / 60)} hours!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MinutesSlide;