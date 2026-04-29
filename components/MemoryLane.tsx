'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { usePlayer } from '@/hooks/usePlayer';

interface MemorySong {
  id:         string;
  title:      string;
  author:     string;
  image_path: string;
  song_path:  string;
  playedAt:   string;
}

const MemoryLane = () => {
  const supabase        = useSupabaseClient();
  const { user }        = useUser();
  const player          = usePlayer();
  const [songs, setSongs]   = useState<MemorySong[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]     = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchMemories();
  }, [user?.id]);

  const fetchMemories = async () => {
    try {
      setLoading(true);

      // Aaj se exactly 1 saal pehle aur 2 saal pehle ka date range
      const ranges = [1, 2, 3].map(years => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - years);
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return { start: start.toISOString(), end: end.toISOString(), years };
      });

      let allMemories: MemorySong[] = [];

      for (const range of ranges) {
        const { data } = await supabase
          .from('track_history')
          .select(`
            played_at,
            songs (
              id, title, author, image_path, song_path
            )
          `)
          .eq('user_id', user!.id)
          .gte('played_at', range.start)
          .lte('played_at', range.end)
          .limit(3);

        if (data && data.length > 0) {
          const mapped = data
            .filter((d: any) => d.songs)
            .map((d: any) => ({
              ...d.songs,
              playedAt: `${range.years} saal pehle aaj ke din`,
            }));
          allMemories = [...allMemories, ...mapped];
        }
      }

      setSongs(allMemories);
    } catch (err) {
      console.error('Memory lane error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (song: MemorySong) => {
    player.setId(song.id);
    player.setIds(songs.map(s => s.id));
  };

  // Koi memory nahi hai
  if (!loading && songs.length === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕰️</span>
              <div>
                <h2
                  className="text-xl font-black"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Memory Lane
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Aaj ke din purane saalon mein yeh sune the
                </p>
              </div>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: 'var(--bg-highlight)',
                color: 'var(--text-muted)',
              }}
            >
              ✕
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex gap-3">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-20 flex-1 rounded-2xl animate-pulse"
                  style={{ background: 'var(--bg-highlight)' }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {songs.map((song, idx) => (
                <motion.div
                  key={`${song.id}-${idx}`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlay(song)}
                  className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all"
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = 'var(--bg-glass-hover)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.background = 'var(--bg-glass)')
                  }
                >
                  {/* Album Art */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    {song.image_path ? (
                      <img
                        src={song.image_path}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-2xl"
                        style={{ background: 'var(--bg-highlight)' }}
                      >
                        🎵
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xl">▶</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-sm truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {song.title}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {song.author}
                    </p>
                  </div>

                  {/* Time Badge */}
                  <div
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: 'rgba(29,185,84,0.12)',
                      color: 'var(--green)',
                      border: '1px solid rgba(29,185,84,0.25)',
                    }}
                  >
                    🕰️ {song.playedAt}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemoryLane;