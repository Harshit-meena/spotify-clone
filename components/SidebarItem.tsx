'use client';

import { IconType } from 'react-icons';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, href }) => {
  return (
    <Link
      href={href}
      className={twMerge(
        'flex flex-row h-auto items-center w-full gap-x-4 text-md font-medium cursor-pointer transition py-1'
      )}
      style={{
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        fontWeight: active ? 700 : 500,
      }}
    >
      <Icon size={26} />
      <p className="truncate w-100">{label}</p>
    </Link>
  );
};