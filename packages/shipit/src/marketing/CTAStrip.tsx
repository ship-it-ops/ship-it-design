'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * CTAStrip — full-width call-to-action band. Title + body + actions, on a
 * gradient panel background. Sits between feature sections and the footer.
 */

export interface CTAStripProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export const CTAStrip = forwardRef<HTMLElement, CTAStripProps>(function CTAStrip(
  { title, description, actions, className, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn(
        'rounded-xl px-10 py-12 text-center',
        'bg-[linear-gradient(135deg,oklch(0.2_0.08_260),oklch(0.16_0.06_300))]',
        className,
      )}
      {...props}
    >
      <h2 className="m-0 mb-[10px] text-[28px] font-medium tracking-[-0.4px]">{title}</h2>
      {description && <p className="text-text-muted m-0 mb-5 text-[13px]">{description}</p>}
      {actions && <div className="flex flex-wrap justify-center gap-2">{actions}</div>}
    </section>
  );
});

CTAStrip.displayName = 'CTAStrip';
