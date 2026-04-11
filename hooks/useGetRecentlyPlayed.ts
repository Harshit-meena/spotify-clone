'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Song } from '@/types';

export const useGetRecentlyPlayed = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchRecent = async () => {
      const { data } = await supabase
        .from('recently_played')
        .select('songs(*)')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(10);

      const formatted = (data || []).map((item: any) => item.songs);
      setSongs(formatted);
    };

    fetchRecent();
  }, [user?.id, supabase]);

  return songs;
};