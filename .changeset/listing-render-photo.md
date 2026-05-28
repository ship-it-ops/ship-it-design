---
'@ship-it-ui/ui': patch
---

Add `renderPhoto` to `ListingCard` and `ListingDetail`. Lets consumers
override the default decorative `<img src>` wrapper with arbitrary
ReactNodes — inline SVG that follows `currentColor`, custom video
players, masked photos, etc.

On `ListingDetail`, the override receives a `mode` flag (`'gallery'` |
`'lightbox'`) so the same callback can render `object-cover` inline and
`object-contain` fullscreen.

Default behavior unchanged when `renderPhoto` is omitted.
