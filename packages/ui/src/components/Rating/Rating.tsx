'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import { forwardRef, useId, type HTMLAttributes, type KeyboardEvent } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * Rating — star rating display and input.
 *
 * `readOnly` (default for displays of averaged values like 4.7) supports
 * `precision='half'` for fractional fills via a clipped overlay. Interactive
 * ratings step in whole units only — half-step input is uncommon UX and the
 * keyboard model (radiogroup) doesn't map cleanly to it.
 */

export interface RatingProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'role'
> {
  /** Current rating (controlled). Range `0` … `max`. */
  value?: number;
  /** Default rating (uncontrolled). */
  defaultValue?: number;
  /** Fires with the new whole-number rating on click / keyboard select. */
  onValueChange?: (value: number) => void;
  /** Maximum number of stars. Default `5`. */
  max?: number;
  /**
   * Fractional precision for **read-only** display. Interactive ratings always
   * step in whole units. Default `'full'`.
   */
  precision?: 'full' | 'half';
  /** Visual size. Default `'md'`. */
  size?: 'sm' | 'md' | 'lg';
  /** When true, renders a non-interactive display (`role='img'`). */
  readOnly?: boolean;
  /** Accessible label. For read-only this overrides the auto-generated "X out of Y stars" label. */
  'aria-label'?: string;
}

const sizeMap = {
  sm: 12,
  md: 16,
  lg: 20,
} as const;

export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value,
    defaultValue,
    onValueChange,
    max = 5,
    precision = 'full',
    size = 'md',
    readOnly = false,
    className,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const [current, setCurrent] = useControllableState<number>({
    value,
    defaultValue: defaultValue ?? 0,
    onChange: onValueChange,
  });
  const reactId = useId();

  const px = sizeMap[size];
  const currentInt = Math.round(current ?? 0);

  const handleSelect = (n: number) => {
    if (readOnly) return;
    setCurrent(n);
  };

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleSelect(Math.min(max, Math.max(1, currentInt) + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleSelect(Math.max(1, currentInt - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleSelect(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleSelect(max);
    }
  };

  const clampedDisplay =
    precision === 'half' ? Math.round((current ?? 0) * 2) / 2 : Math.round(current ?? 0);

  if (readOnly) {
    const label = ariaLabel ?? `${clampedDisplay} out of ${max} stars`;
    const fillPct = Math.max(0, Math.min(1, clampedDisplay / max)) * 100;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={label}
        className={cn('relative inline-flex items-center gap-0.5', className)}
        {...props}
      >
        {/* Empty backdrop */}
        {Array.from({ length: max }).map((_, i) => (
          <IconGlyph key={i} name="star" size={px} className="text-rating-dim" aria-hidden />
        ))}
        {/* Filled overlay, clipped to fillPct */}
        <div
          className="pointer-events-none absolute inset-0 inline-flex items-center gap-0.5 overflow-hidden"
          style={{ width: `${fillPct}%` }}
          aria-hidden
        >
          {Array.from({ length: max }).map((_, i) => (
            <IconGlyph key={i} name="star" size={px} className="text-rating shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel ?? 'Rating'}
      className={cn('inline-flex items-center gap-0.5', className)}
      onKeyDown={handleKey}
      {...props}
    >
      {Array.from({ length: max }).map((_, i) => {
        const star = i + 1;
        const selected = star === currentInt;
        const filled = star <= currentInt;
        return (
          <button
            key={i}
            id={`${reactId}-${i}`}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            tabIndex={selected || (i === 0 && currentInt === 0) ? 0 : -1}
            onClick={() => handleSelect(star)}
            className={cn(
              'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm',
              'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
              'transition-colors duration-(--duration-micro)',
              filled ? 'text-rating' : 'text-rating-dim',
              'hover:text-rating',
            )}
          >
            <IconGlyph name="star" size={px} />
          </button>
        );
      })}
    </div>
  );
});

Rating.displayName = 'Rating';
