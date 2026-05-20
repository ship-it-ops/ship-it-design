---
'@ship-it-ui/cytoscape': patch
'@ship-it-ui/graph-tokens': patch
---

Extract token-resolution helpers from `@ship-it-ui/cytoscape` into a new shared package `@ship-it-ui/graph-tokens`. The cytoscape package re-exports the same surface (`readThemeTokens`, `resolveCssVar`, `resolveColorReference`, `toSrgb`, `ThemeTokenPalette`) so existing consumers see no behavior change. `resolveEntityColor` stays in `@ship-it-ui/cytoscape` since it bridges to the `@ship-it-ui/shipit` entity-type registry. The new shared package unblocks engine-agnostic graph adapters (`@ship-it-ui/graph-editor`) that need the same token bridge without pulling in Cytoscape.
