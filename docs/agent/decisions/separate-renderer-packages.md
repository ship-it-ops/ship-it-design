---
type: decision
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [graph, packages, bundle-size, cytoscape, react-flow, maplibre]
importance: standard
---

# Graph viewer / editor / map ship as separate optional packages, sharing only `graph-tokens`

## Context

Graph rendering (Cytoscape for read-only views, React Flow for editing)
and maps (MapLibre GL JS) each weigh hundreds of KB. They're domain-
specific — most consumers don't need them. Initially they were proposed
to live inside `@ship-it-ui/shipit`; that was rejected.

## Decision

- `@ship-it-ui/cytoscape` — read-only graph viewer (`<GraphCanvas>`).
- `@ship-it-ui/graph-editor` — editing canvas (`<GraphEditorCanvas>`,
  React Flow under the hood). Same `elements[]` input shape as the viewer
  so consumers can swap viewer ↔ editor without reshaping data.
- `@ship-it-ui/graph-tokens` — engine-agnostic token-resolution helpers
  (`resolveCssVar`, `readThemeTokens`, `resolveColorReference`,
  `ThemeTokenPalette`). Both renderers consume it; **neither imports the
  other at runtime** (tree-shaking enforced by package boundary).
- `@ship-it-ui/map` — MapLibre wrapper with token-styled markers (added
  in PR #51, the consumer-marketplace pivot — see
  `.changeset/map-package-initial.md`).
- `@ship-it-ui/next` — Next.js App Router helpers, separately installable
  so non-Next consumers don't pull cookie/server code.

`@ship-it-ui/cytoscape` does have one bridge into `shipit`:
`resolveEntityColor` lives in `cytoscape/src/theme-tokens.ts` because it
reads the entity-type registry from `@ship-it-ui/shipit`. This is an
intentional asymmetry — graph-tokens stays renderer-/registry-agnostic;
only the Cytoscape wrapper takes the shipit dependency.

## Alternatives Considered

- **Bundle Cytoscape + React Flow into `shipit`**: rejected — both bundles
  in one consumer is wasteful; most consumers want viewer-only.
- **One `graph` package for both viewer and editor**: rejected — different
  underlying engines (Cytoscape vs React Flow) with different bundles;
  separate packages let consumers install only the one they need.
- **Make `graph-tokens` an internal subpath of `cytoscape`**: rejected —
  would cycle when `graph-editor` needs the same primitives. The
  extraction breaks the cycle.

## Consequences

- Adding a new renderer (D3, sigma.js, …) follows the same pattern:
  separate package, consumes `graph-tokens`, no cross-renderer imports.
- Stylesheet imports become **the consumer's responsibility**:
  `import '@ship-it-ui/graph-editor/styles.css'` once at the app entry.
  Next.js App Router rejects library-internal global CSS, and explicit
  consumer imports control load order against their own theme.
- `entity-type` rendering across viewer + editor stays consistent because
  both go through `resolveEntityColor` / `getEntityTypeMeta`. Don't
  duplicate the entity-type registry per renderer.

## Revisit Triggers

- If consumers consistently install both viewer + editor and complain
  about duplicate dep graphs, consider a shared `graph-core` package.
- If MapLibre is replaced by another mapping lib (Mapbox GL, Maplibre's
  successor), the `@ship-it-ui/map` boundary makes that swap a single
  package's worry.

## Related

- [[monorepo-package-split]] — the broader package taxonomy.
- [[dark-first-oklch-theming]] — `graph-tokens` is how renderers
  participate in the same token-reskin model the rest of the system uses.
