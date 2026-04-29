"use client";

import { motion } from "framer-motion";
import { FaTwitter, FaInstagram, FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";

interface Props {
  data: any;
}

const FinalSlide = ({ data }: Props) => {
  const handleShare = async (platform: string) => {
    const text = `🎵 My ${new Date().getFullYear()} Music Wrapped!
    
🎶 ${data?.totalMinutes?.toLocaleString()} minutes listened
🎵 Top Song: ${data?.topSongs?.[0]?.title}
🎤 Top Artist: ${data?.topArtists?.[0]?.name}
🔥 ${data?.listeningStreak} day streak!

Check yours! 🎧`;

    if (platform === "copy") {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
      );
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b 
      from-green-600 to-black flex flex-col 
      items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>

        <h1 className="text-white text-5xl font-black mb-2">
          That's a wrap!
        </h1>
        <p className="text-white/70 text-lg mb-8">
          {new Date().getFullYear()} was an amazing year for music
        </p>

        {/* Summary Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8 w-full"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-green-400 text-2xl font-black">
                {data?.totalMinutes?.toLocaleString()}
              </p>
              <p className="text-white/60 text-xs">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-green-400 text-2xl font-black">
                {data?.yearInNumbers?.differentArtists}
              </p>
              <p className="text-white/60 text-xs">Artists</p>
            </div>
            <div className="text-center">
              <p className="text-green-400 text-2xl font-black">
                {data?.listeningStreak}
              </p>
              <p className="text-white/60 text-xs">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-green-400 text-2xl font-black">
                {data?.yearInNumbers?.differentSongs}
              </p>
              <p className="text-white/60 text-xs">Songs</p>
            </div>
          </div>
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 bg-[#1DA1F2] 
              text-white px-6 py-3 rounded-full font-semibold
              hover:bg-[#1a8cd8] transition"
          >
            <FaTwitter />
            Share
          </button>

          <button
            onClick={() => handleShare("copy")}
            className="flex items-center gap-2 bg-white/20 
              text-white px-6 py-3 rounded-full font-semibold
              hover:bg-white/30 transition"
          >
            <FaCopy />
            Copy
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FinalSlide;