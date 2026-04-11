'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const useUserProfile = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, [user?.id, supabase]);

  return profile;
};