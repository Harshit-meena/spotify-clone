'use client';

import { twMerge } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import { usePlayer } from '@/hooks/usePlayer';
import { useMemo, useEffect, useState } from 'react';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import Link from 'next/link';

import { Box } from './Box';
import { SidebarItem } from './SidebarItem';
import { Library } from './Library';
import { CreatePlaylistModal } from './CreatePlaylistModal';

import { Song } from '@/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

type Playlist = {
  id: string;
  name: string;
};

export const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
  const pathname = usePathname();
  const player = usePlayer();
  const supabase = createClientComponentClient();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const routes = useMemo(
    () => [
      { icon: HiHome,   label: 'Home',   active: pathname !== '/search', href: '/' },
      { icon: BiSearch, label: 'Search', active: pathname === '/search', href: '/search' },
    ],
    [pathname]
  );

  const fetchPlaylists = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) { setPlaylists([]); setLoading(false); return; }
    const { data, error } = await supabase.from('playlists').select('*').eq('user_id', userId);
    if (error) console.log('Fetch Playlist Error:', error);
    setPlaylists(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPlaylists(); }, []);
  useEffect(() => { if (!openModal) fetchPlaylists(); }, [openModal]);

  const deletePlaylist = async (id: string) => {
    await supabase.from('playlists').delete().eq('id', id);
    fetchPlaylists();
  };

  return (
    <>
      <CreatePlaylistModal isOpen={openModal} onClose={() => setOpenModal(false)} />

      <div className={twMerge('flex h-full', player.activeId && 'h-[calc(100%-80px)]')}>

        {/* ── SIDEBAR ── */}
        <div
          className="hidden md:flex flex-col gap-y-2 h-full w-[300px] p-2"
          style={{ background: 'var(--sidebar-bg)' }}
        >
          {/* TOP NAV BOX */}
          <Box>
            <div className="flex flex-col gap-y-4 px-5 py-4">
              {routes.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </div>
          </Box>

          {/* LIBRARY + PLAYLISTS */}
          <Box className="overflow-y-auto h-full">
            <Library songs={songs} />

            {/* PLAYLIST SECTION */}
            <div className="px-5 mt-5 pb-4">
              <div className="flex justify-between items-center mb-3">
                <h3
                  className="font-bold text-sm uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  My Playlists
                </h3>
                <button
                  onClick={() => setOpenModal(true)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: 'var(--green)',
                    color: 'black',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-dark)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--green)')}
                >
                  +
                </button>
              </div>

              <div className="flex flex-col gap-y-1">
                {loading && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
                )}
                {!loading && playlists.length === 0 && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No playlists yet 🎵</p>
                )}
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between group px-2 py-1.5 rounded-lg transition-all"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Link
                      href={`/playlist/${playlist.id}`}
                      className="flex items-center gap-x-2 text-sm font-medium truncate transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <FaHeart className="text-pink-500 flex-shrink-0" size={12} />
                      <span className="truncate">{playlist.name}</span>
                    </Link>
                    <button
                      onClick={() => deletePlaylist(playlist.id)}
                      className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                      style={{ color: 'rgba(239,68,68,0.7)' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Box>
        </div>

        {/* MAIN CONTENT */}
        <main
          className="h-full flex-1 overflow-y-auto py-2"
          style={{ background: 'var(--bg-primary)' }}
        >
          {children}
        </main>
      </div>
    </>
  );
};