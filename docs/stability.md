# Stability

## Status: pre-1.0

All `@ship-it-ui/*` packages are currently `0.0.x`. Breaking changes can land
on **any** minor version bump until `1.0.0`. Once we cut `1.0.0`, semver
applies normally.

## What we promise pre-1.0

- Every breaking change is described in the corresponding Changeset and the
  package's `CHANGELOG.md`.
- We never silently change a token value without a Changeset.
- We never remove a public API without first deprecating it via JSDoc
  `@deprecated` for at least one minor release.

## What we don't promise pre-1.0

- The token vocabulary may shift.
- Component APIs may change shape (callback names, prop names).
- The package boundary between `ui` and `shipit` may move.
- Minor versions may include backward-incompatible changes.

## Path to 1.0

Criteria for cutting `1.0.0`:

1. Every item in the audit's P0 / P1 list has been resolved.
2. Token vocabulary stable across at least two consecutive minor releases
   with no breaking changes.
3. Visual regression coverage in CI (Storybook + Chromatic or equivalent).
4. WCAG 2.2 AA verified across every interactive component (axe in CI
   against rendered Storybook stories, not just unit tests).
5. Documented usage in at least one production application.

## Supported runtimes

| Runtime | Range | Notes |
|---|---|---|
| Node | `>=20.6.0` | CI tests against 20, 22, 24 LTS lines. |
| React | `^18.0.0 \|\| ^19.0.0` | Both major lines supported via peerDeps. |
| Browsers | Last 2 versions of evergreen browsers | No IE / legacy Edge support. |

## Deprecation policy

When a public API is deprecated:

1. The function/prop/variant carries a JSDoc `@deprecated <message with replacement>`.
2. A Changeset describes the deprecation as a `minor` bump.
3. At minimum **one full minor release** must elapse between deprecation and removal.
4. Removal happens in a `major` bump (or a `minor` bump while still pre-1.0,
   with a clear "BREAKING" note in the Changeset).

## Reporting incompatibilities

If you find a regression between two consecutive minor versions, please open
an issue using the bug-report template — that pair is a P0 for us.
