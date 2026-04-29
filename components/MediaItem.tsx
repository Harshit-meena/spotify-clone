'use client';

import Image from 'next/image';
import { useLoadImage }    from '@/hooks/useLoadImage';
import { useSubscription } from '@/hooks/useSubscription';
import { Song }            from '@/types';
import { usePlayer }       from '@/hooks/usePlayer';
import { motion }          from 'framer-motion';
import { BsPlayFill }      from 'react-icons/bs';
import { FaLock }          from 'react-icons/fa';
import { useRouter }       from 'next/navigation';

interface MediaItemProps {
  data:     Song;
  onClick?: (id: string) => void;
}

export const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const player   = usePlayer();
  const imageUrl = useLoadImage(data);
  const isActive = player.activeId === data.id;
  const router   = useRouter();
  const { isPremium } = useSubscription();

  const isLocked = !!data?.is_premium && !isPremium;

  const handleClick = () => {
    if (isLocked) { router.push('/premium'); return; }
    if (onClick) return onClick(data.id);
    return player.setId(data.id);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ x: isLocked ? 0 : 3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group flex items-center gap-x-3 cursor-pointer w-full p-2 rounded-xl transition-all"
      style={{
        background: isActive ? 'rgba(29,185,84,0.1)' : 'transparent',
        opacity:    isLocked ? 0.72 : 1,
      }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-glass-hover)'; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {/* ART */}
      <div
        className="relative min-h-[46px] min-w-[46px] rounded-lg overflow-hidden flex-shrink-0"
        style={{ boxShadow: isActive ? '0 0 12px rgba(29,185,84,0.4)' : 'none' }}
      >
        <Image
          fill src={imageUrl || '/images/liked.png'} alt={data.title}
          className="object-cover"
          style={{ filter: isLocked ? 'brightness(0.55)' : 'none' }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
          {isLocked
            ? <FaLock    size={14} style={{ color: '#f59e0b' }} />
            : <BsPlayFill size={16} className="text-white" />
          }
        </div>
      </div>

      {/* TEXT */}
      <div className="flex flex-col gap-y-0.5 overflow-hidden flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p
            className="truncate text-sm font-semibold leading-tight"
            style={{ color: isActive ? 'var(--green)' : 'var(--text-primary)' }}
          >
            {data.title}
          </p>
          {isLocked && <FaLock size={9} style={{ color: '#f59e0b', flexShrink: 0 }} />}
        </div>
        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
          {data.author}
        </p>
      </div>

      {/* Active EQ bars */}
      {isActive && (
        <div className="flex items-end gap-[2px] h-4 flex-shrink-0 mr-1">
          {[0,1,2].map((i) => (
            <div key={i} className="eq-bar w-[3px] rounded-full"
              style={{ background: 'var(--green)', height: '100%', animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
      )}
    </motion.div>
  );
};