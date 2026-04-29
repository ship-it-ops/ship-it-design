import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

/**
 * Dots — progress dots for carousels and onboarding tours. The current dot
 * widens into a pill (per the handoff spec); the rest stay circular.
 */

export interface DotsProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Total dot count. */
  total: number;
  /** Zero-based index of the active dot. */
  current: number;
  /** Optional click handler — when provided, dots become focusable buttons. */
  onChange?: (index: number) => void;
  /** Accessible label. Defaults to `Progress`. */
  'aria-label'?: string;
}

export const Dots = forwardRef<HTMLElement, DotsProps>(function Dots(
  { total, current, onChange, className, 'aria-label': ariaLabel = 'Progress', ...props },
  ref,
) {
  const interactive = typeof onChange === 'function';
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-[6px]', className)}
      {...props}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const sharedClass = cn(
          'h-[6px] rounded-full transition-[width,background] duration-(--duration-micro)',
          isActive ? 'w-[18px] bg-accent' : 'w-[6px] bg-panel-2',
        );
        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onChange?.(i)}
              className={cn(
                sharedClass,
                'cursor-pointer outline-none',
                'focus-visible:ring-[3px] focus-visible:ring-accent-dim',
                !isActive && 'hover:bg-border-strong',
              )}
            />
          );
        }
        return <span key={i} aria-hidden className={sharedClass} />;
      })}
    </nav>
  );
});
