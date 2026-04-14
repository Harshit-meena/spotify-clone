import { getSongsByTitle } from '@/actions/getSongsByTitle';
import { Header } from '@/components/Header';
import SearchInput from '@/components/SearchInput';
import { SearchContent } from './components/SearchContent';

export const revalidate = 0;

interface SearchProps {
  searchParams: { title: string };
}

const Search = async ({ searchParams }: SearchProps) => {
  const songs = await getSongsByTitle(searchParams?.title || '');

  return (
    <div
      className="rounded-lg h-full w-full overflow-hidden overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <Header>
        <div className="flex flex-col items-center gap-5 py-6">

          {/* SEARCH BAR */}
          <div className="w-full max-w-2xl relative">
            <div
              className="relative rounded-full overflow-hidden"
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-default)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <SearchInput />
            </div>
          </div>

          {/* ✅ FIXED (NO EVENTS) */}
          <div className="flex gap-2 flex-wrap justify-center">
            {['🔥 Trending', '🎧 Chill', '💔 Sad', '🚗 Drive', '💃 Party'].map((item) => (
              <div
                key={item}
                className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all hover:opacity-80"
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                {item}
              </div>
            ))}
          </div>

        </div>
      </Header>

      {/* RESULTS */}
      <div className="px-6 pb-10">
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          🎵 Results
        </h2>

        <SearchContent songs={songs} />
      </div>
    </div>
  );
};

export default Search;