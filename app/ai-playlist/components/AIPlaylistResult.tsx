"use client";

import { motion } from "framer-motion";
import { Plus, Brain, RefreshCw, Music } from "lucide-react";
import { Song } from "@/types";
import {usePlayer} from "@/hooks/usePlayer";
import {useLoadImage} from "@/hooks/useLoadImage";
import Image from "next/image";

interface PlaylistData {
  name: string;
  description: string;
  songs: Song[];
  mood: string;
}

interface Props {
  playlist: PlaylistData;
  onSave: () => Promise<void>;
  onNew: () => void;
}

// Separate component to follow React hooks rules
const SongRow = ({
  song,
  index,
  onPlay,
}: {
  song: Song;
  index: number;
  onPlay: (id: string) => void;
}) => {
  const imageUrl = useLoadImage(song);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => onPlay(song.id)}
      className="flex items-center gap-3 p-3 rounded-xl
        hover:bg-white/10 transition cursor-pointer group"
    >
      {/* Track Number */}
      <span className="w-6 text-center text-white/40 text-sm
        group-hover:text-white transition flex-shrink-0"
      >
        {index + 1}
      </span>

      {/* Album Art */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden
        bg-neutral-800 flex-shrink-0"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={song.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">
            🎵
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">
          {song.title}
        </p>
        <p className="text-white/50 text-xs truncate">
          {song.author}
        </p>
      </div>

      {/* Play Indicator */}
      <Music className="w-4 h-4 text-green-400 opacity-0
        group-hover:opacity-100 transition flex-shrink-0"
      />
    </motion.div>
  );
};

const AIPlaylistResult = ({ playlist, onSave, onNew }: Props) => {
  const player = usePlayer();

  const handlePlay = (songId: string) => {
    const songIds = playlist.songs.map((s) => s.id);
    player.setId(songId);
    player.setIds(songIds);
  };

  const handlePlayAll = () => {
    if (playlist.songs.length === 0) return;
    const songIds = playlist.songs.map((s) => s.id);
    player.setId(songIds[0]);
    player.setIds(songIds);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl
        border border-white/20 shadow-2xl overflow-hidden"
    >
      {/* Playlist Header */}
      <div className="bg-gradient-to-r from-purple-600/40 to-indigo-600/40
        p-6 border-b border-white/10"
      >
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-purple-500/30
            border border-purple-400/30 px-3 py-1.5 rounded-full"
          >
            <Brain className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-purple-200 text-xs font-semibold">
              AI Generated
            </span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-full">
            <span className="text-white/60 text-xs">
              Mood:{" "}
              <span className="text-white font-bold">{playlist.mood}</span>
            </span>
          </div>
        </div>

        {/* Playlist Info */}
        <h2 className="text-white text-2xl font-black mb-1">
          {playlist.name}
        </h2>
        <p className="text-white/60 text-sm mb-4">
          {playlist.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-white/50 text-xs">
          <span>🎵 {playlist.songs.length} songs</span>
          <span>🤖 AI curated</span>
          <span>✨ Personalized for you</span>
        </div>
      </div>

      {/* Songs List */}
      <div className="p-4">
        {playlist.songs.length === 0 ? (
          // Empty State
          <div className="text-center py-10">
            <p className="text-4xl mb-3">😔</p>
            <p className="text-white font-semibold mb-1">
              No songs found in database!
            </p>
            <p className="text-white/50 text-sm">
              Please upload some songs first to generate a playlist.
            </p>
          </div>
        ) : (
          // Songs
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {playlist.songs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                onPlay={handlePlay}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 flex flex-col gap-3">
        
        {/* Play All */}
        {playlist.songs.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="w-full py-3 bg-green-500 hover:bg-green-400
              text-black font-black rounded-2xl transition
              flex items-center justify-center gap-2 text-base"
          >
            ▶ Play All Songs
          </button>
        )}

        {/* Save & New */}
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20
              text-white font-bold rounded-2xl transition
              border border-white/20
              flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Save Playlist
          </button>

          <button
            onClick={onNew}
            className="flex-1 py-3 bg-purple-500/20 hover:bg-purple-500/30
              text-purple-300 font-bold rounded-2xl transition
              border border-purple-500/30
              flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Playlist
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIPlaylistResult;