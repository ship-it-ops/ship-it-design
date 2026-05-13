import { describe, expect, it, vi } from 'vitest';

import {
  readThemeTokens,
  resolveColorReference,
  resolveCssVar,
  resolveEntityColor,
  toSrgb,
  type ThemeTokenPalette,
} from './theme-tokens';

/**
 * Replace `HTMLCanvasElement.prototype.getContext` with a stub whose
 * `getImageData` returns whatever the test caller queued via `setNext`.
 * jsdom doesn't implement canvas at all without the optional `canvas` npm
 * package, so unit-testing `toSrgb` requires this kind of seam. Returns a
 * restore function the test calls in `afterEach`.
 */
function stubCanvasReadback(queue: Array<[number, number, number, number]>) {
  const original = HTMLCanvasElement.prototype.getContext;
  // Cast through `unknown` — typing the full CanvasRenderingContext2D would
  // pull in a couple hundred fields we never touch.
  (
    HTMLCanvasElement.prototype as unknown as {
      getContext: () => unknown;
    }
  ).getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    set fillStyle(_v: string) {
      /* swallow */
    },
    getImageData: vi.fn(() => {
      const next = queue.shift() ?? [0, 0, 0, 255];
      return { data: new Uint8ClampedArray(next) };
    }),
  }));
  return () => {
    HTMLCanvasElement.prototype.getContext = original;
  };
}

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

describe('toSrgb', () => {
  it('passes already-sRGB values through untouched (fast path)', () => {
    expect(toSrgb('#abcdef')).toBe('#abcdef');
    expect(toSrgb('rgb(10, 20, 30)')).toBe('rgb(10, 20, 30)');
    expect(toSrgb('rgba(0, 0, 0, 0.5)')).toBe('rgba(0, 0, 0, 0.5)');
    expect(toSrgb('hsl(120, 50%, 50%)')).toBe('hsl(120, 50%, 50%)');
  });

  it('coerces a non-sRGB value to rgb() via canvas readback', () => {
    const restore = stubCanvasReadback([[255, 128, 0, 255]]);
    try {
      expect(toSrgb('oklch(0.82 0.12 200)')).toBe('rgb(255, 128, 0)');
    } finally {
      restore();
    }
  });

  it('emits rgba() when alpha is partial', () => {
    const restore = stubCanvasReadback([[10, 20, 30, 128]]);
    try {
      expect(toSrgb('oklch(0.5 0.1 100 / 0.5)')).toBe('rgba(10, 20, 30, 0.5019607843137255)');
    } finally {
      restore();
    }
  });

  it('returns the input unchanged when the value is empty', () => {
    expect(toSrgb('')).toBe('');
  });
});

describe('readThemeTokens', () => {
  it('returns a complete palette object', () => {
    const palette = readThemeTokens();
    expect(palette).toHaveProperty('accent');
    expect(palette).toHaveProperty('ok');
    expect(palette).toHaveProperty('purple');
  });

  it('coerces oklch() var values to rgb() so cytoscape can parse them', () => {
    // Seed `--color-accent` with an oklch literal — mimics Tailwind v4 output.
    document.documentElement.style.setProperty('--color-accent', 'oklch(0.7 0.15 220)');
    const restore = stubCanvasReadback(
      Array.from({ length: 14 }, () => [50, 100, 200, 255] as [number, number, number, number]),
    );
    try {
      const palette = readThemeTokens();
      expect(palette.accent).toBe('rgb(50, 100, 200)');
      // No raw oklch or var leaks through anywhere in the palette.
      for (const v of Object.values(palette)) {
        expect(v).not.toMatch(/oklch\(/);
        expect(v).not.toMatch(/var\(/);
      }
    } finally {
      restore();
      document.documentElement.style.removeProperty('--color-accent');
    }
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
