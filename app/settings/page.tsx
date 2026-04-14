'use client';

import { useRouter }         from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { usePlayer }         from '@/hooks/usePlayer';
import { toast }             from 'react-hot-toast';
import { motion }            from 'framer-motion';

const SETTINGS = [
  { icon: '/images/account.png',  label: 'Account',               desc: 'Username • Refer friends to Premium' },
  { icon: '/images/music.png',    label: 'Content and display',   desc: 'Languages • App language' },
  { icon: '/images/lock.png',     label: 'Privacy and social',    desc: 'Private session • Public playlists' },
  { icon: '/images/speaker.png',  label: 'Playback',              desc: 'Gapless playback • Autoplay' },
  { icon: '/images/bell.png',     label: 'Notifications',         desc: 'Push • Email' },
  { icon: '/images/device.png',   label: 'Apps and devices',      desc: 'Spotify Connect control' },
  { icon: '/images/download.png', label: 'Data-saving and offline',desc: 'Data saver • Offline mode' },
  { icon: '/images/quality.png',  label: 'Media quality',         desc: 'Streaming • Download quality' },
  { icon: '/images/support.png',  label: 'About and support',     desc: 'Version • Privacy policy' },
];

const SettingsPage = () => {
  const router   = useRouter();
  const supabase = useSupabaseClient();
  const player   = usePlayer();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    player.reset();
    if (error) toast.error(error.message);
    else { toast.success('Logged out!'); router.push('/'); }
  };

  return (
    <div
      className="min-h-full w-full overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-6 py-5 sticky top-0 z-10"
        style={{
          background:    'var(--player-bg)',
          backdropFilter:'blur(20px)',
          borderBottom:  '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={() => router.back()}
          className="text-xl font-bold w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
        >
          ←
        </button>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h1>
        <img src="/images/search.png" className="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity" />
      </div>

      {/* SETTINGS LIST */}
      <div className="px-6 py-4 space-y-1">
        {SETTINGS.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 4 }}
            className="flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition-all"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--bg-glass)' }}
            >
              <img src={item.icon} className="w-5 h-5" style={{ opacity: 0.8 }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {item.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {item.desc}
              </p>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</span>
          </motion.div>
        ))}
      </div>

      {/* DIVIDER */}
      <div className="mx-6 my-2" style={{ height: 1, background: 'var(--border-subtle)' }} />

      {/* LOGOUT */}
      <div className="px-6 py-4 flex justify-center">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-10 py-3 rounded-full font-bold text-sm transition-all"
          style={{
            background: 'var(--bg-elevated)',
            border:     '1px solid var(--border-default)',
            color:      'var(--text-primary)',
            boxShadow:  'var(--card-shadow)',
          }}
        >
          Log out
        </motion.button>
      </div>

    </div>
  );
};

export default SettingsPage;