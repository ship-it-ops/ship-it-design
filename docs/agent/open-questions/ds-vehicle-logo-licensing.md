---
type: open-question
status: answered
opened: 2026-06-16
answered: 2026-06-16
answer-source: maintainer
created: 2026-06-16
updated: 2026-06-16
author: claude-opus-4-8
tags: [icons, branding, licensing]
---

# #16 — Source & self-host 7 trademark make SVGs, or accept text fallback?

## Context

`logoManifest` already ships ~14 car makes from `simple-icons` (commit `d4e29e1`).
Re-verified that exactly **7** makes are genuinely absent from simple-icons (their
trademark policy excludes them): `lotus, genesis, lexus, dodge, gmc, lincoln,
mercury`. Adding them means sourcing custom brand SVGs and self-hosting via the
icons SVGR escape hatch (`packages/icons/src/svg/`).

## Tried

Probed `@iconify-json/simple-icons` directly — all 7 confirmed absent (only alias
spellings of _present_ makes resolve). The other makes the consumer lists already
ship, so the gap is exactly these 7.

## Who can answer

Maintainer / legal — is the team willing to source and redistribute these 7
trademarked marques (licensing/trademark-usage call), or is the current text-chip
fallback acceptable?

## Answer (2026-06-16)

**Keep text fallback — #16 closed won't-fix.** Investigation found the only
Iconify set carrying any of these makes is `cbi` (Custom Brand Icons), licensed
**CC BY-NC-SA 4.0 (NonCommercial)** — unusable in a DS shipped to commercial
consumers — and it still lacks gmc/lincoln/mercury entirely. No commercial-safe
source exists, so make chips stay as styled text. No PR. See
[[cbi-noncommercial-license]].
