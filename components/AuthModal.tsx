'use client';

import { useEffect } from 'react';

import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import { Modal } from './Modal';
import { useRouter } from 'next/navigation';

import { useAuthModal } from '@/hooks/useAuthModal';

export const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen } = useAuthModal();

  useEffect(() => {
    const createProfile = async () => {
      if (!session?.user) return;

      const user = session.user;

      const email = user.email || '';
      const baseName = email.split('@')[0];

      const formattedName =
        baseName.charAt(0).toUpperCase() + baseName.slice(1);

      // ⭐ CHECK EXISTING PROFILE
      const { data: existing } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existing) {
        await supabaseClient.from('profiles').insert({
          id: user.id,
          full_name: formattedName,
          email: user.email,
        });
      }
    };

    if (session) {
      createProfile(); // ⭐ IMPORTANT
      router.refresh();
      onClose();
    }
  }, [session, router, onClose, supabaseClient]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title="Welcome back"
      description="Login into your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        theme="dark"
        magicLink
        providers={['github']}
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#1DB954',
              },
            },
          },
        }}
      />
    </Modal>
  );
};