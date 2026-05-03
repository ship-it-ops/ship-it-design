'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

/** Spinner — circular loading indicator. Three sizes. */

const sizes = {
  sm: { box: 'h-3 w-3', border: 'border-[2px]' },
  md: { box: 'h-4 w-4', border: 'border-[2px]' },
  lg: { box: 'h-5 w-5', border: 'border-[2px]' },
} as const;

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof sizes;
  /** Accessible label. Defaults to `Loading`. */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', className, ...props },
  ref,
) {
  const s = sizes[size];
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn('inline-block', className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'border-panel-2 border-t-accent block animate-[ship-spin_0.7s_linear_infinite] rounded-full',
          s.box,
          s.border,
        )}
      />
    </span>
  );
});

Spinner.displayName = 'Spinner';
