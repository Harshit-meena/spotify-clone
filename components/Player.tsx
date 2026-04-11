'use client';

import { useGetSongById } from '@/hooks/useGetSongById';
import { useLoadSongUrl } from '@/hooks/useLoadSongUrl';
import { usePlayer } from '@/hooks/usePlayer';
import { FullPlayer } from './FullPlayer';

export const Player = () => {
  const player = usePlayer();

  const { song } = useGetSongById(player.activeId || '');
  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <FullPlayer
      key={songUrl}
      song={song}
      songUrl={songUrl}
      onClose={() => player.close()}
    />
  );
};