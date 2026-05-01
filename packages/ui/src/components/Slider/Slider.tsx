import * as RadixSlider from '@radix-ui/react-slider';
import { forwardRef } from 'react';

import { cn } from '../../utils/cn';

export interface SliderProps extends Omit<RadixSlider.SliderProps, 'asChild'> {
  /** Show the numeric value to the right of the track. */
  showValue?: boolean;
  /** Pixel width or any CSS length. Defaults to `240`. */
  width?: number | string;
}

/**
 * Range slider. Built on Radix Slider for keyboard support (arrow keys nudge,
 * Page Up/Down jumps, Home/End snap to extremes).
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { showValue, width = 240, className, value, defaultValue, ...props },
  ref,
) {
  // Radix Slider's value is always an array; we accept either form for ergonomics.
  const arrValue = Array.isArray(value)
    ? value
    : value !== undefined
      ? [value as unknown as number]
      : undefined;
  const arrDefault = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue !== undefined
      ? [defaultValue as unknown as number]
      : undefined;
  const display = arrValue?.[0] ?? arrDefault?.[0] ?? props.min ?? 0;

  return (
    <span
      ref={ref}
      className={cn('inline-flex items-center gap-[10px]', className)}
      style={{ width }}
    >
      <RadixSlider.Root
        value={arrValue}
        defaultValue={arrDefault}
        className="relative flex h-4 flex-1 touch-none items-center select-none"
        {...props}
      >
        <RadixSlider.Track className="bg-panel-2 relative h-1 grow rounded-full">
          <RadixSlider.Range className="bg-accent absolute h-full rounded-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className={cn(
            'bg-text border-accent block h-[14px] w-[14px] rounded-full border-2 shadow',
            'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
            'cursor-grab active:cursor-grabbing',
          )}
          aria-label="Value"
        />
      </RadixSlider.Root>
      {showValue && (
        <span className="text-text-muted min-w-[28px] text-right font-mono text-[11px]">
          {display}
        </span>
      )}
    </span>
  );
});
