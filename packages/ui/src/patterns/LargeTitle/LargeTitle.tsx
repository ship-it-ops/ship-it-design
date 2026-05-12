'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * LargeTitle — iOS-style oversized headline block. Renders an optional eyebrow
 * (small uppercase mono label) above a 30px headline, with an optional trailing
 * slot (typically an avatar or icon button) on the right.
 *
 * Place at the top of a scrolling screen. Pair with `<Topbar density="touch" />`
 * for the scroll-revealing pattern: hide the Topbar title until the LargeTitle
 * scrolls under the bar.
 */

export interface LargeTitleProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Headline text. */
  title: ReactNode;
  /** Optional eyebrow label rendered above the title. Small, uppercase, mono. */
  eyebrow?: ReactNode;
  /** Optional right-aligned slot (avatar, settings button, etc.). */
  trailing?: ReactNode;
}

export const LargeTitle = forwardRef<HTMLElement, LargeTitleProps>(function LargeTitle(
  { title, eyebrow, trailing, className, ...props },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn('px-screen flex items-end justify-between gap-3 py-3 pb-4', className)}
      {...props}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div className="text-m-eyebrow text-accent mb-[6px] font-mono tracking-wide uppercase">
            {eyebrow}
          </div>
        )}
        <h1 className="text-m-h1 m-0 truncate leading-tight font-medium tracking-tight">{title}</h1>
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </header>
  );
});

LargeTitle.displayName = 'LargeTitle';
