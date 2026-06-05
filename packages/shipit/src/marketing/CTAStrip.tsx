'use client';

import { Heading, cn, type HeadingLevel } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * CTAStrip — full-width call-to-action band. Title + body + actions, on a
 * gradient panel background. Sits between feature sections and the footer.
 */

export interface CTAStripProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /**
   * Heading level for the title. Default `'h2'`. Marketing pages typically
   * place a CTAStrip between sections, so an `h2` matches the section
   * hierarchy under the page `h1`.
   */
  titleAs?: HeadingLevel;
  description?: ReactNode;
  actions?: ReactNode;
}

export const CTAStrip = forwardRef<HTMLElement, CTAStripProps>(function CTAStrip(
  { title, titleAs = 'h2', description, actions, className, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn(
        'rounded-xl px-10 py-12 text-center',
        'bg-[linear-gradient(135deg,var(--color-cta-from),var(--color-cta-to))]',
        className,
      )}
      {...props}
    >
      <Heading as={titleAs} className="m-0 mb-[10px] text-[28px] font-medium tracking-[-0.4px]">
        {title}
      </Heading>
      {description && <p className="text-text-muted m-0 mb-5 text-[13px]">{description}</p>}
      {actions && <div className="flex flex-wrap justify-center gap-2">{actions}</div>}
    </section>
  );
});

CTAStrip.displayName = 'CTAStrip';
