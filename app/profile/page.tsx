'use client';

import { useRouter }               from 'next/navigation';
import { useEffect, useState }     from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useUser }           from '@/hooks/useUser';
import useUserProfile        from '@/hooks/useUserProfile';
import { usePlayer }         from '@/hooks/usePlayer';
import { useGetPlaylists }   from '@/hooks/useGetPlaylists';
import { useGetLikedSongs }  from '@/hooks/useGetLikedSongs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import PlaylistItem from '@/components/PlaylistItem';
import { Song }     from '@/types';

const ProfilePage = () => {
  const router   = useRouter();
  const supabase = useSupabaseClient();

  const { user }               = useUser();
  const { profile, isLoading } = useUserProfile();
  const { playlists = [] }     = useGetPlaylists();
  const { songs: likedSongs = [] } = useGetLikedSongs();
  const player = usePlayer();

  const [openPlaylistId, setOpenPlaylistId] = useState<string | null>(null);
  const [activeTab,      setActiveTab]      = useState<'liked' | 'playlists'>('liked');
  const [isFollowing,    setIsFollowing]    = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [avatarUrl,      setAvatarUrl]      = useState<string | null>(null);
  const [imgError,       setImgError]       = useState(false);

  useEffect(() => {
    if (profile?.avatar_url) {
      const base = profile.avatar_url.split('?')[0];
      setAvatarUrl(`${base}?t=${Date.now()}`);
      setImgError(false);
    } else {
      setAvatarUrl(null);
    }
  }, [profile?.avatar_url]);

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

  const toggleFollow = async () => {
    if (!user?.id) return;
    if (isFollowing) {
      await supabase.from('followers').delete()
        .eq('follower_id', user.id).eq('following_id', user.id);
      setIsFollowing(false);
      setFollowersCount(p => p - 1);
    } else {
      await supabase.from('followers').insert(
        { follower_id: user.id, following_id: user.id }
      );
      setIsFollowing(true);
      setFollowersCount(p => p + 1);
    }
  };

  const handlePlay = (songId: string, allIds?: string[]) => {
    player.setId(songId);
    player.setIds(allIds || [songId]);
  };

  const name        = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  const firstLetter = displayName.charAt(0).toUpperCase();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--green)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}>

      {/* ══════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════ */}
      <div className="relative">

        {/* ✅ Banner - Avatar blurred background */}
        <div className="relative h-56 overflow-hidden">

          {/* ✅ Blurred avatar background */}
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              className="absolute inset-0 w-full h-full object-cover scale-110"
              style={{
                filter: 'blur(30px) brightness(0.3) saturate(2)',
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #0d3320 0%, #051a0f 60%, #000 100%)',
              }}
            />
          )}

          {/* ✅ Strong dark overlay so name is always visible */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 60%, var(--bg-primary) 100%)',
            }}
          />

          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="absolute top-5 left-5 w-9 h-9 rounded-full flex items-center justify-center z-10"
            style={{
              background:     'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              color:          'white',
              fontSize:       18,
              border:         '1px solid rgba(255,255,255,0.15)',
            }}
          >
            ←
          </motion.button>
        </div>

        {/* ══════════════════════════════════════
            PROFILE INFO - Avatar + Name
        ══════════════════════════════════════ */}
        <div className="px-8 pb-6" style={{ marginTop: '-55px' }}>
          <div className="flex items-end gap-6">

            {/* ✅ Avatar - fully visible */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1  }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="relative flex-shrink-0 z-10"
            >
              {/* Green glow ring */}
              <div
                className="absolute -inset-[3px] rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #1DB954, #4ade80, #1DB954)',
                  padding: '3px',
                }}
              />
              {/* Avatar */}
              <div
                className="relative w-36 h-36 rounded-full overflow-hidden"
                style={{ border: '4px solid var(--bg-primary)' }}
              >
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-6xl font-black text-black"
                    style={{ background: 'var(--green)' }}
                  >
                    {firstLetter}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ✅ Name + Info - with text shadow for visibility */}
            <div className="flex-1 pb-2 z-10">

              <p
                className="text-xs uppercase tracking-widest font-bold mb-1"
                style={{ color: '#1DB954' }}
              >
                Profile
              </p>

              {/* ✅ Name - Green color + text shadow */}
              <h1
                className="text-5xl font-black mb-1 leading-tight"
                style={{
                  color:      '#ffffff',
                  textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.9)',
                  WebkitTextStroke: '0px',
                }}
              >
                {displayName}
              </h1>

              {/* Email */}
              <p
                className="text-sm mb-4"
                style={{
                  color:      'rgba(255,255,255,0.55)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                {profile?.email || user?.email}
              </p>

              {/* ✅ Stats */}
              <div className="flex items-center gap-6 mb-5">
                {[
                  { val: followersCount,    label: 'Followers'  },
                  { val: likedSongs.length, label: 'Liked'      },
                  { val: playlists.length,  label: 'Playlists'  },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span
                      className="text-xl font-black"
                      style={{ color: '#1DB954' }}
                    >
                      {s.val}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ✅ Action Buttons */}
              <div className="flex gap-3 flex-wrap items-center">

                {/* Play All - Green circle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => likedSongs.length > 0 && handlePlay(
                    likedSongs[0].id,
                    likedSongs.map((s: Song) => s.id)
                  )}
                  className="w-13 h-13 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shadow-lg"
                  style={{
                    background: '#1DB954',
                    color:      'black',
                    boxShadow:  '0 4px 20px rgba(29,185,84,0.5)',
                  }}
                  title="Play All Liked Songs"
                >
                  ▶
                </motion.button>

                {/* Follow */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={toggleFollow}
                  className="px-6 py-2 rounded-full text-sm font-bold transition-all"
                  style={isFollowing
                    ? {
                        border: '1px solid rgba(255,255,255,0.3)',
                        color:  'white',
                      }
                    : {
                        border: '1px solid #1DB954',
                        color:  '#1DB954',
                      }
                  }
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </motion.button>

                {/* Edit Profile */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push('/profile/edit')}
                  className="px-6 py-2 rounded-full text-sm font-bold flex items-center gap-1.5"
                  style={{
                    border: '1px solid rgba(255,255,255,0.2)',
                    color:  'rgba(255,255,255,0.6)',
                  }}
                >
                  ✏️ Edit
                </motion.button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TABS + CONTENT
      ══════════════════════════════════════ */}
      <div className="px-8 pb-10">

        {/* Tab Switcher */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-6 w-fit"
          style={{
            background: 'var(--bg-glass)',
            border:     '1px solid var(--border-subtle)',
          }}
        >
          {(['liked', 'playlists'] as const).map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: activeTab === tab ? '#1DB954' : 'transparent',
                color:      activeTab === tab ? 'black'   : 'var(--text-muted)',
              }}
            >
              {tab === 'liked'
                ? `❤️ Liked Songs (${likedSongs.length})`
                : `🎵 Playlists (${playlists.length})`
              }
            </motion.button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">

          {/* LIKED SONGS */}
          {activeTab === 'liked' && (
            <motion.div
              key="liked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1,  y: 0  }}
              exit={{   opacity: 0,  y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {likedSongs.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-20 rounded-3xl"
                  style={{
                    background: 'var(--bg-glass)',
                    border:     '1px dashed var(--border-subtle)',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-6xl mb-4"
                  >
                    💔
                  </motion.div>
                  <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    No liked songs yet
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                    Heart a song to see it here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {likedSongs.map((song: Song, idx: number) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1,  x: 0   }}
                      transition={{ delay: idx * 0.03 }}
                      whileHover={{ x: 6 }}
                      onClick={() => handlePlay(
                        song.id,
                        likedSongs.map((s: Song) => s.id)
                      )}
                      className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer group transition-all"
                      style={{ border: '1px solid transparent' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--bg-glass)';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <span className="w-5 text-center text-xs flex-shrink-0"
                        style={{ color: 'var(--text-muted)' }}>
                        {idx + 1}
                      </span>

                      <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ background: 'var(--bg-highlight)' }}>
                        {(song as any).image_path ? (
                          <img
                            src={(song as any).image_path}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">🎵</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate"
                          style={{ color: 'var(--text-primary)' }}>
                          {song.title}
                        </p>
                        <p className="text-xs truncate"
                          style={{ color: 'var(--text-muted)' }}>
                          {song.author}
                        </p>
                      </div>

                      <span
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-sm"
                        style={{ color: '#1DB954' }}
                      >
                        ▶
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* PLAYLISTS */}
          {activeTab === 'playlists' && (
            <motion.div
              key="playlists"
              initial={{ opacity: 0, y: 10  }}
              animate={{ opacity: 1,  y: 0  }}
              exit={{   opacity: 0,  y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {playlists.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-20 rounded-3xl"
                  style={{
                    background: 'var(--bg-glass)',
                    border:     '1px dashed var(--border-subtle)',
                  }}
                >
                  <span className="text-6xl mb-4">🎵</span>
                  <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    No playlists yet
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                    Create a playlist to get started
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--border-subtle)' }}>
                  {playlists.map((playlist: any) => (
                    <PlaylistItem
                      key={playlist.id}
                      playlist={playlist}
                      isOpen={openPlaylistId === playlist.id}
                      onToggle={() =>
                        setOpenPlaylistId(p =>
                          p === playlist.id ? null : playlist.id
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;