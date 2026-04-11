'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const useIsLiked = (songId: string) => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const checkLiked = async () => {
      const { data } = await supabase
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single();

      setIsLiked(!!data);
    };

    checkLiked();
  }, [user?.id, songId, supabase]);

  return { isLiked, setIsLiked };
};