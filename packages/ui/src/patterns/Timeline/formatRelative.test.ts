import { describe, expect, it } from 'vitest';

import { formatRelative } from './formatRelative';

const NOW = new Date('2026-05-10T12:00:00Z');

describe('formatRelative', () => {
  it('returns "just now" for very recent timestamps', () => {
    expect(formatRelative(new Date(NOW.getTime() - 1_000), NOW)).toBe('just now');
  });

  it('formats seconds', () => {
    expect(formatRelative(new Date(NOW.getTime() - 30_000), NOW)).toBe('30s ago');
  });

  it('formats minutes', () => {
    expect(formatRelative(new Date(NOW.getTime() - 5 * 60_000), NOW)).toBe('5m ago');
  });

  it('formats hours', () => {
    expect(formatRelative(new Date(NOW.getTime() - 3 * 60 * 60_000), NOW)).toBe('3h ago');
  });

  it('formats days', () => {
    expect(formatRelative(new Date(NOW.getTime() - 2 * 24 * 60 * 60_000), NOW)).toBe('2d ago');
  });

  it('formats future times', () => {
    expect(formatRelative(new Date(NOW.getTime() + 4 * 60 * 60_000), NOW)).toBe('in 4h');
  });

  it('accepts an ISO string', () => {
    expect(formatRelative('2026-05-10T11:00:00Z', NOW)).toBe('1h ago');
  });

  it('returns an empty string for invalid input', () => {
    expect(formatRelative('not a date', NOW)).toBe('');
  });
});
