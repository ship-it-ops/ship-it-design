import { describe, expect, it } from 'vitest';

import type { ShipItConfig } from './config';
import { emitSparseOverrideCss } from './emit-sparse';

describe('emitSparseOverrideCss', () => {
  it('emits an empty result when the config has no overrides', () => {
    const css = emitSparseOverrideCss({});
    expect(css.trim()).toBe('');
  });

  it('emits the accent-h knob inside :root', () => {
    const css = emitSparseOverrideCss({ accentH: 280 });
    expect(css).toContain(':root {');
    expect(css).toContain('--accent-h: 280;');
  });

  it('emits dark color overrides under :root', () => {
    const css = emitSparseOverrideCss({ color: { dark: { panel: '#0d0f14' } } });
    expect(css).toMatch(/:root\s*\{[\s\S]*--color-panel:\s*#0d0f14;[\s\S]*\}/);
  });

  it('emits light color overrides under [data-theme="light"]', () => {
    const css = emitSparseOverrideCss({
      color: { light: { accent: 'oklch(0.42 0.14 280)' } },
    });
    expect(css).toMatch(
      /\[data-theme='light'\]\s*\{[\s\S]*--color-accent:\s*oklch\(0\.42 0\.14 280\);[\s\S]*\}/,
    );
  });

  it('emits typography overrides without prefix collisions', () => {
    const css = emitSparseOverrideCss({
      typography: {
        fontFamily: { sans: '"Söhne", system-ui, sans-serif' },
        fontSize: { body: '14px' },
        fontWeight: { semibold: 550 },
        lineHeight: { normal: 1.55 },
        tracking: { tight: '-0.4px' },
      },
    });
    expect(css).toContain('--font-family-sans: "Söhne", system-ui, sans-serif;');
    expect(css).toContain('--font-size-body: 14px;');
    expect(css).toContain('--font-weight-semibold: 550;');
    expect(css).toContain('--line-height-normal: 1.55;');
    expect(css).toContain('--tracking-tight: -0.4px;');
  });

  it('emits a header comment naming the source config path', () => {
    const css = emitSparseOverrideCss({ accentH: 280 }, { sourceConfig: 'ship-it.config.ts' });
    expect(css).toMatch(/AUTO-GENERATED.*ship-it\.config\.ts/);
  });

  it('preserves source-order of keys for deterministic diffs', () => {
    // accentH first, then color, then typography — must match the source token modules.
    const css = emitSparseOverrideCss({
      typography: { fontSize: { body: '14px' } },
      color: { dark: { panel: '#0d0f14' } },
      accentH: 280,
    });
    const accentIdx = css.indexOf('--accent-h');
    const colorIdx = css.indexOf('--color-panel');
    const fontIdx = css.indexOf('--font-size-body');
    expect(accentIdx).toBeGreaterThan(-1);
    expect(accentIdx).toBeLessThan(colorIdx);
    expect(colorIdx).toBeLessThan(fontIdx);
  });

  it('throws when a color value is not a valid CSS color', () => {
    const cfg: ShipItConfig = { color: { dark: { panel: 'not-a-color' } } };
    expect(() => emitSparseOverrideCss(cfg)).toThrow(/Invalid CSS color/);
  });
});
