'use client';

import { useEffect, useState } from 'react';
import { Song } from '@/types';
import { usePlayer } from '@/hooks/usePlayer';

import { BsPauseFill, BsPlayFill }        from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2';
import { RiRepeat2Line, RiShuffleLine }   from 'react-icons/ri';

import { MediaItem }  from './MediaItem';
import { LikeButton } from './LikeButton';
import { Slider }     from './Slider';

import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerContentProps {
  song: Song;
  songUrl: string;
  onOpenFull?: () => void;
}

export const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl, onOpenFull }) => {
  const player = usePlayer();

  const [volume,    setVolume]    = useState(player.volume ?? 0.7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [duration,  setDuration]  = useState(0);
  const [isMuted,   setIsMuted]   = useState(false);
  const [barHeights, setBarHeights] = useState([6, 10, 7, 14, 9]);

  const Icon       = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = isMuted || volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    const idx  = player.ids.findIndex((id) => id === player.activeId);
    const next = player.ids[idx + 1];
    player.setId(next || player.ids[0]);
  };

  const onPlayPrev = () => {
    const idx  = player.ids.findIndex((id) => id === player.activeId);
    const prev = player.ids[idx - 1];
    player.setId(prev || player.ids[player.ids.length - 1]);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: isMuted ? 0 : volume,
    onplay:  () => setIsPlaying(true),
    onend:   () => { setIsPlaying(false); onPlayNext(); },
    onpause: () => setIsPlaying(false),
    format: ['mp3'],
  });

  useEffect(() => { sound?.play(); return () => sound?.unload(); }, [sound]);
  useEffect(() => { if (sound) sound.volume(isMuted ? 0 : volume); }, [volume, isMuted, sound]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        const seek = sound.seek([]) as number;
        const dur  = sound.duration();
        if (seek && dur) { setProgress(seek); setDuration(dur); }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [sound]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBarHeights(prev => prev.map(() => Math.floor(Math.random() * 16) + 4));
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => { isPlaying ? pause() : play(); };
  const handleSeek = (value: number) => { sound?.seek([value]); setProgress(value); };
  const toggleMute = () => setIsMuted(m => !m);
  const progressPercent = duration ? (progress / duration) * 100 : 0;

  const formatTime = (time: number) => {
    if (!time) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      {/* PROGRESS BAR — top strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{ background: 'var(--border-subtle)' }}
      >
        <motion.div
          className="h-full"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, var(--green), #4ade80)',
          }}
          transition={{ ease: 'linear' }}
        />
      </div>

      <div className="grid grid-cols-3 h-full items-center px-4 gap-2">

        {/* LEFT — song info */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenFull}
            className="relative flex-shrink-0 cursor-pointer"
          >
            <div
              className="w-12 h-12 rounded-lg overflow-hidden"
              style={{ boxShadow: 'var(--card-shadow)' }}
            >
              <MediaItem data={song} />
            </div>
            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }}
              />
            )}
          </motion.div>

          <div className="min-w-0 flex flex-col gap-0.5">
            <p
              className="text-sm font-semibold truncate leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {song.title}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {song.author}
            </p>
          </div>

          <div className="flex-shrink-0 ml-1">
            <LikeButton songId={song.id} />
          </div>
        </div>

        {/* CENTER — controls */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4">

            <motion.button
              whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={() => player.toggleShuffle?.()}
              className="hidden md:flex"
              style={{ color: player.isShuffle ? 'var(--green)' : 'var(--text-muted)' }}
            >
              <RiShuffleLine size={17} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={onPlayPrev}
              style={{ color: 'var(--text-secondary)' }}
            >
              <AiFillStepBackward size={24} />
            </motion.button>

            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              onClick={handlePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--green), var(--green-dark))',
                boxShadow:  isPlaying
                  ? '0 0 20px var(--green-glow)'
                  : '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isPlaying ? 'pause' : 'play'}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1,   opacity: 1 }}
                  exit={{    scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <Icon size={20} className="text-black" style={{ marginLeft: isPlaying ? 0 : 1 }} />
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={onPlayNext}
              style={{ color: 'var(--text-secondary)' }}
            >
              <AiFillStepForward size={24} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              onClick={() => player.toggleRepeat?.()}
              className="hidden md:flex"
              style={{
                color: player.repeatMode && player.repeatMode !== 'off'
                  ? 'var(--green)'
                  : 'var(--text-muted)',
              }}
            >
              <RiRepeat2Line size={17} />
            </motion.button>
          </div>

          {/* Seek bar */}
          <div className="hidden md:flex items-center gap-2 w-full max-w-[380px]">
            <span
              className="text-[10px] tabular-nums"
              style={{ color: 'var(--text-muted)', minWidth: 28, textAlign: 'right' }}
            >
              {formatTime(progress)}
            </span>

            <div
              className="flex-1 relative h-1 rounded-full overflow-hidden cursor-pointer group"
              style={{ background: 'var(--border-default)' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleSeek(((e.clientX - rect.left) / rect.width) * duration);
              }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, var(--green), #4ade80)',
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 5px)` }}
              />
            </div>

            <span
              className="text-[10px] tabular-nums"
              style={{ color: 'var(--text-muted)', minWidth: 28 }}
            >
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* RIGHT — volume + equalizer */}
        <div className="hidden md:flex justify-end items-center gap-3">
          {/* Equalizer bars */}
          <div className="flex items-end gap-[3px] h-4 mr-1">
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying ? h : 4 }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
                style={{
                  width: 3, borderRadius: 2,
                  background: 'var(--green)',
                  minHeight: 4, opacity: 0.7,
                }}
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            style={{ color: 'var(--text-muted)' }}
          >
            <VolumeIcon size={20} />
          </motion.button>

          <div className="w-[90px]">
            <Slider
              value={isMuted ? 0 : volume}
              max={1}
              step={0.01}
              onChange={(val) => { setVolume(val); setIsMuted(false); }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};