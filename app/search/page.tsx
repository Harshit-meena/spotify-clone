import { getSongsByTitle } from '@/actions/getSongsByTitle';

import { Header } from '@/components/Header';
import { SearchInput } from '@/components/SearchInput';

import { SearchContent } from './components/SearchContent';

export const revalidate = 0;

interface SearchProps {
  searchParams: {
    title: string;
  };
}

const Search = async ({ searchParams }: SearchProps) => {
  const songs = await getSongsByTitle(searchParams.title);

  return (
    <div
      className="
        bg-neutral-900
        rounded-lg
        h-full
        w-full
        overflow-hidden
        overflow-y-auto
      "
    >
      {/* 🔥 HEADER */}
      <Header className="bg-gradient-to-b from-purple-800 via-neutral-900 to-black">
        <div className="mb-4 flex flex-col gap-y-6">
          
          {/* 🎯 TITLE */}
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight">
            Search 🔍
          </h1>

          {/* 🔎 SEARCH BAR */}
          <div className="max-w-lg">
            <SearchInput />
          </div>

          {/* 🔥 QUICK TAGS */}
          <div className="flex gap-3 flex-wrap">
            <span className="bg-neutral-800 px-4 py-2 rounded-full text-sm hover:bg-neutral-700 cursor-pointer">
              🎧 Chill
            </span>
            <span className="bg-neutral-800 px-4 py-2 rounded-full text-sm hover:bg-neutral-700 cursor-pointer">
              🔥 Trending
            </span>
            <span className="bg-neutral-800 px-4 py-2 rounded-full text-sm hover:bg-neutral-700 cursor-pointer">
              ❤️ Love
            </span>
            <span className="bg-neutral-800 px-4 py-2 rounded-full text-sm hover:bg-neutral-700 cursor-pointer">
              🎵 Pop
            </span>
          </div>
        </div>
      </Header>

      {/* 🔥 CONTENT */}
      <div className="px-6 pb-10">
        
        {/* 🎵 RESULT TITLE */}
        {searchParams.title && (
          <h2 className="text-white text-xl font-semibold mb-4">
            Results for "{searchParams.title}"
          </h2>
        )}

        {/* ❌ NO RESULTS */}
        {songs.length === 0 ? (
          <div className="text-neutral-400 text-center mt-20">
            <p className="text-lg">No songs found 😢</p>
            <p className="text-sm mt-2">Try searching something else</p>
          </div>
        ) : (
          <>
            {/* 🔥 GRID RESULTS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              <SearchContent songs={songs} />
            </div>

            {/* 🔥 EXTRA SECTION */}
            <div className="mt-12">
              <h2 className="text-white text-xl font-semibold mb-4">
                You might also like 🎯
              </h2>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {songs.slice(0, 8).map((song) => (
                  <div
                    key={song.id}
                    className="
                      min-w-[180px]
                      bg-neutral-800/50
                      p-3
                      rounded-lg
                      hover:bg-neutral-700
                      transition
                      cursor-pointer
                    "
                  >
                    <img
                      src="/images/liked.png"
                      className="rounded mb-3"
                    />
                    <p className="text-sm font-medium truncate">
                      {song.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {song.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;