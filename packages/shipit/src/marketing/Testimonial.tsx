'use client';

import { Avatar } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * Testimonial — pull-quote with author + role. Centered for marketing
 * surfaces.
 */

export interface TestimonialProps extends Omit<HTMLAttributes<HTMLElement>, 'cite' | 'role'> {
  /** The quoted body. */
  quote: ReactNode;
  /** Author display name. */
  author: ReactNode;
  /** Author role / company. */
  role?: ReactNode;
  /** Avatar initials or full node. */
  avatar?: ReactNode;
}

export const Testimonial = forwardRef<HTMLElement, TestimonialProps>(function Testimonial(
  { quote, author, role, avatar, className, ...props },
  ref,
) {
  return (
    <figure
      ref={ref}
      className={cn('mx-auto max-w-[620px] px-6 py-10 text-center', className)}
      {...props}
    >
      <div aria-hidden className="text-accent mb-4 text-[40px] leading-none">
        &ldquo;
      </div>
      <blockquote className="m-0 text-[22px] leading-[1.45] font-medium tracking-[-0.3px]">
        {quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center justify-center gap-[10px]">
        {typeof avatar === 'string' ? <Avatar size="md" name={avatar} /> : avatar}
        <div className="text-left">
          <div className="text-[13px] font-medium">{author}</div>
          {role && <div className="text-text-dim text-[11px]">{role}</div>}
        </div>
      </figcaption>
    </figure>
  );
});

Testimonial.displayName = 'Testimonial';
