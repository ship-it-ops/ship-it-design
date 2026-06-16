---
type: scar
status: active
incident-date: 2026-06-16
created: 2026-06-16
updated: 2026-06-16
author: claude-opus-4-8
tags: [icons, licensing, branding, iconify]
tripwire: 'if reaching for the `cbi` (Custom Brand Icons) Iconify set, STOP — it is CC BY-NC-SA NonCommercial'
---

# Don't pull `cbi` (Custom Brand Icons) into the DS — it's NonCommercial

## What Happened

Sourcing brand/car-make logos missing from `simple-icons` (#16), the obvious
Iconify hit was `cbi` (Custom Brand Icons by elax46) — it has `cbi:lexus`,
`cbi:lotus`, etc. It was nearly added before a license check.

## Tripwire

If you're about to add `@iconify-json/cbi` or reference any `cbi:*` icon, STOP:
`cbi` is **CC BY-NC-SA 4.0 (NonCommercial)**. The DS ships to commercial
consumers, so NonCommercial assets are off-limits.

## Why It Hurt

A NonCommercial-licensed icon baked into `icon-data.ts` would propagate to every
commercial consumer of `@ship-it-ui/icons` — a license violation that's hard to
unwind once published.

## Don't Do This

Don't use `cbi` (or any CC-NC / non-permissive set) in this DS. Prefer
commercial-safe sets already in use or verified: `simple-icons` (CC0), `logos`
(CC0), `lucide`, `ph` (Phosphor MIT), `solar` (CC BY 4.0). When a brand mark
isn't in a permissive set, prefer a text fallback over an NC asset unless legal
clears a properly-licensed source.

## Related

- [[ds-vehicle-logo-licensing]] — the #16 decision this came from
- [[ds-upstream-gaps-roadmap]] — #16 closed won't-fix
