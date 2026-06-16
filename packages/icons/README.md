# @ship-it-ui/icons

Iconography for the design system. Icons are curated from [Iconify](https://iconify.design/)
sets via a typed manifest, with an SVGR escape hatch for bespoke SVGs. The
primary consumer surface is `<IconGlyph name="…" />`.

## How this fits in

Part of the [Ship-It Design System](../../docs/architecture.md). See the
architecture overview for how `@ship-it-ui/tokens`, `@ship-it-ui/icons`,
`@ship-it-ui/ui`, and `@ship-it-ui/shipit` compose.

## How it works (Iconify manifest — canonical path)

```
src/icon-manifest.ts        scripts/build-icon-data.ts        src/icon-data.ts
────────────────────        ──────────────────────────        ─────────────────────
instagram: ['simple-icons', ──► pull body/viewBox from   ──►  "logo:instagram": { body, … }
  'instagram']                  @iconify-json/<set>            (committed, drift-tested)
github: ['lucide', 'github'] ─►                           ──►  "github": { body, … }
```

`src/icon-manifest.ts` is the source of truth. It maps semantic names to Iconify
`[collection, icon]` tuples across three sets:

- **`lucide`** — stroke-based UI primitives (the default)
- **`ph`** ([Phosphor](https://phosphoricons.com/)) — softer variants when Lucide's hairlines feel wrong
- **`simple-icons`** — brand logos (GitHub, Slack, Instagram, …)

It exposes two maps: `glyphManifest` (semantic UI icons → `<IconGlyph name="…" />`)
and `logoManifest` (brand logos → `<IconGlyph kind="logo" name="…" />`).
The `GlyphName` / `LogoName` types are derived from these maps, so adding an
entry expands the typed `name` prop automatically.

> **Deprecated alias:** the brand-logo map was formerly `connectorManifest` and
> the category was `kind="connector"`. Both still work (`connectorManifest`,
> `ConnectorName`, and `kind="connector"` resolve to the same icons) but are
> `@deprecated` and will be removed at 1.0 — prefer `logoManifest` / `LogoName`
> / `kind="logo"`.

`scripts/build-icon-data.ts` reads the manifest, pulls each referenced icon from
the corresponding `@iconify-json/*` devDep, and writes the **committed**
`src/icon-data.ts` (`Record<string, { body; viewBox; width; height }>`). A
`vitest` drift test (`scripts/build-icon-data.test.ts`) regenerates the same
content in-memory and byte-diffs it against the committed copy, so the manifest
can never silently desync from the data.

```ts
import { IconGlyph } from '@ship-it-ui/icons';

<IconGlyph name="rocket" className="text-accent size-4" />
<IconGlyph kind="logo" name="instagram" className="size-5" />
```

For non-React surfaces (cytoscape `background-image`, canvas, Mermaid), call
`iconToSvgDataUrl(name, options)` to get a ready `data:image/svg+xml;…` URL.

## Adding an icon

1. Find the icon on [icon-sets.iconify.design](https://icon-sets.iconify.design/)
   in one of the in-use collections (`lucide`, `ph`, `simple-icons`).
2. Add an entry to `glyphManifest` (semantic UI icon) or `logoManifest`
   (brand logo) in `src/icon-manifest.ts`, e.g. `instagram: ['simple-icons', 'instagram']`.
3. Regenerate the committed data: `pnpm --filter @ship-it-ui/icons icons:sync`
   (or the full `build`). The codegen throws if a slug doesn't exist in its
   collection.
4. Commit `src/icon-manifest.ts` **and** the regenerated `src/icon-data.ts`. CI's
   drift test fails if you forget the regenerate.

Need a collection that isn't installed yet? Add the `@iconify-json/<set>` devDep
first, then reference it from the manifest.

## SVGR escape hatch (bespoke SVGs)

For one-off art that isn't in any Iconify set, the SVGR pipeline under
`scripts/build.ts` is still wired:

1. Drop a clean kebab-case SVG into `src/svg/` (e.g. `my-logo.svg`) — no fixed
   `width`/`height` on the root, uses `currentColor` (or solid `#000`, remapped
   automatically), ideally a 24×24 viewBox.
2. Run `pnpm --filter @ship-it-ui/icons build`. SVGR emits a typed component into
   `src/components/` and re-exports it from `src/svg-icons.ts`.
3. Import the named component: `import { MyLogoIcon } from '@ship-it-ui/icons';`.
4. Commit the SVG and the regenerated `src/svg-icons.ts`. The generated
   `src/components/*.tsx` files are gitignored — CI rebuilds them from the
   committed SVG sources.

`src/svg/` is empty by default; prefer the Iconify manifest unless you genuinely
need custom art.
