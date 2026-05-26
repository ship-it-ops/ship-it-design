---
type: decision
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [versioning, changesets, semver, release]
importance: core
---

# All published packages stay at `patch` bumps while in v0.0.x

## Context

All publishable `@ship-it-ui/*` packages are at `0.0.x`. Changesets'
default `updateInternalDependencies: "patch"` plus the v0 promotion rules
would otherwise spam `minor` bumps on workspace peer-dep promotions even
when the change is purely additive.

## Decision

Every changeset is `patch` while packages remain at `0.0.x` — even for:

- Additive new exports (new component / pattern / hook).
- Changes that Changesets' workspace-peerDep rule auto-promotes to
  `minor`/`major`.
- Internal peer-dep bumps inside the workspace.

The `changeset-check` workflow enforces structural presence; severity is
not policed. Reviewers must **not** flag patch-vs-minor severity
mismatches — encoded as repo convention in
`.claude/ship-reviewed-prs-overrides.md` ("v0 changeset policy").

Breaking changes that occur during 0.0.x must be called out **in the
changeset body** (so the CHANGELOG reader sees them) even though the
bump level won't communicate severity.

Docs-site and root-config-only changes don't require a changeset
(`changeset/config.json` lists `"ignore": ["docs-site"]`; root tooling is
not a published package).

## Alternatives Considered

- **Bump to `0.1.0` and follow semver from there**: deferred — the system
  still has audited P0s pending in the May 2026 audit and isn't ready to
  commit to a deprecation policy yet.
- **Auto-promote per Changesets defaults**: rejected — every internal
  peer-dep bump would cascade `minor` across the workspace and inflate
  CHANGELOG noise without signaling real consumer impact.

## Consequences

- The release workflow can land patches rapidly without humans agonizing
  over semver.
- Consumers cannot rely on patch-vs-minor signaling pre-1.0. The README
  and any `docs/stability.md` (still TODO from PM audit) should state this.
- A regression that _should_ have been caught at the bump-level discussion
  must be caught at code-review time instead — the bot is calibrated to
  cry wolf less than miss things (see `.claude/ship-reviewed-prs-overrides.md`,
  "When in doubt").

## Revisit Triggers

- **At 1.0 cut** — pivot to strict semver. Define deprecation cadence
  (PM audit suggested: one minor with `@deprecated` JSDoc + console
  warn → removal in next major).
- If a consumer reports they were silently broken by a "patch" bump that
  was actually a breaking change.

## Related

- [[monorepo-package-split]] — packages this policy applies to.
- [[breaking-changes-in-changeset-body]] — the convention for surfacing
  breaks that the bump level hides.
