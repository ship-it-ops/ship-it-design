'use client';

import { IconGlyph, type GlyphName } from '@ship-it-ui/icons';
import { cva } from 'class-variance-authority';
import { forwardRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Rating } from '../../components/Rating';
import { cn } from '../../utils/cn';
import { Carousel } from '../Carousel';

/**
 * Hover affordance for the card root. Module-scoped so the cva function is
 * stable across renders (it's pure config). `none` is the no-affordance
 * branch — used for static cards (no onClick / href).
 */
const hoverVariants = cva('', {
  variants: {
    hoverEffect: {
      lift: 'transition-[transform,box-shadow,border-color] duration-(--duration-micro) hover:-translate-y-px hover:shadow hover:border-border-strong',
      glow: 'transition-[box-shadow,border-color] duration-(--duration-micro) hover:ring-[3px] hover:ring-accent-dim hover:border-accent',
      none: '',
    },
  },
});

/**
 * ListingCard — a marketplace card for a single listing.
 *
 * Two visual variants share the same photo + price + title spine:
 *
 *   - `default` — consumer-stay style: rating, host, distance, favorite
 *     heart. Built for marketplace grids (Airbnb / Turo search-result row).
 *   - `spec`    — product-spec style: a flag pill, photo counter, a
 *     spec grid (e.g. 0-60 / power / drive), and an inline CTA. Better
 *     for premium / spec-driven inventory (sports cars, electronics).
 *
 * Distinct from `EntityCard`, which is dev-tool entity chrome.
 */

export type ListingCardVariant = 'default' | 'spec';

export interface ListingCardFlag {
  /** Glyph rendered to the left of the label. */
  icon?: GlyphName;
  /** Pill label, e.g. "Flagship", "New", "Editor's pick". */
  label: ReactNode;
  /** Badge tone. Default `accent`. */
  tone?: 'accent' | 'purple' | 'pink' | 'ok' | 'warn';
}

export interface ListingCardSpec {
  /** Small label (typographically rendered as uppercase). */
  label: ReactNode;
  /** Headline value below the label. */
  value: ReactNode;
}

export interface ListingCardCta {
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export interface ListingCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'title' | 'onClick'
> {
  /** Visual variant. Default `default`. */
  variant?: ListingCardVariant;

  /** Photo URLs (or anything `Carousel` can render). At least one. */
  photos: ReadonlyArray<string>;
  /**
   * Override the photo renderer. Defaults to a decorative `<img src>`.
   * Use this when consumers need theme-aware photos (e.g. inline SVG
   * placeholders that follow `currentColor`) or non-image slides.
   */
  renderPhoto?: (src: string, index: number) => ReactNode;
  /**
   * Wrap the photo carousel past the boundaries (next from the last
   * photo goes to the first). Default `true` — marketplace photo
   * browsing expects looping. Pass `false` to restore stop-at-end.
   */
  loop?: boolean;
  /** Listing title — e.g. "2023 Tesla Model 3". */
  title: ReactNode;
  /** Optional eyebrow text above the title (location, vehicle type). */
  eyebrow?: ReactNode;

  /** Headline price (e.g. `89`). */
  price: ReactNode;
  /** Price unit suffix (e.g. `/day`). */
  priceUnit?: ReactNode;
  /** Original price for sale strike-through. */
  originalPrice?: ReactNode;
  /** Prefix shown before the price — e.g. "from". `spec` variant only. */
  pricePrefix?: ReactNode;

  /** Card width override. */
  width?: number | string;
  /** Link target for the whole card (default) or the title (spec). */
  href?: string;
  /**
   * Whole-card click handler. Renders an invisible stretched `<button>`
   * underneath the inner actions (favorite, CTA, links) so clicks on
   * those take precedence. Use this for "click card → open detail"
   * without leaving the page.
   */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Visual treatment on hover. Default `lift` when the card is
   * interactive (has `onClick` / `href`), otherwise `none`.
   */
  hoverEffect?: 'lift' | 'glow' | 'none';

  // ── default-variant props ──────────────────────────────────────────────

  /** Average rating (0–5). When undefined, the rating row is hidden. */
  rating?: number;
  /** Number of reviews — shown next to the rating. */
  reviewCount?: number;
  /** Host / owner name. */
  host?: ReactNode;
  /** Distance label (e.g. `0.4 mi away`). */
  distance?: ReactNode;
  /** When true, shows a `verified` badge on the photo. */
  verified?: boolean;
  /** Heart-icon favorite toggle handler. */
  onFavorite?: (next: boolean) => void;
  /** Current favorite state. */
  favorited?: boolean;

  // ── spec-variant props ─────────────────────────────────────────────────

  /** Pill rendered top-left of the photo. */
  flag?: ListingCardFlag;
  /** Small category tag right-aligned in the title row. */
  category?: ReactNode;
  /** Dim secondary line under the title (e.g. listing ID · year). */
  meta?: ReactNode;
  /** Spec cells rendered as a grid below the title block. */
  specs?: ReadonlyArray<ListingCardSpec>;
  /** Bottom CTA button. When set, no whole-card stretched link is rendered. */
  cta?: ListingCardCta;
  /** Hide the photo counter overlay in `spec` variant. Default `false`. */
  hidePhotoCounter?: boolean;

  /**
   * Per-section className overrides. Each key targets a specific element in
   * the rendered tree; values are merged with the component's own utilities
   * via `cn()` so consumers can override, extend, or replace any styling
   * without forking the component.
   *
   * The `className` prop still controls the outer Card element — `classNames.root`
   * is an alias that's also merged onto it.
   */
  classNames?: Partial<{
    /** Outer Card element. Merged with `className`. */
    root: string;
    /** Wrapper around the photo Carousel (includes overlays). */
    photos: string;
    /** Top-left flag pill (spec variant). */
    flag: string;
    /** Top-right photo counter (spec variant). */
    photoCounter: string;
    /** Top-right favorite heart button (default variant). */
    favorite: string;
    /** Body content wrapper below the photos. */
    body: string;
    /** Header row containing title + (rating | category). */
    header: string;
    /** Title text. */
    title: string;
    /** Eyebrow text above the title (default variant). */
    eyebrow: string;
    /** Category tag in the title row (spec variant). */
    category: string;
    /** Meta line under the title (spec variant) or host/distance row (default). */
    meta: string;
    /** Spec grid container (spec variant). */
    specs: string;
    /** Each spec cell wrapper (spec variant). */
    specCell: string;
    /** Each spec cell's small uppercase label. */
    specLabel: string;
    /** Each spec cell's headline value. */
    specValue: string;
    /** Footer strip (price + CTA, spec variant) or price row (default). */
    footer: string;
    /** Price text. */
    price: string;
    /** Price unit (e.g. `/day`). */
    priceUnit: string;
    /** CTA button (spec variant). */
    cta: string;
  }>;
}

const flagToneClass: Record<NonNullable<ListingCardFlag['tone']>, string> = {
  accent: 'bg-accent-dim text-accent',
  purple: 'bg-[color-mix(in_oklab,var(--color-purple),transparent_75%)] text-purple',
  pink: 'bg-[color-mix(in_oklab,var(--color-pink),transparent_75%)] text-pink',
  ok: 'bg-[color-mix(in_oklab,var(--color-ok),transparent_75%)] text-ok',
  warn: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_75%)] text-warn',
};

export const ListingCard = forwardRef<HTMLDivElement, ListingCardProps>(function ListingCard(
  {
    variant = 'default',
    photos,
    renderPhoto,
    loop = true,
    onClick,
    hoverEffect,
    title,
    eyebrow,
    rating,
    reviewCount,
    price,
    priceUnit = '/day',
    originalPrice,
    pricePrefix,
    host,
    distance,
    verified,
    href,
    onFavorite,
    favorited,
    width = variant === 'spec' ? 320 : 280,
    flag,
    category,
    meta,
    specs,
    cta,
    hidePhotoCounter,
    classNames: cls = {},
    className,
    ...props
  },
  ref,
) {
  // Spec variant controls the carousel index so it can drive the counter.
  const [photoIndex, setPhotoIndex] = useState(0);
  const isSpec = variant === 'spec';

  const stretchedLinkSupported = !isSpec || (!cta && !!href);
  const isInteractive = Boolean(onClick) || Boolean(href);
  const effectiveHover: 'lift' | 'glow' | 'none' = hoverEffect ?? (isInteractive ? 'lift' : 'none');
  const hoverClass = hoverVariants({ hoverEffect: effectiveHover });

  return (
    <Card
      ref={ref}
      /*
       * `isolate` (CSS isolation: isolate) forces a new stacking context on
       * the card. Without it, child elements with `z-10` (flag pill, photo
       * counter, footer CTA, consumer-supplied editable cells) participate
       * in the page's root stacking context and can bleed *over* a portaled
       * modal whose ancestor chain doesn't create a comparable context.
       * Isolating here keeps every z-* utility scoped inside the card.
       */
      className={cn('relative isolate overflow-hidden !p-0', hoverClass, cls.root, className)}
      style={{ width }}
      {...props}
    >
      <div className={cn('relative', cls.photos)}>
        <Carousel
          items={photos}
          loop={loop}
          {...(isSpec
            ? {
                index: photoIndex,
                onIndexChange: setPhotoIndex,
                showDots: false,
              }
            : {})}
          aria-label={typeof title === 'string' ? `${title} photos` : 'Listing photos'}
          renderItem={(src, i) =>
            renderPhoto ? (
              renderPhoto(src as string, i)
            ) : (
              <img
                src={src as string}
                alt=""
                className="block h-full w-full object-cover"
                loading="lazy"
              />
            )
          }
        />

        {!isSpec && verified && (
          <div className="pointer-events-none absolute top-3 left-3 z-10">
            <Badge variant="ok" size="sm">
              <IconGlyph name="verified" size={11} /> Verified host
            </Badge>
          </div>
        )}

        {isSpec && flag && (
          <div className="pointer-events-none absolute top-3 left-3 z-10">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur',
                flagToneClass[flag.tone ?? 'accent'],
                cls.flag,
              )}
            >
              {flag.icon && <IconGlyph name={flag.icon} size={11} />}
              {flag.label}
            </span>
          </div>
        )}

        {isSpec && !hidePhotoCounter && photos.length > 1 && (
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-3 right-3 z-10 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur',
              cls.photoCounter,
            )}
          >
            {photoIndex + 1} / {photos.length}
          </div>
        )}
      </div>

      {isSpec ? (
        <div className={cn('flex flex-col', cls.body)}>
          <div className={cn('flex flex-col gap-2 p-4 pb-3', cls.header)}>
            <div className="flex items-start justify-between gap-2">
              <span className={cn('text-text text-[15px] leading-snug font-semibold', cls.title)}>
                {title}
              </span>
              {category && (
                <span
                  className={cn(
                    'border-border bg-panel-2 text-text-muted shrink-0 rounded-full border px-2 py-0.5 text-[10px] tracking-wide uppercase',
                    cls.category,
                  )}
                >
                  {category}
                </span>
              )}
            </div>
            {meta && (
              <span className={cn('text-text-dim font-mono text-[11px] tracking-wide', cls.meta)}>
                {meta}
              </span>
            )}

            {specs && specs.length > 0 && (
              <dl
                className={cn(
                  'border-border mt-1 grid gap-2 border-t pt-3',
                  specs.length === 2 && 'grid-cols-2',
                  specs.length === 3 && 'grid-cols-3',
                  specs.length >= 4 && 'grid-cols-4',
                  cls.specs,
                )}
              >
                {specs.map((s, i) => (
                  <div key={i} className={cn('flex flex-col gap-0.5', cls.specCell)}>
                    <dt
                      className={cn(
                        'text-text-dim text-[10px] tracking-wider uppercase',
                        cls.specLabel,
                      )}
                    >
                      {s.label}
                    </dt>
                    <dd className={cn('text-text text-[13px] font-medium', cls.specValue)}>
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div
            className={cn(
              'border-border bg-panel-2 relative z-10 flex items-center justify-between gap-2 border-t px-4 py-3',
              cls.footer,
            )}
          >
            <div className="flex flex-col leading-tight">
              <div className="flex items-baseline gap-1.5">
                {pricePrefix && <span className="text-text-dim text-[11px]">{pricePrefix}</span>}
                {originalPrice && (
                  <span className="text-text-dim decoration-sale text-[11px] line-through">
                    {originalPrice}
                  </span>
                )}
                <span className={cn('text-text text-[15px] font-semibold', cls.price)}>
                  {price}
                </span>
                <span className={cn('text-text-dim text-[11px]', cls.priceUnit)}>{priceUnit}</span>
              </div>
            </div>
            {cta &&
              (cta.href ? (
                <Button
                  asChild
                  variant="primary"
                  size="sm"
                  disabled={cta.disabled}
                  className={cls.cta}
                >
                  <a href={cta.href} onClick={cta.onClick}>
                    {cta.label}
                  </a>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={cta.onClick}
                  disabled={cta.disabled}
                  className={cls.cta}
                >
                  {cta.label}
                </Button>
              ))}
          </div>
        </div>
      ) : (
        <div className={cn('flex flex-col gap-1 p-3', cls.body)}>
          {eyebrow && (
            <span
              className={cn(
                'text-text-dim font-mono text-[10px] tracking-wide uppercase',
                cls.eyebrow,
              )}
            >
              {eyebrow}
            </span>
          )}
          <div className={cn('flex items-start justify-between gap-2', cls.header)}>
            <span className={cn('text-text text-[14px] leading-snug font-semibold', cls.title)}>
              {title}
            </span>
            {rating !== undefined && (
              <span className="inline-flex shrink-0 items-center gap-1 text-[12px]">
                <IconGlyph name="star" size={12} className="text-rating" />
                <span className="text-text font-medium">{rating.toFixed(1)}</span>
                {reviewCount !== undefined && (
                  <span className="text-text-dim">({reviewCount})</span>
                )}
              </span>
            )}
          </div>
          {(host || distance) && (
            <div className={cn('text-text-dim flex items-center gap-2 text-[12px]', cls.meta)}>
              {host && <span>{host}</span>}
              {host && distance && <span aria-hidden>·</span>}
              {distance && <span>{distance}</span>}
            </div>
          )}
          <div className={cn('mt-2 flex items-baseline gap-2', cls.footer)}>
            {originalPrice && (
              <span className="text-text-dim decoration-sale text-[12px] line-through">
                {originalPrice}
              </span>
            )}
            <span className={cn('text-text text-[15px] font-semibold', cls.price)}>{price}</span>
            <span className={cn('text-text-dim text-[12px]', cls.priceUnit)}>{priceUnit}</span>
          </div>
          {rating !== undefined && (
            <Rating
              value={rating}
              max={5}
              precision="half"
              size="sm"
              readOnly
              className="sr-only"
            />
          )}
        </div>
      )}

      {/*
       * a11y: in the default variant we use the "stretched link" pattern so
       * the whole-card link doesn't nest the favorite button (axe:
       * nested-interactive). In the spec variant the CTA button IS the
       * primary affordance, so we skip the stretched link when a CTA is
       * present and let the title link (if any) live inline instead.
       */}
      {href && stretchedLinkSupported && !onClick && (
        <a
          href={href}
          aria-label={typeof title === 'string' ? title : undefined}
          className="absolute inset-0 z-0 no-underline"
        />
      )}

      {onClick && (
        <button
          type="button"
          onClick={onClick}
          aria-label={typeof title === 'string' ? `View ${title}` : 'View listing'}
          className="focus-visible:ring-accent-dim absolute inset-0 z-0 cursor-pointer bg-transparent outline-none focus-visible:ring-[3px]"
        />
      )}

      {!isSpec && onFavorite && (
        <button
          type="button"
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          aria-pressed={favorited}
          onClick={() => onFavorite(!favorited)}
          className={cn(
            'absolute top-3 right-3 z-20 inline-grid h-8 w-8 cursor-pointer place-items-center rounded-full',
            'bg-panel/85 hover:bg-panel border-border border shadow-sm backdrop-blur',
            favorited ? 'text-err' : 'text-text-dim hover:text-text',
            cls.favorite,
          )}
        >
          <IconGlyph name="heart" size={16} />
        </button>
      )}
    </Card>
  );
});

ListingCard.displayName = 'ListingCard';
