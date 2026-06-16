---
type: open-question
status: answered
opened: 2026-06-16
answered: 2026-06-16
answer-source: maintainer
created: 2026-06-16
updated: 2026-06-16
author: claude-opus-4-8
tags: [tokens, typography, brand]
---

# #1 — Which sanctioned display/heading font family to add?

## Context

DS exposes only `--font-family-sans` (Geist) and `--font-family-mono` (Geist Mono).
A marketing consumer wanted a display font. Audit correction: the display type
_scale_ already exists and there is **no** font-adherence lint rule in the repo, so
#1 shrinks to "add one `--font-display` family token + a self-hosted face."
Blocked purely on the brand choice. Prototype used Archivo / Saira Semi Condensed.

## Tried

Confirmed no ESLint/lint rule forbids non-sanctioned fonts (the consumer assumed
one existed). Font loading is via `@fontsource-variable/*` in `globals.css`.

## Who can answer

Brand/design owner — pick the family (Archivo vs Saira Semi Condensed vs other),
ideally one with a `@fontsource-variable` package to match the existing self-host
pattern. PR-M in [[ds-upstream-gaps-roadmap]] is ready once chosen.

## Answer (2026-06-16)

Add a **curated set spanning vibes**, all verified on `@fontsource-variable`:
**Space Grotesk** (tech), **Archivo** (bold), **Fraunces** (luxury/upscale serif).
Implement as sanctioned `--font-display-*` family tokens. PR-M unblocked.
