'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';

export interface Subscription {
  id: string;
  plan: string;
  amount: number;
  status: string;
  expires_at: string | null;
}

export const useSubscription = () => {
  const supabase = createClientComponentClient();
  const user     = useUser();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);

  useEffect(() => {
    if (!user?.id) { setIsLoading(false); return; }

    const fetch = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      setSubscription(data || null);
      setIsLoading(false);
    };

    fetch();
  }, [user?.id, supabase]);

  const isPremium = !!subscription;

  return { subscription, isPremium, isLoading };
};