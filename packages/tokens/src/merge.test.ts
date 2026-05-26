import { describe, expect, it } from 'vitest';

import { deepMerge } from './merge';

describe('deepMerge', () => {
  it('returns a new object — does not mutate the base', () => {
    const base = { a: 1, b: { c: 2 } };
    const result = deepMerge(base, { b: { c: 3 } });
    expect(base.b.c).toBe(2);
    expect(result.b.c).toBe(3);
  });

  it('overrides primitive values on the right', () => {
    expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  it('preserves keys from the base that the override does not touch', () => {
    expect(deepMerge({ a: 1, b: 2 }, { b: 99 })).toEqual({ a: 1, b: 99 });
  });

  it('recursively merges nested objects', () => {
    expect(
      deepMerge(
        { color: { dark: { bg: '#000', panel: '#111' } } },
        { color: { dark: { panel: '#222' } } },
      ),
    ).toEqual({ color: { dark: { bg: '#000', panel: '#222' } } });
  });

  it('treats undefined override as no-op', () => {
    expect(deepMerge({ a: 1 }, undefined)).toEqual({ a: 1 });
  });

  it('replaces (does not concat) when the override value is not a plain object', () => {
    // Cast through unknown because the override intentionally diverges from the
    // base shape to verify the runtime "replace, don't concat" behavior.
    expect(
      deepMerge(
        { a: { b: 1 } } as Record<string, unknown>,
        { a: '#fff' } as Record<string, unknown>,
      ),
    ).toEqual({ a: '#fff' });
  });
});
