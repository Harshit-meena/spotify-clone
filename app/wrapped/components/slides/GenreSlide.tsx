"use client";

import { motion } from "framer-motion";

interface Genre {
  name: string;
  percentage: number;
}

interface Props {
  genres?: Genre[];
}

const genreColors = [
  {
    bg: "bg-red-500",
    gradient: "from-red-500 to-pink-500",
    text: "text-red-400",
  },
  {
    bg: "bg-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    text: "text-blue-400",
  },
  {
    bg: "bg-green-500",
    gradient: "from-green-500 to-emerald-500",
    text: "text-green-400",
  },
  {
    bg: "bg-yellow-500",
    gradient: "from-yellow-500 to-orange-500",
    text: "text-yellow-400",
  },
  {
    bg: "bg-purple-500",
    gradient: "from-purple-500 to-violet-500",
    text: "text-purple-400",
  },
];

const genreEmojis: Record<string, string> = {
  pop: "🎤",
  rock: "🎸",
  hiphop: "🎧",
  "hip-hop": "🎧",
  rap: "🎤",
  jazz: "🎺",
  classical: "🎻",
  electronic: "🎛️",
  edm: "🎛️",
  rnb: "🎵",
  "r&b": "🎵",
  indie: "🎶",
  metal: "🤘",
  country: "🤠",
  folk: "🪕",
  blues: "🎸",
  reggae: "🌴",
  latin: "💃",
  soul: "❤️",
  default: "🎵",
};

const getGenreEmoji = (genre: string) => {
  const lower = genre.toLowerCase();
  return genreEmojis[lower] || genreEmojis.default;
};

const GenreSlide = ({ genres = [] }: Props) => {
  const topGenre = genres[0];

  return (
    <div
      className="h-full w-full bg-gradient-to-b 
      from-pink-700 to-rose-900 flex flex-col p-8 pt-16"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-white/70 text-lg">Your music taste</p>
        <h2 className="text-white text-4xl font-black">
          Top Genres 🎼
        </h2>
      </motion.div>

      {/* Top Genre Big Display */}
      {topGenre && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="bg-white/15 backdrop-blur rounded-3xl p-6 mb-6 text-center"
        >
          <p className="text-6xl mb-2">
            {getGenreEmoji(topGenre.name)}
          </p>
          <p className="text-white text-3xl font-black capitalize">
            {topGenre.name}
          </p>
          <p className="text-white/70 text-lg">
            {topGenre.percentage}% of your listening
          </p>
        </motion.div>
      )}

      {/* Genre Bars */}
      <div className="flex flex-col gap-3">
        {genres.slice(0, 5).map((genre, index) => {
          const colorSet = genreColors[index] || genreColors[0];

          return (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="flex items-center gap-3"
            >
              {/* Emoji */}
              <span className="text-xl w-8 text-center">
                {getGenreEmoji(genre.name)}
              </span>

              {/* Name */}
              <p className="text-white font-semibold capitalize w-20 flex-shrink-0">
                {genre.name}
              </p>

              {/* Bar */}
              <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${colorSet.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${genre.percentage}%` }}
                  transition={{
                    delay: index * 0.1 + 0.6,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                />
              </div>

              {/* Percentage */}
              <p className={`${colorSet.text} font-bold w-10 text-right flex-shrink-0`}>
                {genre.percentage}%
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Fun Fact */}
      {topGenre && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-auto bg-white/10 rounded-2xl p-4 text-center"
        >
          <p className="text-white/80 text-sm">
            🎯 You're definitely a{" "}
            <span className="text-white font-bold capitalize">
              {topGenre.name}
            </span>{" "}
            fan!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default GenreSlide;