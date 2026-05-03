'use client';

import * as RadixSlider from '@radix-ui/react-slider';
import { forwardRef } from 'react';

import { cn } from '../../utils/cn';

export interface SliderProps extends Omit<
  RadixSlider.SliderProps,
  'asChild' | 'value' | 'defaultValue' | 'onValueChange'
> {
  /** Show the numeric value to the right of the track. */
  showValue?: boolean;
  /** Pixel width or any CSS length. Defaults to `240`. */
  width?: number | string;
  /**
   * Per-thumb accessible names for multi-thumb (range) sliders. The label at
   * each index is forwarded to the corresponding `<RadixSlider.Thumb>`. When
   * omitted, every thumb falls back to `aria-label`/`aria-labelledby` (or the
   * literal `'Value'` when neither is provided).
   */
  thumbLabels?: ReadonlyArray<string>;
  /**
   * Controlled value. Accepts a scalar for single-thumb sliders or an array
   * for multi-thumb (range) sliders. The shape passed in mirrors the shape
   * passed back to `onValueChange`.
   */
  value?: number | number[];
  /** Uncontrolled initial value. Same scalar/array semantics as `value`. */
  defaultValue?: number | number[];
  /**
   * Fires when the value changes. The argument shape mirrors the input shape:
   * if `value`/`defaultValue` is a scalar, `next` is a scalar; if it's an
   * array, `next` is an array.
   */
  onValueChange?: (next: number | number[]) => void;
}

/**
 * Range slider. Built on Radix Slider for keyboard support (arrow keys nudge,
 * Page Up/Down jumps, Home/End snap to extremes).
 *
 * Pass `aria-label` / `aria-labelledby` to name a single-thumb slider; pass
 * `thumbLabels` to name each thumb in a multi-thumb (range) slider.
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    showValue,
    width = 240,
    className,
    value,
    defaultValue,
    thumbLabels,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...props
  },
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

  // Determine how many thumbs to render. Radix derives the count from the
  // value/defaultValue array length; mirror that here so we can render one
  // Thumb per slot with its own per-thumb name.
  const thumbCount = (arrValue ?? arrDefault)?.length ?? 1;

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
        {Array.from({ length: thumbCount }, (_, i) => {
          const perThumb = thumbLabels?.[i];
          // aria-labelledby wins when there's no per-thumb override.
          const thumbAriaLabel = perThumb ?? (ariaLabelledBy ? undefined : (ariaLabel ?? 'Value'));
          return (
            <RadixSlider.Thumb
              key={i}
              className={cn(
                'bg-text border-accent block h-[14px] w-[14px] rounded-full border-2 shadow',
                'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
                'cursor-grab active:cursor-grabbing',
              )}
              aria-label={thumbAriaLabel}
              aria-labelledby={perThumb ? undefined : ariaLabelledBy}
            />
          );
        })}
      </RadixSlider.Root>
      {showValue && (
        <span className="text-text-muted min-w-[28px] text-right font-mono text-[11px]">
          {display}
        </span>
      )}
    </span>
  );
});

Slider.displayName = 'Slider';
