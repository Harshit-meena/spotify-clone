'use client';

import { useUserProfile } from '@/hooks/useUserProfile';

export const UserAvatar = () => {
  const profile = useUserProfile();

  const name = profile?.full_name || 'U';
  const letter = name.charAt(0).toUpperCase();

  return (
    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
      {letter}
    </div>
  );
};