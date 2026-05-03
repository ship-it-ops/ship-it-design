'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Banner — top-of-page notice. Spans the full width of its container, uses a
 * tinted background derived from the tone color, and supports `sticky`
 * positioning so it stays at the top of the viewport on scroll.
 */

export type BannerTone = 'accent' | 'ok' | 'warn' | 'err';

const bannerStyles = cva(
  'flex items-center gap-3 border-b border-border px-[14px] py-2 text-[12px]',
  {
    variants: {
      tone: {
        accent: 'bg-[color-mix(in_oklab,var(--color-accent),transparent_82%)] text-accent',
        ok: 'bg-[color-mix(in_oklab,var(--color-ok),transparent_82%)] text-ok',
        warn: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_82%)] text-warn',
        err: 'bg-[color-mix(in_oklab,var(--color-err),transparent_82%)] text-err',
      },
      sticky: {
        true: 'sticky top-0 z-sticky',
        false: '',
      },
    },
    defaultVariants: { tone: 'accent', sticky: false },
  },
);

const defaultGlyph: Record<BannerTone, string> = {
  accent: '✦',
  ok: '✓',
  warn: '!',
  err: '×',
};

export interface BannerProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof bannerStyles> {
  /** Override the leading glyph. */
  icon?: ReactNode;
  /** Optional trailing action (e.g., a link). Rendered with `ml-auto`. */
  action?: ReactNode;
  /**
   * Aria-live behavior for the banner. Default `'polite'`.
   *
   * Banners that are part of the initial page render should leave this at the
   * default — `role="alert"` (which is `aria-live="assertive"`) interrupts the
   * screen reader on every page load. Set `'assertive'` only for urgent
   * banners that appear *after* initial render. Set `'off'` to suppress
   * announcements entirely (still rendered, still has `role="status"`).
   */
  live?: 'off' | 'polite' | 'assertive';
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { tone = 'accent', sticky, icon, action, live = 'polite', className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={live === 'assertive' ? 'alert' : 'status'}
      aria-live={live === 'off' ? undefined : live}
      className={cn(bannerStyles({ tone, sticky }), className)}
      {...props}
    >
      <span aria-hidden className="leading-none">
        {icon ?? defaultGlyph[tone!]}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
});

Banner.displayName = 'Banner';
