import { forwardRef, type ReactNode, type Ref, type TimeHTMLAttributes } from 'react';

export interface DateTimeProps extends Omit<
  TimeHTMLAttributes<HTMLTimeElement>,
  'dateTime' | 'children'
> {
  /** Machine-readable ISO 8601 string or `Date` object. Rendered into `<time dateTime="…">`. */
  iso: string | Date;
  /**
   * Visible label. When omitted the component falls back to the ISO string,
   * so consumers can pass just `<DateTime iso={...} />` and get a sane render.
   */
  children?: ReactNode;
}

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

/**
 * Wraps a date label in a `<time dateTime="…">` element with a machine-readable
 * ISO 8601 attribute. Search crawlers and AI agents read `dateTime` for
 * timestamps even when the visible label is a relative phrase like
 * "2 days ago" or a localized format like "May 3, 2026".
 *
 * @example
 * <DateTime iso="2026-05-03">May 3, 2026</DateTime>
 * <DateTime iso={lastSyncedAt}>{formatRelative(lastSyncedAt)}</DateTime>
 */
export const DateTime = forwardRef(function DateTime(
  { iso, children, ...rest }: DateTimeProps,
  ref: Ref<HTMLTimeElement>,
) {
  const dateTime = toIsoString(iso);
  return (
    <time ref={ref} dateTime={dateTime} {...rest}>
      {children ?? dateTime}
    </time>
  );
});

DateTime.displayName = 'DateTime';
