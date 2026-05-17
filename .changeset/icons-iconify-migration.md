---
'@ship-it-ui/icons': patch
---

Replace the Unicode-glyph rendering system with inline Iconify SVGs. The
`<IconGlyph>` consumer API (`name`, `kind`, `size`, `label`) is unchanged
in shape; under the hood every name now resolves to a Lucide / Phosphor /
simple-icons SVG via `src/icon-manifest.ts`. A build-time codegen
(`scripts/build-icon-data.ts`) materialises every manifest entry into the
committed `src/icon-data.ts`; a drift test regenerates the same content
in-memory and fails CI when the manifest and generated file desync.

**New exports**:

- `iconData` (and the `IconData` type) — the raw map of `{ body, viewBox,
width, height }`. Consumers that need to render icons outside React
  (canvas, Mermaid) read directly from it.
- `iconToSvgDataUrl(name, { color?, size? })` — builds a complete
  `data:image/svg+xml;…` URL with explicit `width`/`height` so cytoscape's
  `<img>`-based background-image rasterisation paints correctly. Falls back
  to a centered `<text>` glyph for unregistered names.
- Two new manifest aliases — `deployment` (`lucide:rocket`) and `ticket`
  (`lucide:ticket`) — to give entity-type built-ins clean semantic names.

**Removed (breaking for any external consumer)**:

- `glyphs` and `connectorGlyphs` value exports — the unicode character
  lookup tables. The `GlyphName` and `ConnectorName` types are preserved
  but now derived from `icon-manifest.ts` (`keyof typeof glyphManifest`).
  Consumers that imported these maps must read `iconData` instead, or call
  `iconToSvgDataUrl()` for the SVG body string.
- `resolveGlyph(name)` helper — no replacement; the typed `IconGlyph`
  component is the canonical surface.
- `src/glyphs.ts` and `src/manifest-coverage.test.ts` — deleted.

**Behaviour changes**:

- `IconGlyph` renders as `<svg>` instead of `<span>`. **Typed-API break**:
  `forwardRef` element type changes from `HTMLSpanElement` to
  `SVGSVGElement`; props extend `SVGAttributes<SVGSVGElement>` instead of
  `HTMLAttributes<HTMLSpanElement>`. Consumers holding refs need to update
  the type annotation.
- `DynamicIconGlyph` falls back to drawing the literal name string as
  centered SVG `<text>` for unregistered names (no more unicode-map
  fallback).

**Build & deps**: adds `@iconify/utils`, `@iconify-json/lucide`,
`@iconify-json/ph`, `@iconify-json/simple-icons` as devDependencies only —
nothing Iconify-shaped ships in `dist/`. The codegen runs as the first step
in `pnpm build`; a `pnpm icons:sync` alias regenerates `icon-data.ts`
without a full `tsup` pass.
