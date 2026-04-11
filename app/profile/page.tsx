'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { useUser } from '@/hooks/useUser';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePlayer } from '@/hooks/usePlayer';
import { useGetPlaylists } from '@/hooks/useGetPlaylists';
import { useGetLikedSongs } from '@/hooks/useGetLikedSongs';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import PlaylistItem from '@/components/PlaylistItem';
import { Song } from '@/types';

const ProfilePage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const { user } = useUser();
  const profile = useUserProfile();

  const { playlists = [] } = useGetPlaylists();
  const { songs: likedSongs = [] } = useGetLikedSongs();

  const player = usePlayer();

  const [openPlaylistId, setOpenPlaylistId] = useState<string | null>(null);
  const [showLiked, setShowLiked] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const handlePlay = (songId: string) => {
    player.setId(songId);
    player.setIds([songId]);
  };

  // 🔥 NAME LOGIC
  const name =
    profile?.full_name ||
    user?.email?.split('@')[0] ||
    'User';

  const displayName =
    name.charAt(0).toUpperCase() + name.slice(1);

  const firstLetter = displayName.charAt(0).toUpperCase();

  // 🔥 FOLLOW COUNT (WORKS EVEN IF PROFILE NULL)
  useEffect(() => {
    if (!user?.id) return;

    const fetchFollowers = async () => {
      const { count } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

      setFollowersCount(count || 0);
    };

    fetchFollowers();
  }, [user?.id, supabase]);

  // 🔥 TOGGLE FOLLOW (for future use)
  const toggleFollow = async () => {
    if (!user?.id) return;

    if (isFollowing) {
      await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', user.id);

      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      await supabase.from('followers').insert({
        follower_id: user.id,
        following_id: user.id,
      });

      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">

      {/* BACK */}
      <button onClick={() => router.back()} className="mb-6 text-2xl">
        ←
      </button>

      {/* HEADER */}
      <div className="flex items-center gap-6 mb-8">

        {/* AVATAR */}
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            className="w-28 h-28 rounded-full object-cover"
          />
        ) : (
          <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center text-5xl font-bold text-black">
            {firstLetter}
          </div>
        )}

        {/* NAME */}
        <div>
          <h1 className="text-3xl font-bold">{displayName}</h1>

          <p className="text-neutral-400">
            {followersCount} followers
          </p>

          <div className="flex gap-4 mt-4">

            {/* EDIT */}
            <button
              onClick={() => router.push('/profile/edit')}
              className="border px-4 py-1 rounded-full"
            >
              Edit
            </button>

            {/* ✅ ALWAYS SHOW (NO FLICKER / NO NULL ISSUE) */}
            <button
              onClick={toggleFollow}
              className={`px-4 py-1 rounded-full ${
                isFollowing
                  ? 'bg-neutral-700 text-white'
                  : 'bg-green-500 text-black'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>

          </div>
        </div>
      </div>

      {/* ❤️ LIKED */}
      <div className="mb-6">
        <div
          onClick={() => setShowLiked((prev) => !prev)}
          className="cursor-pointer flex items-center gap-4 hover:text-green-400"
        >
          ❤️ <span>Liked Songs</span>
        </div>

        {showLiked && (
          <div className="mt-3 ml-6">
            {likedSongs.length === 0 ? (
              <p className="text-neutral-400 text-sm">
                No liked songs
              </p>
            ) : (
              likedSongs.map((song: Song) => (
                <div
                  key={song.id}
                  onClick={() => handlePlay(song.id)}
                  className="cursor-pointer hover:text-green-400"
                >
                  🎵 {song.title}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 🎵 PLAYLISTS */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Playlists</h2>

        {playlists.length === 0 ? (
          <p className="text-neutral-400 text-sm">
            No playlists found
          </p>
        ) : (
          playlists.map((playlist: any) => (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              isOpen={openPlaylistId === playlist.id}
              onToggle={() =>
                setOpenPlaylistId((prev) =>
                  prev === playlist.id ? null : playlist.id
                )
              }
            />
          ))
        )}
      </div>

    </div>
  );
};

export default ProfilePage;