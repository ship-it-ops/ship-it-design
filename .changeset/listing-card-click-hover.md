---
'@ship-it-ui/ui': patch
---

`ListingCard` — two new props:

- `onClick` makes the whole card surface clickable via an invisible
  stretched `<button>` underneath the inner actions. Favorite, CTA, and
  links keep their own click semantics (no nested-interactive). Pair with
  a Dialog/Drawer trigger to wire "click card → open detail" without
  navigating away.
- `hoverEffect` picks the visual treatment: `'lift'` (translate + shadow),
  `'glow'` (accent ring), or `'none'`. Defaults to `'lift'` when the card
  is interactive (has `onClick` or `href`), otherwise `'none'`.

In the spec variant, the footer CTA bar is now elevated to `relative z-10`
so the inline CTA stays above the stretched click target.

The card's outer surface gets `isolation: isolate` so child `z-10` elements
(flag pill, photo counter, footer CTA, consumer-supplied editable cells)
stay scoped to the card and can't bleed over a portaled modal opened from
the same page.

Every section slot still accepts arbitrary `ReactNode`, so consumers can
drop `<InlineEdit>` directly into `title`, `meta`, `specs[].value`,
`price`, etc. for editable listings.
