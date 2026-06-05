'use client';

import { Heading, JsonLd, cn, nodeToString, type HeadingLevel } from '@ship-it-ui/ui';
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
 *
 * Emits a schema.org `Offer` JSON-LD entity when `priceCurrency` is
 * provided AND a numeric `priceAmount` (or a parseable `price` string like
 * `"$29"`) is supplied. Cards where the price isn't machine-readable
 * (e.g. `"Talk to us"`) skip JSON-LD emission unless the consumer passes
 * `priceAmount` explicitly. Pass `noStructuredData` to opt out entirely.
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
  /**
   * Heading level for the tier name. Default `'h3'` — pricing tables live
   * under a section `h2` on most pricing pages.
   */
  tierAs?: HeadingLevel;
  /**
   * ISO 4217 currency code (e.g. `'USD'`, `'EUR'`). REQUIRED to emit the
   * `Offer` JSON-LD — without it the script is suppressed.
   */
  priceCurrency?: string;
  /**
   * Explicit machine-readable price (number). When omitted, parsed from the
   * visible `price` string by stripping non-numeric characters. Pass this
   * directly when `price` is JSX or contains unusual formatting.
   */
  priceAmount?: number;
  /**
   * schema.org `availability` URL, typically `'https://schema.org/InStock'`.
   */
  availability?: string;
  /** Optional URL of the tier's product/checkout page. */
  url?: string;
  /** String version of `tier` for the JSON-LD `name`. Required if `tier` is JSX. */
  tierName?: string;
  /** String version of `description` for the JSON-LD `description`. */
  descriptionText?: string;
  /** Opt out of emitting the `Offer` JSON-LD script. */
  noStructuredData?: boolean;
}

function parsePrice(priceAmount: number | undefined, price: ReactNode): number | null {
  if (typeof priceAmount === 'number' && Number.isFinite(priceAmount)) {
    return priceAmount;
  }
  const text = nodeToString(price);
  if (!text) return null;
  // Strip currency symbols / commas / whitespace; keep digits + decimal point.
  const cleaned = text.replace(/[^\d.]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

interface OfferSchema {
  '@context': string;
  '@type': 'Offer';
  name: string;
  description?: string;
  price: number;
  priceCurrency: string;
  availability?: string;
  url?: string;
}

function buildOfferSchema(props: PricingCardProps): OfferSchema | null {
  if (!props.priceCurrency) return null;
  const name = props.tierName ?? nodeToString(props.tier);
  if (!name) return null;
  const numericPrice = parsePrice(props.priceAmount, props.price);
  if (numericPrice === null) return null;
  const schema: OfferSchema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name,
    price: numericPrice,
    priceCurrency: props.priceCurrency,
  };
  const description = props.descriptionText ?? nodeToString(props.description);
  if (description) {
    schema.description = description;
  }
  if (props.availability) {
    schema.availability = props.availability;
  }
  if (props.url) {
    schema.url = props.url;
  }
  return schema;
}

export const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(function PricingCard(
  {
    tier,
    price,
    priceUnit,
    description,
    features,
    action,
    featured,
    tierAs = 'h3',
    priceCurrency,
    priceAmount,
    availability,
    url,
    tierName,
    descriptionText,
    noStructuredData,
    className,
    ...props
  },
  ref,
) {
  const structuredData = !noStructuredData
    ? buildOfferSchema({
        tier,
        price,
        features,
        priceCurrency,
        priceAmount,
        availability,
        url,
        tierName,
        description,
        descriptionText,
      })
    : null;
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
      {structuredData && <JsonLd data={structuredData} />}
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Heading as={tierAs} className="text-[14px] font-medium">
            {tier}
          </Heading>
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
