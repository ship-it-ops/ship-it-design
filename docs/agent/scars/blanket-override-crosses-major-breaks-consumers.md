---
type: scar
status: active
created: 2026-07-18
updated: 2026-07-18
author: claude-fable-5
incident-date: 2026-07-18
tripwire: "adding a pnpm override whose range spans a major boundary? check every consumer's expected major first"
tags: [pnpm, overrides, js-yaml, changesets, security]
---

# Blanket security override forced js-yaml 4 onto a v3 consumer and broke changesets

## What Happened

The June dependabot batch added `"js-yaml@<4.2.0": "^4.2.0"` to
`pnpm.overrides` to clear two advisories. The range `<4.2.0` also matches
`js-yaml@^3` consumers — `read-yaml-file` (a `@changesets/cli` transitive
dep) got js-yaml 4, which removed `safeLoad`, so every `changeset status`
/ `changeset version` call crashed. The release workflow would have
failed at the next version cut; it went unnoticed for a month because
nothing ran changesets in between (the changeset-check CI job uses its
own git-diff script, not the changesets CLI).

## Tripwire

Writing a `pnpm.overrides` entry whose version range crosses a major
boundary (e.g. `pkg@<4.2.0`)? Stop — list the consumers
(`pnpm why pkg`) and their declared ranges first.

## Why It Hurt

Release tooling silently broken on `next-release` for ~1 month; only
surfaced when a changeset was added for PR #111.

## Don't Do This

Don't map one fixed version onto all majors. Write one override per
major line, matching each advisory:
`"js-yaml@>=4.0.0 <4.2.0": "^4.2.0"` and `"js-yaml@<3.15.0": "^3.15.0"`.
After adding any override, smoke-test the repo's own toolchain
(`changeset status`, lint, a build), not just `pnpm audit`.

## Related

- [dependabot-batch-next-release](../status/dependabot-batch-next-release.md) — the batch that introduced it
- [hoisted-linker-stale-nested-node-modules](hoisted-linker-stale-nested-node-modules.md) — sibling scar from the same batch
