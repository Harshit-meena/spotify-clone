'use client';

import { Song } from '@/types';
import Image from 'next/image';
import { useLoadImage } from '@/hooks/useLoadImage';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@supabase/auth-helpers-react';
import { BsPlayFill } from 'react-icons/bs';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdPlaylistAdd } from 'react-icons/md';

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
  isActive?: boolean;
}

export const SongItem: React.FC<SongItemProps> = ({ data, onClick, isActive }) => {
  const imagePath  = useLoadImage(data);
  const supabase   = createClientComponentClient();
  const user       = useUser();

  const [playlists,  setPlaylists]  = useState<any[]>([]);
  const [showMenu,   setShowMenu]   = useState(false);
  const [isLiked,    setIsLiked]    = useState(false);
  const [isHovered,  setIsHovered]  = useState(false);
  const [likeAnim,   setLikeAnim]   = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const checkLiked = async () => {
      const { data: likedData } = await supabase
        .from('liked_songs').select('*')
        .eq('user_id', user.id).eq('song_id', data.id).maybeSingle();
      setIsLiked(!!likedData);
    };
    checkLiked();
  }, [user?.id, data.id, supabase]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchPlaylists = async () => {
      const { data: pd } = await supabase.from('playlists').select('*').eq('user_id', user.id);
      if (pd) setPlaylists(pd);
    };
    fetchPlaylists();
  }, [supabase, user?.id]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return;
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    if (isLiked) {
      await supabase.from('liked_songs').delete().eq('user_id', user.id).eq('song_id', data.id);
      setIsLiked(false);
    } else {
      await supabase.from('liked_songs').insert({ user_id: user.id, song_id: data.id });
      setIsLiked(true);
    }
  };

  const addToPlaylist = async (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('playlist_songs').insert({ playlist_id: playlistId, song_id: data.id });
    setShowMenu(false);
  };

  const saveRecentlyPlayed = async (songId: string) => {
    if (!user?.id) return;
    await supabase.from('recently_played').delete().eq('user_id', user.id).eq('song_id', songId);
    await supabase.from('recently_played').insert({ user_id: user.id, song_id: songId });
  };

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(data.id);
    await saveRecentlyPlayed(data.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => { onClick(data.id); saveRecentlyPlayed(data.id); }}
      className="relative group cursor-pointer flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: isActive
          ? 'linear-gradient(145deg, rgba(29,185,84,0.15), rgba(29,185,84,0.05))'
          : 'var(--card-bg)',
        border: isActive
          ? '1px solid rgba(29,185,84,0.35)'
          : '1px solid var(--border-subtle)',
        boxShadow: isHovered ? 'var(--card-shadow)' : '0 2px 8px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        padding: '12px',
      }}
    >
      {/* IMAGE */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 flex-shrink-0">
        <Image
          src={imagePath || '/images/liked.png'}
          fill
          className="object-cover"
          alt={data.title}
          style={{
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* PREMIUM BADGE */}
        {data?.is_premium && (
          <div
            className="absolute top-2 left-2 text-xs font-black px-2 py-0.5 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              color: 'black', fontSize: 10, letterSpacing: '0.05em',
            }}
          >
            PREMIUM
          </div>
        )}

        {/* LIKE BUTTON */}
        <motion.button
          onClick={toggleLike}
          animate={{ scale: likeAnim ? [1, 1.5, 0.9, 1] : 1 }}
          transition={{ duration: 0.35 }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center z-10"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            opacity: isHovered || isLiked ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          {isLiked
            ? <FaHeart    size={12} style={{ color: '#1DB954' }} />
            : <FaRegHeart size={12} className="text-white" />
          }
        </motion.button>

        {/* PLAY BUTTON */}
        <motion.button
          onClick={handlePlay}
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.18 }}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center z-10"
          style={{
            background: 'linear-gradient(135deg, #1DB954, #17a349)',
            boxShadow: '0 4px 20px rgba(29,185,84,0.6)',
          }}
        >
          <BsPlayFill size={18} className="text-black ml-0.5" />
        </motion.button>

        {/* Active equalizer */}
        {isActive && (
          <div className="absolute bottom-2 left-2 flex items-end gap-[2px] h-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="eq-bar w-[3px] rounded-full"
                style={{ background: '#1DB954', height: '100%', animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* INFO + ACTIONS */}
      <div className="flex items-start justify-between gap-1 px-1">
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-bold truncate leading-tight"
            style={{ color: isActive ? 'var(--green)' : 'var(--text-primary)' }}
          >
            {data.title}
          </p>
          {/* ✅ artist name — always visible in both themes */}
          <p
            className="text-xs truncate mt-0.5 font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            {data.author}
          </p>
        </div>

        {/* DOTS MENU */}
        <div className="relative flex-shrink-0">
          <motion.button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            whileTap={{ scale: 0.9 }}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              opacity: isHovered || showMenu ? 1 : 0,
              transition: 'opacity 0.2s',
              background: 'var(--bg-glass-hover)',
            }}
          >
            <HiDotsHorizontal size={14} style={{ color: 'var(--text-primary)' }} />
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 6 }}
                animate={{ opacity: 1, scale: 1,    y: 0 }}
                exit={{   opacity: 0, scale: 0.88,  y: 6 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-8 min-w-[160px] rounded-xl p-1.5 z-50"
                style={{
                  background: 'var(--modal-bg)',
                  border: '1px solid var(--border-default)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <p
                  className="text-xs px-2 py-1 mb-1 font-semibold"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Add to playlist
                </p>
                {playlists.length === 0 ? (
                  <p className="text-xs px-2 py-1.5" style={{ color: 'var(--text-muted)' }}>
                    No playlists yet
                  </p>
                ) : (
                  playlists.map((p) => (
                    <button
                      key={p.id}
                      onClick={(e) => addToPlaylist(p.id, e)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 transition"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(29,185,84,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <MdPlaylistAdd size={14} style={{ color: 'var(--green)' }} />
                      {p.name}
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};