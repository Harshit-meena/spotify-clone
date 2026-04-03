'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useOnPlay } from '@/hooks/useOnPlay';
import { useLoadImage } from '@/hooks/useLoadImage';

// --- SUB-COMPONENT: SongItem ---
// This fixes the "Rules of Hooks" error by calling useLoadImage at the top level
const SongItem = ({ item, onPlay, removeSong }: any) => {
  const imagePath = useLoadImage(item.songs);

  return (
    <div className="flex items-center gap-x-4 bg-neutral-800/50 p-3 rounded-md hover:bg-neutral-700/50 transition group">
      <div className="relative h-12 w-12 min-h-[48px] min-w-[48px]">
        <Image
          fill
          src={imagePath || '/images/liked.png'}
          alt="Song cover"
          className="object-cover rounded"
        />
      </div>

      <div
        onClick={() => onPlay(item.songs.id)}
        className="flex-1 cursor-pointer truncate"
      >
        <p className="font-semibold truncate">{item.songs.title}</p>
        <p className="text-sm text-neutral-400 truncate">
          {item.songs.author}
        </p>
      </div>

      <button
        onClick={() => removeSong(item.id)}
        className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition px-2"
      >
        ✕
      </button>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const PlaylistPage = ({ params }: { params: { id: string } }) => {
  const supabase = createClientComponentClient();

  const [songs, setSongs] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [editing, setEditing] = useState(false);

  // 1. Memoize fetchSongs so it can be a useEffect dependency
  const fetchSongs = useCallback(async () => {
    const { data } = await supabase
      .from('playlist_songs')
      .select('id, songs(*)')
      .eq('playlist_id', params.id);

    setSongs(data || []);
  }, [supabase, params.id]);

  // 2. Memoize fetchPlaylist so it can be a useEffect dependency
  const fetchPlaylist = useCallback(async () => {
    const { data } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) setPlaylistName(data.name);
  }, [supabase, params.id]);

  useEffect(() => {
    fetchSongs();
    fetchPlaylist();
  }, [fetchSongs, fetchPlaylist]); // ✅ Dependencies now correctly tracked

  // 3. Initialize the play hook with the loaded songs
  const onPlay = useOnPlay(songs.map((s) => s.songs));

  const removeSong = async (id: string) => {
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('id', id);
    
    if (!error) fetchSongs();
  };

  const updatePlaylistName = async () => {
    await supabase
      .from('playlists')
      .update({ name: playlistName })
      .eq('id', params.id);

    setEditing(false);
  };

  return (
    <div className="text-white h-full w-full overflow-hidden overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-b from-pink-600 via-red-500 to-neutral-900 p-6 flex items-end gap-x-6">
        <div className="relative h-40 w-40 shadow-2xl">
          <Image
            fill
            src="/images/liked.png"
            alt="Playlist"
            className="object-cover rounded-md"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <p className="hidden md:block font-semibold text-sm">Playlist</p>
          {editing ? (
            <div className="flex gap-x-2 items-center">
              <input
                autoFocus
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                onBlur={updatePlaylistName}
                className="bg-black/20 text-4xl md:text-6xl font-bold px-2 py-1 rounded outline-none w-full"
              />
            </div>
          ) : (
            <h1
              onClick={() => setEditing(true)}
              className="text-4xl md:text-6xl font-bold cursor-pointer hover:opacity-80 transition"
            >
              {playlistName}
            </h1>
          )}
          <p className="text-neutral-200 text-sm">
            {songs.length} songs
          </p>
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {songs.length === 0 ? (
            <p className="text-neutral-400 italic">No songs in this playlist yet.</p>
          ) : (
            songs.map((item) => (
              <SongItem
                key={item.id}
                item={item}
                onPlay={onPlay}
                removeSong={removeSong}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;