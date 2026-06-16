---
'@ship-it-ui/ui': patch
---

Fix DS components rendering unstyled for npm consumers.

The published `globals.css` carried `@source` directives with monorepo-relative
paths (`../../../shipit/src/**`, `../../../../apps/docs-site/**`) that don't
exist in an installed package, so Tailwind v4 never scanned the compiled
component class names — every DS component rendered unstyled (a silent failure).

The stylesheet is now split into three: a shared `globals.base.css` (fonts,
tokens, Tailwind, `@theme`); the consumer entry `globals.css`, which adds a
`@source` at this package's own `dist` so `@ship-it-ui/ui`'s classes compile out
of the box; and `globals.workspace.css` for apps inside this repo (scans the live
workspace `src`). The README documents the extra `@source` lines consumers add
for `@ship-it-ui/shipit` and their own code. No API change; existing
`@ship-it-ui/ui/styles/globals.css` imports keep working.
