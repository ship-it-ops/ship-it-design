'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Rating } from '../../components/Rating';
import { cn } from '../../utils/cn';
import { Carousel } from '../Carousel';

/**
 * ListingCard — a consumer-marketplace card composing photos (`Carousel`),
 * title, `Rating`, price, host, and an optional verified badge / favorite
 * toggle. Distinct from `EntityCard`, which is dev-tool entity chrome.
 */

export interface ListingCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'title'
> {
  /** Photo URLs (or anything `Carousel` can render). At least one. */
  photos: ReadonlyArray<string>;
  /** Listing title — e.g. "2023 Tesla Model 3". */
  title: ReactNode;
  /** Optional eyebrow text above the title (location, vehicle type). */
  eyebrow?: ReactNode;
  /** Average rating (0–5). When undefined, the rating row is hidden. */
  rating?: number;
  /** Number of reviews — shown next to the rating. */
  reviewCount?: number;
  /** Headline price (e.g. `89`). */
  price: ReactNode;
  /** Price unit suffix (e.g. `/day`). */
  priceUnit?: ReactNode;
  /** Original price for sale strike-through. */
  originalPrice?: ReactNode;
  /** Host / owner name. */
  host?: ReactNode;
  /** Distance label (e.g. `0.4 mi away`). */
  distance?: ReactNode;
  /** When true, shows a `verified` badge on the photo. */
  verified?: boolean;
  /** Link target for the whole card. */
  href?: string;
  /** Heart-icon favorite toggle handler. */
  onFavorite?: (next: boolean) => void;
  /** Current favorite state. */
  favorited?: boolean;
  /** Card width override. */
  width?: number | string;
}

export const ListingCard = forwardRef<HTMLDivElement, ListingCardProps>(function ListingCard(
  {
    photos,
    title,
    eyebrow,
    rating,
    reviewCount,
    price,
    priceUnit = '/day',
    originalPrice,
    host,
    distance,
    verified,
    href,
    onFavorite,
    favorited,
    width = 280,
    className,
    ...props
  },
  ref,
) {
  /*
   * a11y: when `href` and `onFavorite` are both set we cannot wrap the whole
   * card in an `<a>` because the favorite `<button>` would become a
   * descendant of an interactive element (axe: nested-interactive).
   *
   * Instead we use the "stretched link" pattern: the `<a>` is rendered as
   * an `absolute inset-0` sibling underneath the favorite button (z-0 vs
   * z-20). Pointer events on the card surface hit the link; pointer events
   * on the heart hit the heart. No nesting, single tab stop per affordance.
   */
  return (
    <Card
      ref={ref}
      className={cn('relative overflow-hidden !p-0', className)}
      style={{ width }}
      {...props}
    >
      <div className="relative">
        <Carousel
          items={photos}
          aria-label={typeof title === 'string' ? `${title} photos` : 'Listing photos'}
          renderItem={(src) => (
            <img
              src={src as string}
              alt=""
              className="block h-full w-full object-cover"
              loading="lazy"
            />
          )}
        />
        {verified && (
          <div className="pointer-events-none absolute top-3 left-3 z-10">
            <Badge variant="ok" size="sm">
              <IconGlyph name="verified" size={11} /> Verified host
            </Badge>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        {eyebrow && (
          <span className="text-text-dim font-mono text-[10px] tracking-wide uppercase">
            {eyebrow}
          </span>
        )}
        <div className="flex items-start justify-between gap-2">
          <span className="text-text text-[14px] leading-snug font-semibold">{title}</span>
          {rating !== undefined && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px]">
              <IconGlyph name="star" size={12} className="text-rating" />
              <span className="text-text font-medium">{rating.toFixed(1)}</span>
              {reviewCount !== undefined && <span className="text-text-dim">({reviewCount})</span>}
            </span>
          )}
        </div>
        {(host || distance) && (
          <div className="text-text-dim flex items-center gap-2 text-[12px]">
            {host && <span>{host}</span>}
            {host && distance && <span aria-hidden>·</span>}
            {distance && <span>{distance}</span>}
          </div>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-text-dim decoration-sale text-[12px] line-through">
              {originalPrice}
            </span>
          )}
          <span className="text-text text-[15px] font-semibold">{price}</span>
          <span className="text-text-dim text-[12px]">{priceUnit}</span>
        </div>
        {rating !== undefined && (
          <Rating value={rating} max={5} precision="half" size="sm" readOnly className="sr-only" />
        )}
      </div>

      {href && (
        <a
          href={href}
          aria-label={typeof title === 'string' ? title : undefined}
          className="absolute inset-0 z-0 no-underline"
        />
      )}

      {onFavorite && (
        <button
          type="button"
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          aria-pressed={favorited}
          onClick={() => onFavorite(!favorited)}
          className={cn(
            'absolute top-3 right-3 z-20 inline-grid h-8 w-8 cursor-pointer place-items-center rounded-full',
            'bg-panel/85 hover:bg-panel border-border border shadow-sm backdrop-blur',
            favorited ? 'text-err' : 'text-text-dim hover:text-text',
          )}
        >
          <IconGlyph name="heart" size={16} />
        </button>
      )}
    </Card>
  );
});

ListingCard.displayName = 'ListingCard';
