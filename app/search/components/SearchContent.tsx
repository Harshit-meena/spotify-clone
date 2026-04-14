'use client';

import { motion } from 'framer-motion';
import { useOnPlay }   from '@/hooks/useOnPlay';
import { LikeButton }  from '@/components/LikeButton';
import { MediaItem }   from '@/components/MediaItem';
import { Song }        from '@/types';

interface SearchContentProps {
  songs: Song[];
}

export const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{ background: 'var(--card-bg)', border: '1px dashed var(--border-default)' }}
      >
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          No songs found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full">
      {songs.map((song, i) => (
        <motion.div
          key={song.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.2 }}
          className="flex items-center gap-x-4 w-full p-3 rounded-xl transition-all"
          style={{
            background: 'var(--card-bg)',
            border:     '1px solid var(--border-subtle)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background   = 'var(--card-hover)';
            e.currentTarget.style.borderColor  = 'var(--border-default)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background   = 'var(--card-bg)';
            e.currentTarget.style.borderColor  = 'var(--border-subtle)';
          }}
        >
          <div className="flex-1 min-w-0">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
          <LikeButton songId={song.id} />
        </motion.div>
      ))}
    </div>
  );
};