"use client";

import { motion } from "framer-motion";

interface Artist {
  name: string;
  playCount: number;
  image?: string;
}

interface Props {
  artists?: Artist[];
}

const getRankEmoji = (index: number) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `#${index + 1}`;
};

const getRandomColor = (index: number) => {
  const colors = [
    "from-yellow-500 to-orange-500",
    "from-gray-400 to-gray-600",
    "from-orange-400 to-orange-600",
    "from-purple-400 to-purple-600",
    "from-blue-400 to-blue-600",
  ];
  return colors[index] || colors[0];
};

const TopArtistsSlide = ({ artists = [] }: Props) => {
  return (
    <div
      className="h-full w-full bg-gradient-to-b 
      from-purple-700 to-indigo-900 flex flex-col p-8 pt-16"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-white/70 text-lg">You loved these artists</p>
        <h2 className="text-white text-4xl font-black">
          Your Top Artists 🎤
        </h2>
      </motion.div>

      {/* Artists List */}
      <div className="flex flex-col gap-4">
        {artists.slice(0, 5).map((artist, index) => (
          <motion.div
            key={artist.name}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 100,
            }}
            className="flex items-center gap-4"
          >
            {/* Avatar with Gradient */}
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-br 
                ${getRandomColor(index)} flex items-center justify-center
                flex-shrink-0 shadow-lg`}
            >
              <span className="text-white text-xl font-black">
                {artist.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getRankEmoji(index)}
                </span>
                <p className="text-white font-bold text-lg truncate">
                  {artist.name}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getRandomColor(index)} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (artist.playCount /
                        (artists[0]?.playCount || 1)) *
                      100
                    }%`,
                  }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
                />
              </div>
            </div>

            {/* Play Count */}
            <div className="text-right flex-shrink-0">
              <p className="text-white font-bold">{artist.playCount}</p>
              <p className="text-white/50 text-xs">plays</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Message */}
      {artists[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-auto"
        >
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
            <p className="text-white font-semibold">
              🎤 {artists[0].name} was your most played artist!
            </p>
            <p className="text-white/60 text-sm mt-1">
              You played their songs {artists[0].playCount} times
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TopArtistsSlide;