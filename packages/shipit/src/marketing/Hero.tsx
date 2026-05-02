import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * Hero — landing-page top section. Optional eyebrow / pill above the headline,
 * a large heading (children of `<h1>`), a body description, and an action row.
 *
 * Designed for marketing surfaces only — do not bring this into the app.
 */

export interface HeroProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Eyebrow / pill rendered above the headline. */
  eyebrow?: ReactNode;
  /** Headline. Pass JSX to highlight a phrase (e.g., `<span className="text-accent">…</span>`). */
  title: ReactNode;
  /** Subheading. */
  description?: ReactNode;
  /** Action buttons row. */
  actions?: ReactNode;
  /** Trailing visual (right-side image, animation). When provided, the hero
   * switches to a two-column layout. */
  visual?: ReactNode;
}

export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero(
  { eyebrow, title, description, actions, visual, className, ...props },
  ref,
) {
  const hasVisual = visual != null;
  return (
    <section
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-between gap-10 px-6 py-16 md:py-24',
        hasVisual && 'md:flex-row md:items-center md:gap-16',
        className,
      )}
      {...props}
    >
      <div className={cn('max-w-[680px]', !hasVisual && 'mx-auto text-center')}>
        {eyebrow}
        <h1
          className={cn(
            'mb-4 text-[44px] leading-[1.05] font-medium tracking-[-1.6px] md:text-[56px]',
            eyebrow && 'mt-5',
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="text-text-muted mb-7 text-[17px] leading-[1.6]">{description}</p>
        )}
        {actions && (
          <div className={cn('flex flex-wrap gap-2', !hasVisual && 'justify-center')}>
            {actions}
          </div>
        )}
      </div>
      {visual && <div className="flex-1">{visual}</div>}
    </section>
  );
});

Hero.displayName = 'Hero';
