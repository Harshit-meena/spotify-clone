'use client';

import { useState, useEffect } from 'react';

import { Database } from '@/types_db';
import {
  createClientComponentClient
} from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {

  // ✅ FIX: type ko simple rakha (avoid TS conflict)
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  useEffect(() => {
    const client = createClientComponentClient<Database>();
    setSupabaseClient(client);
  }, []);

  // ⏳ jab tak client ready nahi ho, kuch render mat karo
  if (!supabaseClient) {
    return null;
  }

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};