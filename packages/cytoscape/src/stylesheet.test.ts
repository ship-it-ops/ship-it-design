import { describe, expect, it } from 'vitest';

import { buildShipItStylesheet, GRAPH_CANVAS_CLASS } from './stylesheet';
import type { ThemeTokenPalette } from './theme-tokens';

const PALETTE: ThemeTokenPalette = {
  bg: '#000000',
  panel: '#0d0d0d',
  panel2: '#161616',
  border: '#262626',
  borderStrong: '#383838',
  text: '#fafafa',
  textMuted: '#a3a3a3',
  textDim: '#737373',
  accent: '#5b9cff',
  ok: '#10b981',
  warn: '#f59e0b',
  err: '#ef4444',
  purple: '#a855f7',
  pink: '#ec4899',
};

const LIGHT_PALETTE: ThemeTokenPalette = { ...PALETTE, bg: '#ffffff', panel: '#fafafa' };

// Narrow the StylesheetJsonBlock union (StylesheetStyle | StylesheetCSS) to the
// `style`-keyed variant — the builder only ever emits that shape.
function findSelector(
  styles: ReturnType<typeof buildShipItStylesheet>,
  selector: string,
): { selector: string; style: Record<string, unknown> } | undefined {
  const block = styles.find((s) => s.selector === selector);
  return block as { selector: string; style: Record<string, unknown> } | undefined;
}

describe('buildShipItStylesheet', () => {
  it('uses the supplied palette colors for entity-type selectors', () => {
    const styles = buildShipItStylesheet({ palette: PALETTE });
    expect(findSelector(styles, 'node[entityType = "service"]')?.style['border-color']).toBe(
      PALETTE.accent,
    );
    expect(findSelector(styles, 'node[entityType = "deployment"]')?.style['border-color']).toBe(
      PALETTE.ok,
    );
    expect(findSelector(styles, 'node[entityType = "document"]')?.style['border-color']).toBe(
      PALETTE.pink,
    );
  });

  it('reflects palette changes when the theme flips', () => {
    const dark = buildShipItStylesheet({ palette: PALETTE });
    const light = buildShipItStylesheet({ palette: LIGHT_PALETTE });
    expect(findSelector(dark, 'node')?.style['background-color']).toBe('#0d0d0d');
    expect(findSelector(light, 'node')?.style['background-color']).toBe('#fafafa');
  });

  it('includes path + dim class selectors', () => {
    const styles = buildShipItStylesheet({ palette: PALETTE });
    expect(styles.some((s) => s.selector.includes('graph-canvas'))).toBe(true);
  });

  it('appends extra entries after the base stylesheet', () => {
    const extra = [{ selector: 'node.custom', style: { 'border-color': '#fff' } }];
    const styles = buildShipItStylesheet({ palette: PALETTE, extra });
    expect(styles[styles.length - 1]?.selector).toBe('node.custom');
  });

  it('exposes the class-name constants the stylesheet recognizes', () => {
    expect(GRAPH_CANVAS_CLASS).toEqual({ path: 'graph-canvas:path', dim: 'graph-canvas:dim' });
  });
});
