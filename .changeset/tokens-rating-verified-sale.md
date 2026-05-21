---
'@ship-it-ui/tokens': patch
---

Add consumer-marketplace semantic color tokens and hero display type sizes.

**Colors** (both `colorSemanticDark` and `colorSemanticLight`, enforced by
the `satisfies` constraint):

- `rating` — gold for star fills, distinct from `warn` yellow
- `ratingDim` — outline color for empty stars
- `verified` — trust badge (aliases `ok` today; named separately so future
  divergence is cheap)
- `sale` — promo / discount strike-through color
- `saleText` — text-on-bg foreground for sale prices in light theme

**Typography**: adds `displayLg: '72px'` and `displayXl: '96px'` for hero
sections in consumer marketing pages. Existing `display: '56px'` is
unchanged.

Tailwind utility mappings (`--color-rating`, `--text-display-lg`, etc.) are
wired through `packages/ui/src/styles/globals.css` so consumers get
`bg-rating`, `text-verified`, `text-display-xl` automatically.
