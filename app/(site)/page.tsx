import { getSongs }          from '@/actions/getSongs';
import { getRecentlyPlayed } from '@/actions/getRecentlyPlayed';

import { Header }      from '@/components/Header';
import { ListItem }    from '@/components/ListItem';
import { PageContent } from './components/PageContent';
import { SongCard }    from '@/components/SongCard';

export const revalidate = 0;

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '/images/liked.png';
  return `https://nquzpenqnbkymnmwrwqt.supabase.co/storage/v1/object/public/images/${path}`;
};

export default async function Home() {
  const songs       = await getSongs();
  const recentSongs = await getRecentlyPlayed();

  return (
    <div
      className="rounded-lg h-full w-full overflow-hidden overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <Header>
        <div className="mb-4 flex flex-col items-center">

          {/* THEME-AWARE LOGO — white logo for dark, black logo for light */}
          <img
            src="/images/logo.png"
            alt="Spotify"
            className="theme-logo-white h-14 mb-2 hover:scale-105 transition"
          />
          <img
            src="/images/logo_black.png"
            alt="Spotify"
            className="theme-logo-black h-14 mb-2 hover:scale-105 transition"
          />

          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight text-center mt-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome back 👋
          </h1>
          <p className="mt-2 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
            Your vibe. Your music. 🎧
          </p>

          {/* QUICK CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-6 w-full">
            <ListItem image="/images/liked.png" name="❤️ Liked Songs"     href="/liked" />
            <ListItem image="/images/liked.png" name="🔥 Trending"        href="/" />
            <ListItem image="/images/liked.png" name="🎧 Recently Played" href="#recent" />
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">

        <h1 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Newest Songs 🚀
        </h1>
        <PageContent songs={songs} />

        {/* RECENTLY PLAYED */}
        <div id="recent" className="mt-12">
          <h2 className="text-2xl font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            Recently Played 🕒
          </h2>
          {!recentSongs || recentSongs.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recently played songs</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {recentSongs.map((song: any) => (
                <div key={song.id} className="w-[180px] flex-shrink-0">
                  <SongCard imageUrl={getImageUrl(song?.image_path)} title={song?.title} author={song?.author} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MADE FOR YOU */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            Made For You 🎯
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {songs.slice(0, 6).map((song: any) => (
              <SongCard key={song.id} imageUrl={getImageUrl(song?.image_path)} title={song?.title} author={song?.author} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}