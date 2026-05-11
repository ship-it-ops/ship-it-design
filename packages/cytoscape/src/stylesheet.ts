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
}

// Re-export the block type so consumers can declare typed `extra` entries.
export type ShipItStylesheetBlock = cytoscape.StylesheetJsonBlock;

export function buildShipItStylesheet(
  options: BuildStylesheetOptions = {},
): cytoscape.StylesheetJson {
  const palette = options.palette ?? readThemeTokens();
  const color = (cssVar: string) => resolveColorReference(cssVar, palette);

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
        'font-family': 'var(--font-mono, monospace)',
        'font-size': 10,
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 6,
        width: 36,
        height: 36,
        shape: 'round-rectangle',
      },
    },
    {
      selector: 'node[entityType = "service"]',
      style: { 'border-color': color('var(--color-accent)') },
    },
    {
      selector: 'node[entityType = "person"]',
      style: { 'border-color': color('var(--color-purple)') },
    },
    {
      selector: 'node[entityType = "document"]',
      style: { 'border-color': color('var(--color-pink)') },
    },
    {
      selector: 'node[entityType = "deployment"]',
      style: { 'border-color': color('var(--color-ok)') },
    },
    {
      selector: 'node[entityType = "incident"]',
      style: { 'border-color': color('var(--color-warn)') },
    },
    {
      selector: 'node[entityType = "ticket"]',
      style: { 'border-color': color('var(--color-text-muted)') },
    },
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
