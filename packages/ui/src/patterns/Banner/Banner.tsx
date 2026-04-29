import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Banner — top-of-page notice. Spans the full width of its container, uses a
 * tinted background derived from the variant color, and supports `sticky`
 * positioning so it stays at the top of the viewport on scroll.
 */

export type BannerVariant = 'info' | 'ok' | 'warn' | 'err';

const bannerStyles = cva(
  'flex items-center gap-[10px] border-b border-border px-[14px] py-2 text-[12px]',
  {
    variants: {
      variant: {
        info: 'bg-[color-mix(in_oklab,var(--color-accent),transparent_82%)] text-accent',
        ok: 'bg-[color-mix(in_oklab,var(--color-ok),transparent_82%)] text-ok',
        warn: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_82%)] text-warn',
        err: 'bg-[color-mix(in_oklab,var(--color-err),transparent_82%)] text-err',
      },
      sticky: {
        true: 'sticky top-0 z-30',
        false: '',
      },
    },
    defaultVariants: { variant: 'info', sticky: false },
  },
);

const defaultGlyph: Record<BannerVariant, string> = {
  info: '✦',
  ok: '✓',
  warn: '!',
  err: '×',
};

export interface BannerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerStyles> {
  /** Override the leading glyph. */
  icon?: ReactNode;
  /** Optional trailing action (e.g., a link). Rendered with `ml-auto`. */
  action?: ReactNode;
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { variant = 'info', sticky, icon, action, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={variant === 'err' || variant === 'warn' ? 'alert' : 'status'}
      className={cn(bannerStyles({ variant, sticky }), className)}
      {...props}
    >
      <span aria-hidden className="leading-none">
        {icon ?? defaultGlyph[variant!]}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
});
