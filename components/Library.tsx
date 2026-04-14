'use client';

import { TbPlaylist }     from 'react-icons/tb';
import { AiOutlinePlus }  from 'react-icons/ai';

import { useSubscribeModal } from '@/hooks/useSubscribeModal';
import { useOnPlay }         from '@/hooks/useOnPlay';
import { useAuthModal }      from '@/hooks/useAuthModal';
import { useUser }           from '@/hooks/useUser';
import { useUploadModal }    from '@/hooks/useUploadModal';

import { Song }       from '@/types';
import { MediaItem }  from './MediaItem';

interface LibraryProps {
  songs: Song[];
}

export const Library: React.FC<LibraryProps> = ({ songs }) => {
  const subscribeModal = useSubscribeModal();
  const authModal      = useAuthModal();
  const uploadModal    = useUploadModal();
  const { user, subscription } = useUser();
  const onPlay = useOnPlay(songs);

  const onClick = () => {
    if (!user)         return authModal.onOpen('login');
    if (!subscription) return subscribeModal.onOpen();
    return uploadModal.onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} style={{ color: 'var(--text-muted)' }} />
          <p
            className="font-medium text-md"
            style={{ color: 'var(--text-muted)' }}
          >
            Your Library
          </p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="cursor-pointer transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => ((e.target as SVGElement).style.color = 'var(--text-primary)')}
          onMouseLeave={e => ((e.target as SVGElement).style.color = 'var(--text-muted)')}
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((item) => (
          <MediaItem
            onClick={(id: string) => onPlay(id)}
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </div>
  );
};