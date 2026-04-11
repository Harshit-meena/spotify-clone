'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

import { Song } from '@/types';

export const useGetLikedSongs = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setSongs([]);
      setLoading(false);
      return;
    }

    const fetchLikedSongs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('liked_songs')
        .select('songs(*)')
        .eq('user_id', user.id);

      if (error) {
        console.log('Liked Songs Error:', error);
      }

      const formattedSongs = (data || []).map((item: any) => item.songs);
      setSongs(formattedSongs);
      setLoading(false);
    };

    fetchLikedSongs();
  }, [user?.id, supabase]);

  return { songs, loading };
};