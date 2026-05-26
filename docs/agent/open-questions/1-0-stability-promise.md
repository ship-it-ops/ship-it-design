---
type: open-question
status: active
opened: 2026-05-21
answer-source: maintainer
tags: [versioning, stability, 1-0, deprecation, semver]
---

# When does the system cut 1.0, and what's the stability/deprecation promise?

## Context

Every publishable `@ship-it-ui/*` package is at `0.0.x`. The May 2026
audit (PM persona) flagged that there's no documented:

- 1.0 milestone criteria.
- Stability promise pre-1.0 ("frequent breaking changes; semver after"
  is the audit's recommended stance).
- Deprecation cadence (audit suggested: one minor with `@deprecated`
  JSDoc + console warn → removal in next major).
- Supported React / Node compatibility matrix.

Consumers evaluating adoption need to know the team's intent. Without
it, enterprise consumers wait — and the design system stays an internal
artifact.

The current [[v0-changeset-patch-policy]] is what holds the line on
bumps; the question is how and when to relax it.

## Tried

No explicit work has been done on this. `docs/stability.md` was proposed
in the PM audit but not created.

## Who Can Answer

**Maintainer call.** Needs:

1. Criteria for the 1.0 cut (audit P0/P1 status? variant/callback
   vocabulary consolidation? a11y bar verification with axe on the
   live docs site?).
2. Stability commitments after 1.0 (semver-strict? semver-strict +
   deprecation windows for API removals?).
3. Public commitment surface — a `docs/stability.md`, or a section in
   the top-level README, or a per-package note. The choice affects
   discoverability for npm-search-driven adopters.

## Related

- [[v0-changeset-patch-policy]] — the policy this question would relax.
- [[variant-tone-callback-vocabulary-consolidation]] — a likely
  prerequisite for 1.0.
- [[audit-2026-05-02-snapshot]] — original audit context.
