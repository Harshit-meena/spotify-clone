'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import useUserProfile    from '@/hooks/useUserProfile';
import { useUser }        from '@/hooks/useUser';
import { useSubscription } from '@/hooks/useSubscription';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ✅ FIX: destructure karo - profile object se nikalo
  const { profile } = useUserProfile();
  const { user }    = useUser();
  const { subscription, isPremium } = useSubscription();

  // ✅ Avatar cache busting
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.avatar_url) {
      const base = profile.avatar_url.split('?')[0];
      setAvatarUrl(`${base}?t=${Date.now()}`);
    } else {
      setAvatarUrl(null);
    }
  }, [profile?.avatar_url]);

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const name        = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const firstLetter = displayName.charAt(0).toUpperCase();

  const planBadge = isPremium ? subscription?.plan ?? null : null;

  const planColor = () => {
    if (!subscription?.plan) return 'var(--green)';
    const p = subscription.plan.toLowerCase();
    if (p === 'platinum') return '#f59e0b';
    if (p === 'lite')     return '#9ca3af';
    if (p === 'student')  return '#60a5fa';
    return 'var(--green)';
  };

  const menuItems = [
    { icon: '/images/add.png',      label: 'Add account',          path: null },
    { icon: '/images/premium.png',  label: 'Your Premium',         path: isPremium ? null : '/premium', badge: planBadge },
    { icon: '/images/new.png',      label: "What's new",           path: null },
    { icon: '/images/capsule.png',  label: 'Your Sound Capsule',   path: null },
    { icon: '/images/recent.png',   label: 'Recents',              path: null },
    { icon: '/images/update.png',   label: 'Your Updates',         path: null },
    { icon: '/images/settings.png', label: 'Settings and privacy', path: '/settings' },
  ];

  return (
    <>
      {/* ── AVATAR BUTTON ── */}
      <div onClick={() => setOpen(true)} className="cursor-pointer relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: `2px solid ${isPremium ? planColor() : 'var(--green)'}` }}
            onError={() => setAvatarUrl(null)}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black text-sm"
            style={{ background: 'var(--green)' }}
          >
            {firstLetter}
          </div>
        )}

        {isPremium && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
            style={{
              background: planColor(),
              border: '1.5px solid var(--bg-primary)',
              color: '#000',
            }}
          >
            ★
          </div>
        )}
      </div>

      {/* ── SLIDE MENU ── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: 'var(--modal-overlay)' }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0,    opacity: 1 }}
              exit={{    x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-[300px] h-full flex flex-col p-5 z-10"
              style={{
                background:  'var(--modal-bg)',
                borderRight: '1px solid var(--border-subtle)',
                boxShadow:   '4px 0 40px rgba(0,0,0,0.25)',
              }}
            >
              {/* USER ROW */}
              <motion.div
                onClick={() => handleNavigate('/profile')}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 mb-4 cursor-pointer p-3 rounded-xl"
                style={{ background: 'var(--bg-glass)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-glass)')}
              >
                {/* ✅ avatarUrl state use karo here also */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    onError={() => setAvatarUrl(null)}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-black flex-shrink-0"
                    style={{ background: 'var(--green)' }}
                  >
                    {firstLetter}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-sm truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {displayName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    View profile
                  </p>
                </div>
              </motion.div>

              {/* PLAN BANNER */}
              {isPremium ? (
                <div
                  className="mb-4 px-3 py-2.5 rounded-xl flex items-center gap-2"
                  style={{
                    background: `${planColor()}18`,
                    border:     `1px solid ${planColor()}40`,
                  }}
                >
                  <span>★</span>
                  <div>
                    <p className="text-xs font-black" style={{ color: planColor() }}>
                      Premium {subscription?.plan}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Active subscription
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  onClick={() => handleNavigate('/premium')}
                  whileHover={{ scale: 1.02 }}
                  className="mb-4 px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-2"
                  style={{
                    background: 'rgba(29,185,84,0.08)',
                    border:     '1px solid rgba(29,185,84,0.25)',
                  }}
                >
                  <span>🎵</span>
                  <div>
                    <p className="text-xs font-black" style={{ color: 'var(--green)' }}>
                      Upgrade to Premium
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Unlock all features →
                    </p>
                  </div>
                </motion.div>
              )}

              {/* DIVIDER */}
              <div
                className="mb-3 h-px w-full"
                style={{ background: 'var(--border-subtle)' }}
              />

              {/* MENU ITEMS */}
              <div className="flex flex-col gap-0.5 flex-1">
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    onClick={() => item.path && handleNavigate(item.path)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer"
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
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-5 h-5 opacity-70"
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-md"
                        style={{ background: planColor(), color: '#000' }}
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
                className="mt-4 mx-auto px-6 py-2 rounded-full text-sm font-semibold"
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