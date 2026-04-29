"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLoadImage } from "@/hooks/useLoadImage";
import type { Song } from "@/types";
import { ReactNode } from "react";

interface SongWithPlayCount extends Song {
  artist: ReactNode;
  playCount: number;
}

interface Props {
  songs?: SongWithPlayCount[];
}

const SongItem = ({
  song,
  index,
}: {
  song: SongWithPlayCount;
  index: number;
}) => {
  const imageUrl = useLoadImage(song);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.15, type: "spring" }}
      className={`flex items-center gap-4 p-3 rounded-xl
        ${index === 0 ? "bg-yellow-500/20 border border-yellow-500/30" : "bg-white/5"}`}
    >
      {/* Rank */}
      <span
        className={`text-2xl font-black w-8 text-center
          ${index === 0 ? "text-yellow-400" : "text-white/40"}`}
      >
        {index + 1}
      </span>

      {/* Image */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <Image src={imageUrl} alt={song.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
            🎵
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold truncate">{song.title}</p>
        <p className="text-white/60 text-sm truncate">{song.artist}</p>
      </div>

      {/* Play Count */}
      <div className="text-right flex-shrink-0">
        <p className="text-green-400 font-bold">{song.playCount}</p>
        <p className="text-white/40 text-xs">plays</p>
      </div>
    </motion.div>
  );
};

const TopSongsSlide = ({ songs = [] }: Props) => {
  return (
    <div className="h-full w-full bg-gradient-to-b 
      from-orange-600 to-red-900 flex flex-col p-8 pt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-white/70 text-lg">Your top songs</p>
        <h2 className="text-white text-4xl font-black">
          You had them on repeat 🔂
        </h2>
      </motion.div>

      <div className="flex flex-col gap-3">
        {songs.slice(0, 5).map((song, index) => (
          <SongItem key={song.id} song={song} index={index} />
        ))}
      </div>

      {songs[0] && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/60 text-sm mt-4 text-center"
        >
          "{songs[0].title}" was your #1 song 🏆
        </motion.p>
      )}
    </div>
  );
};

export default TopSongsSlide;