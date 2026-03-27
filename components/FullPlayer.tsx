'use client';

import { Song } from '@/types';
import Image from 'next/image';
import { useLoadImage } from '@/hooks/useLoadImage';
import { Slider } from './Slider';
import { usePlayer } from '@/hooks/usePlayer';

import {
  BsPauseFill,
  BsPlayFill
} from 'react-icons/bs';

import {
  AiFillStepBackward,
  AiFillStepForward,
  AiOutlineSwap
} from 'react-icons/ai';

import { RiRepeat2Line } from 'react-icons/ri';
import { FaHeart } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

import useSound from 'use-sound';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FullPlayerProps {
  song: Song;
  songUrl: string;
  onClose: () => void;
}

export const FullPlayer: React.FC<FullPlayerProps> = ({
  song,
  songUrl,
  onClose
}) => {
  const image = useLoadImage(song);
  const player = usePlayer();

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;

  // 🔥 SOUND HOOK (CORRECT)
  const [play, { pause, sound }] = useSound(songUrl, {
    volume: player.volume,
    html5: true,
    format: ['mp3'],
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onend: () => player.playNext()
  });

  // 🔥 AUTO PLAY ON SONG CHANGE
  useEffect(() => {
    if (!sound) return;

    play();

    return () => {
      sound.unload();
    };
  }, [sound, songUrl]);

  // 🔊 VOLUME SYNC
  useEffect(() => {
    if (sound) {
      sound.volume(player.volume);
    }
  }, [player.volume, sound]);

  // ⏱ PROGRESS TRACKING
  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        const seek = sound.seek([]) as number;
        const dur = sound.duration();

        if (seek && dur) {
          setProgress(seek);
          setDuration(dur);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [sound]);

  // 🎯 SEEK
  const handleSeek = (value: number) => {
    sound?.seek([value]);
    setProgress(value);
  };

  // ▶ PLAY / PAUSE
  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // ⏱ FORMAT TIME
  const formatTime = (time: number) => {
    if (!time) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center text-white"
    >
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 blur-3xl scale-110 opacity-40"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center px-4">

        {/* CLOSE */}
        <div className="absolute top-4 left-4">
          <IoMdClose
            size={30}
            onClick={onClose}
            className="cursor-pointer bg-black/40 p-2 rounded-full"
          />
        </div>

        {/* IMAGE */}
        <div className="relative w-[260px] h-[260px] mb-8">
          <Image
            src={image || '/images/liked.png'}
            fill
            className="object-cover rounded-xl shadow-2xl"
            alt="cover"
          />
        </div>

        {/* INFO */}
        <h1 className="text-2xl font-bold">{song.title}</h1>

        <div className="flex items-center gap-3 mt-2">
          <p className="text-neutral-400">{song.author}</p>

          <motion.div whileTap={{ scale: 1.3 }}>
            <FaHeart
              onClick={() => setLiked(!liked)}
              className={`cursor-pointer ${
                liked ? 'text-green-500' : 'text-neutral-400'
              }`}
            />
          </motion.div>
        </div>

        {/* SEEK */}
        <div className="w-[300px] mt-6">
          <div className="flex items-center gap-2">
            <span className="text-xs">{formatTime(progress)}</span>

            <Slider
              value={progress}
              max={duration || 0}
              onChange={handleSeek}
            />

            <span className="text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col items-center mt-10 gap-4">

          <div className="flex items-center gap-8">

            {/* SHUFFLE */}
            <AiOutlineSwap
              size={22}
              onClick={() => player.toggleShuffle()}
              className={`cursor-pointer ${
                player.isShuffle ? 'text-green-500 scale-110' : ''
              }`}
            />

            {/* PREV */}
            <AiFillStepBackward
              size={28}
              onClick={() => player.playPrev()}
              className="cursor-pointer"
            />

            {/* PLAY */}
            <div
              onClick={togglePlay}
              className="bg-white p-5 rounded-full cursor-pointer"
            >
              <Icon size={30} className="text-black" />
            </div>

            {/* NEXT */}
            <AiFillStepForward
              size={28}
              onClick={() => player.playNext()}
              className="cursor-pointer"
            />

            {/* REPEAT */}
            <RiRepeat2Line
              size={22}
              onClick={() => player.toggleRepeat()}
              className={`cursor-pointer ${
                player.repeatMode !== 'off'
                  ? 'text-green-500 scale-110'
                  : ''
              }`}
            />
          </div>

          {/* MODE TEXT */}
          <p className="text-xs text-neutral-400">
            {player.repeatMode === 'one'
              ? 'Repeat One 🔁'
              : player.repeatMode === 'all'
              ? 'Repeat All 🔂'
              : ''}
          </p>
        </div>

        {/* VOLUME */}
        <div className="w-[200px] mt-8">
          <Slider
            value={player.volume}
            max={1}
            step={0.01}
            onChange={(val) => player.setVolume(val)}
          />
        </div>
      </div>
    </motion.div>
  );
};