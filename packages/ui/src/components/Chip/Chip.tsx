'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Pill-style leading icon (typically a glyph or `@`/`#`). */
  icon?: ReactNode;
  /**
   * Optional remove handler. When provided, renders an inset close button.
   * Mirrors the `Tag` API — pass `onRemove` and the X is rendered automatically.
   */
  onRemove?: () => void;
  /**
   * `'comfortable'` (default) renders the desktop chip at 26px tall.
   * `'touch'` swaps to a roomier 32px chip with larger text for mobile filter strips.
   */
  density?: 'comfortable' | 'touch';
  children: ReactNode;
}

/**
 * Pill-shaped filter chip. Used in command palette tag rows, search filter strips,
 * and AI suggestion lists. Differs from `Tag` by being pill-shaped (full radius)
 * and slightly more decorative.
 */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { icon, onRemove, density = 'comfortable', className, children, ...props },
  ref,
) {
  const isTouch = density === 'touch';
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-[6px] font-sans',
        isTouch
          ? 'text-m-mono h-8 py-[5px] pr-[6px] pl-3'
          : 'h-[26px] py-[4px] pr-1 pl-[10px] text-[12px]',
        'bg-panel-2 text-text border-border rounded-full border',
        className,
      )}
      {...props}
    >
      {icon && (
        <span className={cn('text-text-dim inline-flex', isTouch ? 'text-[12px]' : 'text-[10px]')}>
          {icon}
        </span>
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className={cn(
            'bg-panel text-text-dim hover:text-text grid place-items-center rounded-full leading-none',
            isTouch ? 'h-[22px] w-[22px] text-[12px]' : 'h-[18px] w-[18px] text-[10px]',
          )}
        >
          ×
        </button>
      )}
    </span>
  );
});

Chip.displayName = 'Chip';
