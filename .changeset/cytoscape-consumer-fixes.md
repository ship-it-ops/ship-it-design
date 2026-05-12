---
'@ship-it-ui/cytoscape': patch
---

Three consumer-reported fixes plus a visual upgrade, all in
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
