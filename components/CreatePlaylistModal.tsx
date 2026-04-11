'use client';

import { useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlaylistModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const supabase = useSupabaseClient();
  const user = useUser();

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name || !user?.id) return;

    const { error } = await supabase.from('playlists').insert({
      name,
      user_id: user.id // ⭐ MOST IMPORTANT FIX
    });

    if (error) {
      console.log('Create Playlist Error:', error);
    }

    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-neutral-900 p-6 rounded-lg w-[350px] shadow-xl">

        <h2 className="text-white text-xl font-bold mb-4">
          Create Playlist 🎵
        </h2>

        <input
          placeholder="Enter playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-black text-white rounded outline-none"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="bg-green-500 px-4 py-2 rounded text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};