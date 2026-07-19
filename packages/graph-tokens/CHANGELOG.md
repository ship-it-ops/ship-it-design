# @ship-it-ui/graph-tokens

## 0.0.3

### Patch Changes

- 035d1c5: Dependency refresh from the June/July dependabot batches: runtime bumps
  (@radix-ui/\* incl. slider 1.4.1, @xyflow/react 12.11.0) plus security
  overrides (undici, vite, esbuild, @babel/core, js-yaml) and tooling
  updates (vitest 3.2.6, shiki 4.2.0). No API changes.

## 0.0.2

### Patch Changes

- 9da43f1: Extract token-resolution helpers from `@ship-it-ui/cytoscape` into a new shared package `@ship-it-ui/graph-tokens`. The cytoscape package re-exports the same surface (`readThemeTokens`, `resolveCssVar`, `resolveColorReference`, `toSrgb`, `ThemeTokenPalette`) so existing consumers see no behavior change. `resolveEntityColor` stays in `@ship-it-ui/cytoscape` since it bridges to the `@ship-it-ui/shipit` entity-type registry. The new shared package unblocks engine-agnostic graph adapters (`@ship-it-ui/graph-editor`) that need the same token bridge without pulling in Cytoscape.
