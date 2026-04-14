'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { useUserProfile } from '@/hooks/useUserProfile';
import { useUser }        from '@/hooks/useUser';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const router  = useRouter();
  const profile = useUserProfile();
  const { user } = useUser();

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const name = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayName  = name.charAt(0).toUpperCase() + name.slice(1);
  const firstLetter  = displayName.charAt(0).toUpperCase();

  const menuItems = [
    { icon: '/images/add.png',      label: 'Add account',          path: null },
    { icon: '/images/premium.png',  label: 'Your Premium',         path: null,         badge: 'Standard' },
    { icon: '/images/new.png',      label: "What's new",           path: null },
    { icon: '/images/capsule.png',  label: 'Your Sound Capsule',   path: null },
    { icon: '/images/recent.png',   label: 'Recents',              path: null },
    { icon: '/images/update.png',   label: 'Your Updates',         path: null },
    { icon: '/images/settings.png', label: 'Settings and privacy', path: '/settings' },
  ];

  return (
    <>
      {/* AVATAR BUTTON */}
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            className="w-10 h-10 rounded-full object-cover ring-2"
            style={{ borderColor: 'var(--green)' }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black text-sm"
            style={{ background: 'var(--green)' }}
          >
            {firstLetter}
          </div>
        )}
      </div>

      {/* SLIDE-IN MENU */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex">

            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: 'var(--modal-overlay)' }}
              onClick={() => setOpen(false)}
            />

            {/* PANEL */}
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0,    opacity: 1 }}
              exit={{    x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-[300px] h-full flex flex-col p-5 z-10"
              style={{
                background: 'var(--modal-bg)',
                borderRight: '1px solid var(--border-subtle)',
                boxShadow:   '4px 0 40px rgba(0,0,0,0.25)',
              }}
            >
              {/* USER SECTION */}
              <motion.div
                onClick={() => handleNavigate('/profile')}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 mb-6 cursor-pointer p-3 rounded-xl transition-all"
                style={{ background: 'var(--bg-glass)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-glass)')}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-black"
                    style={{ background: 'var(--green)' }}
                  >
                    {firstLetter}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {displayName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    View profile
                  </p>
                </div>
              </motion.div>

              {/* DIVIDER */}
              <div
                className="mb-4 h-px w-full"
                style={{ background: 'var(--border-subtle)' }}
              />

              {/* MENU ITEMS */}
              <div className="flex flex-col gap-1">
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    onClick={() => item.path && handleNavigate(item.path)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--bg-glass-hover)';
                      e.currentTarget.style.color      = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color      = 'var(--text-secondary)';
                    }}
                  >
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <img src={item.icon} className="w-5 h-5 opacity-70" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: 'var(--green)', color: 'black' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setOpen(false)}
                className="mt-auto mx-auto px-6 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: 'var(--bg-glass-hover)',
                  border:     '1px solid var(--border-default)',
                  color:      'var(--text-secondary)',
                }}
              >
                Close
              </button>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileMenu;