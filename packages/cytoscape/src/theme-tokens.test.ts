import { describe, expect, it } from 'vitest';

import {
  readThemeTokens,
  resolveColorReference,
  resolveCssVar,
  resolveEntityColor,
  type ThemeTokenPalette,
} from './theme-tokens';

const PALETTE: ThemeTokenPalette = {
  bg: '#000',
  panel: '#111',
  panel2: '#222',
  border: '#333',
  borderStrong: '#444',
  text: '#fff',
  textMuted: '#aaa',
  textDim: '#888',
  accent: '#3b82f6',
  ok: '#10b981',
  warn: '#f59e0b',
  err: '#ef4444',
  purple: '#a855f7',
  pink: '#ec4899',
};

describe('resolveCssVar', () => {
  it('returns the trimmed computed value', () => {
    document.documentElement.style.setProperty('--ship-it-test', '  #abcdef  ');
    expect(resolveCssVar('--ship-it-test')).toBe('#abcdef');
    document.documentElement.style.removeProperty('--ship-it-test');
  });

  it('returns the fallback when the variable is missing', () => {
    expect(resolveCssVar('--ship-it-missing', 'red')).toBe('red');
  });
});

describe('readThemeTokens', () => {
  it('returns a complete palette object', () => {
    const palette = readThemeTokens();
    expect(palette).toHaveProperty('accent');
    expect(palette).toHaveProperty('ok');
    expect(palette).toHaveProperty('purple');
  });
});

describe('resolveColorReference', () => {
  it('rewrites a known var to the palette color', () => {
    expect(resolveColorReference('var(--color-accent)', PALETTE)).toBe('#3b82f6');
    expect(resolveColorReference('var(--color-ok)', PALETTE)).toBe('#10b981');
  });

  it('returns the input unchanged when not a var', () => {
    expect(resolveColorReference('#abcdef', PALETTE)).toBe('#abcdef');
  });

  it('falls back to accent for an unknown var', () => {
    expect(resolveColorReference('var(--color-unknown)', PALETTE)).toBe('#3b82f6');
  });
});

describe('resolveEntityColor', () => {
  it('resolves a built-in entity type to a palette color', () => {
    expect(resolveEntityColor('service', PALETTE)).toBe(PALETTE.accent);
    expect(resolveEntityColor('deployment', PALETTE)).toBe(PALETTE.ok);
    expect(resolveEntityColor('document', PALETTE)).toBe(PALETTE.pink);
  });

  it('falls back when the type is unregistered', () => {
    expect(resolveEntityColor('totally-made-up', PALETTE)).toBe(PALETTE.accent);
  });
});
