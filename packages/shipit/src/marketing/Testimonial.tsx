'use client';

import { Avatar, JsonLd, cn, nodeToString } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Testimonial — pull-quote with author + role. Centered for marketing
 * surfaces.
 *
 * Emits a schema.org `Review` JSON-LD entity by default. Pass `rating`
 * (1–5) for `reviewRating` and `itemReviewedName` (plus optional `url`)
 * for `itemReviewed` to make the JSON-LD eligible for Google's Review
 * rich results. Without those it still emits a minimal `Review`. Pass
 * `noStructuredData` to suppress the JSON-LD script entirely.
 */

export interface TestimonialProps extends Omit<HTMLAttributes<HTMLElement>, 'cite' | 'role'> {
  /** The quoted body. */
  quote: ReactNode;
  /** Author display name. */
  author: ReactNode;
  /** Author role / company. */
  role?: ReactNode;
  /** Avatar initials or full node. */
  avatar?: ReactNode;
  /**
   * String version of `quote` for the JSON-LD `reviewBody` field. Required
   * when `quote` is JSX — without it the JSON-LD script is suppressed.
   */
  quoteText?: string;
  /** String version of `author` for the JSON-LD `author.name`. */
  authorName?: string;
  /** String version of `role` for the JSON-LD `author.jobTitle`. */
  authorJobTitle?: string;
  /** Star rating (1–5). When provided, emitted as `reviewRating`. */
  rating?: number;
  /** Name of the thing being endorsed (product / service / company). */
  itemReviewedName?: string;
  /** Optional URL of the thing being endorsed. */
  url?: string;
  /** Opt out of emitting the schema.org `Review` JSON-LD script. */
  noStructuredData?: boolean;
}

interface ReviewSchema {
  '@context': string;
  '@type': 'Review';
  author: { '@type': 'Person'; name: string; jobTitle?: string };
  reviewBody: string;
  reviewRating?: { '@type': 'Rating'; ratingValue: number; bestRating: number };
  itemReviewed?: { '@type': 'Thing'; name: string; url?: string };
}

function buildTestimonialSchema(props: TestimonialProps): ReviewSchema | null {
  const authorName = props.authorName ?? nodeToString(props.author);
  const reviewBody = props.quoteText ?? nodeToString(props.quote);
  if (!authorName || !reviewBody) return null;
  const schema: ReviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: { '@type': 'Person', name: authorName },
    reviewBody,
  };
  const jobTitle = props.authorJobTitle ?? nodeToString(props.role);
  if (jobTitle) {
    schema.author.jobTitle = jobTitle;
  }
  if (typeof props.rating === 'number') {
    schema.reviewRating = {
      '@type': 'Rating',
      ratingValue: props.rating,
      bestRating: 5,
    };
  }
  if (props.itemReviewedName) {
    schema.itemReviewed = { '@type': 'Thing', name: props.itemReviewedName };
    if (props.url) {
      schema.itemReviewed.url = props.url;
    }
  }
  return schema;
}

export const Testimonial = forwardRef<HTMLElement, TestimonialProps>(function Testimonial(
  {
    quote,
    author,
    role,
    avatar,
    quoteText,
    authorName,
    authorJobTitle,
    rating,
    itemReviewedName,
    url,
    noStructuredData,
    className,
    ...props
  },
  ref,
) {
  const structuredData = !noStructuredData
    ? buildTestimonialSchema({
        quote,
        author,
        role,
        quoteText,
        authorName,
        authorJobTitle,
        rating,
        itemReviewedName,
        url,
      })
    : null;
  return (
    <figure
      ref={ref}
      className={cn('mx-auto max-w-[620px] px-6 py-10 text-center', className)}
      {...props}
    >
      {structuredData && <JsonLd data={structuredData} />}
      <div aria-hidden className="text-accent mb-4 text-[40px] leading-none">
        &ldquo;
      </div>
      <blockquote className="m-0 text-[22px] leading-[1.45] font-medium tracking-[-0.3px]">
        {quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center justify-center gap-[10px]">
        {typeof avatar === 'string' ? <Avatar size="md" name={avatar} /> : avatar}
        <div className="text-left">
          <div className="text-[13px] font-medium">{author}</div>
          {role && <div className="text-text-dim text-[11px]">{role}</div>}
        </div>
      </figcaption>
    </figure>
  );
});

Testimonial.displayName = 'Testimonial';
