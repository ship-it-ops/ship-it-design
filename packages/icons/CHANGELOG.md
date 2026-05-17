# @ship-it-ui/icons

## 0.0.6

### Patch Changes

- 0318497: Replace the Unicode-glyph rendering system with inline Iconify SVGs. The
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
  - `glyphManifest`, `connectorManifest`, and the `IconRef` type — the raw
    `[collection, iconName]` map. Useful for enumeration (icon pickers, docs
    pages) when you need the names in their authored order.

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

- 0318497: Tighten `<IconGlyph>` typing and add a runtime-dynamic escape hatch:
  - `IconGlyphProps['name']` is now `GlyphName | ConnectorName` (previously
    `GlyphName | ConnectorName | string`). Static call-sites get compile-time
    typo catching — names like `caretUp` / `change` / `book` / `analytics` /
    `cluster` that don't exist in the registry now fail typecheck instead of
    silently rendering the literal string.
  - New companion export `<DynamicIconGlyph>` accepts `name: string` for the
    runtime case (server payloads, plugin-registered keys). Same render
    behaviour — falls back to the literal name when the glyph isn't
    registered, which is the right behaviour when the name is genuinely
    dynamic.
  - `ConnectorCard` switches to `<DynamicIconGlyph>` internally so its public
    `connector: ConnectorName | (string & {})` surface keeps working
    unchanged.

  This is a compile-time-only breaking change for any out-of-tree consumer
  passing arbitrary strings to `<IconGlyph name=…>`; the fix is a single-line
  swap to `<DynamicIconGlyph>`. Per the v0 patch-only convention this ships as
  a patch.

## 0.0.5

### Patch Changes

- 0796a75: Add `caretUp` (▴) and `caretDown` (⌄) glyphs to complete the caret family —
  previously only `caretLeft` (‹) and `caretRight` (›) existed. Useful for sort
  indicators, dropdown toggles, and collapsible-section affordances. `caretUp`
  uses U+25B4 (BLACK UP-POINTING SMALL TRIANGLE) to stay in the same
  small-triangle family as the existing `expand: '▸'` / `collapse: '▾'` glyphs,
  leaving U+2303 (`⌃`) reserved for the macOS Control-key role when the
  interaction-keys section adds `ctrl` alongside `cmd`, `shift`, `option`, and
  `escape`.

## 0.0.4

### Patch Changes

- 01246b3: Add a `lint:fix` npm script to both packages so `pnpm --filter
@ship-it-ui/icons lint:fix` (and the equivalent for tokens) runs
  `eslint src --fix`. Mirrors the script already present in the other
  publishable packages — no runtime or published-artifact change.

## 0.0.3

### Patch Changes

- 597a705: Adds five new glyphs to the `glyphs` map: `info` (ⓘ), `moreVertical` (⋮),
  `edit` (✎), `copy` (⧉), and `refresh` (↻). Existing glyph names are
  unchanged.

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.

## 0.0.1

### Patch Changes

- 1035968: v0 launch
