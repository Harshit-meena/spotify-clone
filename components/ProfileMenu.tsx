'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useUserProfile } from '@/hooks/useUserProfile';
import { useUser } from '@/hooks/useUser';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const profile = useUserProfile();
  const { user } = useUser();

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  // 🔥 NAME LOGIC
  const name =
    profile?.full_name ||
    user?.email?.split('@')[0] ||
    'User';

  const displayName =
    name.charAt(0).toUpperCase() + name.slice(1);

  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* 🔥 TOP RIGHT AVATAR BUTTON */}
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
            {firstLetter}
          </div>
        )}
      </div>

      {/* 🔥 SIDEBAR MENU */}
      {open && (
        <div className="fixed inset-0 z-50 flex">

          {/* BACKDROP */}
          <div
            className="bg-black/60 w-full"
            onClick={() => setOpen(false)}
          />

          {/* MENU */}
          <div className="w-[300px] bg-[#121212] text-white p-4 absolute left-0 top-0 h-full">

            {/* 🧑 USER SECTION */}
            <div
              onClick={() => handleNavigate('/profile')}
              className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-black">
                  {firstLetter}
                </div>
              )}

              <div>
                <p className="font-bold">{displayName}</p>
                <p className="text-sm text-neutral-400">View profile</p>
              </div>
            </div>

            <hr className="mb-4 border-neutral-700" />

            {/* OPTIONS */}
            <div className="flex flex-col gap-5 text-sm">

              <div className="flex items-center gap-3 cursor-pointer hover:text-green-400">
                <img src="/images/add.png" className="w-5 h-5" />
                <span>Add account</span>
              </div>

              <div className="flex items-center justify-between cursor-pointer hover:text-green-400">
                <div className="flex items-center gap-3">
                  <img src="/images/premium.png" className="w-5 h-5" />
                  <span>Your Premium</span>
                </div>
                <span className="bg-green-500 text-black px-2 py-1 rounded-md text-xs">
                  Standard
                </span>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:text-green-400">
                <img src="/images/new.png" className="w-5 h-5" />
                <span>What’s new</span>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:text-green-400">
                <img src="/images/capsule.png" className="w-5 h-5" />
                <span>Your Sound Capsule</span>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:text-green-400">
                <img src="/images/recent.png" className="w-5 h-5" />
                <span>Recents</span>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:text-green-400">
                <img src="/images/update.png" className="w-5 h-5" />
                <span>Your Updates</span>
              </div>

              <div
                onClick={() => handleNavigate('/settings')}
                className="flex items-center gap-3 cursor-pointer hover:text-green-400"
              >
                <img src="/images/settings.png" className="w-5 h-5" />
                <span>Settings and privacy</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileMenu;