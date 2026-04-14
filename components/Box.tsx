import { twMerge } from 'tailwind-merge';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

export const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge('rounded-lg h-fit w-full', className)}
      style={{ background: 'var(--bg-elevated)' }}
    >
      {children}
    </div>
  );
};