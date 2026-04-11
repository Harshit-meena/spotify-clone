'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const useGetPlaylists = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    const fetchPlaylists = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Playlist Error:', error);
      }

      setPlaylists(data || []);
      setLoading(false);
    };

    fetchPlaylists();
  }, [user?.id, supabase]);

  return { playlists, loading };
};