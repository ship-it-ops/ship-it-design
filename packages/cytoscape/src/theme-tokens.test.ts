import { describe, expect, it } from 'vitest';

import { resolveEntityColor, type ThemeTokenPalette } from './theme-tokens';

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
