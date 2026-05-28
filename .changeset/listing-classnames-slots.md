---
'@ship-it-ui/ui': patch
---

`ListingCard` and `ListingDetail` now accept a `classNames` slot map for
per-section className overrides. Every internal element (root, photos,
flag, photoCounter, body, header, title, category, meta, specs grid,
each spec cell + label + value, footer, price, priceUnit, cta, favorite,
host, features, description, close, overlay, content) is independently
styleable without forking. Values are merged with the component's own
utilities via `cn()`, so consumers can override, extend, or replace any
styling and still inherit the rest.

Content overrides remain via ReactNode props on every text slot; the
slot map is purely for styling.
