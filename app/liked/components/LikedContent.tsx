'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion }    from 'framer-motion';

import { Song }        from '@/types';
import { useUser }     from '@/hooks/useUser';
import { MediaItem }   from '@/components/MediaItem';
import { LikeButton }  from '@/components/LikeButton';
import { useOnPlay }   from '@/hooks/useOnPlay';

interface LikedContentProps {
  songs: Song[];
}

export const LikedContent: React.FC<LikedContentProps> = ({ songs }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const onPlay = useOnPlay(songs);

  useEffect(() => {
    if (!isLoading && !user) router.replace('/');
  }, [isLoading, user, router]);

  if (songs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 mx-6 mt-4 rounded-2xl"
        style={{ background: 'var(--card-bg)', border: '1px dashed var(--border-default)' }}
      >
        <span className="text-5xl mb-4">💔</span>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          No liked songs yet
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Songs you like will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {songs.map((song, i) => (
        <motion.div
          key={song.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.2 }}
          className="flex items-center gap-x-4 w-full p-2 rounded-xl transition-all"
          style={{ background: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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