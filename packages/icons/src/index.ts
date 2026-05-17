/**
 * Public icon exports.
 *
 * `<IconGlyph name="…" />` is the primary consumer surface — it renders an
 * inline SVG from `src/icon-data.ts` (auto-generated from the Iconify manifest
 * in `src/icon-manifest.ts`). `<DynamicIconGlyph>` accepts arbitrary runtime
 * names and falls back to rendering the literal string when no icon is
 * registered.
 *
 * For non-React rendering surfaces (cytoscape `background-image`, canvas,
 * Mermaid), call `iconToSvgDataUrl(name, options)` to get a ready
 * `data:image/svg+xml;…` URL.
 *
 * The SVGR pipeline under `scripts/build.ts` is still wired — drop a file in
 * `src/svg/` and it becomes a React component on the next build.
 */

export {
  IconGlyph,
  DynamicIconGlyph,
  type IconGlyphProps,
  type DynamicIconGlyphProps,
} from './IconGlyph';
export {
  connectorManifest,
  glyphManifest,
  type ConnectorName,
  type GlyphName,
  type IconRef,
} from './icon-manifest';
export { iconData, type IconData } from './icon-data';
export { iconToSvgDataUrl } from './icon-to-data-url';

export type { SVGProps } from 'react';

// Auto-generated SVG icons (empty until SVGs are added under src/svg/).
export * from './svg-icons';
