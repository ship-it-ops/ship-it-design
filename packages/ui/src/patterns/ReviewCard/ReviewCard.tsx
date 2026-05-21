'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Rating } from '../../components/Rating';
import { cn } from '../../utils/cn';

/**
 * ReviewCard — a single review feed item. Composes Avatar, Rating, date,
 * body, optional photos strip, and a `verified-trip` badge.
 *
 * Distinct from `Testimonial`, which is curated marketing chrome.
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
  /** Review body. */
  body: ReactNode;
  /** Optional photo URLs (rendered as a horizontal strip). */
  photos?: ReadonlyArray<string>;
  /** When true, shows the "Verified trip" badge. */
  verified?: boolean;
  /** Optional reviewer subtitle (location, member-since date). */
  subtitle?: ReactNode;
}

export const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(function ReviewCard(
  { author, authorAvatar, rating, date, body, photos, verified, subtitle, className, ...props },
  ref,
) {
  return (
    <article
      ref={ref}
      className={cn('border-border bg-panel flex flex-col gap-3 rounded-md border p-4', className)}
      {...props}
    >
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
            <time className="text-text-dim text-[11px]">{date}</time>
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
