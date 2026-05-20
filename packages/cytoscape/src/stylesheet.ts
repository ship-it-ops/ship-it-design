import { iconToSvgDataUrl } from '@ship-it-ui/icons';
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
  /**
   * Fraction of the node that the rendered glyph occupies. Default `0.5` —
   * matches `<GraphNode>` where the icon is sized at ~42% of the square and
   * leaves breathing room inside the border. Set to `1` to revert to the
   * pre-0.0.7 behavior where the glyph filled the node edge-to-edge.
   */
  glyphScale?: number;
}

// Re-export the block type so consumers can declare typed `extra` entries.
export type ShipItStylesheetBlock = cytoscape.StylesheetJsonBlock;

export function buildShipItStylesheet(
  options: BuildStylesheetOptions = {},
): cytoscape.StylesheetJson {
  const palette = options.palette ?? readThemeTokens();
  const color = (cssVar: string) => resolveColorReference(cssVar, palette);
  const renderGlyphs = options.renderGlyphs !== false;
  // Clamp into a sensible range. `0` would hide the glyph entirely; `1` paints
  // edge-to-edge (the legacy behavior). The default `0.5` matches the 26/52
  // ratio used by the `<GraphNode>` React component.
  const glyphScale = Math.max(0, Math.min(1, options.glyphScale ?? 0.5));
  const glyphSizePct = `${Math.round(glyphScale * 100)}%`;

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
      // Pre-0.0.7 the glyph used `background-fit: contain`, which scales the
      // image to fill the node edge-to-edge and ignores the painted SVG's
      // intrinsic size. The icon ended up touching the border on every side
      // and looked cramped against the 52×52 node. We now set
      // `background-fit: none` and pin the painted width/height to a
      // fraction of the node (default 50%), with the image's anchor centered
      // — that gives the glyph breathing room and visually aligns with the
      // `<GraphNode>` React component used elsewhere in the design system.
      //
      // Cast through `unknown` because `cytoscape.Css.Node` doesn't (yet)
      // expose `background-width`/`background-height` in its TS types,
      // though the runtime accepts them per the cytoscape.js reference.
      const glyphStyle = renderGlyphs
        ? ({
            'border-color': c,
            'background-image': iconToSvgDataUrl(meta.iconName, { color: c }),
            'background-fit': 'none',
            'background-clip': 'none',
            'background-width': glyphSizePct,
            'background-height': glyphSizePct,
            'background-position-x': '50%',
            'background-position-y': '50%',
          } as unknown as cytoscape.Css.Node)
        : { 'border-color': c };
      return {
        selector: `node[entityType = "${escapeCytoscapeAttr(type)}"]`,
        style: glyphStyle,
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
      // Default edges tone with `accent` so they read against the panel
      // background — matches `<GraphEdge edgeStyle="solid">` in the docs.
      // Pre-fix the line drew in `palette.border` (the same tone as
      // surface-divider lines) and effectively disappeared on dark themes.
      selector: 'edge',
      style: {
        width: 1,
        'line-color': palette.accent,
        'target-arrow-color': palette.accent,
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
