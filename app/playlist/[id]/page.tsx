'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient }      from '@supabase/auth-helpers-nextjs';
import Image    from 'next/image';
import { motion } from 'framer-motion';
import { useOnPlay }    from '@/hooks/useOnPlay';
import { useLoadImage } from '@/hooks/useLoadImage';
import { BsPlayFill }   from 'react-icons/bs';

const SongRow = ({ item, onPlay, removeSong }: any) => {
  const imagePath = useLoadImage(item.songs);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-x-4 p-3 rounded-xl transition-all group"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-subtle)' }}
      onMouseEnter={e => {
        e.currentTarget.style.background  = 'var(--card-hover)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background  = 'var(--card-bg)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div className="relative h-12 w-12 min-w-[48px] rounded-lg overflow-hidden">
        <Image fill src={imagePath || '/images/liked.png'} alt="cover" className="object-cover" />
      </div>

      <div onClick={() => onPlay(item.songs.id)} className="flex-1 cursor-pointer min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
          {item.songs.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {item.songs.author}
        </p>
      </div>

      <motion.button
        onClick={() => onPlay(item.songs.id)}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--green)', boxShadow: '0 4px 12px var(--green-glow)' }}
      >
        <BsPlayFill size={14} className="text-black ml-0.5" />
      </motion.button>

      <button
        onClick={() => removeSong(item.id)}
        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ color: 'rgba(239,68,68,0.8)', background: 'var(--bg-glass-hover)' }}
      >
        ✕
      </button>
    </motion.div>
  );
};

const PlaylistPage = ({ params }: { params: { id: string } }) => {
  const supabase = createClientComponentClient();

  const [songs, setSongs]               = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [editing, setEditing]           = useState(false);

  const fetchSongs = useCallback(async () => {
    const { data } = await supabase
      .from('playlist_songs').select('id, songs(*)').eq('playlist_id', params.id);
    setSongs(data || []);
  }, [supabase, params.id]);

  const fetchPlaylist = useCallback(async () => {
    const { data } = await supabase
      .from('playlists').select('*').eq('id', params.id).single();
    if (data) setPlaylistName(data.name);
  }, [supabase, params.id]);

  useEffect(() => { fetchSongs(); fetchPlaylist(); }, [fetchSongs, fetchPlaylist]);

  const onPlay    = useOnPlay(songs.map((s) => s.songs));
  const removeSong = async (id: string) => {
    await supabase.from('playlist_songs').delete().eq('id', id);
    fetchSongs();
  };

  const updatePlaylistName = async () => {
    await supabase.from('playlists').update({ name: playlistName }).eq('id', params.id);
    setEditing(false);
  };

  return (
    <div
      className="h-full w-full overflow-hidden overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* HERO HEADER */}
      <div
        className="p-8 flex flex-col md:flex-row items-end gap-6"
        style={{
          background: 'linear-gradient(180deg, rgba(236,72,153,0.3) 0%, var(--bg-primary) 100%)',
        }}
      >
        <div
          className="relative h-44 w-44 rounded-2xl overflow-hidden flex-shrink-0"
          style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}
        >
          <Image fill src="/images/liked.png" alt="Playlist" className="object-cover" />
        </div>

        <div className="flex flex-col gap-y-2">
          <p
            className="font-semibold text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Playlist
          </p>

          {editing ? (
            <input
              autoFocus
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
              onBlur={updatePlaylistName}
              onKeyDown={e => e.key === 'Enter' && updatePlaylistName()}
              className="bg-transparent text-4xl md:text-5xl font-black outline-none border-b-2 pb-1"
              style={{
                color:       'var(--text-primary)',
                borderColor: 'var(--green)',
              }}
            />
          ) : (
            <h1
              onClick={() => setEditing(true)}
              className="text-4xl md:text-5xl font-black cursor-pointer hover:opacity-80 transition"
              style={{ color: 'var(--text-primary)' }}
            >
              {playlistName}
            </h1>
          )}

          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
          </p>
        </div>
      </div>

      {/* SONGS LIST */}
      <div className="p-6">
        {songs.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl"
            style={{ background: 'var(--card-bg)', border: '1px dashed var(--border-default)' }}
          >
            <span className="text-5xl mb-4">🎵</span>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              No songs in this playlist yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {songs.map((item) => (
              <SongRow key={item.id} item={item} onPlay={onPlay} removeSong={removeSong} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;