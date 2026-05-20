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

  it('renders entity glyphs as Iconify SVG data-URL backgrounds by default', () => {
    const styles = buildShipItStylesheet({ palette: PALETTE });
    const service = findSelector(styles, 'node[entityType = "service"]');
    expect(service?.style['background-image']).toMatch(/^data:image\/svg\+xml/);
    // `background-fit: none` (not `contain`) + percent width/height pinning
    // gives the icon breathing room — pre-0.0.7 `contain` made it fill the
    // node edge-to-edge.
    expect(service?.style['background-fit']).toBe('none');
    expect(service?.style['background-clip']).toBe('none');
    expect(service?.style['background-width']).toBe('50%');
    expect(service?.style['background-height']).toBe('50%');
    expect(service?.style['background-position-x']).toBe('50%');
    expect(service?.style['background-position-y']).toBe('50%');
    const decoded = decodeURIComponent(
      String(service?.style['background-image']).replace(/^data:image\/svg\+xml;utf8,/, ''),
    );
    // Built-ins set `iconName`, so the data URL should embed a real Iconify
    // SVG body (path/g/circle), not the legacy unicode `<text>` fallback.
    expect(decoded).toMatch(/<(path|g|circle|rect|polyline)/);
    expect(decoded).not.toContain('<text');
    // Explicit width/height are mandatory — cytoscape rasterises canvas
    // background-images through `<img>`, which treats viewBox-only SVG as
    // 0×0 intrinsic dimensions and paints nothing.
    expect(decoded).toMatch(/width='\d+'/);
    expect(decoded).toMatch(/height='\d+'/);
    // The wrapper fill should be the resolved entity color (accent for service).
    expect(decoded).toContain(`fill='${PALETTE.accent}'`);
  });

  it('honors a custom `glyphScale` (clamped into [0, 1])', () => {
    const at40 = buildShipItStylesheet({ palette: PALETTE, glyphScale: 0.4 });
    const service40 = findSelector(at40, 'node[entityType = "service"]');
    expect(service40?.style['background-width']).toBe('40%');
    expect(service40?.style['background-height']).toBe('40%');

    // Out-of-range values clamp instead of throwing.
    const at5 = buildShipItStylesheet({ palette: PALETTE, glyphScale: 5 });
    expect(findSelector(at5, 'node[entityType = "service"]')?.style['background-width']).toBe(
      '100%',
    );
    const atNegative = buildShipItStylesheet({ palette: PALETTE, glyphScale: -1 });
    expect(
      findSelector(atNegative, 'node[entityType = "service"]')?.style['background-width'],
    ).toBe('0%');
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
