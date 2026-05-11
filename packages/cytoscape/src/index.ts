/**
 * @ship-it-ui/cytoscape — Cytoscape adapter for the Ship-It design system.
 *
 * Three layered exports:
 *   - {@link buildShipItStylesheet}   — token-driven stylesheet array.
 *   - {@link useShipItStylesheet}     — theme-aware re-resolver hook.
 *   - {@link GraphCanvas}             — `<GraphCanvas>` React wrapper that
 *                                       owns the data-theme ↔ stylesheet ↔
 *                                       inspector dance.
 *
 * Cytoscape is a peer dependency — pass `engine={cytoscape}` so the consumer
 * controls the version and any registered extensions.
 */

export {
  buildShipItStylesheet,
  GRAPH_CANVAS_CLASS,
  type BuildStylesheetOptions,
} from './stylesheet';

export {
  useShipItStylesheet,
  type UseShipItStylesheetOptions,
  type UseShipItStylesheetReturn,
} from './useShipItStylesheet';

export {
  GraphCanvas,
  type GraphCanvasProps,
  type GraphCanvasHandle,
  type CytoscapeEngine,
} from './GraphCanvas';

export {
  readThemeTokens,
  resolveCssVar,
  resolveColorReference,
  resolveEntityColor,
  type ThemeTokenPalette,
} from './theme-tokens';
