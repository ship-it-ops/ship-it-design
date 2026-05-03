'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

const cardStyles = cva(
  'block bg-panel border border-border rounded-base transition-[border-color,transform,box-shadow] duration-(--duration-step)',
  {
    variants: {
      variant: {
        default: '',
        ghost: 'bg-transparent',
        elevated: 'shadow',
      },
      interactive: {
        true: 'cursor-pointer hover:border-border-strong hover:-translate-y-px hover:shadow',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', interactive: false },
  },
);

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof cardStyles> {
  /** Render a header row with this title (and optional `actions`). */
  title?: ReactNode;
  /** Description shown under the title (or above children when no title). */
  description?: ReactNode;
  /** Action slot rendered to the right of the title. */
  actions?: ReactNode;
  /** Footer slot rendered with a top divider beneath children. */
  footer?: ReactNode;
  /**
   * Keyboard activation handler. When provided, Enter/Space on a card with
   * `role="button"` (i.e. `interactive` truthy) calls this instead of
   * synthesizing a fake mouse event for `onClick` — downstream `e.button` /
   * `e.clientX` reads from the synthesized event are `undefined`, so prefer
   * `onActivate` when you need an intent-only callback.
   */
  onActivate?: () => void;
}

/**
 * Standard surface for a chunk of content. All cards share the same chrome
 * (panel bg, 1px border, 10px radius); variation comes from what's inside.
 *
 * Compose with the `<Card title="…" actions={…} footer={…}>` API for simple
 * cases, or pass children directly for full control.
 *
 * NOTE on `interactive`: a card with `interactive` resolves to
 * `role="button" tabIndex=0`. If the same card also renders interactive
 * children (e.g. via `actions`), screen readers see a button-inside-button —
 * an axe `nested-interactive` violation. For "the whole card is one link"
 * use `<CardLink>` instead. In the actions-present + interactive case we
 * downgrade to a plain `<div>` (and warn in dev) so the assistive-tech tree
 * stays valid.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant,
    interactive,
    title,
    description,
    actions,
    footer,
    className,
    children,
    onClick,
    onActivate,
    ...props
  },
  ref,
) {
  const wantsInteractive = interactive ?? Boolean(onClick);
  const hasActions = actions != null;
  // Nested-interactive guard: a card containing action buttons must not itself
  // claim role="button". Drop the role/tabIndex but keep the click handler so
  // background activation still fires for non-AT users.
  if (wantsInteractive && hasActions && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[Card] `interactive` was requested but `actions` is also set, which would create a nested-interactive a11y violation. The card will render as a plain <div>. Use <CardLink> for whole-card links, or move the actions outside the card.',
    );
  }
  const isInteractive = wantsInteractive && !hasActions;
  const handleKeyDown = isInteractive
    ? (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (onActivate) {
          e.preventDefault();
          onActivate();
        } else if (onClick) {
          e.preventDefault();
          // Fallback: callers that didn't pass onActivate still need keyboard
          // parity with mouse, so synthesize a minimal event. Reads of
          // mouse-only fields (`e.button`, `e.clientX`) will be undefined —
          // hence the preference for onActivate above.
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }
    : undefined;
  return (
    <div
      ref={ref}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={cn(cardStyles({ variant, interactive: wantsInteractive }), 'p-[18px]', className)}
      {...props}
    >
      {(title || actions) && (
        <div className={cn('flex items-start gap-3', (description || children) && 'mb-[10px]')}>
          {title && <div className="flex-1 text-[14px] font-medium">{title}</div>}
          {actions && <div className="flex gap-1">{actions}</div>}
        </div>
      )}
      {description && (
        <div className={cn('text-text-muted text-[12px] leading-[1.55]', children && 'mb-[14px]')}>
          {description}
        </div>
      )}
      {children}
      {footer && (
        <div className="border-border text-text-dim mt-[14px] border-t pt-3 text-[11px]">
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export interface CardLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'>, VariantProps<typeof cardStyles> {
  /** Destination URL. The whole card becomes a single link to this URL. */
  href: string;
  /** Render a header row with this title. */
  title?: ReactNode;
  /** Description shown under the title (or above children when no title). */
  description?: ReactNode;
  /** Footer slot rendered with a top divider beneath children. */
  footer?: ReactNode;
}

/**
 * Whole-card link. Use this when "click anywhere on the card" should
 * navigate — it renders a single `<a>` so assistive tech sees one link
 * (no nested-interactive problem) and the browser handles middle-click,
 * cmd-click, hover preview, etc. without bespoke wiring.
 *
 * Does not accept an `actions` slot: action buttons inside a link are a
 * nested-interactive violation. Put per-card actions next to the card
 * instead, or use the plain `<Card>` for non-link cards.
 */
export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { variant, title, description, footer, className, children, href, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        cardStyles({ variant, interactive: true }),
        'focus-visible:ring-accent-dim p-[18px] no-underline outline-none focus-visible:ring-[3px]',
        className,
      )}
      {...props}
    >
      {title && (
        <div className={cn('flex items-start', (description || children) && 'mb-[10px]')}>
          <div className="flex-1 text-[14px] font-medium">{title}</div>
        </div>
      )}
      {description && (
        <div className={cn('text-text-muted text-[12px] leading-[1.55]', children && 'mb-[14px]')}>
          {description}
        </div>
      )}
      {children}
      {footer && (
        <div className="border-border text-text-dim mt-[14px] border-t pt-3 text-[11px]">
          {footer}
        </div>
      )}
    </a>
  );
});

CardLink.displayName = 'CardLink';

export { cardStyles };
