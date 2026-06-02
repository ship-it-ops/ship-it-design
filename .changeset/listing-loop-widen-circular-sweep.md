---
'@ship-it-ui/ui': patch
---

Widen `ListingCard.loop` and `ListingDetail.loop` from `boolean` to
`boolean | 'circular' | 'sweep'` so consumers can pick the underlying
`Carousel` loop variant explicitly without a cast.

Both wrappers already forward the prop straight through to the gallery
`Carousel` (and `ListingDetail` additionally to its `Lightbox`), and
`Carousel.loop` has accepted the string forms since the loop-variant
work — the wrapper type was just narrower than the runtime. The
`Lightbox` forwarding call coerces with `Boolean(loop)` because
`Lightbox` is a standalone implementation that only treats `loop` as a
boolean toggle; the `'circular'` / `'sweep'` distinctions are
gallery-only and don't apply there.

No runtime behavior change. Removes the need for a
`loop={'circular' as unknown as boolean}` cast on `ListingDetail` /
`ListingCard`.
