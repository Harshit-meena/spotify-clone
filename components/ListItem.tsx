'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BsPlayFill } from 'react-icons/bs';

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

export const ListItem: React.FC<ListItemProps> = ({ image, name, href }) => {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push(href)}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex items-center gap-x-3 overflow-hidden w-full rounded-xl pr-4 text-left"
      style={{
        background:    'var(--bg-glass)',
        border:        '1px solid var(--border-default)',
        backdropFilter:'blur(12px)',
        minHeight: 60,
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(29,185,84,0.1) 0%, transparent 100%)' }}
      />

      {/* IMAGE */}
      <div className="relative min-h-[60px] min-w-[60px] flex-shrink-0 overflow-hidden rounded-l-xl">
        <Image className="object-cover" fill src={image} alt={name} />
      </div>

      {/* NAME */}
      <p
        className="font-bold text-sm truncate flex-1 relative z-10"
        style={{ color: 'var(--text-primary)' }}
      >
        {name}
      </p>

      {/* PLAY BUTTON */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1 }}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 relative z-10 flex-shrink-0"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--green), var(--green-dark))',
            boxShadow:  '0 4px 15px var(--green-glow)',
          }}
        >
          <BsPlayFill size={16} className="text-black ml-0.5" />
        </div>
      </motion.div>
    </motion.button>
  );
};