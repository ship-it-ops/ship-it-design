import type { ReactElement } from 'react';

/**
 * Emits a `<script type="application/ld+json">` tag carrying schema.org (or
 * any JSON-serializable) structured data. The payload is escaped so a
 * user-supplied string containing `</script>` can't break out of the script
 * tag — that's the standard Next.js JSON-LD recipe.
 *
 * Returns `null` for `null`/`undefined` data so call sites can pass the
 * payload directly without an outer guard.
 *
 * @example
 * <JsonLd data={{
 *   '@context': 'https://schema.org',
 *   '@type': 'BreadcrumbList',
 *   itemListElement: items,
 * }} />
 */
export interface JsonLdProps {
  /** The structured-data payload. JSON-stringified into the script body. */
  data: unknown;
}

export function JsonLd({ data }: JsonLdProps): ReactElement | null {
  if (data === null || data === undefined) return null;
  // Escape `</` so any user-supplied substring like `</script><img/>` becomes
  // an inert literal in the rendered DOM. Standard Next.js JSON-LD escape.
  const html = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: html }} />;
}
