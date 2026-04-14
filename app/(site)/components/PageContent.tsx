'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SongItem } from '@/components/SongItem';
import { useOnPlay } from '@/hooks/useOnPlay';
import { usePlayer } from '@/hooks/usePlayer';
import { Song } from '@/types';

interface PageContentProps {
  songs: Song[];
}

const CATEGORIES = [
  { label: 'All',       value: null,        emoji: '✦'  },
  { label: 'Haryanvi',  value: 'haryanvi',  emoji: '🎶' },
  { label: 'Bollywood', value: 'bollywood', emoji: '🎬' },
  { label: 'Pop',       value: 'pop',       emoji: '🎧' },
  { label: 'Hip-Hop',   value: 'hiphop',    emoji: '🎤' },
  { label: 'Chill',     value: 'chill',     emoji: '🌊' },
];

export const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);
  const player = usePlayer();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredSongs = activeCategory
    ? songs.filter((s: any) => s.category === activeCategory)
    : songs;

  if (songs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 rounded-2xl mt-4"
        style={{
          background: 'var(--card-bg)',
          border: '1px dashed var(--border-default)',
        }}
      >
        <span className="text-5xl mb-4">🎵</span>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          No songs available yet
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2">

      {/* CATEGORY PILLS */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <motion.button
              key={cat.label}
              onClick={() => setActiveCategory(cat.value)}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #1DB954, #17a349)'
                  : 'var(--bg-glass)',
                color:  isActive ? 'black' : 'var(--text-secondary)',
                border: isActive ? 'none' : '1px solid var(--border-default)',
                boxShadow: isActive ? '0 4px 15px var(--green-glow)' : 'none',
              }}
            >
              <span style={{ fontSize: 13 }}>{cat.emoji}</span>
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* SECTION TITLE */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p
            className="font-black text-lg"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            {activeCategory
              ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Songs`
              : 'All Songs'}
          </p>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(29,185,84,0.15)', color: 'var(--green)' }}
          >
            {filteredSongs.length}
          </span>
        </div>
      </div>

      {/* SONG GRID */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory ?? 'all'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4"
        >
          {filteredSongs.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <SongItem
                data={item}
                onClick={(id) => onPlay(id)}
                isActive={player.activeId === item.id}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};