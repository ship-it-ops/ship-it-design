---
type: status
status: active
created: 2026-06-20
updated: 2026-07-18
author: claude-opus-4-8
branch: next-release
agent: claude-session-2026-06-20-dependabot
tags: [dependabot, dependencies, security, vitest, github-actions]
---

# Cleared all remaining dependabot PRs + security alerts on next-release

## Scope

Committed + pushed to `next-release` (NO PR, per user). Resolves the GitHub
Actions group (#87) across all 7 workflows (checkout v6→v7, claude-code-action +
changesets v1 pins) and the npm PRs: vitest+coverage-v8 →^3.2.6 (#95/#101, NOT
#92's 4.x — see below), @radix-ui/\* group + slider (#102/#90), @xyflow/react
(#89), shiki →^4.2.0 (#91), next/@next/mdx/@tailwindcss/postcss/@types/@iconify/
prettier/turbo (#102). All 9 GitHub security alerts cleared via root
`pnpm.overrides` (undici, vite, esbuild, @babel/core, js-yaml, @vitest/{utils,
expect}) + an explicit `vite ^6.4.3` devDep. `pnpm audit` → no known vulns.

## Why vitest 3.2.6 not 4.x

The critical advisory only needs vitest ≥3.2.6. Picking #92's 4.1.8 broke the
suite: `eslint-plugin-storybook@10.3.6` (still in `@ship-it-ui/eslint-config`
though Storybook was removed — see [[no-storybook-migration]]) pins `@vitest/*`
exactly 3.2.4, and under `node-linker=hoisted` vitest-4's runner resolved that
old copy. 3.2.6 keeps the skew to a patch and an override dedupes it. The stale
nested-node_modules trap that cost the most time is recorded as
[[hoisted-linker-stale-nested-node-modules]].

## State

Pushed; verified green: typecheck 18, lint 18, test 17 (all suites), build 10,
docs-site `out/` built with shiki 4.2.0. No changeset added (consistent with how
dependabot PRs land here; bot PRs skip changeset-check). User curates next-release
for the actual version cut.

NB: earlier the same session shipped #107 (ci.yml-only checkout v6.0.3 +
claude-code-action), now superseded by this batch's v7.0.0 across all workflows.

## Related

- [[hoisted-linker-stale-nested-node-modules]] — the scar earned here
- [[eslint-plugin-storybook-dead-weight]] — cleanup candidate surfaced here
- [[v0-changeset-patch-policy]], [[ci-strict-resolution-masks]]

## 2026-07-18 fold-in (second batch)

Re-audit found two post-batch dependabot PRs and folded their deltas in
directly (same pattern: commit on next-release, no PR, no changeset):

- **#108 actions group** — only real deltas vs the June batch were the
  `actions/cache` v5 pin (Apr→Jun sha) and `claude-code-action` pin
  (2.1.183→2.1.195). checkout v7.0.0 + changesets pins already matched.
- **#110 patches group (July 12)** — 20 declared-range bumps across
  docs-site/icons/ui (next+@next/mdx 16.2.10, 13 Radix, 3 iconify,
  @tailwindcss/postcss 4.3.2, rehype-pretty-code 0.14.4). Clean reinstall
  per [[hoisted-linker-stale-nested-node-modules]]; `pnpm dedupe` collapsed
  a leftover `next@16.2.6` resolution in packages/next (CI audit.yml has a
  dedupe check).
- All 23 open GitHub alerts verified as `main`-scan artifacts — this
  branch's lockfile satisfies every fixed version; they close on merge.
- Superseded PRs #89/#90/#91/#95/#101 auto-close on merge. #81/#92
  (vitest 4.x) stay open pending [[eslint-plugin-storybook-dead-weight]].
- Also committed alongside: rocket icon variety pack (25 glyphs +
  Rocket.rs logo) authored by a sibling session, changeset
  `rocket-icon-variety.md` (patch).

Verified green post-fold-in: typecheck 18, lint 18, test 17 (all suites,
882 tests), build 10, `pnpm audit` clean, `pnpm dedupe --check` clean.

## Done when

`next-release` merged to `main` — check: `git merge-base --is-ancestor a3b8f83 origin/main` exits zero.
