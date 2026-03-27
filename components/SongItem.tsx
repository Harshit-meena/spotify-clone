'use client';

import { Song } from '@/types';
import Image from 'next/image';
import { useLoadImage } from '@/hooks/useLoadImage';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

export const SongItem: React.FC<SongItemProps> = ({ data, onClick }) => {
  const imagePath = useLoadImage(data);
  const supabase = createClientComponentClient();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔥 Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data } = await supabase.from('playlists').select('*');
      if (data) setPlaylists(data);
    };
    fetchPlaylists();
  }, [supabase]);

  // 🔥 Add song
  const addToPlaylist = async (playlistId: string) => {
    await supabase.from('playlist_songs').insert({
      playlist_id: playlistId,
      song_id: data.id,
    });

    setShowDropdown(false);
  };

  return (
    <motion.div
      onClick={() => onClick(data.id)}
      whileHover={{ scale: 1.04, y: -5 }}
      transition={{ type: 'spring', stiffness: 250 }}
      className="
        relative group flex flex-col
        bg-neutral-900/60 backdrop-blur-md
        rounded-xl p-4 cursor-pointer
        hover:bg-neutral-800
        shadow-md hover:shadow-xl
      "
    >
      {/* 🎵 IMAGE */}
      <div className="relative aspect-square rounded-md overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <Image
            src={imagePath || '/images/liked.png'}
            fill
            className="object-cover"
            alt="Song"
          />
        </motion.div>

        {/* 🔥 PREMIUM */}
        {data?.is_premium && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded">
            Premium
          </div>
        )}

        {/* ▶ PLAY BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 right-3"
        >
          <div className="bg-green-500 p-3 rounded-full shadow-lg hover:scale-110 transition">
            ▶
          </div>
        </motion.div>
      </div>

      {/* 🎶 INFO */}
      <div className="mt-4">
        <p className="text-white font-semibold truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm truncate">{data.author}</p>
      </div>

      {/* 🔥 PLAYLIST HOVER ZONE */}
      <div
        className="relative mt-3"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        {/* BUTTON */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="
            w-full text-xs bg-green-500 py-2 rounded-md
            opacity-0 group-hover:opacity-100
            transition hover:bg-green-600
          "
        >
          + Playlist
        </button>

        {/* 🔥 DROPDOWN */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="
                absolute bottom-12 left-0 w-full
                bg-black/95 backdrop-blur-md
                border border-neutral-700
                rounded-lg shadow-xl
                p-2 z-50
              "
            >
              {playlists.length === 0 ? (
                <p className="text-xs text-neutral-400 px-2">
                  No playlists
                </p>
              ) : (
                playlists.map((p) => (
                  <div
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToPlaylist(p.id);
                    }}
                    className="
                      px-2 py-2 text-sm
                      cursor-pointer
                      rounded-md
                      hover:bg-neutral-800
                      hover:text-green-400
                      transition
                    "
                  >
                    ❤️ {p.name}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};