/**
 * formatRelative — compact "x ago" / "in x" formatter used by ActivityTimeline
 * and any other surface that wants to print typed event timestamps. Always
 * returns a short, ASCII string; if you need locale-aware formatting reach for
 * `Intl.RelativeTimeFormat` instead.
 *
 * The `now` argument is injectable so callers can render deterministically in
 * tests and during SSR. Falsy or unparseable inputs return an empty string.
 */

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

interface Unit {
  ms: number;
  short: string;
}

const UNITS: ReadonlyArray<Unit> = [
  { ms: YEAR, short: 'y' },
  { ms: MONTH, short: 'mo' },
  { ms: WEEK, short: 'w' },
  { ms: DAY, short: 'd' },
  { ms: HOUR, short: 'h' },
  { ms: MINUTE, short: 'm' },
  { ms: SECOND, short: 's' },
];

export function formatRelative(input: Date | string | number, now: Date = new Date()): string {
  const target = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(target.getTime())) return '';

  const diffMs = now.getTime() - target.getTime();
  const abs = Math.abs(diffMs);
  if (abs < 5 * SECOND) return 'just now';

  for (const unit of UNITS) {
    if (abs >= unit.ms) {
      const n = Math.floor(abs / unit.ms);
      return diffMs >= 0 ? `${n}${unit.short} ago` : `in ${n}${unit.short}`;
    }
  }
  return 'just now';
}
