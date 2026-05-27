/**
 * Cytoscape-side wrapper around `@ship-it-ui/graph-tokens`. The token-reader
 * primitives (`resolveCssVar`, `toSrgb`, `readThemeTokens`,
 * `resolveColorReference`, `ThemeTokenPalette`) live in the shared package so
 * `@ship-it-ui/graph-editor` (React Flow) can consume them without dragging
 * Cytoscape in. Only `resolveEntityColor` lives here because it bridges to the
 * `@ship-it-ui/shipit` entity-type registry.
 */

import { resolveColorReference, type ThemeTokenPalette } from '@ship-it-ui/graph-tokens';
import { getEntityTypeMeta, type EntityType } from '@ship-it-ui/shipit';

export {
  readThemeTokens,
  resolveColorReference,
  resolveCssVar,
  toSrgb,
  type ThemeTokenPalette,
} from '@ship-it-ui/graph-tokens';

/**
 * Resolve the concrete color for a registered entity type. Reads the type's
 * `colorVar` (a `var(--color-…)` string) and looks the value up in the
 * palette. Falls back to the palette's `accent` color when the var is
 * malformed or unknown.
 */
export function resolveEntityColor(type: EntityType, palette: ThemeTokenPalette): string {
  const meta = getEntityTypeMeta(type);
  return resolveColorReference(meta.colorVar, palette);
}
