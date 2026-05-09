# @ship-it-ui/shipit

## 0.0.3

### Patch Changes

- 597a705: `PricingCard` gains an optional `priceUnit` prop for per-period suffixes
  (e.g. `/ user / mo`). The unit renders next to the headline price, baseline-
  aligned, and wraps cleanly when the card is narrow.

  The card now also establishes a CSS container, so the price font-size scales
  with the card's own inline-size rather than the viewport. Three cards
  crowded into a narrow column no longer blow out the layout — the price
  steps down to 22px below the `@sm` container breakpoint.

  **Visual change for existing consumers:** the price is now horizontally
  centered within the card (it was previously left-flush in the implicit
  block layout). This pairs better with the new `priceUnit` slot, but if
  your app relied on the previous left alignment you'll need to override the
  inner price container.

- Updated dependencies [597a705]
  - @ship-it-ui/ui@0.0.3

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.
- Updated dependencies [3b7a79a]
  - @ship-it-ui/ui@0.0.2

## 0.0.1

### Patch Changes

- 1035968: v0 launch
- Updated dependencies [1035968]
  - @ship-it-ui/icons@0.0.1
  - @ship-it-ui/ui@0.0.1
