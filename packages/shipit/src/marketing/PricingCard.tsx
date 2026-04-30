import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * PricingCard — single tier in a pricing table. Shows tier name, price,
 * description, list of features (with ✓ markers), and an action button slot.
 *
 * Pass `featured` to highlight the card with an accent border + tinted
 * background for the "recommended" tier.
 */

export interface PricingCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Tier name — e.g., `Pro`, `Team`. */
  tier: ReactNode;
  /** Price. Pass JSX (`<span>$29</span><span> / mo</span>`) for layout. */
  price: ReactNode;
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
  { tier, price, description, features, action, featured, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-5 rounded-lg border bg-panel p-6',
        featured ? 'border-accent shadow-lg' : 'border-border',
        className,
      )}
      {...props}
    >
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[14px] font-medium">{tier}</span>
          {featured && (
            <span className="rounded-full bg-accent-dim px-[6px] py-[1px] font-mono text-[10px] text-accent">
              recommended
            </span>
          )}
        </div>
        {description && <div className="text-[12px] text-text-muted">{description}</div>}
      </div>
      <div className="font-mono text-[28px] font-medium tracking-[-0.5px]">{price}</div>
      <ul className="flex flex-col gap-2 m-0 p-0 list-none">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px]">
            <span aria-hidden className="text-accent">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {action && <div className="mt-auto">{action}</div>}
    </div>
  );
});
