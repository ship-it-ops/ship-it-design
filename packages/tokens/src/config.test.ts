import { describe, expect, expectTypeOf, it } from 'vitest';

import { defineConfig, type ShipItConfig } from './config';

describe('defineConfig', () => {
  it('returns the config unchanged at runtime', () => {
    const cfg = defineConfig({ accentH: 280 });
    expect(cfg).toEqual({ accentH: 280 });
  });

  it('accepts the full schema shape', () => {
    const cfg = defineConfig({
      accentH: 280,
      color: {
        dark: { panel: '#0d0f14' },
        light: { accent: 'oklch(0.42 0.14 280)' },
      },
      typography: {
        fontFamily: { sans: '"Söhne", system-ui, sans-serif' },
        fontSize: { body: '14px' },
        fontWeight: { semibold: 550 },
        lineHeight: { normal: 1.55 },
        tracking: { tight: '-0.4px' },
      },
      output: './app/styles/shipit-overrides.css',
    });
    expect(cfg.color?.dark?.panel).toBe('#0d0f14');
  });

  it('types color keys against the semantic token enum', () => {
    expectTypeOf<NonNullable<NonNullable<ShipItConfig['color']>['dark']>>().toMatchTypeOf<
      Partial<Record<'bg' | 'panel' | 'accent', string>>
    >();
  });
});
