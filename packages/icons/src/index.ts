/**
 * Public icon exports.
 *
 * Two systems live side-by-side:
 *
 *   1. `IconGlyph` + `glyphs` + `connectorGlyphs` — the canonical glyph vocabulary
 *      (unicode characters rendered as styled text). This is what most components use.
 *
 *   2. SVG-based React components — generated from `src/svg/*.svg` by SVGR
 *      (`scripts/build.ts`). Auto-regenerated into `src/svg-icons.ts` on every build;
 *      this file is hand-authored and survives.
 */

export {
  IconGlyph,
  DynamicIconGlyph,
  type IconGlyphProps,
  type DynamicIconGlyphProps,
} from './IconGlyph';
export {
  glyphs,
  connectorGlyphs,
  resolveGlyph,
  type GlyphName,
  type ConnectorName,
} from './glyphs';

export type { SVGProps } from 'react';

// Auto-generated SVG icons (empty until SVGs are added under src/svg/).
export * from './svg-icons';
