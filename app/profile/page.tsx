'use client';

import { useRouter }        from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion }           from 'framer-motion';

import { useUser }          from '@/hooks/useUser';
import { useUserProfile }   from '@/hooks/useUserProfile';
import { usePlayer }        from '@/hooks/usePlayer';
import { useGetPlaylists }  from '@/hooks/useGetPlaylists';
import { useGetLikedSongs } from '@/hooks/useGetLikedSongs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import PlaylistItem from '@/components/PlaylistItem';
import { Song }     from '@/types';

const ProfilePage = () => {
  const router    = useRouter();
  const supabase  = useSupabaseClient();

  const { user }  = useUser();
  const profile   = useUserProfile();

  const { playlists = [] }      = useGetPlaylists();
  const { songs: likedSongs = [] } = useGetLikedSongs();
  const player = usePlayer();

  const [openPlaylistId,  setOpenPlaylistId]  = useState<string | null>(null);
  const [showLiked,       setShowLiked]       = useState(false);
  const [isFollowing,     setIsFollowing]     = useState(false);
  const [followersCount,  setFollowersCount]  = useState(0);

  const handlePlay = (songId: string) => {
    player.setId(songId);
    player.setIds([songId]);
  };

  const name        = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const firstLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!user?.id) return;
    const fetchFollowers = async () => {
      const { count } = await supabase
        .from('followers').select('*', { count: 'exact', head: true }).eq('following_id', user.id);
      setFollowersCount(count || 0);
    };
    fetchFollowers();
  }, [user?.id, supabase]);

  const toggleFollow = async () => {
    if (!user?.id) return;
    if (isFollowing) {
      await supabase.from('followers').delete().eq('follower_id', user.id).eq('following_id', user.id);
      setIsFollowing(false); setFollowersCount(p => p - 1);
    } else {
      await supabase.from('followers').insert({ follower_id: user.id, following_id: user.id });
      setIsFollowing(true); setFollowersCount(p => p + 1);
    }
  };

  return (
    <div
      className="min-h-full w-full overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* HERO */}
      <div
        className="p-8 pb-12"
        style={{
          background: 'linear-gradient(180deg, rgba(29,185,84,0.2) 0%, var(--bg-primary) 100%)',
        }}
      >
        <button
          onClick={() => router.back()}
          className="mb-6 text-xl font-bold transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ←
        </button>

        <div className="flex items-center gap-6">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              className="w-28 h-28 rounded-full object-cover"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-black text-black"
              style={{ background: 'var(--green)', boxShadow: '0 8px 32px var(--green-glow)' }}
            >
              {firstLetter}
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              Profile
            </p>
            <h1 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
              {displayName}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {followersCount} followers
            </p>

            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => router.push('/profile/edit')}
                className="px-5 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  border: '1px solid var(--border-strong)',
                  color:  'var(--text-primary)',
                }}
              >
                Edit profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={toggleFollow}
                className="px-5 py-1.5 rounded-full text-sm font-semibold"
                style={isFollowing
                  ? { background: 'var(--bg-highlight)', color: 'var(--text-primary)' }
                  : { background: 'var(--green)', color: 'black' }
                }
              >
                {isFollowing ? 'Following' : 'Follow'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-10 space-y-8">

        {/* LIKED SONGS */}
        <div>
          <motion.div
            onClick={() => setShowLiked(p => !p)}
            whileHover={{ x: 3 }}
            className="flex items-center gap-3 cursor-pointer py-2"
          >
            <span className="text-xl">❤️</span>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Liked Songs
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(29,185,84,0.15)', color: 'var(--green)' }}
            >
              {likedSongs.length}
            </span>
            <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {showLiked ? '▲' : '▼'}
            </span>
          </motion.div>

          {showLiked && (
            <div
              className="mt-2 rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border-subtle)' }}
            >
              {likedSongs.length === 0 ? (
                <p className="p-4 text-sm" style={{ color: 'var(--text-muted)' }}>No liked songs</p>
              ) : (
                likedSongs.map((song: Song) => (
                  <div
                    key={song.id}
                    onClick={() => handlePlay(song.id)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>🎵</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {song.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* PLAYLISTS */}
        <div>
          <h2 className="text-xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
            Playlists
          </h2>
          {playlists.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No playlists found</p>
          ) : (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border-subtle)' }}
            >
              {playlists.map((playlist: any) => (
                <PlaylistItem
                  key={playlist.id}
                  playlist={playlist}
                  isOpen={openPlaylistId === playlist.id}
                  onToggle={() => setOpenPlaylistId(p => p === playlist.id ? null : playlist.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;