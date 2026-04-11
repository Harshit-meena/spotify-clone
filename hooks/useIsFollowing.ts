'use client';

import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const useIsFollowing = (targetUserId: string) => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!user?.id || !targetUserId) return;

    const check = async () => {
      const { data } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      setIsFollowing(!!data);
    };

    check();
  }, [user?.id, targetUserId, supabase]);

  return { isFollowing, setIsFollowing };
};