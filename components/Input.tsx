'use client';

import { twMerge } from 'tailwind-merge';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={twMerge(
        `
        bg-neutral-800
        border border-neutral-700
        text-white
        rounded-md
        px-4 py-3
        outline-none
        w-full
        focus:border-green-500
        transition
        `,
        className
      )}
    />
  );
};

export default Input;