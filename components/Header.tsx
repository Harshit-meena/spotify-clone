'use client';

import { Button } from './Button';
import ProfileMenu from './ProfileMenu';

import { usePlayer }    from '@/hooks/usePlayer';
import { useUser }      from '@/hooks/useUser';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useTheme }     from '@/providers/ThemeProvider';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { HiHome }                    from 'react-icons/hi';
import { BiSearch }                  from 'react-icons/bi';
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs';

import { useRouter }  from 'next/navigation';
import { twMerge }    from 'tailwind-merge';
import { toast }      from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  children:   React.ReactNode;
  className?: string;
  style?:     React.CSSProperties;
}

export const Header: React.FC<HeaderProps> = ({ children, className, style }) => {
  const authModal      = useAuthModal();
  const router         = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user }       = useUser();
  const player         = usePlayer();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();
    if (error) toast.error(error.message);
    else toast.success('Logged out!');
  };

  return (
    <div
      className={twMerge('h-fit p-6', className)}
      style={{
        background: 'var(--header-gradient)',
        fontFamily: 'var(--font-syne, Syne, sans-serif)',
        ...style,
      }}
    >
      <div className="w-full mb-4 flex items-center justify-between">

        {/* LEFT — desktop nav arrows */}
        <div className="hidden md:flex gap-x-2 items-center">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background:    'var(--nav-btn-bg)',
              border:        '1px solid var(--nav-btn-border)',
              backdropFilter:'blur(10px)',
              color:         'var(--text-primary)',
            }}
          >
            <RxCaretLeft size={22} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => router.forward()}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background:    'var(--nav-btn-bg)',
              border:        '1px solid var(--nav-btn-border)',
              backdropFilter:'blur(10px)',
              color:         'var(--text-primary)',
            }}
          >
            <RxCaretRight size={22} />
          </motion.button>
        </div>

        {/* LEFT — mobile home/search icons */}
        <div className="flex md:hidden gap-x-2 items-center">
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--bg-glass-hover)',
              border:     '1px solid var(--border-default)',
              color:      'var(--text-primary)',
            }}
          >
            <HiHome size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
            onClick={() => router.push('/search')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--bg-glass-hover)',
              border:     '1px solid var(--border-default)',
              color:      'var(--text-primary)',
            }}
          >
            <BiSearch size={18} />
          </motion.button>
        </div>

        {/* RIGHT — theme toggle + auth */}
        <div className="flex items-center gap-x-3">

          {/* ── THEME TOGGLE BUTTON ── */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            aria-label="Toggle theme"
            className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background:    'var(--toggle-bg)',
              border:        '1px solid var(--border-default)',
              backdropFilter:'blur(10px)',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate:   0, scale: 1, opacity: 1 }}
                  exit={{    rotate:  90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                  className="absolute flex items-center justify-center"
                >
                  <BsSunFill size={16} style={{ color: '#facc15' }} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, scale: 0, opacity: 0 }}
                  animate={{ rotate:  0, scale: 1, opacity: 1 }}
                  exit={{    rotate:-90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                  className="absolute flex items-center justify-center"
                >
                  <BsMoonStarsFill size={15} style={{ color: '#6366f1' }} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* ── AUTH BUTTONS ── */}
          {user ? (
            <>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  onClick={handleLogout}
                  className="text-sm font-semibold px-5 py-2 rounded-full"
                  style={{
                    background:    'var(--bg-glass-hover)',
                    border:        '1px solid var(--border-default)',
                    color:         'var(--text-primary)',
                    backdropFilter:'blur(10px)',
                  }}
                >
                  Logout
                </Button>
              </motion.div>
              <ProfileMenu />
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  onClick={() => authModal.onOpen('signup')}
                  className="text-sm font-semibold px-5 py-2 rounded-full"
                  style={{
                    background: 'transparent',
                    border:     '1px solid var(--border-strong)',
                    color:      'var(--text-secondary)',
                  }}
                >
                  Sign Up
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  onClick={() => authModal.onOpen('login')}
                  className="text-sm font-semibold px-5 py-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #1DB954 0%, #17a349 100%)',
                    border:     'none',
                    color:      'black',
                    boxShadow:  '0 4px 15px var(--green-glow)',
                  }}
                >
                  Log in
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};