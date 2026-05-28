---
'@ship-it-ui/ui': patch
---

Add `variant="spec"` to `ListingCard` and `ListingDetail` — a
product-spec layout for premium / spec-driven inventory. Photo counter,
top-left flag pill, three-up stats grid (e.g. `0-60` / `power` / `drive`),
and an inline CTA button on a dark footer strip on the card. The detail
modal mirrors the same vocabulary at modal scale with a wider spec grid
and a single primary action in the bottom CTA bar.

New shared types: `ListingCardFlag`, `ListingCardSpec`, `ListingCardCta`,
`ListingCardVariant`, `ListingDetailVariant`. Default-variant behavior
and prop set unchanged.
