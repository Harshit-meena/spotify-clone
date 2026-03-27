'use client';

import { useEffect, useState } from 'react';
import { Song } from '@/types';
import { usePlayer } from '@/hooks/usePlayer';

import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2';

import { MediaItem } from './MediaItem';
import { LikeButton } from './LikeButton';
import { Slider } from './Slider';

import useSound from 'use-sound';

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

export const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();

  const [volume, setVolume] = useState(0.7);
  const [isPlaying, setIsPlaying] = useState(false);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  // 🔥 NEXT
  const onPlayNextSong = () => {
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const next = player.ids[currentIndex + 1];
    if (!next) return player.setId(player.ids[0]);
    player.setId(next);
  };

  // 🔥 PREV
  const onPlayPreviousSong = () => {
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const prev = player.ids[currentIndex - 1];
    if (!prev) return player.setId(player.ids[player.ids.length - 1]);
    player.setId(prev);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNextSong();
    },
    onpause: () => setIsPlaying(false),
    format: ['mp3'],
  });

  // ▶ AUTO PLAY
  useEffect(() => {
    sound?.play();
    return () => sound?.unload();
  }, [sound]);

  // 🔊 VOLUME
  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);

  // ⏱ PROGRESS TRACK
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
    if (sound) {
      sound.seek([value]);
      setProgress(value);
    }
  };

  // ▶ PLAY / PAUSE
  const handlePlay = () => {
    if (!isPlaying) play();
    else pause();
  };

  // 🔊 MUTE
  const toggleMute = () => {
    setVolume(volume === 0 ? 1 : 0);
  };

  // ⏱ FORMAT
  const formatTime = (time: number) => {
    if (!time) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full text-white px-4">

      {/* 🎵 LEFT */}
      <div className="flex items-center gap-x-4">
        <MediaItem data={song} />
        <LikeButton songId={song.id} />
      </div>

      {/* 🎯 CENTER */}
      <div className="flex flex-col items-center justify-center gap-2">

        {/* CONTROLS */}
        <div className="flex items-center gap-6">
          <AiFillBackward
            onClick={onPlayPreviousSong}
            size={28}
            className="text-neutral-400 hover:text-white cursor-pointer"
          />

          <div
            onClick={handlePlay}
            className="bg-white p-2 rounded-full cursor-pointer hover:scale-110 transition"
          >
            <Icon size={28} className="text-black" />
          </div>

          <AiFillStepForward
            onClick={onPlayNextSong}
            size={28}
            className="text-neutral-400 hover:text-white cursor-pointer"
          />
        </div>

        {/* 🔥 SEEK BAR */}
        <div className="flex items-center gap-2 w-full max-w-[500px]">
          <span className="text-xs">{formatTime(progress)}</span>

          <Slider
            value={progress}
            max={duration || 0}
            onChange={(value) => handleSeek(value)}
          />

          <span className="text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 🔊 RIGHT */}
      <div className="hidden md:flex justify-end items-center gap-2">
        <VolumeIcon
          onClick={toggleMute}
          size={28}
          className="cursor-pointer"
        />

        <Slider
          value={volume}
          max={1}
          step={0.01}
          onChange={(value) => setVolume(value)}
          className="w-[100px]"
        />
      </div>
    </div>
  );
};