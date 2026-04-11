'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const EditProfilePage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // 🔥 FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setName(data.full_name || '');
        setAvatarUrl(data.avatar_url || null);
      }
    };

    fetchProfile();
  }, [user?.id, supabase]);

  // 🔥 UPLOAD IMAGE
  const uploadImage = async () => {
    if (!image || !user?.id) return null;

    const fileExt = image.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.log('Upload Error:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    console.log('Image URL:', data.publicUrl);

    return data.publicUrl;
  };

  // 🔥 SAVE PROFILE
  const handleSave = async () => {
    if (!user?.id) return;

    let finalAvatar = avatarUrl;

    if (image) {
      const uploaded = await uploadImage();
      if (uploaded) finalAvatar = uploaded;
    }

    console.log('Saving Avatar:', finalAvatar);

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name,
      avatar_url: finalAvatar,
    });

    if (error) {
      console.log('Save Error:', error);
    }

    router.refresh();
    router.push('/profile');
  };

  const firstLetter = name?.charAt(0)?.toUpperCase();

  return (
    <div className="bg-black text-white min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="text-2xl">✕</button>
        <h1 className="text-xl font-bold">Edit profile</h1>
        <button onClick={handleSave} className="text-green-400">Save</button>
      </div>

      {/* AVATAR */}
      <div className="flex justify-center mb-6">
        <div className="relative">

          {avatarUrl ? (
            <img
              src={avatarUrl}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-5xl font-bold text-black">
              {firstLetter}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-4"
          />
        </div>
      </div>

      {/* NAME */}
      <div>
        <p className="text-neutral-400 mb-2">Name</p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border-b border-neutral-600 outline-none text-xl pb-2"
        />
      </div>

    </div>
  );
};

export default EditProfilePage;