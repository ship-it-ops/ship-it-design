import type { Metadata } from 'next';

/**
 * Inputs for `buildMetadata`. Everything except `title` is optional —
 * sensible defaults fill in the rest. Pass `noIndex: true` on
 * staging/preview deploys to keep them out of search results.
 */
export interface BuildMetadataInput {
  /** Page title. Used for `<title>`, OG title, and Twitter title. */
  title: string;
  /** Page description. Used for the meta description, OG description, and Twitter description. */
  description?: string;
  /** Absolute or root-relative URL. Used as `alternates.canonical` and as the OG `url`. */
  url?: string;
  /**
   * Absolute URL to a social-share image (1200×630 is the recommended OG size).
   * Pass an object to supply `width`, `height`, and `alt`.
   */
  ogImage?: string | { url: string; width?: number; height?: number; alt?: string };
  /** Twitter handle (with or without the leading `@`). Used as `twitter.creator`. */
  twitterHandle?: string;
  /** Site name shown next to the OG title on Facebook/LinkedIn/Slack. */
  siteName?: string;
  /** Locale string for OG (e.g. `'en_US'`). Default `'en_US'`. */
  locale?: string;
  /**
   * When `true`, emits `robots: { index: false, follow: false }` so search
   * engines skip the page. Use for preview/staging deploys.
   */
  noIndex?: boolean;
}

function normalizeTwitterHandle(handle: string): string {
  return handle.startsWith('@') ? handle : `@${handle}`;
}

function normalizeImage(
  image: BuildMetadataInput['ogImage'],
): { url: string; width?: number; height?: number; alt?: string } | undefined {
  if (image === undefined) return undefined;
  if (typeof image === 'string') return { url: image };
  return image;
}

/**
 * Builds a Next.js App Router `Metadata` object from a small, opinionated
 * input shape — title, description, social-share image, canonical URL,
 * Twitter handle, robots posture. Output is suitable for direct assignment
 * to a `page.tsx` or `layout.tsx` `export const metadata`.
 *
 * @example
 * export const metadata = buildMetadata({
 *   title: 'Pricing',
 *   description: 'Plans that scale with your team.',
 *   url: 'https://ship.it/pricing',
 *   ogImage: 'https://ship.it/og/pricing.png',
 *   twitterHandle: 'shipit',
 * });
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const {
    title,
    description,
    url,
    ogImage,
    twitterHandle,
    siteName,
    locale = 'en_US',
    noIndex,
  } = input;

  const image = normalizeImage(ogImage);
  const images = image ? [image] : undefined;
  const twitter = twitterHandle ? normalizeTwitterHandle(twitterHandle) : undefined;

  const metadata: Metadata = {
    title,
    ...(description ? { description } : {}),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(url ? { url } : {}),
      ...(siteName ? { siteName } : {}),
      ...(images ? { images } : {}),
      locale,
      type: 'website',
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      ...(description ? { description } : {}),
      ...(images ? { images } : {}),
      ...(twitter ? { creator: twitter, site: twitter } : {}),
    },
    ...(url ? { alternates: { canonical: url } } : {}),
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };

  return metadata;
}
