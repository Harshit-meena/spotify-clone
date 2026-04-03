'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useOnPlay } from '@/hooks/useOnPlay';
import Image from 'next/image';
import { useLoadImage } from '@/hooks/useLoadImage';

// ✅ NEW COMPONENT (HOOK yaha use hoga)
const SongItem = ({ item, onPlay, removeSong }: any) => {
  const imagePath = useLoadImage(item.songs); // ✅ CORRECT USAGE

  return (
    <div
      className="flex items-center gap-x-4 bg-neutral-800 p-3 rounded-md hover:bg-neutral-700 transition group"
    >
      {/* 🎵 IMAGE */}
      <div className="relative h-12 w-12">
        <Image
          fill
          src={imagePath || '/images/liked.png'}
          alt="Song"
          className="object-cover rounded"
        />
      </div>

      {/* 🎶 INFO */}
      <div
        onClick={() => onPlay(item.songs.id)}
        className="flex-1 cursor-pointer"
      >
        <p className="font-semibold">{item.songs.title}</p>
        <p className="text-sm text-neutral-400">
          {item.songs.author}
        </p>
      </div>

      {/* ❌ REMOVE */}
      <button
        onClick={() => removeSong(item.id)}
        className="text-red-400 opacity-0 group-hover:opacity-100 transition"
      >
        ✕
      </button>
    </div>
  );
};

const PlaylistPage = ({ params }: { params: { id: string } }) => {
  const supabase = createClientComponentClient();

  const [songs, setSongs] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState('❤️ My Playlist');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchSongs();
    fetchPlaylist();
  }, []);

  const fetchSongs = async () => {
    const { data } = await supabase
      .from('playlist_songs')
      .select('id, songs(*)')
      .eq('playlist_id', params.id);

    setSongs(data || []);
  };

  const fetchPlaylist = async () => {
    const { data } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) setPlaylistName(data.name);
  };

  const onPlay = useOnPlay(songs.map((s) => s.songs));

  const removeSong = async (id: string) => {
    await supabase.from('playlist_songs').delete().eq('id', id);
    fetchSongs();
  };

  const updatePlaylistName = async () => {
    await supabase
      .from('playlists')
      .update({ name: playlistName })
      .eq('id', params.id);

    setEditing(false);
  };

  return (
    <div className="text-white">

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-b from-pink-600 via-red-500 to-black p-6 flex items-end gap-x-6">

        <div className="relative h-40 w-40 shadow-lg">
          <Image
            fill
            src="/images/liked.png"
            alt="Playlist"
            className="object-cover rounded-md"
          />
        </div>

        <div>
          <p className="text-sm">Playlist</p>

          {editing ? (
            <div className="flex gap-x-2 items-center">
              <input
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="bg-black text-white px-2 py-1 rounded outline-none"
              />
              <button
                onClick={updatePlaylistName}
                className="bg-green-500 px-2 py-1 rounded"
              >
                💾
              </button>
            </div>
          ) : (
            <h1
              onClick={() => setEditing(true)}
              className="text-4xl font-bold cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
            >
              {playlistName}
            </h1>
          )}

          <p className="text-neutral-300 mt-2">
            {songs.length} songs
          </p>
        </div>
      </div>

      {/* 🔥 SONG LIST */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((item) => (
          <SongItem
            key={item.id}
            item={item}
            onPlay={onPlay}
            removeSong={removeSong}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;