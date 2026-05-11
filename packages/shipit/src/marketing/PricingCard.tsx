'use client';

import { cn } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * PricingCard — single tier in a pricing table. Shows tier name, price,
 * description, list of features (with ✓ markers), and an action button slot.
 *
 * The card establishes a CSS container, so the price scales with the card's
 * own inline-size rather than the viewport — when three cards crowd into a
 * narrow column the price doesn't blow out the layout.
 *
 * Pass `featured` to highlight the card with an accent border + tinted
 * background for the "recommended" tier. Use `priceUnit` for per-period
 * suffixes (e.g. `/ user / mo`) so the unit lays out next to the price
 * baseline-aligned and wraps cleanly when there isn't room.
 */

export interface PricingCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Tier name — e.g., `Pro`, `Team`. */
  tier: ReactNode;
  /** Headline price, e.g. `$29` or `Talk to us`. */
  price: ReactNode;
  /** Optional small unit rendered next to the price, e.g. `/ user / mo`. */
  priceUnit?: ReactNode;
  /** Short description below the tier name. */
  description?: ReactNode;
  /** Feature bullet list. */
  features: ReadonlyArray<ReactNode>;
  /** Action button (typically a `<Button>`). */
  action?: ReactNode;
  /** Highlight as the recommended tier. */
  featured?: boolean;
}

export const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(function PricingCard(
  { tier, price, priceUnit, description, features, action, featured, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-panel @container flex flex-col gap-5 rounded-lg border p-5 @sm:p-6',
        featured ? 'border-accent shadow-lg' : 'border-border',
        className,
      )}
      {...props}
    >
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-medium">{tier}</span>
          {featured && (
            <span className="bg-accent-dim text-accent rounded-full px-[6px] py-[1px] font-mono text-[10px]">
              recommended
            </span>
          )}
        </div>
        {description && <div className="text-text-muted text-[12px]">{description}</div>}
      </div>
      <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
        <span className="font-mono text-[22px] font-medium tracking-[-0.5px] text-balance @sm:text-[28px]">
          {price}
        </span>
        {priceUnit != null && (
          <span className="text-text-dim text-[12px] whitespace-nowrap @sm:text-[13px]">
            {priceUnit}
          </span>
        )}
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px]">
            <span aria-hidden className="text-accent">
              ✓
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {action && <div className="mt-auto">{action}</div>}
    </div>
  );
});

PricingCard.displayName = 'PricingCard';
