# @ship-it-ui/cytoscape

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
