'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * PriceBreakdown — labelled line items + a totals row. Used in booking
 * summaries, checkout sheets, trip receipts.
 *
 * Compose with `<PriceBreakdown.Line>` for individual rows, or pass an
 * `items` array for the common case. The `total` is rendered last with a
 * top border separator.
 */

export interface PriceBreakdownItem {
  label: ReactNode;
  /** Optional secondary text (e.g. `$89 × 3 nights`). */
  subLabel?: ReactNode;
  amount: ReactNode;
  /** When set, renders the amount with a strike-through in the `sale` token. */
  originalAmount?: ReactNode;
  /** When true, renders the amount in the `sale` color (e.g. discounts). */
  discount?: boolean;
}

export interface PriceBreakdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Line items rendered in order. */
  items?: ReadonlyArray<PriceBreakdownItem>;
  /** Final total. Pre-formatted (e.g. `$267`). */
  total?: ReactNode;
  /** Label for the total row. Default `'Total'`. */
  totalLabel?: ReactNode;
  /** Currency hint shown next to the total. */
  currency?: ReactNode;
  /** Optional bespoke children — use instead of `items` for custom rows. */
  children?: ReactNode;
}

function PriceBreakdownRoot(
  {
    items,
    total,
    totalLabel = 'Total',
    currency,
    className,
    children,
    ...props
  }: PriceBreakdownProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
      {items?.map((item, i) => (
        <PriceBreakdownLine key={i} {...item} />
      ))}
      {children}
      {total !== undefined && (
        <div className="border-border mt-2 flex items-baseline justify-between border-t pt-3">
          <span className="text-text text-[14px] font-semibold">{totalLabel}</span>
          <span className="text-text text-[16px] font-semibold">
            {total}
            {currency && (
              <span className="text-text-dim ml-1 text-[12px] font-normal">{currency}</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export const PriceBreakdown = forwardRef(PriceBreakdownRoot) as ReturnType<
  typeof forwardRef<HTMLDivElement, PriceBreakdownProps>
> & {
  Line: typeof PriceBreakdownLine;
};

PriceBreakdown.displayName = 'PriceBreakdown';

export interface PriceBreakdownLineProps extends PriceBreakdownItem {
  className?: string;
}

export function PriceBreakdownLine({
  label,
  subLabel,
  amount,
  originalAmount,
  discount,
  className,
}: PriceBreakdownLineProps) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3', className)}>
      <div className="flex min-w-0 flex-col">
        <span className="text-text text-[13px]">{label}</span>
        {subLabel && <span className="text-text-dim text-[11px]">{subLabel}</span>}
      </div>
      <div className="inline-flex shrink-0 items-baseline gap-2">
        {originalAmount && (
          <span className="text-text-dim decoration-sale text-[12px] line-through">
            {originalAmount}
          </span>
        )}
        <span className={cn('text-[13px] font-medium', discount ? 'text-sale-text' : 'text-text')}>
          {amount}
        </span>
      </div>
    </div>
  );
}

PriceBreakdown.Line = PriceBreakdownLine;
