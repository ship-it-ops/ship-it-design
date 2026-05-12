import { listEntityTypes } from '@ship-it-ui/shipit';
import type cytoscape from 'cytoscape';

import { readThemeTokens, resolveColorReference, type ThemeTokenPalette } from './theme-tokens';

/**
 * Build a Cytoscape stylesheet from the live design tokens. The result is a
 * plain JSON array suitable for `cytoscape({ style: ... })` — re-run after a
 * `data-theme` change to pick up the new palette.
 *
 * The stylesheet is opinionated:
 *   - Nodes are square-ish rounded glyphs colored by `data(entityType)`.
 *   - Edges are token-colored thin lines with arrowheads.
 *   - Selected / on-path / dimmed states are driven by class names that the
 *     consumer toggles (`graph-canvas:selected`, `graph-canvas:path`,
 *     `graph-canvas:dim`).
 *
 * Pass `palette` to override the token read — useful for SSR or tests.
 */

export interface BuildStylesheetOptions {
  /** Pre-resolved palette. When omitted, tokens are read from the document. */
  palette?: ThemeTokenPalette;
  /**
   * Additional entries appended to the stylesheet — handy for app-specific
   * selectors without forking the builder.
   */
  extra?: ReadonlyArray<cytoscape.StylesheetJsonBlock>;
  /**
   * Render each registered entity type's glyph (◇, ○, ▤, ↑, ◎, ▢ …) inside
   * the cytoscape node as a centered SVG data URL. Closes the visual gap
   * with the `<GraphNode>` React component — the docs page and the canvas
   * now share a vocabulary. Defaults to `true`. Pass `false` to fall back
   * to the original wireframe (border-only) per-type rule.
   */
  renderGlyphs?: boolean;
}

// Re-export the block type so consumers can declare typed `extra` entries.
export type ShipItStylesheetBlock = cytoscape.StylesheetJsonBlock;

export function buildShipItStylesheet(
  options: BuildStylesheetOptions = {},
): cytoscape.StylesheetJson {
  const palette = options.palette ?? readThemeTokens();
  const color = (cssVar: string) => resolveColorReference(cssVar, palette);
  const renderGlyphs = options.renderGlyphs !== false;

  const base: cytoscape.StylesheetJsonBlock[] = [
    {
      selector: 'node',
      style: {
        'background-color': palette.panel,
        'border-width': 1.5,
        'border-color': palette.accent,
        'border-opacity': 1,
        label: 'data(label)',
        color: palette.textMuted,
        // Static stack instead of `var(--font-mono, monospace)` — cytoscape
        // can't resolve CSS variables outside the DOM cascade and emits a
        // warning per node selector at every mount. Consumers who need to
        // override the canvas font can do so via `options.extra`.
        'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        'font-size': 10,
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
        // 52 matches `<GraphNode>`'s default size — the docs page and the
        // canvas now share dimensions. Pre-Issue-4 the canvas was 36×36.
        width: 52,
        height: 52,
        shape: 'round-rectangle',
      },
    },
    // One selector per entity type registered with @ship-it-ui/shipit. Built-in
    // types are seeded automatically; custom types registered via
    // `registerEntityType(...)` pick up their `colorVar` here without a docs
    // patch or a forked stylesheet.
    ...listEntityTypes().map<cytoscape.StylesheetJsonBlock>(([type, meta]) => {
      const c = color(meta.colorVar);
      return {
        selector: `node[entityType = "${escapeCytoscapeAttr(type)}"]`,
        style: renderGlyphs
          ? {
              'border-color': c,
              'background-image': glyphDataUrl(meta.glyph, c),
              'background-fit': 'contain',
              'background-clip': 'none',
            }
          : { 'border-color': c },
      };
    }),
    {
      selector: 'node:selected',
      style: {
        'border-width': 3,
        'overlay-color': palette.accent,
        'overlay-opacity': 0.15,
        'overlay-padding': 4,
      },
    },
    {
      selector: 'node.graph-canvas\\:path',
      style: { 'border-color': palette.purple },
    },
    {
      selector: 'node.graph-canvas\\:dim',
      style: { opacity: 0.35 },
    },
    {
      selector: 'edge',
      style: {
        width: 1,
        'line-color': palette.border,
        'target-arrow-color': palette.border,
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.8,
        'curve-style': 'bezier',
      },
    },
    {
      selector: 'edge.graph-canvas\\:path',
      style: {
        'line-color': palette.purple,
        'target-arrow-color': palette.purple,
        width: 1.5,
      },
    },
    {
      selector: 'edge.graph-canvas\\:dim',
      style: { opacity: 0.25 },
    },
  ];

  return [...base, ...(options.extra ?? [])] as cytoscape.StylesheetJson;
}

/**
 * Convenience class names the stylesheet recognizes. Toggle these on Cytoscape
 * nodes / edges to drive the on-path and dimmed visuals.
 */
export const GRAPH_CANVAS_CLASS = {
  path: 'graph-canvas:path',
  dim: 'graph-canvas:dim',
} as const;

// Cytoscape's attribute selector accepts a double-quoted string. Escape
// embedded backslashes and double quotes so a malformed (or hostile)
// registered key can't break out of the selector. The grammar
// (https://js.cytoscape.org/#selectors/data) is more permissive than CSS, but
// these two characters are the only ones that would change selector semantics.
function escapeCytoscapeAttr(value: string): string {
  return value.replace(/[\\"]/g, (c) => `\\${c}`);
}

const XML_ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
};

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (c) => XML_ESCAPES[c] ?? c);
}

/**
 * Build a `data:image/svg+xml;...` URL containing the entity glyph centered
 * in a 52×52 viewBox, filled with `color`. Cytoscape draws this as the
 * node's `background-image`, on top of the panel-colored fill, beneath the
 * entity-color border. Glyphs are single unicode characters from the
 * `EntityTypeMeta.glyph` registry (◇ ○ ▤ ↑ ◎ ▢ …).
 *
 * `y='34'` lands the visual centre of typical box-drawing / shape glyphs on
 * the geometric centre of the node — `y='26'` (true centre) sits the
 * baseline at the centre and the glyph reads as if it's floating above.
 */
function glyphDataUrl(glyph: string, color: string): string {
  const safeGlyph = escapeXml(glyph);
  const safeColor = escapeXml(color);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'>` +
    `<text x='26' y='34' text-anchor='middle' ` +
    `font-family='ui-monospace,SFMono-Regular,monospace' ` +
    `font-size='26' fill='${safeColor}'>${safeGlyph}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
