'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUser } from '@/hooks/useUser';
import { usePlayer } from '@/hooks/usePlayer';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

import PlaylistItem from '@/components/PlaylistItem';
import { Song } from '@/types';

const UserProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const supabase = useSupabaseClient();

  const { user } = useUser();
  const player = usePlayer();

  const userId = params.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // 🔥 FETCH PROFILE
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, [userId, supabase]);

  // 🔥 FETCH PLAYLISTS
  useEffect(() => {
    if (!userId) return;

    const fetchPlaylists = async () => {
      const { data } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId);

      if (data) setPlaylists(data);
    };

    fetchPlaylists();
  }, [userId, supabase]);

  // 🔥 FOLLOW COUNT
  useEffect(() => {
    if (!userId) return;

    const fetchFollowers = async () => {
      const { count } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      setFollowersCount(count || 0);
    };

    fetchFollowers();
  }, [userId, supabase]);

  // 🔥 CHECK FOLLOW
  useEffect(() => {
    if (!user?.id || !userId) return;

    const checkFollow = async () => {
      const { data } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle();

      setIsFollowing(!!data);
    };

    checkFollow();
  }, [user?.id, userId, supabase]);

  // 🔥 TOGGLE FOLLOW
  const toggleFollow = async () => {
    if (!user?.id || !userId) return;

    if (user.id === userId) return;

    if (isFollowing) {
      await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      await supabase.from('followers').insert({
        follower_id: user.id,
        following_id: userId,
      });

      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  const handlePlay = (songId: string) => {
    player.setId(songId);
    player.setIds([songId]);
  };

  // 🔥 NAME
  const name =
    profile?.full_name ||
    profile?.email?.split('@')[0] ||
    'User';

  const displayName =
    name.charAt(0).toUpperCase() + name.slice(1);

  const firstLetter = displayName.charAt(0).toUpperCase();

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

          {/* 🔥 FOLLOW BUTTON */}
          {user?.id !== userId && (
            <button
              onClick={toggleFollow}
              className={`mt-4 px-4 py-1 rounded-full ${
                isFollowing
                  ? 'bg-neutral-700 text-white'
                  : 'bg-green-500 text-black'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
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
              isOpen={false}
              onToggle={() => {}}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default UserProfilePage;