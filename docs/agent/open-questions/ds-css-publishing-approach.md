---
type: open-question
status: answered
opened: 2026-06-16
answered: 2026-06-16
answer-source: maintainer
created: 2026-06-16
updated: 2026-06-16
author: claude-opus-4-8
tags: [ui, publishing, tailwind, css]
---

# #2 — Which CSS-publishing approach for npm consumers: documented `@source` (C) or precompiled CSS entry (A)?

## Context

Published `@ship-it-ui/ui` ships `globals.css` from `src/` with workspace-relative
`@source` paths that break for npm consumers → every DS component renders unstyled.
`tokens.css`-style precompiled utility CSS is **not** emitted. Three options scored
in the plan ([[ds-upstream-gaps-roadmap]]):

- **C (recommended)**: make published `globals.css` consumer-safe + document the
  required consumer `@source './node_modules/@ship-it-ui/ui/dist/**/*.js'` line.
  This is exactly the consumer's own working interim fix and the standard
  Tailwind-v4 node_modules-lib pattern.
- **A (deferred/optional)**: ship a precompiled `dist/styles/*.css`. Audit found it
  is NOT self-service (only DS classes; bakes Tailwind-beta preflight → double-reset
  vs consumer Tailwind; bare-specifier `@import` resolution risk; published path is
  permanent API).

## Tried

Re-verified the consumer's interim `@source`-at-dist workaround works (Tailwind v4
scans built JS class-name string literals). Confirmed `snapshot.yml` exists as the
real external-install gate.

## Who can answer

DS maintainer — A vs C is a product/support-surface call. Recommendation: ship C
now; treat A as a later optional non-Tailwind-consumer convenience.

## Answer (2026-06-16)

**Option C.** Make published `globals.css` consumer-safe and document the required
consumer `@source` line; precompiled CSS (Option A) is out of scope. Folded into
[[ds-upstream-gaps-roadmap]] PR-B.
