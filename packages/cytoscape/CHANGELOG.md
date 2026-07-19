# @ship-it-ui/cytoscape

## 0.0.21

### Patch Changes

- 035d1c5: Dependency refresh from the June/July dependabot batches: runtime bumps
  (@radix-ui/\* incl. slider 1.4.1, @xyflow/react 12.11.0) plus security
  overrides (undici, vite, esbuild, @babel/core, js-yaml) and tooling
  updates (vitest 3.2.6, shiki 4.2.0). No API changes.
- Updated dependencies [035d1c5]
- Updated dependencies [035d1c5]
  - @ship-it-ui/graph-tokens@0.0.3
  - @ship-it-ui/shipit@0.0.22
  - @ship-it-ui/ui@0.0.21
  - @ship-it-ui/icons@0.0.15

## 0.0.20

### Patch Changes

- Updated dependencies [2f70665]
- Updated dependencies [2f70665]
  - @ship-it-ui/ui@0.0.20
  - @ship-it-ui/shipit@0.0.21

## 0.0.19

### Patch Changes

- Updated dependencies [52af924]
- Updated dependencies [52af924]
- Updated dependencies [52af924]
- Updated dependencies [52af924]
- Updated dependencies [52af924]
- Updated dependencies [52af924]
- Updated dependencies [52af924]
  - @ship-it-ui/icons@0.0.14
  - @ship-it-ui/shipit@0.0.20
  - @ship-it-ui/ui@0.0.19

## 0.0.18

### Patch Changes

- Updated dependencies [bae6568]
  - @ship-it-ui/ui@0.0.18
  - @ship-it-ui/shipit@0.0.19

## 0.0.17

### Patch Changes

- Updated dependencies [d4e29e1]
  - @ship-it-ui/icons@0.0.13
  - @ship-it-ui/shipit@0.0.18
  - @ship-it-ui/ui@0.0.17

## 0.0.16

### Patch Changes

- Updated dependencies [9c8a7e8]
  - @ship-it-ui/ui@0.0.16
  - @ship-it-ui/shipit@0.0.17

## 0.0.15

### Patch Changes

- Updated dependencies [61b814b]
- Updated dependencies [61b814b]
- Updated dependencies [61b814b]
- Updated dependencies [61b814b]
- Updated dependencies [61b814b]
  - @ship-it-ui/ui@0.0.15
  - @ship-it-ui/shipit@0.0.16

## 0.0.14

### Patch Changes

- 19b6dbd: Bump dev dependencies via dependabot patches group (#79):
  - `react` / `react-dom` 19.2.6 → 19.2.7 (fixes a `FormData`-entries
    regression introduced in 19.2.6's Server Actions; also backported in
    `next@16.2.7` as "Don't drop FormData entries").
  - `@types/react` 19.2.15 → 19.2.16.
  - `@iconify-json/simple-icons` 1.2.84 → 1.2.85 (icons only).

  Dev-only bumps; published tarballs are functionally unchanged. Five of
  these packages (cytoscape, graph-editor, map, next, shipit) would
  patch-cascade alongside `@ship-it-ui/ui` regardless per
  `updateInternalDependencies`; the explicit entry exists so the
  changeset-required gate sees coverage for the bundled dependabot patch
  group, and so `icons` (which isn't a ui-dependent and wouldn't cascade)
  picks up the upstream alignment.

- Updated dependencies [19b6dbd]
- Updated dependencies [19b6dbd]
- Updated dependencies [19b6dbd]
  - @ship-it-ui/ui@0.0.14
  - @ship-it-ui/icons@0.0.12
  - @ship-it-ui/shipit@0.0.15

## 0.0.13

### Patch Changes

- Updated dependencies [a8ebcce]
- Updated dependencies [a8ebcce]
- Updated dependencies [a8ebcce]
  - @ship-it-ui/ui@0.0.13
  - @ship-it-ui/shipit@0.0.14

## 0.0.12

### Patch Changes

- Updated dependencies [206fa53]
- Updated dependencies [206fa53]
  - @ship-it-ui/ui@0.0.12
  - @ship-it-ui/shipit@0.0.13

## 0.0.11

### Patch Changes

- Updated dependencies [a793daa]
- Updated dependencies [a793daa]
  - @ship-it-ui/ui@0.0.11
  - @ship-it-ui/icons@0.0.11
  - @ship-it-ui/shipit@0.0.12

## 0.0.10

### Patch Changes

- 1ba01f1: React 19 baseline. Peer range tightened to `react ^19.0.0` /
  `react-dom ^19.0.0` (was `^18.0.0 || ^19.0.0`) and dev installs bumped to
  React 19.2. Drops React 18 from the supported matrix — consumers must be on
  React 19 to install.

  `@ship-it-ui/ui` also refreshes every `@radix-ui/react-*` dependency to the
  latest 1.x. Each one now declares explicit React 19 peer support and ships
  the strict-mode / `forwardRef` compat fixes from the Radix 1.x line. No
  Radix v2 migration in this release; only patch-level moves within 1.x.

- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
  - @ship-it-ui/icons@0.0.10
  - @ship-it-ui/ui@0.0.10
  - @ship-it-ui/shipit@0.0.11

## 0.0.9

### Patch Changes

- 66be20b: Dev-dependency bumps with no runtime-output impact:
  - `@ship-it-ui/cytoscape`: `cytoscape` dev dep `^3.30.0` → `^3.33.4`.
  - `@ship-it-ui/icons`: `@iconify-json/lucide` `^1.2.0` → `^1.2.109`,
    `@iconify-json/simple-icons` `^1.2.0` → `^1.2.83`.

  Published package output is unchanged; these only affect local development
  and CI environments.

- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
  - @ship-it-ui/icons@0.0.9
  - @ship-it-ui/ui@0.0.9
  - @ship-it-ui/shipit@0.0.10

## 0.0.8

### Patch Changes

- Updated dependencies [e2b569e]
- Updated dependencies [e2b569e]
  - @ship-it-ui/icons@0.0.8
  - @ship-it-ui/ui@0.0.8
  - @ship-it-ui/shipit@0.0.9

## 0.0.7

### Patch Changes

- 9da43f1: Stop letting node glyphs fill the cytoscape node edge-to-edge. The per-entity-type stylesheet block now uses `background-fit: none` (was `contain`) with `background-width` / `background-height` pinned at `50%` and the image centered via `background-position-x` / `background-position-y`. Consumers can override the fraction with the new `glyphScale` option on `buildShipItStylesheet` (default `0.5`, clamped to `[0, 1]`); pass `1` to revert to the legacy edge-to-edge behavior. The visual now matches the `<GraphNode>` React component (≈42% icon inside a 52px square).
- 9da43f1: Extract token-resolution helpers from `@ship-it-ui/cytoscape` into a new shared package `@ship-it-ui/graph-tokens`. The cytoscape package re-exports the same surface (`readThemeTokens`, `resolveCssVar`, `resolveColorReference`, `toSrgb`, `ThemeTokenPalette`) so existing consumers see no behavior change. `resolveEntityColor` stays in `@ship-it-ui/cytoscape` since it bridges to the `@ship-it-ui/shipit` entity-type registry. The new shared package unblocks engine-agnostic graph adapters (`@ship-it-ui/graph-editor`) that need the same token bridge without pulling in Cytoscape.
- Updated dependencies [9da43f1]
- Updated dependencies [9da43f1]
- Updated dependencies [9da43f1]
  - @ship-it-ui/ui@0.0.7
  - @ship-it-ui/graph-tokens@0.0.2
  - @ship-it-ui/icons@0.0.7
  - @ship-it-ui/shipit@0.0.8

## 0.0.6

### Patch Changes

- 0318497: Route per-entity-type `background-image` styles through
  `iconToSvgDataUrl()` from `@ship-it-ui/icons` instead of the hand-rolled
  `glyphDataUrl()`. Entity types now paint with real Iconify SVGs inside
  cytoscape nodes.

  Adds `@ship-it-ui/icons` as a peer dependency (and devDependency for local
  builds). No cytoscape API change.

- Updated dependencies [0318497]
- Updated dependencies [0318497]
- Updated dependencies [0318497]
- Updated dependencies [0318497]
- Updated dependencies [0318497]
  - @ship-it-ui/icons@0.0.6
  - @ship-it-ui/shipit@0.0.7
  - @ship-it-ui/ui@0.0.6

## 0.0.5

### Patch Changes

- @ship-it-ui/shipit@0.0.6

## 0.0.4

### Patch Changes

- 659db3e: Default cytoscape edges now draw in `--color-accent` rather than
  `--color-border`. The previous tone was the same as surface-divider lines
  and made edges almost invisible against the panel background on dark
  themes; the canonical `<GraphEdge edgeStyle="solid">` in the docs already
  drew in accent, so the adapter now matches it. Apps that intentionally
  want subdued edges can still override via `buildShipItStylesheet({ extra })`.
- 659db3e: Fix entity glyphs not painting on the Cytoscape canvas. The SVG data-URL
  emitted by `buildShipItStylesheet`'s `background-image` carried only a
  `viewBox` attribute; Cytoscape rasterises canvas background-images through
  `<img>`, which treats a `viewBox`-only `<svg>` as 0×0 intrinsic dimensions
  and renders nothing. Added explicit `width='52' height='52'` to match the
  existing viewBox so the glyph paints at the node's full size (with
  `background-fit: contain` unchanged).

## 0.0.3

### Patch Changes

- 40c58e6: Three consumer-reported fixes plus a visual upgrade, all in
  `@ship-it-ui/cytoscape`:
  - **Container collapse fix.** `<GraphCanvas>` mounted cytoscape on a
    `className="absolute inset-0"` div. Cytoscape injects an unlayered
    `.__________cytoscape_container { position: relative }` rule at init time;
    with Tailwind v4 emitting utilities into `@layer utilities`, the
    unlayered rule won and the canvas collapsed to 0×0 in a static-height
    parent. Now mounted with inline `style={{ position: 'absolute', inset: 0 }}`
    which outranks both layered Tailwind and cytoscape's runtime reset.
  - **sRGB token coercion (`oklch()` warnings).** `readThemeTokens` returns
    the raw computed value of each `--color-*` token. Tailwind v4 compiles
    every token to `oklch(...)`, which cytoscape's color parser rejects —
    70+ warnings per mount and every node falls back to default colors. A
    new internal `toSrgb` helper coerces values through a 1×1 canvas pixel
    readback (the only reliable way; reading `ctx.fillStyle` back returns
    the oklch literal on modern Chromium). `readThemeTokens` wraps every
    `resolveCssVar` result in `toSrgb`, so cytoscape sees only `rgb(...)`.
  - **Static font-family.** The base node block handed cytoscape
    `font-family: var(--font-mono, monospace)`. Cytoscape can't resolve
    `var(...)` outside the DOM cascade — four more warnings per mount.
    Swapped for a static `ui-monospace, SFMono-Regular, Menlo, Monaco,
Consolas, monospace` stack. Consumers who need a custom canvas font can
    override via `options.extra`.
  - **Glyph rendering in nodes + 36→52 default size** (new opt-out).
    `buildShipItStylesheet` now emits a centered SVG-data-URL `background-image`
    with the entity's registered glyph (`◇`, `○`, `▤`, `↑`, `◎`, `▢`, …) per
    type, and the default node dimensions match the `<GraphNode>` component
    (52×52, previously 36×36). The cytoscape canvas now shares its visual
    vocabulary with the docs `<GraphNode>` page. Pass `{ renderGlyphs: false }`
    on `BuildStylesheetOptions` to fall back to the wireframe.

  Regression tests assert (a) `JSON.stringify(buildShipItStylesheet(...))`
  contains no `oklch(` or `var(` substrings, (b) the mount div sets
  `position: absolute; inset: 0` inline, (c) per-type rules emit the glyph
  data URL by default and only `border-color` when opted out.

- Updated dependencies [40c58e6]
  - @ship-it-ui/ui@0.0.5
  - @ship-it-ui/shipit@0.0.5

## 0.0.2

### Patch Changes

- 01246b3: **New package: `@ship-it-ui/cytoscape`.** Cytoscape adapter for the design
  system — three layered exports:
  - **`buildShipItStylesheet(options?)`** — returns a token-driven Cytoscape
    stylesheet array. Reads color tokens from `<html>` via `getComputedStyle`
    by default; pass a pre-resolved `palette` to render deterministically (SSR,
    tests, screenshots). Append app-specific selectors via `options.extra`. The
    exported `GRAPH_CANVAS_CLASS` constants are the class names the stylesheet
    recognizes (`'graph-canvas:path'`, `'graph-canvas:dim'`).
  - **`useShipItStylesheet(cyRef)`** — React hook that re-applies the
    stylesheet whenever `<html data-theme>` flips. Wires a `MutationObserver`
    against the document root (skippable via `observe: false`) and returns a
    `refresh()` callback for manual triggers (e.g. after a `--color-accent`
    hue-knob change).
  - **`<GraphCanvas engine={cytoscape} … />`** — high-level wrapper that owns
    the Cytoscape lifecycle (create / destroy), the `data-theme` ↔ stylesheet
    sync, and a thin selection API (`onSelect`, `onClearSelection`,
    `onNodeHover`, `onNodeLeave`). The Cytoscape engine itself is passed in as a
    prop, so the consumer controls the version and any registered extensions.
    Accepts an `inspector` slot positioned top-right — wire it to
    `<GraphInspector>` from `@ship-it-ui/shipit`.

  Also exported: `readThemeTokens`, `resolveCssVar`, `resolveColorReference`,
  `resolveEntityColor`, `ThemeTokenPalette`, `BuildStylesheetOptions`,
  `GraphCanvasProps`, `GraphCanvasHandle`, `CytoscapeEngine`,
  `ShipItStylesheetBlock`. The package depends on `@ship-it-ui/shipit` to map
  registered entity types to colors — register custom types once via
  `registerEntityType` and they appear in the graph automatically.

  The `var(--color-…)` parser in `resolveColorReference` is a hand-written
  deterministic O(n) walk over the input (no regex). Earlier regex-based
  drafts had overlapping quantifiers around the color name that CodeQL
  flagged as quadratic backtracking on adversarial inputs like
  `var(--color---------` with no closing paren (CodeQL js/polynomial-redos).

- Updated dependencies [01246b3]
- Updated dependencies [01246b3]
- Updated dependencies [01246b3]
  - @ship-it-ui/shipit@0.0.4
  - @ship-it-ui/ui@0.0.4
