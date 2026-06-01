---
'@ship-it-ui/ui': patch
---

Add `loop` prop to `Carousel` and `Lightbox` (default `false` on both
primitives). When `true`, prev/next wraps — clicking "next" on the last
slide goes to the first, and vice versa. `Carousel` also wraps native
swipe via an invisible clone-twin jump on either edge. `onIndexChange`
always emits real indices in `0..items.length - 1`.

`ListingCard` and `ListingDetail` opt in by default (new
`loop?: boolean` prop, default `true`). Marketplace photo browsing now
loops; pass `loop={false}` to restore stop-at-end behavior. On
`ListingDetail`, one prop drives both the inline gallery and the
fullscreen lightbox.

Also fix: when `Carousel`'s controlled `index` prop changes from
outside (e.g. `Lightbox` close in `ListingDetail` pushes back the
index it left on), the viewport now scrolls to the new slide instead
of leaving stale content on screen.
