import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getRecentlyPlayed = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from('recently_played')
    .select('songs(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return data?.map((item) => item.songs) || [];
};