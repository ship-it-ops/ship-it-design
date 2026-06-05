import type { ReactNode } from 'react';

/**
 * Helpers used by components that emit schema.org JSON-LD.
 *
 * Centralised here so the seven structured-data components
 * (ComparisonTable, Breadcrumbs, ReviewCard, Testimonial, PricingCard,
 * ListingCard/Detail, ConnectorCard) don't each carry their own copy.
 * If the behavior ever needs to change (e.g. handle `bigint`,
 * normalise whitespace), there's one place to do it.
 */

/**
 * Returns the string form of a `ReactNode` when it's a plain string or
 * number, otherwise `null`. Components emitting JSON-LD use this to
 * decide whether a JSX-typed prop can populate a string-only schema
 * field — when it returns `null`, the field (or the whole entity) is
 * skipped rather than coerced to `"[object Object]"` or similar.
 */
export function nodeToString(node: ReactNode): string | null {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  return null;
}

/**
 * Returns the ISO 8601 string for a `Date`, `string`, or epoch-number
 * input, or `null` when the value is `undefined`/`null` or the
 * resulting `Date` is not a valid timestamp. Used by the
 * `datePublished` / `dateModified` JSON-LD fields and the
 * `<time dateTime>` attribute on review and activity components.
 *
 * Strings are passed through as-is (no validation) so consumers who
 * already have an ISO 8601 string don't pay for a parse + re-format
 * round trip and so non-ISO machine-readable strings supported by
 * `<time dateTime>` (e.g. `"2026-W19"`) survive.
 */
export function toIsoString(value: Date | string | number | undefined | null): string | null {
  if (value === undefined || value === null) return null;
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value.toISOString() : null;
  }
  if (typeof value === 'string') return value;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}
