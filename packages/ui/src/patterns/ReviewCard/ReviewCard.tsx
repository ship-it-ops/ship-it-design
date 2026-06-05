'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Rating } from '../../components/Rating';
import { cn } from '../../utils/cn';
import { JsonLd } from '../../utils/JsonLd';
import { nodeToString, toIsoString } from '../../utils/structuredData';

/**
 * ReviewCard — a single review feed item. Composes Avatar, Rating, date,
 * body, optional photos strip, and a `verified-trip` badge.
 *
 * Distinct from `Testimonial`, which is curated marketing chrome.
 *
 * Emits a schema.org `Review` JSON-LD entity by default. Pass `dateTime`
 * (ISO 8601 string or Date) to populate `datePublished` and emit a
 * machine-readable `<time dateTime>`; without it the visible `date` is
 * still rendered but `datePublished` is omitted. The review must point
 * at *something* — pass `itemReviewedName` (and optionally `url` of the
 * reviewed item) so Google's Rich Results Test accepts it as a valid
 * `Review`. Pass `noStructuredData` to suppress the JSON-LD script.
 */

export interface ReviewCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Reviewer display name. */
  author: ReactNode;
  /** Optional author avatar URL. */
  authorAvatar?: string;
  /** Star rating, 0–5. */
  rating: number;
  /** When set, renders as a Date — otherwise as a string. */
  date: ReactNode;
  /**
   * Machine-readable ISO 8601 string (or Date) for the review date. Emitted
   * as `<time dateTime="…">{date}</time>` and threaded into the JSON-LD
   * `datePublished` field. Backwards-compatible: when omitted the visible
   * `date` is rendered without a `dateTime` attribute.
   */
  dateTime?: string | Date;
  /** Review body. */
  body: ReactNode;
  /** Optional photo URLs (rendered as a horizontal strip). */
  photos?: ReadonlyArray<string>;
  /** When true, shows the "Verified trip" badge. */
  verified?: boolean;
  /** Optional reviewer subtitle (location, member-since date). */
  subtitle?: ReactNode;
  /**
   * String version of `author` for the JSON-LD `author.name` field. Required
   * when `author` is JSX — without it the JSON-LD script is suppressed.
   */
  authorName?: string;
  /** String version of `body` for the JSON-LD `reviewBody`. */
  bodyText?: string;
  /** Name of the thing being reviewed (product, place, service). */
  itemReviewedName?: string;
  /** Optional URL of the reviewed item. */
  url?: string;
  /** Opt out of emitting the schema.org `Review` JSON-LD script. */
  noStructuredData?: boolean;
}

interface ReviewSchema {
  '@context': string;
  '@type': 'Review';
  author: { '@type': 'Person'; name: string; image?: string };
  reviewBody: string;
  reviewRating: { '@type': 'Rating'; ratingValue: number; bestRating: number };
  datePublished?: string;
  itemReviewed?: { '@type': 'Thing'; name: string; url?: string };
}

function buildReviewSchema(props: ReviewCardProps): ReviewSchema | null {
  const authorName = props.authorName ?? nodeToString(props.author);
  const bodyText = props.bodyText ?? nodeToString(props.body);
  if (!authorName || !bodyText) return null;
  const schema: ReviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: { '@type': 'Person', name: authorName },
    reviewBody: bodyText,
    reviewRating: { '@type': 'Rating', ratingValue: props.rating, bestRating: 5 },
  };
  if (props.authorAvatar) {
    schema.author.image = props.authorAvatar;
  }
  const datePublished = toIsoString(props.dateTime);
  if (datePublished) {
    schema.datePublished = datePublished;
  }
  if (props.itemReviewedName) {
    schema.itemReviewed = { '@type': 'Thing', name: props.itemReviewedName };
    if (props.url) {
      schema.itemReviewed.url = props.url;
    }
  }
  return schema;
}

export const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(function ReviewCard(
  {
    author,
    authorAvatar,
    rating,
    date,
    dateTime,
    body,
    photos,
    verified,
    subtitle,
    authorName,
    bodyText,
    itemReviewedName,
    url,
    noStructuredData,
    className,
    ...props
  },
  ref,
) {
  const isoDate = toIsoString(dateTime);
  const structuredData = !noStructuredData
    ? buildReviewSchema({
        author,
        authorAvatar,
        rating,
        date,
        dateTime,
        body,
        authorName,
        bodyText,
        itemReviewedName,
        url,
      })
    : null;
  return (
    <article
      ref={ref}
      className={cn('border-border bg-panel flex flex-col gap-3 rounded-md border p-4', className)}
      {...props}
    >
      {structuredData && <JsonLd data={structuredData} />}
      <header className="flex items-start gap-3">
        <Avatar
          src={authorAvatar}
          name={typeof author === 'string' ? author : undefined}
          size="md"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-text text-[14px] leading-tight font-semibold">{author}</span>
            {verified && (
              <Badge variant="ok" size="sm">
                <IconGlyph name="verified" size={11} /> Verified trip
              </Badge>
            )}
          </div>
          {subtitle && <span className="text-text-dim text-[11px]">{subtitle}</span>}
          <div className="mt-1 flex items-center gap-2">
            <Rating value={rating} max={5} precision="half" size="sm" readOnly />
            <span className="text-text-dim text-[11px]">·</span>
            <time className="text-text-dim text-[11px]" {...(isoDate ? { dateTime: isoDate } : {})}>
              {date}
            </time>
          </div>
        </div>
      </header>
      <p className="text-text text-[13px] leading-relaxed">{body}</p>
      {photos && photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              className="border-border h-20 w-20 shrink-0 rounded border object-cover"
            />
          ))}
        </div>
      )}
    </article>
  );
});

ReviewCard.displayName = 'ReviewCard';
