'use client';

import { useState } from 'react';
import { useGetSongById }  from '@/hooks/useGetSongById';
import { useLoadSongUrl }  from '@/hooks/useLoadSongUrl';
import { usePlayer }       from '@/hooks/usePlayer';
import { FullPlayer }      from './FullPlayer';
import { PlayerContent }   from './PlayerContent';
import { motion, AnimatePresence } from 'framer-motion';

export const Player = () => {
  const player = usePlayer();
  const [showFull, setShowFull] = useState(false);

  const { song }  = useGetSongById(player.activeId || '');
  const songUrl   = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId) return null;

  return (
    <>
      {/* FULL SCREEN PLAYER */}
      <AnimatePresence>
        {showFull && (
          <FullPlayer
            key={songUrl}
            song={song}
            songUrl={songUrl}
            onClose={() => setShowFull(false)}
          />
        )}
      </AnimatePresence>

      {/* MINI BOTTOM BAR */}
      <AnimatePresence>
        {!showFull && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{    y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40 h-20"
            style={{
              background:    'var(--player-bg)',
              backdropFilter:'blur(30px)',
              borderTop:     '1px solid var(--border-subtle)',
              boxShadow:     '0 -8px 40px rgba(0,0,0,0.3)',
            }}
          >
            <PlayerContent
              key={songUrl}
              song={song}
              songUrl={songUrl}
              onOpenFull={() => setShowFull(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};