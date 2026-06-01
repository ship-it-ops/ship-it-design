'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { IconGlyph, type GlyphName } from '@ship-it-ui/icons';
import { forwardRef, useState, type ReactNode } from 'react';

import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Rating } from '../../components/Rating';
import { cn } from '../../utils/cn';
import { Carousel } from '../Carousel';
import { Lightbox } from '../Lightbox';
import type { ListingCardCta, ListingCardFlag, ListingCardSpec } from '../ListingCard';

/**
 * ListingDetail — full marketplace listing popup. Photos on the left
 * (Carousel, click to open Lightbox for fullscreen), info on the right.
 * Stacks on narrow viewports. Built on Radix Dialog so focus trap,
 * Escape, and ARIA are inherited.
 *
 * Two visual variants mirror `ListingCard`:
 *
 *   - `default` — consumer-stay style: rating, host, features, primary /
 *     secondary CTAs.
 *   - `spec`    — product-spec style: a flag pill on the photo, photo
 *     counter, spec grid, and a dark CTA bar with a single primary action.
 */

export type ListingDetailVariant = 'default' | 'spec';

export interface ListingDetailHost {
  name: ReactNode;
  avatarUrl?: string;
  /** Renders a small `verified` badge next to the name. */
  verified?: boolean;
  /** Free-text meta line under the name, e.g. "Host since 2022 · 312 trips". */
  meta?: ReactNode;
}

export interface ListingDetailFeature {
  icon: GlyphName;
  label: ReactNode;
}

export interface ListingDetailAction {
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  /** Disables the button while keeping it focusable for tooltips. */
  disabled?: boolean;
}

function renderAction(action: ListingDetailAction, variant: 'primary' | 'ghost'): ReactNode {
  if (action.href) {
    return (
      <Button asChild variant={variant} disabled={action.disabled}>
        <a href={action.href} onClick={action.onClick}>
          {action.label}
        </a>
      </Button>
    );
  }
  return (
    <Button variant={variant} onClick={action.onClick} disabled={action.disabled}>
      {action.label}
    </Button>
  );
}

const flagToneClass: Record<NonNullable<ListingCardFlag['tone']>, string> = {
  accent: 'bg-accent-dim text-accent',
  purple: 'bg-[color-mix(in_oklab,var(--color-purple),transparent_75%)] text-purple',
  pink: 'bg-[color-mix(in_oklab,var(--color-pink),transparent_75%)] text-pink',
  ok: 'bg-[color-mix(in_oklab,var(--color-ok),transparent_75%)] text-ok',
  warn: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_75%)] text-warn',
};

export interface ListingDetailProps {
  /** Visual variant. Default `default`. */
  variant?: ListingDetailVariant;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Photo URLs. At least one. */
  photos: ReadonlyArray<string>;
  /**
   * Override the photo renderer for the gallery and the fullscreen
   * `Lightbox`. Defaults to decorative `<img src>` (object-cover in the
   * gallery, object-contain in the lightbox). Use this for theme-aware
   * placeholders or non-image slides.
   */
  renderPhoto?: (src: string, index: number, mode: 'gallery' | 'lightbox') => ReactNode;
  /**
   * Wrap the gallery carousel and the fullscreen lightbox past the
   * boundaries (next from the last photo goes to the first). Default
   * `true` — marketplace photo browsing expects looping. One prop
   * drives both surfaces.
   */
  loop?: boolean;
  /** Listing title — e.g. "2023 Tesla Model 3". */
  title: ReactNode;
  /** Optional eyebrow above the title — vehicle type, location. */
  eyebrow?: ReactNode;
  /** Long-form description body. */
  description?: ReactNode;

  /** Average rating (0–5). When undefined, the rating row is hidden. */
  rating?: number;
  /** Total review count, shown next to the rating. */
  reviewCount?: number;

  /** Headline price (e.g. `$89`). */
  price: ReactNode;
  /** Suffix after the price (e.g. `/day`). */
  priceUnit?: ReactNode;
  /** Original price for a strike-through; renders only when set. */
  originalPrice?: ReactNode;
  /** Prefix shown before the price — e.g. "from". `spec` variant only. */
  pricePrefix?: ReactNode;

  /** Host card data — name + avatar + optional verified / meta line. */
  host?: ListingDetailHost;

  /** Feature chips (e.g. seats, fuel, A/C). */
  features?: ReadonlyArray<ListingDetailFeature>;

  /** Primary CTA — typically "Book now". Default variant. */
  primaryAction?: ListingDetailAction;
  /** Secondary CTA — typically "Message host". Default variant. */
  secondaryAction?: ListingDetailAction;

  // ── spec-variant props ────────────────────────────────────────────────

  /** Pill rendered top-left of the photo. */
  flag?: ListingCardFlag;
  /** Small category tag right-aligned in the title row. */
  category?: ReactNode;
  /** Dim secondary line under the title (e.g. listing ID · year). */
  meta?: ReactNode;
  /** Spec cells rendered as a grid in the info column. */
  specs?: ReadonlyArray<ListingCardSpec>;
  /** Primary CTA rendered in the dark bottom bar. `spec` variant. */
  cta?: ListingCardCta;
  /** Hide the photo counter overlay in `spec` variant. Default `false`. */
  hidePhotoCounter?: boolean;

  /**
   * Per-section className overrides. Each key targets a specific element
   * in the rendered tree; values are merged with the component's own
   * utilities via `cn()`.
   */
  classNames?: Partial<{
    /** RadixDialog.Overlay (the darkened backdrop). */
    overlay: string;
    /** RadixDialog.Content (the modal panel). */
    content: string;
    /** Two-column grid inside the panel. */
    grid: string;
    /** Photos column wrapper. */
    photos: string;
    /** Info column wrapper. */
    info: string;
    /** Header (title + category + meta + rating). */
    header: string;
    /** Title text. */
    title: string;
    /** Category tag (spec variant). */
    category: string;
    /** Meta line (spec variant). */
    meta: string;
    /** Spec grid container (spec variant). */
    specs: string;
    /** Each spec cell wrapper. */
    specCell: string;
    specLabel: string;
    specValue: string;
    /** Host row (default variant). */
    host: string;
    /** Feature chips list (default variant). */
    features: string;
    /** Description paragraph. */
    description: string;
    /** Footer / bottom CTA bar. */
    footer: string;
    /** Price text inside the footer. */
    price: string;
    /** Price unit text inside the footer. */
    priceUnit: string;
    /** CTA button (spec variant) or primary action button (default). */
    cta: string;
    /** Top-left flag pill on the photos (spec variant). */
    flag: string;
    /** Top-right photo counter (spec variant). */
    photoCounter: string;
    /** Close button (top-right corner). */
    close: string;
  }>;
}

export const ListingDetail = forwardRef<HTMLDivElement, ListingDetailProps>(function ListingDetail(
  {
    variant = 'default',
    open,
    defaultOpen,
    onOpenChange,
    photos,
    renderPhoto,
    loop = true,
    title,
    eyebrow,
    description,
    rating,
    reviewCount,
    price,
    priceUnit = '/day',
    originalPrice,
    pricePrefix,
    host,
    features,
    primaryAction,
    secondaryAction,
    flag,
    category,
    meta,
    specs,
    cta,
    hidePhotoCounter,
    classNames: cls = {},
  },
  ref,
) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isSpec = variant === 'spec';

  const lightboxTitle = typeof title === 'string' ? `${title} photos` : 'Listing photos';

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={cn(
            'z-overlay fixed inset-0 bg-black/55 backdrop-blur-[4px]',
            'data-[state=open]:animate-[ship-fade-in_150ms_ease]',
            cls.overlay,
          )}
        />
        <RadixDialog.Content
          ref={ref}
          // Match `Dialog.tsx` precedent: only opt out of the
          // aria-describedby link when no description is provided, so the
          // dialog gets a real accessible description when one exists.
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            'z-modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-[calc(100%-32px)] max-w-[960px]',
            'max-h-[min(92vh,820px)] overflow-hidden',
            'bg-panel border-border-strong rounded-lg border shadow-lg outline-none',
            'data-[state=open]:animate-[ship-dialog-in_180ms_var(--easing-out)]',
            'flex flex-col',
            cls.content,
          )}
        >
          <div
            className={cn(
              'grid grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-[1.1fr_1fr]',
              isSpec && cta && 'pb-4',
              cls.grid,
            )}
          >
            <div className={cn('flex flex-col gap-3', cls.photos)}>
              <div className="relative overflow-hidden rounded-md">
                <Carousel
                  items={photos}
                  index={galleryIndex}
                  onIndexChange={setGalleryIndex}
                  loop={loop}
                  {...(isSpec ? { showDots: false } : {})}
                  aria-label={typeof title === 'string' ? `${title} photos` : 'Listing photos'}
                  renderItem={(src, i) =>
                    renderPhoto ? (
                      renderPhoto(src as string, i, 'gallery')
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

                {isSpec && flag ? (
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
                ) : null}

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Open photo viewer"
                  className={cn(
                    'bg-panel/85 hover:bg-panel border-border text-text-muted hover:text-text focus-visible:ring-accent-dim absolute z-10 inline-grid h-8 w-8 cursor-pointer place-items-center rounded-full border shadow-sm backdrop-blur outline-none focus-visible:ring-[3px]',
                    isSpec ? 'right-3 bottom-3' : 'top-3 left-3',
                  )}
                >
                  <IconGlyph name="maximize" size={14} />
                </button>

                {isSpec && !hidePhotoCounter && photos.length > 1 && (
                  <div
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute top-3 right-3 z-10 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur',
                      cls.photoCounter,
                    )}
                  >
                    {galleryIndex + 1} / {photos.length}
                  </div>
                )}
              </div>

              {!isSpec && features && features.length > 0 && (
                <ul className={cn('flex flex-wrap gap-2', cls.features)}>
                  {features.map((f, i) => (
                    <li
                      key={i}
                      className="border-border bg-panel-2 text-text-muted inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px]"
                    >
                      <IconGlyph name={f.icon} size={12} />
                      {f.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={cn('flex flex-col gap-4', cls.info)}>
              <header className={cn('flex flex-col gap-1.5', cls.header)}>
                {eyebrow && !isSpec && (
                  <span className="text-text-dim font-mono text-[10px] tracking-wide uppercase">
                    {eyebrow}
                  </span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <RadixDialog.Title asChild>
                    <h2
                      className={cn('text-text text-[22px] leading-tight font-semibold', cls.title)}
                    >
                      {title}
                    </h2>
                  </RadixDialog.Title>
                  {isSpec && category && (
                    <span
                      className={cn(
                        'border-border bg-panel-2 text-text-muted mt-1 shrink-0 rounded-full border px-2 py-0.5 text-[10px] tracking-wide uppercase',
                        cls.category,
                      )}
                    >
                      {category}
                    </span>
                  )}
                </div>
                {isSpec && meta && (
                  <span
                    className={cn('text-text-dim font-mono text-[12px] tracking-wide', cls.meta)}
                  >
                    {meta}
                  </span>
                )}
                {rating !== undefined && (
                  <div className="text-text-muted mt-1 flex items-center gap-2 text-[13px]">
                    <IconGlyph name="star" size={13} className="text-rating" />
                    <span className="text-text font-medium">{rating.toFixed(2)}</span>
                    {reviewCount !== undefined && <span>({reviewCount} reviews)</span>}
                    <Rating
                      value={rating}
                      max={5}
                      precision="half"
                      size="sm"
                      readOnly
                      className="sr-only"
                    />
                  </div>
                )}
              </header>

              {isSpec && specs && specs.length > 0 && (
                <dl
                  className={cn(
                    'border-border grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-3',
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
                      <dd className={cn('text-text text-[15px] font-semibold', cls.specValue)}>
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {host && (
                <div
                  className={cn('border-border flex items-center gap-3 border-t pt-4', cls.host)}
                >
                  <Avatar
                    size="md"
                    name={typeof host.name === 'string' ? host.name : 'Host'}
                    src={host.avatarUrl}
                  />
                  <div className="flex flex-col">
                    <div className="text-text inline-flex items-center gap-1.5 text-[13px] font-medium">
                      <span>Hosted by {host.name}</span>
                      {host.verified && (
                        <Badge variant="ok" size="sm">
                          <IconGlyph name="verified" size={11} /> Verified
                        </Badge>
                      )}
                    </div>
                    {host.meta && <span className="text-text-dim text-[12px]">{host.meta}</span>}
                  </div>
                </div>
              )}

              {description && (
                <RadixDialog.Description asChild>
                  <p className={cn('text-text-muted text-[13px] leading-[1.6]', cls.description)}>
                    {description}
                  </p>
                </RadixDialog.Description>
              )}

              {!isSpec && (
                <div
                  className={cn(
                    'border-border mt-auto flex flex-col gap-3 border-t pt-4',
                    cls.footer,
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    {originalPrice && (
                      <span className="text-text-dim decoration-sale text-[13px] line-through">
                        {originalPrice}
                      </span>
                    )}
                    <span className={cn('text-text text-[22px] font-semibold', cls.price)}>
                      {price}
                    </span>
                    <span className={cn('text-text-dim text-[13px]', cls.priceUnit)}>
                      {priceUnit}
                    </span>
                  </div>
                  {(primaryAction || secondaryAction) && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                      {secondaryAction && renderAction(secondaryAction, 'ghost')}
                      {primaryAction && renderAction(primaryAction, 'primary')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {isSpec && (cta || price) && (
            <div
              className={cn(
                'border-border bg-panel-2 flex items-center justify-between gap-3 border-t px-6 py-4',
                cls.footer,
              )}
            >
              <div className="flex items-baseline gap-2">
                {pricePrefix && <span className="text-text-dim text-[12px]">{pricePrefix}</span>}
                {originalPrice && (
                  <span className="text-text-dim decoration-sale text-[13px] line-through">
                    {originalPrice}
                  </span>
                )}
                <span className={cn('text-text text-[20px] font-semibold', cls.price)}>
                  {price}
                </span>
                <span className={cn('text-text-dim text-[13px]', cls.priceUnit)}>{priceUnit}</span>
              </div>
              {cta &&
                (cta.href ? (
                  <Button asChild variant="primary" disabled={cta.disabled} className={cls.cta}>
                    <a href={cta.href} onClick={cta.onClick}>
                      {cta.label}
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={cta.onClick}
                    disabled={cta.disabled}
                    className={cls.cta}
                  >
                    {cta.label}
                  </Button>
                ))}
            </div>
          )}

          <RadixDialog.Close asChild>
            <button
              type="button"
              aria-label="Close listing details"
              className={cn(
                'bg-panel-2 hover:bg-panel-2/80 text-text-muted hover:text-text border-border focus-visible:ring-accent-dim absolute top-3 right-3 inline-grid h-9 w-9 cursor-pointer place-items-center rounded-full border outline-none focus-visible:ring-[3px]',
                cls.close,
              )}
            >
              <IconGlyph name="close" size={16} />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>

      <Lightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        items={photos}
        index={galleryIndex}
        onIndexChange={setGalleryIndex}
        loop={loop}
        title={lightboxTitle}
        renderItem={(src, i) =>
          renderPhoto ? (
            renderPhoto(src as string, i, 'lightbox')
          ) : (
            <img src={src as string} alt="" className="max-h-[88vh] max-w-[92vw] object-contain" />
          )
        }
      />
    </RadixDialog.Root>
  );
});

ListingDetail.displayName = 'ListingDetail';
