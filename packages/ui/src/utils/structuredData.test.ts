import { describe, expect, it } from 'vitest';

import { nodeToString, toIsoString } from './structuredData';

describe('nodeToString', () => {
  it('returns strings unchanged', () => {
    expect(nodeToString('hello')).toBe('hello');
  });

  it('coerces numbers (including zero)', () => {
    expect(nodeToString(0)).toBe('0');
    expect(nodeToString(42)).toBe('42');
  });

  it('returns null for JSX, null, undefined, booleans, and arrays', () => {
    expect(nodeToString(null)).toBeNull();
    expect(nodeToString(undefined)).toBeNull();
    expect(nodeToString(true)).toBeNull();
    expect(nodeToString(false)).toBeNull();
    expect(nodeToString(['x'])).toBeNull();
    expect(nodeToString({ type: 'span', props: { children: 'x' } } as never)).toBeNull();
  });
});

describe('toIsoString', () => {
  it('returns null for null/undefined', () => {
    expect(toIsoString(null)).toBeNull();
    expect(toIsoString(undefined)).toBeNull();
  });

  it('passes strings through unchanged (no parse/re-format round trip)', () => {
    expect(toIsoString('2026-05-03')).toBe('2026-05-03');
    expect(toIsoString('2026-W19')).toBe('2026-W19'); // ISO 8601 week-of-year
  });

  it('serialises Date via toISOString', () => {
    expect(toIsoString(new Date('2026-05-03T12:34:56Z'))).toBe('2026-05-03T12:34:56.000Z');
  });

  it('returns null for an invalid Date', () => {
    expect(toIsoString(new Date('not-a-date'))).toBeNull();
  });

  it('handles epoch numbers', () => {
    expect(toIsoString(0)).toBe('1970-01-01T00:00:00.000Z');
  });

  it('returns null for NaN epoch numbers', () => {
    expect(toIsoString(Number.NaN)).toBeNull();
  });
});
