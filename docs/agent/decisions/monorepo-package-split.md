---
type: decision
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [architecture, packages, monorepo, publish]
importance: core
---

# Why the design system is split across many `@ship-it-ui/*` packages

## Context

The original `v0` (commit `1035968`) shipped a single package, then `Rename`
PRs (#10, #11) broke it into `@ship-it-ui/{tokens,icons,ui,shipit}`. Since
then `cytoscape`, `graph-tokens`, `graph-editor`, `next`, and `map` have
been added as separately publishable siblings. The split tracks **how
change propagates** and **who installs what** — not "smaller is better."

## Decision

**Publishable packages (current, v0.0.x):**

| Package                    | Purpose                                                          | Depends on                  |
| -------------------------- | ---------------------------------------------------------------- | --------------------------- |
| `@ship-it-ui/tokens`       | TS → CSS-variable tokens (color, type, spacing, motion, z-index) | —                           |
| `@ship-it-ui/icons`        | IconGlyph + Iconify manifest + SVGR pipeline                     | —                           |
| `@ship-it-ui/ui`           | Generic components + patterns + hooks                            | tokens (peer), icons (peer) |
| `@ship-it-ui/shipit`       | ShipIt-AI domain composites (AI, graph, entity, marketing, data) | ui, icons                   |
| `@ship-it-ui/graph-tokens` | Engine-agnostic token-resolution for graph adapters              | —                           |
| `@ship-it-ui/cytoscape`    | Read-only graph viewer adapter                                   | graph-tokens, shipit        |
| `@ship-it-ui/graph-editor` | Editing adapter (React Flow under the hood)                      | graph-tokens                |
| `@ship-it-ui/next`         | Next.js App Router helpers (SSR theme bootstrap, cookie)         | —                           |
| `@ship-it-ui/map`          | MapLibre wrapper with token-styled markers                       | tokens                      |

**Internal-only:** `@ship-it-ui/eslint-config`, `@ship-it-ui/tsconfig`.

A consumer installs only what they need: a marketing site can take just
`tokens`; a generic React app takes `ui`; a ShipIt-AI surface takes
`shipit` (which transitively pulls `ui` + `icons`).

## Alternatives Considered

- **Single mega-package**: rejected. Bundles MapLibre's ~700 KB into every
  consumer, even those that don't render a map. The split is the bundle
  budget mechanism.
- **Lerna-style "one version" lockstep**: rejected for Changesets-per-PR.
  Token churn shouldn't force ui+shipit+icons version bumps.
- **`shipit` re-exports `ui`**: rejected. ShipIt-AI composites build _on
  top of_ `ui` chrome; merging them would re-couple "is this generic or
  product-specific?" — the test that's currently load-bearing in design
  reviews ("would another product want this verbatim?").

## Consequences

- Adding a new component requires picking the right package first
  (`docs/design-handoff.md` step 4 lays out the test). Wrong package =
  later migration with a peer-dep version bump.
- Workspace peer/dev/runtime distinctions are easy to get wrong — `pnpm`
  symlinks mask undeclared deps locally but CI's strict resolution catches
  them. See [[ci-strict-resolution-masks]] for the canonical incident.
- Changesets are _per-package_: every PR that crosses a package boundary
  may need multiple `.changeset/*.md` entries.
- New packages should still set `provenance: true` and follow the
  `homepage`/`bugs`/`keywords`/`author` metadata template the four
  original packages converged on (verified in PR #13 audit-review).

## Revisit Triggers

- If any optional adapter (`map`, `graph-editor`) is installed by
  ≥80% of consumers, consider folding into `shipit`.
- If the package graph grows past ~12 publishable packages, consider a
  category-level rollup or a docs-driven `engines.peerDependencies` matrix.
- At 1.0, settle whether `graph-tokens` should be an internal subpath of
  `cytoscape`+`graph-editor` (it was extracted to break the cycle).

## Related

- [[v0-changeset-patch-policy]] — bump policy for the current 0.0.x phase.
- [[ssr-rsc-support-strategy]] — every package that ships React UI now
  carries `"use client"`-preserving tsup config.
- [[ci-strict-resolution-masks]] — undeclared workspace dep scar.
