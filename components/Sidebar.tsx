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

export const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
  const pathname = usePathname();
  const player = usePlayer();
  const supabase = createClientComponentClient();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: 'Home',
        active: pathname !== '/search',
        href: '/',
      },
      {
        icon: BiSearch,
        label: 'Search',
        active: pathname === '/search',
        href: '/search',
      },
    ],
    [pathname]
  );

  // 🔥 fetch playlists
  const fetchPlaylists = async () => {
    const { data } = await supabase.from('playlists').select('*');
    if (data) setPlaylists(data);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // 🔥 create playlist
  const handleCreatePlaylist = async (name: string) => {
    const { data: userData } = await supabase.auth.getUser();

    await supabase.from('playlists').insert({
      name,
      user_id: userData.user?.id,
    });

    fetchPlaylists();
  };

  // 🔥 delete playlist
  const deletePlaylist = async (id: string) => {
    await supabase.from('playlists').delete().eq('id', id);
    fetchPlaylists();
  };

  return (
    <>
      {/* 🔥 MODAL */}
      <CreatePlaylistModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreatePlaylist}
      />

      <div
        className={twMerge(
          `flex h-full`,
          player.activeId && 'h-[calc(100%-80px)]'
        )}
      >
        <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
          <Box>
            <div className="flex flex-col gap-y-4 px-5 py-4">
              {routes.map((item) => (
                <SidebarItem key={item.label} {...item} />
              ))}
            </div>
          </Box>

          <Box className="overflow-y-auto h-full">
            <Library songs={songs} />

            {/* 🔥 PLAYLIST SECTION */}
            <div className="px-5 mt-5">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold">My Playlists</h3>

                <button
                  onClick={() => setOpenModal(true)}
                  className="text-sm bg-green-500 px-2 py-1 rounded hover:bg-green-600 transition"
                >
                  +
                </button>
              </div>

              {/* 🔥 PLAYLIST LIST */}
              <div className="mt-3 flex flex-col gap-y-2">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between group"
                  >
                    {/* ❤️ + NAME */}
                    <Link
                      href={`/playlist/${playlist.id}`}
                      className="flex items-center gap-x-2 text-neutral-400 hover:text-white"
                    >
                      <FaHeart className="text-pink-500" />
                      {playlist.name}
                    </Link>

                    {/* ❌ DELETE */}
                    <button
                      onClick={() => deletePlaylist(playlist.id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Box>
        </div>

        <main className="h-full flex-1 overflow-y-auto py-2">
          {children}
        </main>
      </div>
    </>
  );
};