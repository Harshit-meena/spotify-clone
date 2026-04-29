'use client';

import { Song } from '@/types';
import Image from 'next/image';
import { useLoadImage }    from '@/hooks/useLoadImage';
import { useSubscription } from '@/hooks/useSubscription';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState }   from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser }         from '@supabase/auth-helpers-react';
import { BsPlayFill }      from 'react-icons/bs';
import { FaHeart, FaRegHeart, FaLock } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdPlaylistAdd }   from 'react-icons/md';
import { useRouter }       from 'next/navigation';

interface SongItemProps {
  data:      Song;
  onClick:   (id: string) => void;
  isActive?: boolean;
}

export const SongItem: React.FC<SongItemProps> = ({ data, onClick, isActive }) => {
  const imagePath  = useLoadImage(data);
  const supabase   = createClientComponentClient();
  const user       = useUser();
  const router     = useRouter();
  const { isPremium } = useSubscription();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showMenu,  setShowMenu]  = useState(false);
  const [isLiked,   setIsLiked]   = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [likeAnim,  setLikeAnim]  = useState(false);
  const [showLock,  setShowLock]  = useState(false);

  // Is this song locked for this user?
  const isLocked = !!data?.is_premium && !isPremium;

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
    if (isLocked) { setShowLock(true); setTimeout(() => setShowLock(false), 2500); return; }
    onClick(data.id);
    await saveRecentlyPlayed(data.id);
  };

  const handleCardClick = () => {
    if (isLocked) { setShowLock(true); setTimeout(() => setShowLock(false), 2500); return; }
    onClick(data.id);
    saveRecentlyPlayed(data.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="relative group cursor-pointer flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: isActive
          ? 'linear-gradient(145deg, rgba(29,185,84,0.15), rgba(29,185,84,0.05))'
          : isLocked
          ? 'var(--bg-elevated)'
          : 'var(--card-bg)',
        border: isActive
          ? '1px solid rgba(29,185,84,0.35)'
          : isLocked
          ? '1px solid var(--border-default)'
          : '1px solid var(--border-subtle)',
        boxShadow: isHovered ? 'var(--card-shadow)' : '0 2px 8px rgba(0,0,0,0.06)',
        transform:  isHovered && !isLocked ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        padding:    '12px',
        opacity:    isLocked ? 0.75 : 1,
      }}
    >
      {/* LOCK TOOLTIP */}
      <AnimatePresence>
        {showLock && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: 8 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl gap-2"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
            onClick={e => { e.stopPropagation(); router.push('/premium'); }}
          >
            <FaLock size={22} style={{ color: '#f59e0b' }} />
            <p className="text-xs font-bold text-white text-center px-2">
              Premium only
            </p>
            <span
              className="text-[10px] px-3 py-1 rounded-full font-bold"
              style={{ background: 'var(--green)', color: '#000' }}
            >
              Upgrade →
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMAGE */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 flex-shrink-0">
        <Image
          src={imagePath || '/images/liked.png'}
          fill className="object-cover" alt={data.title}
          style={{
            transform:  isHovered && !isLocked ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.4s ease',
            filter:     isLocked ? 'brightness(0.6)' : 'none',
          }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* PREMIUM BADGE */}
        {data?.is_premium && (
          <div
            className="absolute top-2 left-2 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', color: '#000', fontSize: 9 }}
          >
            {isLocked ? <FaLock size={8} /> : '★'} PREMIUM
          </div>
        )}

        {/* LIKE BUTTON */}
        <motion.button
          onClick={toggleLike}
          animate={{ scale: likeAnim ? [1, 1.5, 0.9, 1] : 1 }}
          transition={{ duration: 0.35 }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center z-10"
          style={{
            background:     'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            opacity:        isHovered || isLiked ? 1 : 0,
            transition:     'opacity 0.2s',
          }}
        >
          {isLiked
            ? <FaHeart    size={12} style={{ color: 'var(--green)' }} />
            : <FaRegHeart size={12} className="text-white" />
          }
        </motion.button>

        {/* PLAY / LOCK BUTTON */}
        <motion.button
          onClick={handlePlay}
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.18 }}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center z-10"
          style={{
            background: isLocked
              ? 'linear-gradient(135deg,#f59e0b,#d97706)'
              : 'linear-gradient(135deg,#1DB954,#17a349)',
            boxShadow: isLocked
              ? '0 4px 20px rgba(245,158,11,0.5)'
              : '0 4px 20px rgba(29,185,84,0.6)',
          }}
        >
          {isLocked
            ? <FaLock    size={14} className="text-black" />
            : <BsPlayFill size={18} className="text-black ml-0.5" />
          }
        </motion.button>

        {/* Active EQ */}
        {isActive && (
          <div className="absolute bottom-2 left-2 flex items-end gap-[2px] h-4">
            {[0,1,2,3].map((i) => (
              <div key={i} className="eq-bar w-[3px] rounded-full"
                style={{ background: 'var(--green)', height: '100%', animationDelay: `${i*0.12}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex items-start justify-between gap-1 px-1">
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-bold truncate leading-tight"
            style={{ color: isActive ? 'var(--green)' : 'var(--text-primary)' }}
          >
            {data.title}
          </p>
          <p className="text-xs truncate mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
            {data.author}
          </p>
        </div>

        {/* DOTS MENU */}
        {!isLocked && (
          <div className="relative flex-shrink-0">
            <motion.button
              onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
              whileTap={{ scale: 0.9 }}
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                opacity:    isHovered || showMenu ? 1 : 0,
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
                  onClick={e => e.stopPropagation()}
                  className="absolute right-0 bottom-8 min-w-[160px] rounded-xl p-1.5 z-50"
                  style={{
                    background:     'var(--modal-bg)',
                    border:         '1px solid var(--border-default)',
                    backdropFilter: 'blur(20px)',
                    boxShadow:      'var(--card-shadow)',
                  }}
                >
                  <p className="text-xs px-2 py-1 mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Add to playlist
                  </p>
                  {playlists.length === 0 ? (
                    <p className="text-xs px-2 py-1.5" style={{ color: 'var(--text-muted)' }}>No playlists yet</p>
                  ) : (
                    playlists.map(p => (
                      <button
                        key={p.id}
                        onClick={e => addToPlaylist(p.id, e)}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-sm flex items-center gap-2"
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
        )}
      </div>
    </motion.div>
  );
};