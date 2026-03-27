'use client';

import * as RadixSlider from '@radix-ui/react-slider';
import { twMerge } from 'tailwind-merge';

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;     // ✅ ADD
  step?: number;    // ✅ ADD
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value = 0,
  onChange,
  max = 1,
  step = 0.01,
  className,
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <RadixSlider.Root
      value={[value]}
      onValueChange={handleChange}
      max={max}         // ✅ FIX
      step={step}       // ✅ FIX
      className={twMerge(`
        relative flex items-center select-none touch-none w-full h-5 group
      `, className)}
    >
      {/* 🔥 TRACK */}
      <RadixSlider.Track
        className="
          bg-neutral-600 relative grow rounded-full h-[4px]
        "
      >
        {/* 🔥 RANGE (filled part) */}
        <RadixSlider.Range
          className="
            absolute bg-green-500 rounded-full h-full
          "
        />
      </RadixSlider.Track>

      {/* 🔥 THUMB (Spotify style) */}
      <RadixSlider.Thumb
        className="
          block w-3 h-3 bg-white rounded-full shadow-md
          opacity-0 group-hover:opacity-100
          transition
          hover:scale-125
          focus:outline-none
        "
      />
    </RadixSlider.Root>
  );
};