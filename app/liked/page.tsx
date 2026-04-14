import Image from 'next/image';
import { getLikedSongs } from '@/actions/getLikedSongs';
import { Header }        from '@/components/Header';
import { LikedContent }  from './components/LikedContent';

export const revalidate = 0;

const Liked = async () => {
  const songs = await getLikedSongs();

  return (
    <div
      className="rounded-lg h-full w-full overflow-hidden overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <Header>
        <div className="mt-10">
          <div className="flex flex-col md:flex-row items-center gap-x-6 gap-y-4">

            {/* COVER */}
            <div
              className="relative h-36 w-36 lg:h-48 lg:w-48 rounded-xl overflow-hidden flex-shrink-0"
              style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}
            >
              <Image fill alt="Liked Songs" className="object-cover" src="/images/liked.png" />
            </div>

            {/* INFO */}
            <div className="flex flex-col gap-y-2">
              <p
                className="hidden md:block font-semibold text-xs uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Playlist
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Liked Songs
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                {songs.length} {songs.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        </div>
      </Header>

      <LikedContent songs={songs} />
    </div>
  );
};

export default Liked;