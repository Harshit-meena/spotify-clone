'use client';
 
import { Song } from '@/types';
import Image from 'next/image';
import { useLoadImage } from '@/hooks/useLoadImage';
import { Slider } from './Slider';
import { usePlayer } from '@/hooks/usePlayer';
 
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { RiRepeat2Line, RiShuffleLine } from 'react-icons/ri';
import { FaHeart } from 'react-icons/fa';
import { IoMdClose, IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io';
import { MdQueueMusic } from 'react-icons/md';
 
import useSound from 'use-sound';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
 
interface FullPlayerProps {
  song: Song;
  songUrl: string;
  onClose: () => void;
}
 
export const FullPlayer: React.FC<FullPlayerProps> = ({ song, songUrl, onClose }) => {
  const image = useLoadImage(song);
  const player = usePlayer();
 
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [volume, setVolume] = useState(player.volume ?? 0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [barHeights, setBarHeights] = useState([4, 8, 5, 12, 7, 10, 6, 9, 4, 11]);
 
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
 
  const [play, { pause, sound }] = useSound(songUrl, {
    volume: isMuted ? 0 : volume,
    html5: true,
    format: ['mp3'],
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onend: () => player.playNext?.(),
  });
 
  useEffect(() => {
    if (!sound) return;
    play();
    return () => sound.unload();
  }, [sound, songUrl]);
 
  useEffect(() => {
    if (sound) sound.volume(isMuted ? 0 : volume);
  }, [volume, isMuted, sound]);
 
  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        const seek = sound.seek([]) as number;
        const dur = sound.duration();
        if (seek && dur) { setProgress(seek); setDuration(dur); }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [sound]);
 
  // Animated equalizer bars
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBarHeights(prev => prev.map(() => Math.floor(Math.random() * 20) + 4));
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);
 
  const handleSeek = (value: number) => { sound?.seek([value]); setProgress(value); };
  const togglePlay = () => { isPlaying ? pause() : play(); };
  const formatTime = (time: number) => {
    if (!time) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  const progressPercent = duration ? (progress / duration) * 100 : 0;
 
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {/* BACKGROUND LAYERS */}
        <div className="absolute inset-0">
          {/* Blurred album art background */}
          <div
            className="absolute inset-0 scale-125"
            style={{
              backgroundImage: `url(${image || '/images/liked.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(60px) saturate(180%)',
              opacity: 0.5,
            }}
          />
          {/* Deep dark overlay */}
          <div className="absolute inset-0 bg-black/75" />
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
          {/* Radial glow from center */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(29,185,84,0.08) 0%, transparent 70%)',
            }}
          />
        </div>
 
        {/* CLOSE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <IoMdClose size={20} className="text-white" />
        </motion.button>
 
        {/* MAIN CONTENT */}
        <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col items-center">
 
          {/* SONG NUMBER / NOW PLAYING LABEL */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="flex items-end gap-[3px] h-4">
              {barHeights.slice(0, 5).map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? h : 4 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  style={{
                    width: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(to top, #1DB954, #4ade80)',
                    minHeight: 4,
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: '#1DB954' }}>
              Now Playing
            </span>
            <div className="flex items-end gap-[3px] h-4">
              {barHeights.slice(5).map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? h : 4 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  style={{
                    width: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(to top, #1DB954, #4ade80)',
                    minHeight: 4,
                  }}
                />
              ))}
            </div>
          </motion.div>
 
          {/* VINYL / ALBUM ART */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180, delay: 0.1 }}
            className="relative mb-8"
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{
                boxShadow: isPlaying
                  ? ['0 0 40px 8px rgba(29,185,84,0.25)', '0 0 70px 16px rgba(29,185,84,0.15)', '0 0 40px 8px rgba(29,185,84,0.25)']
                  : '0 0 20px 4px rgba(29,185,84,0.1)',
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-3 rounded-full"
            />
 
            {/* Vinyl ring */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
              className="relative w-[260px] h-[260px]"
            >
              {/* Vinyl disc background */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'repeating-radial-gradient(circle, #111 0px, #1a1a1a 2px, #111 3px)',
                }}
              />
              {/* Album art centered */}
              <div className="absolute inset-[20%] rounded-full overflow-hidden" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                <Image
                  src={image || '/images/liked.png'}
                  fill
                  className="object-cover"
                  alt={song.title}
                />
              </div>
              {/* Center hole */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10"
                style={{ background: '#0a0a0a', boxShadow: '0 0 0 2px rgba(255,255,255,0.1)' }}
              />
            </motion.div>
          </motion.div>
 
          {/* SONG INFO */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full flex items-start justify-between mb-1"
          >
            <div className="flex-1 min-w-0 pr-3">
              <h1
                className="text-2xl font-black text-white truncate leading-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {song.title}
              </h1>
              <p className="text-sm mt-1 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {song.author}
              </p>
            </div>
 
            {/* LIKE BUTTON */}
            <motion.button
              whileTap={{ scale: 1.4 }}
              whileHover={{ scale: 1.15 }}
              onClick={() => setLiked(!liked)}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
              style={{
                background: liked ? 'rgba(29,185,84,0.15)' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${liked ? 'rgba(29,185,84,0.4)' : 'rgba(255,255,255,0.12)'}`,
              }}
            >
              <FaHeart size={16} className={liked ? 'text-green-400' : 'text-white/40'} />
            </motion.button>
          </motion.div>
 
          {/* PROGRESS BAR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full mt-5"
          >
            {/* Custom styled progress track */}
            <div className="relative w-full h-1 rounded-full mb-2 overflow-hidden cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const ratio = x / rect.width;
                handleSeek(ratio * duration);
              }}
            >
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #1DB954, #4ade80)',
                }}
              />
              {/* Scrub dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 6px)`, boxShadow: '0 0 6px rgba(255,255,255,0.5)' }}
              />
            </div>
            {/* Hidden Slider for accessibility / touch */}
            <div className="opacity-0 absolute pointer-events-none">
              <Slider value={progress} max={duration || 0} onChange={handleSeek} />
            </div>
            <div className="flex justify-between">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(progress)}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(duration)}
              </span>
            </div>
          </motion.div>
 
          {/* CONTROLS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between w-full mt-6 px-2"
          >
            {/* SHUFFLE */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => player.toggleShuffle?.()}
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{
                background: player.isShuffle ? 'rgba(29,185,84,0.15)' : 'transparent',
                color: player.isShuffle ? '#1DB954' : 'rgba(255,255,255,0.4)',
              }}
            >
              <RiShuffleLine size={20} />
            </motion.button>
 
            {/* PREV */}
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => player.playPrev?.()}
              className="text-white/70 hover:text-white"
            >
              <AiFillStepBackward size={30} />
            </motion.button>
 
            {/* PLAY / PAUSE */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              onClick={togglePlay}
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #1DB954 0%, #17a349 100%)',
                boxShadow: isPlaying
                  ? '0 0 30px rgba(29,185,84,0.5), 0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isPlaying ? 'pause' : 'play'}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <Icon size={28} className="text-black ml-0.5" />
                </motion.div>
              </AnimatePresence>
            </motion.button>
 
            {/* NEXT */}
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => player.playNext?.()}
              className="text-white/70 hover:text-white"
            >
              <AiFillStepForward size={30} />
            </motion.button>
 
            {/* REPEAT */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => player.toggleRepeat?.()}
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{
                background: player.repeatMode && player.repeatMode !== 'off' ? 'rgba(29,185,84,0.15)' : 'transparent',
                color: player.repeatMode && player.repeatMode !== 'off' ? '#1DB954' : 'rgba(255,255,255,0.4)',
              }}
            >
              <RiRepeat2Line size={20} />
              {player.repeatMode === 'one' && (
                <span className="absolute text-[8px] font-black" style={{ color: '#1DB954', marginTop: 12 }}>1</span>
              )}
            </motion.button>
          </motion.div>
 
          {/* VOLUME ROW */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 w-full mt-6"
          >
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMuted(!isMuted)}>
              {isMuted || volume === 0
                ? <IoMdVolumeOff size={18} className="text-white/40" />
                : <IoMdVolumeHigh size={18} className="text-white/40" />
              }
            </motion.button>
 
            <div className="flex-1 relative h-1 rounded-full overflow-hidden cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                setVolume(Math.max(0, Math.min(1, ratio)));
                setIsMuted(false);
              }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${(isMuted ? 0 : volume) * 100}%`,
                  background: 'rgba(255,255,255,0.5)',
                }}
              />
            </div>
          </motion.div>
 
        </div>
      </motion.div>
    </AnimatePresence>
  );
};