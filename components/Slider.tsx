'use client';

import * as RadixSlider from '@radix-ui/react-slider';
import { twMerge }      from 'tailwind-merge';

interface SliderProps {
  value?:     number;
  onChange?:  (value: number) => void;
  max?:       number;
  step?:      number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value = 0,
  onChange,
  max  = 1,
  step = 0.01,
  className,
}) => {
  return (
    <RadixSlider.Root
      value={[value]}
      onValueChange={v => onChange?.(v[0])}
      max={max}
      step={step}
      className={twMerge(
        'relative flex items-center select-none touch-none w-full h-5 group',
        className
      )}
    >
      <RadixSlider.Track
        className="relative grow rounded-full h-[4px]"
        style={{ background: 'var(--border-default)' }}
      >
        <RadixSlider.Range
          className="absolute rounded-full h-full"
          style={{ background: 'var(--green)' }}
        />
      </RadixSlider.Track>

      <RadixSlider.Thumb
        className="block w-3 h-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition hover:scale-125 focus:outline-none"
        style={{ background: 'var(--text-primary)' }}
      />
    </RadixSlider.Root>
  );
};