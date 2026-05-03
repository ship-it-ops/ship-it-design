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
  children: ReactNode;
}

/**
 * Pill-shaped filter chip. Used in command palette tag rows, search filter strips,
 * and AI suggestion lists. Differs from `Tag` by being pill-shaped (full radius)
 * and slightly more decorative.
 */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { icon, onRemove, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex h-[26px] items-center gap-[6px] py-[4px] pr-1 pl-[10px] font-sans text-[12px]',
        'bg-panel-2 text-text border-border rounded-full border',
        className,
      )}
      {...props}
    >
      {icon && <span className="text-text-dim inline-flex text-[10px]">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="bg-panel text-text-dim hover:text-text grid h-[18px] w-[18px] place-items-center rounded-full text-[10px] leading-none"
        >
          ×
        </button>
      )}
    </span>
  );
});

Chip.displayName = 'Chip';
