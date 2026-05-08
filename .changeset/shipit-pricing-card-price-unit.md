---
'@ship-it-ui/shipit': patch
---

`PricingCard` gains an optional `priceUnit` prop for per-period suffixes
(e.g. `/ user / mo`). The unit renders next to the headline price, baseline-
aligned, and wraps cleanly when the card is narrow.

The card now also establishes a CSS container, so the price font-size scales
with the card's own inline-size rather than the viewport. Three cards
crowded into a narrow column no longer blow out the layout — the price
steps down to 22px below the `@sm` container breakpoint.
