import { getSongs } from '@/actions/getSongs';
import { getRecentlyPlayed } from '@/actions/getRecentlyPlayed';

import { Header } from '@/components/Header';
import { ListItem } from '@/components/ListItem';
import { PageContent } from './components/PageContent';

export const revalidate = 0;

// ✅ SAFE IMAGE FUNCTION (ERROR FIX)
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '/images/liked.png';
  return `https://nquzpenqnbkymnmwrwqt.supabase.co/storage/v1/object/public/images/${path}`;
};

export default async function Home() {
  const songs = await getSongs();
  const recentSongs = await getRecentlyPlayed();

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      
      {/* 🔥 HEADER */}
      <Header className="bg-gradient-to-b from-emerald-800 via-neutral-900 to-black">
        <div className="mb-4">
          
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight">
            Welcome back 👋
          </h1>

          <p className="text-neutral-400 mt-2 text-sm">
            Your vibe. Your music. 🎧
          </p>

          {/* 🔥 QUICK CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-6">
            <ListItem image="/images/liked.png" name="❤️ Liked Songs" href="/liked" />
            <ListItem image="/images/liked.png" name="🔥 Trending" href="/" />
            <ListItem image="/images/liked.png" name="🎧 Recently Played" href="#recent" />
          </div>
        </div>
      </Header>

      {/* 🔥 CONTENT */}
      <div className="mt-2 mb-7 px-6">
        
        {/* 🎵 NEW SONGS */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-2xl font-semibold">
            Newest Songs 🚀
          </h1>
        </div>

        <PageContent songs={songs} />

        {/* 🔥 RECENTLY PLAYED */}
        {recentSongs?.length > 0 && (
          <div id="recent" className="mt-12">
            <h2 className="text-white text-2xl font-semibold mb-5">
              Recently Played 🕒
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentSongs.map((song: any) => (
                <div
                  key={song.id}
                  className="w-[180px] flex-shrink-0 bg-neutral-800/40 p-4 rounded-xl hover:bg-neutral-700 transition cursor-pointer group"
                >
                  {/* 🎵 IMAGE */}
                  <div className="relative aspect-square rounded-md overflow-hidden">
                    <img
                      src={getImageUrl(song?.image_path)}
                      alt="cover"
                      className="object-cover w-full h-full"
                    />

                    {/* ▶ PLAY */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
                      <div className="bg-green-500 p-3 rounded-full shadow-lg">
                        ▶
                      </div>
                    </div>
                  </div>

                  {/* 🎶 INFO */}
                  <p className="mt-3 text-white truncate font-medium">
                    {song?.title}
                  </p>
                  <p className="text-sm text-neutral-400 truncate">
                    {song?.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 MADE FOR YOU */}
        <div className="mt-12">
          <h2 className="text-white text-2xl font-semibold mb-5">
            Made For You 🎯
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {songs.slice(0, 6).map((song: any) => (
              <div
                key={song.id}
                className="bg-neutral-800/40 p-4 rounded-xl hover:bg-neutral-700 transition cursor-pointer group"
              >
                <div className="relative aspect-square rounded-md overflow-hidden">
                  <img
                    src={getImageUrl(song?.image_path)}
                    alt="cover"
                    className="object-cover w-full h-full"
                  />

                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-green-500 p-3 rounded-full shadow-lg">
                      ▶
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-white truncate font-medium">
                  {song?.title}
                </p>
                <p className="text-sm text-neutral-400 truncate">
                  {song?.author}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}