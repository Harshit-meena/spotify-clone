import { Song } from '@/types';
import { usePlayer } from './usePlayer';
import { useAuthModal } from './useAuthModal';
import { useUser } from './useUser';
import { useSubscribeModal } from './useSubscribeModal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const subscribeModal = useSubscribeModal();
  const { user, subscription } = useUser();

  const supabase = createClientComponentClient();

  const onPlay = async (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    const song = songs.find((song) => song.id === id);

    // 🔥 PREMIUM CHECK
    if (song?.is_premium && !subscription) {
      return subscribeModal.onOpen();
    }

    // 🔥 SAVE TO RECENTLY PLAYED (non-blocking)
    supabase.from('recently_played').insert({
      user_id: user.id,
      song_id: id,
    });

    // 🔥 IMPORTANT: FIRST SET QUEUE
    player.setIds(songs.map((song) => song.id));

    // 🔥 THEN SET CURRENT SONG
    player.setId(id);
  };

  return onPlay;
};