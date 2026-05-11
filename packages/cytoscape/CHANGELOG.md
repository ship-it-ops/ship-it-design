# @ship-it-ui/cytoscape

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
