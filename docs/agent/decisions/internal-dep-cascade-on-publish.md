---
type: decision
status: active
created: 2026-06-02
updated: 2026-06-02
author: claude-session-2026-06-02-release-cascade
tags: [release, changesets, monorepo, semver, publishing]
importance: standard
---

# Keep internal-dep patch cascade on publish (revisit at 1.0)

## Context

Release #78 shipped three changesets, all scoped `'@ship-it-ui/ui': patch`
(carousel fixes). The publish step pushed **six** tarballs to npm —
`ui@0.0.13`, plus `cytoscape@0.0.13`, `graph-editor@0.0.8`, `map@0.0.7`,
`next@0.0.11`, `shipit@0.0.14`. The user expected only `ui` to ship and
asked whether the workflow was re-publishing packages it didn't need to.

It wasn't a workflow bug — it's the configured policy doing what it says:

- `.changeset/config.json` sets `"updateInternalDependencies": "patch"`
  (the changesets default).
- Five packages declare `"@ship-it-ui/ui": "workspace:*"` as a runtime
  dep: `cytoscape`, `graph-editor`, `map`, `next`, `shipit`.
- The four packages that _didn't_ publish (`icons`, `tokens`,
  `graph-tokens`, `cssscape`) don't depend on `ui` — proving the cascade
  is exactly one level deep and scoped to actual dependents.

## Decision

Leave `"updateInternalDependencies": "patch"` and `workspace:*` dep
specifiers as-is for the duration of `0.0.x`. Accept the larger publish
fan-out per ui change as the cost of correctness in pre-1.0.

## Alternatives Considered

- **`"updateInternalDependencies": "none"`** — rejected for now. Would
  stop the cascade, but on `0.0.x` semver `^0.0.12` does NOT satisfy
  `0.0.13` (caret is restrictive for `0.0.x` ranges). If
  `cytoscape@0.0.12`'s published manifest still pinned `ui@0.0.12` while
  `ui@0.0.13` is out, a fresh `npm i @ship-it-ui/cytoscape` could land
  two copies of `ui` in `node_modules` (old nested under cytoscape, new
  hoisted). Cascading the patch bump keeps published manifests pinned to
  the just-shipped ui so the install tree dedupes.
- **`workspace:^` instead of `workspace:*`** — rejected for now. Caret
  semantics on `0.0.x` don't help (still equivalent to exact). Useful
  only after 1.0 when caret actually widens the range.
- **Splitting changesets per package** — rejected. The cascade isn't
  driven by changeset count; it's driven by `updateInternalDependencies`
  - workspace dep graph. Even one ui changeset triggers the same six
    tarballs.

## Consequences

- Every ui-only release publishes all five ui-dependents alongside it.
  Patch versions of the dependents will tick up faster than their actual
  change rate — expected, not a smell.
- npm registry / GitHub release noise per release scales with the size
  of the dependent set on `ui`. Acceptable while package count stays
  small (~9).
- `icons` / `tokens` changes still cascade only to _their_ dependents
  (e.g. `ui` depends on both, so a `tokens` changeset cascades into `ui`
  and then transitively into the five ui-dependents). Worth remembering
  before adding a changeset to a foundational package.

## Revisit Triggers

- Cutting 1.0 (see [1-0-stability-promise](../open-questions/1-0-stability-promise.md)).
  At that point: flip workspace specifiers to `workspace:^`, set
  `updateInternalDependencies` to `"none"`, and only the actually
  changed package republishes per changeset.
- Adding a sixth+ direct dependent on `ui` and feeling the publish
  fan-out is painful enough to warrant moving sooner.
- Switching to a fixed-version policy across the monorepo (would make
  the cascade explicit via `"fixed"` config instead of implicit via the
  dep graph).

## Related

- [v0-changeset-patch-policy](v0-changeset-patch-policy.md) — every bump
  is `patch` while on `0.0.x`; the cascade inherits that.
- [monorepo-package-split](monorepo-package-split.md) — defines which
  packages exist and how they depend on each other.
- [1-0-stability-promise](../open-questions/1-0-stability-promise.md) —
  the trigger to revisit this and flip the policy.
