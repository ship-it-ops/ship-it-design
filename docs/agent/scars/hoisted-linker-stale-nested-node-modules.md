---
type: scar
status: active
created: 2026-06-20
updated: 2026-06-20
author: claude-opus-4-8
incident-date: 2026-06-20
tripwire: "After a MAJOR dep bump, if a test/build dies with 'module X does not provide an export named Y' yet `pnpm ls` shows only the new version, suspect a stale NESTED node_modules copy left by a reused install under node-linker=hoisted — clean-reinstall before chasing override syntax."
tags: [pnpm, hoisted-linker, vitest, node-modules, dependency-bump]
---

# A reused pnpm install leaves stale nested node_modules under node-linker=hoisted

## What Happened

Bumping `vitest` 2.x → (first 4.1.9, then 3.2.6) across the workspace, the test
run crashed at worker startup with `SyntaxError: The requested module
'@vitest/expect' does not provide an export named 'customMatchers'` (and earlier
`assertTypes`). `pnpm ls -r --depth Infinity @vitest/expect` showed a single
clean `3.2.6`, and a root dynamic import confirmed `customMatchers` WAS exported.
The error persisted across multiple `pnpm install`, `pnpm install --force`, and
even a from-scratch lockfile delete + reinstall.

Root cause: `find . -path '*/node_modules/@vitest/expect/package.json'` revealed
`./node_modules/vitest/node_modules/@vitest/expect` was still **2.1.9** — a stale
NESTED copy from the original vitest-2 install. With `.npmrc`
`node-linker=hoisted`, pnpm reused the existing `node_modules` tree and never
removed the nested leftover; Node resolved the closest (2.1.9) copy from vitest's
own folder, not the hoisted 3.2.6. Removing all `node_modules` (root + every
package) and reinstalling cleared it; all 17 suites then passed.

## Tripwire

After a major dependency bump, if a build/test dies with "module X does not
provide an export named Y" but `pnpm ls` shows only the NEW version, suspect a
stale nested `node_modules/<pkg>/node_modules/<subdep>` left by a reused install.
`find . -path '*/node_modules/<subdep>/package.json'` and check each version.

## Why It Hurt

Burned ~4 reinstall cycles chasing pnpm `overrides` syntax (conditional vs
unconditional) for the wrong reason — the overrides were fine; the physical tree
was stale. `--force` and even lockfile deletion do NOT prune stale nested dirs
under the hoisted linker; only removing node_modules does.

## Don't Do This

Don't trust `pnpm ls` / lockfile alone after a major bump under
`node-linker=hoisted`. When versions look right but resolution acts wrong,
`rm -rf node_modules packages/*/node_modules apps/*/node_modules && pnpm install`
BEFORE theorizing about override semantics.

## Related

- [[ci-strict-resolution-masks]] — sibling "the tree on disk lies" hazard
- [[tailwind-v4-beta-caret]] — other dependency-pinning footgun
