'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { Song } from '@/types';

export const useGetSongsByPlaylistId = (playlistId: string) => {
  const supabase = useSupabaseClient();
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (!playlistId) return;

    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from('playlist_songs')
        .select('songs(*)')
        .eq('playlist_id', playlistId);

      if (!error && data) {
        const formattedSongs = data.map((item: any) => item.songs);
        setSongs(formattedSongs);
      }
    };

    fetchSongs();
  }, [playlistId, supabase]);

  return songs;
};