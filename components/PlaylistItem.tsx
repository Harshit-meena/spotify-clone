'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGetSongsByPlaylistId } from '@/hooks/useGetSongsByPlaylistId';
import { usePlayer }               from '@/hooks/usePlayer';

interface PlaylistItemProps {
  playlist: any;
  isOpen:   boolean;
  onToggle: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist, isOpen, onToggle }) => {
  const songs  = useGetSongsByPlaylistId(playlist.id);
  const player = usePlayer();

  const handlePlay = (id: string) => {
    player.setId(id);
    player.setIds([id]);
  };

  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      {/* PLAYLIST ROW */}
      <motion.div
        onClick={onToggle}
        whileHover={{ x: 3 }}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span>🎵</span>
        <span className="font-semibold text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
          {playlist.name}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
          {songs.length} songs
        </span>
        <span style={{ color: 'var(--text-muted)' }}>{isOpen ? '▲' : '▼'}</span>
      </motion.div>

      {/* SONGS DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {songs.length === 0 ? (
              <p className="px-6 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                No songs in this playlist
              </p>
            ) : (
              songs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handlePlay(song.id)}
                  className="flex items-center gap-2 px-8 py-2.5 cursor-pointer transition-all"
                  style={{ borderTop: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-glass-hover)';
                    (e.currentTarget.querySelector('.song-title') as HTMLElement)!.style.color = 'var(--green)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    (e.currentTarget.querySelector('.song-title') as HTMLElement)!.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span style={{ fontSize: 11 }}>🎶</span>
                  <span className="song-title text-xs font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    {song.title}
                  </span>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaylistItem;