---
'@ship-it-ui/ui': patch
---

Fix `Carousel` thumbnail-strip active-state ring so it traces the
shape of the rendered thumbnail rather than a fixed `rounded` box on
the wrapper. The previous implementation hard-coded a 4px-radius ring
on the click target, which mismatched any thumbnail with a different
radius (e.g. `DemoTile`'s `rounded-lg`) and made the first / last
selected thumb's ring appear clipped against the strip's overflow
edge.

The ring is now applied to the wrapper's direct child via a
`[&[data-active]>*]:ring-*` variant on a `data-active` attribute.
Because `ring-*` compiles to `box-shadow`, the highlight inherits the
child's own `border-radius` automatically — works for square, pill,
and circular thumbnails with no Carousel-side configuration. The
scroll container also picks up `p-0.5 -mx-0.5` so the ring has room
to render against the edge without shifting the strip's outer width.
