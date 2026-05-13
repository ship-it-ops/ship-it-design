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

  it('draws default edges in accent, not border-grey', () => {
    // Regression for the consumer report: pre-fix the default `edge` selector
    // used `palette.border`, which is the same tone as surface dividers and
    // made edges almost invisible on dark backgrounds. Default edges should
    // tone with accent so they match `<GraphEdge edgeStyle="solid">`.
    const styles = buildShipItStylesheet({ palette: PALETTE });
    const edge = findSelector(styles, 'edge');
    expect(edge?.style['line-color']).toBe(PALETTE.accent);
    expect(edge?.style['target-arrow-color']).toBe(PALETTE.accent);
  });

  it('appends extra entries after the base stylesheet', () => {
    const extra = [{ selector: 'node.custom', style: { 'border-color': '#fff' } }];
    const styles = buildShipItStylesheet({ palette: PALETTE, extra });
    expect(styles[styles.length - 1]?.selector).toBe('node.custom');
  });

  it('exposes the class-name constants the stylesheet recognizes', () => {
    expect(GRAPH_CANVAS_CLASS).toEqual({ path: 'graph-canvas:path', dim: 'graph-canvas:dim' });
  });

  it('uses a static font-family stack (no `var(...)` for cytoscape to choke on)', () => {
    const styles = buildShipItStylesheet({ palette: PALETTE });
    const base = findSelector(styles, 'node');
    expect(base?.style['font-family']).toMatch(/ui-monospace/);
    expect(String(base?.style['font-family'])).not.toMatch(/var\(/);
  });

  it('renders entity glyphs as SVG data-URL backgrounds by default', () => {
    const styles = buildShipItStylesheet({ palette: PALETTE });
    const service = findSelector(styles, 'node[entityType = "service"]');
    expect(service?.style['background-image']).toMatch(/^data:image\/svg\+xml/);
    expect(service?.style['background-fit']).toBe('contain');
    expect(service?.style['background-clip']).toBe('none');
    // The `service` glyph is ◇ (U+25C7), which URL-encodes to %E2%97%87.
    expect(String(service?.style['background-image'])).toContain('%E2%97%87');
    // The emitted SVG must carry explicit `width`/`height` attributes in
    // addition to `viewBox` — Cytoscape's canvas renderer rasterises the
    // background-image through an `<img>`, which treats a `viewBox`-only
    // `<svg>` as 0×0 and paints nothing.
    const encoded = String(service?.style['background-image']);
    expect(encoded).toContain("width%3D'52'");
    expect(encoded).toContain("height%3D'52'");
  });

  it('falls back to a border-only per-type rule when renderGlyphs is false', () => {
    const styles = buildShipItStylesheet({ palette: PALETTE, renderGlyphs: false });
    const service = findSelector(styles, 'node[entityType = "service"]');
    expect(service?.style).toEqual({ 'border-color': PALETTE.accent });
    expect(service?.style['background-image']).toBeUndefined();
  });

  it('sets the default node size to 52×52 (matches <GraphNode>)', () => {
    const styles = buildShipItStylesheet({ palette: PALETTE });
    const base = findSelector(styles, 'node');
    expect(base?.style.width).toBe(52);
    expect(base?.style.height).toBe(52);
  });

  it('emits no `oklch(` or `var(` substrings anywhere in the stylesheet', () => {
    // Regression for the consumer report: cytoscape's color parser rejects
    // both `oklch(...)` (Tailwind v4's default for `--color-*` tokens) and
    // raw `var(...)` references. With the sRGB coercion in `readThemeTokens`
    // and the static font-family in the base block, neither should appear in
    // the final stylesheet JSON, regardless of palette.
    const serialized = JSON.stringify(buildShipItStylesheet({ palette: PALETTE }));
    expect(serialized).not.toMatch(/oklch\(/);
    expect(serialized).not.toMatch(/var\(/);
  });
});
