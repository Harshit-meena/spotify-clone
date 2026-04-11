'use client';

import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { usePlayer } from '@/hooks/usePlayer';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const player = usePlayer();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    player.reset();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out!');
      router.push('/');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">

      {/* 🔙 HEADER */}
      <div className="flex items-center justify-between mb-6">

        <button onClick={() => router.back()} className="text-2xl">
          ←
        </button>

        <h1 className="text-xl font-bold">Settings</h1>

        {/* 🔍 SEARCH ICON */}
        <img
          src="/images/search.png"
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {/* 🔥 OPTIONS */}
      <div className="space-y-6">

        {/* ACCOUNT */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/account.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">Account</p>
            <p className="text-sm text-neutral-400">
              Username • Refer friends to Premium
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/music.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">Content and display</p>
            <p className="text-sm text-neutral-400">
              Languages • App language
            </p>
          </div>
        </div>

        {/* PRIVACY */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/lock.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">Privacy and social</p>
            <p className="text-sm text-neutral-400">
              Private session • Public playlists
            </p>
          </div>
        </div>

        {/* PLAYBACK */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/speaker.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">Playback</p>
            <p className="text-sm text-neutral-400">
              Gapless playback • Autoplay
            </p>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/bell.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">Notifications</p>
            <p className="text-sm text-neutral-400">
              Push • Email
            </p>
          </div>
        </div>

        {/* DEVICES */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/device.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">Apps and devices</p>
            <p className="text-sm text-neutral-400">
              Spotify Connect control
            </p>
          </div>
        </div>

        {/* DATA SAVING */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/download.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">Data-saving and offline</p>
            <p className="text-sm text-neutral-400">
              Data saver • Offline mode
            </p>
          </div>
        </div>

        {/* MEDIA QUALITY */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/quality.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">Media quality</p>
            <p className="text-sm text-neutral-400">
              Streaming • Download quality
            </p>
          </div>
        </div>

        {/* SUPPORT */}
        <div className="flex items-start gap-4 cursor-pointer hover:text-green-400">
          <img src="/images/support.png" className="w-6 h-6" />
          <div>
            <p className="font-semibold">About and support</p>
            <p className="text-sm text-neutral-400">
              Version • Privacy policy
            </p>
          </div>
        </div>

      </div>

      {/* 🔥 LOGOUT */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleLogout}
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:opacity-80"
        >
          Log out
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;