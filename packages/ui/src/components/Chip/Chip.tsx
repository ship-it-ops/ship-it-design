'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { tintStyle, warnIfInvalidColor } from '../../utils/color-override';

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
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
  /** Arbitrary CSS color. When set, the default neutral tint is replaced with this color. */
  color?: string;
  children: ReactNode;
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { icon, onRemove, density = 'comfortable', color, className, children, style, ...props },
  ref,
) {
  const isTouch = density === 'touch';
  const useColor = color && warnIfInvalidColor(color, 'Chip');
  const structural = cn(
    'inline-flex items-center gap-[6px] font-sans rounded-full border',
    isTouch
      ? 'text-m-mono h-8 py-[5px] pr-[6px] pl-3'
      : 'h-[26px] py-[4px] pr-1 pl-[10px] text-[12px]',
  );
  const defaultPaint = 'bg-panel-2 text-text border-border';

  return (
    <span
      ref={ref}
      className={cn(structural, !useColor && defaultPaint, className)}
      style={{
        ...(useColor ? { ...tintStyle(color!), borderColor: 'transparent' } : {}),
        ...style,
      }}
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
