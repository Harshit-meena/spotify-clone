'use client';

import { useRouter }                       from 'next/navigation';
import { useEffect, useState }             from 'react';
import { useSupabaseClient, useUser }      from '@supabase/auth-helpers-react';
import { motion }                          from 'framer-motion';
import { toast }                           from 'react-hot-toast';

const EditProfilePage = () => {
  const router   = useRouter();
  const supabase = useSupabaseClient();
  const user     = useUser();

  const [name,      setName]      = useState('');
  const [image,     setImage]     = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) { setName(data.full_name || ''); setAvatarUrl(data.avatar_url || null); }
    };
    fetchProfile();
  }, [user?.id, supabase]);

  const uploadImage = async () => {
    if (!image || !user?.id) return null;
    const fileExt = image.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('avatars').upload(fileName, image, { cacheControl: '3600', upsert: true });
    if (error) return null;
    return supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    let finalAvatar = avatarUrl;
    if (image) { const uploaded = await uploadImage(); if (uploaded) finalAvatar = uploaded; }
    const { error } = await supabase.from('profiles').upsert({ id: user.id, full_name: name, avatar_url: finalAvatar });
    setSaving(false);
    if (error) toast.error('Failed to save'); else { toast.success('Profile saved!'); router.push('/profile'); }
  };

  const firstLetter = name?.charAt(0)?.toUpperCase();

  return (
    <div
      className="min-h-full w-full overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* HEADER */}
      <div
        className="flex justify-between items-center px-6 py-5 sticky top-0 z-10"
        style={{
          background:    'var(--player-bg)',
          backdropFilter:'blur(20px)',
          borderBottom:  '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
        >
          ✕
        </button>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Edit profile</h1>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="px-4 py-1.5 rounded-full text-sm font-bold"
          style={{ background: 'var(--green)', color: 'black', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving…' : 'Save'}
        </motion.button>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto space-y-8">

        {/* AVATAR */}
        <div className="flex flex-col items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} className="w-32 h-32 rounded-full object-cover" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} />
          ) : (
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-black text-black"
              style={{ background: 'var(--green)' }}
            >
              {firstLetter}
            </div>
          )}
          <label
            className="px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all"
            style={{ border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
          >
            Change photo
            <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files?.[0] || null)} />
          </label>
        </div>

        {/* NAME INPUT */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Display name
          </p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-base outline-none transition-all"
            style={{
              background:  'var(--bg-glass)',
              border:      '1px solid var(--border-default)',
              color:       'var(--text-primary)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--green)')}
            onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border-default)')}
          />
        </div>

      </div>
    </div>
  );
};

export default EditProfilePage;