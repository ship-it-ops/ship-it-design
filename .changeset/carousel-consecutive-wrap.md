---
'@ship-it-ui/ui': patch
---

Fix `Carousel` `loop="circular"` direction on consecutive wrap clicks.
Double-clicking the next arrow at the last slide previously circled to
slide 1 (correct), then immediately swept backward across the entire
strip to land on slide 2 (wrong direction). Same symmetric bug on the
prev arrow at slide 0.

Cause: the first click's smooth scroll lands on a clone (`scrollLeft`
sits beyond the real-slide range, between `N*width` and `(N+1)*width`).
A second `goTo` arriving before that scroll settled would start its
smooth scroll from clone territory toward a real mid-strip target,
forcing the browser to traverse every intermediate slide backward.

Fix: when a `goTo` starts a wrap, capture the wrap direction in a ref.
The next `goTo` reads this ref at entry and, if non-null, jumps the
viewport to the _opposite_ clone via `scrollIntoView({behavior:
'instant'})` (clone-start for an in-flight next-wrap, clone-end for an
in-flight prev-wrap). The jump is invisible because clones render
the same content as their twins, and the new smooth scroll then runs
forward from a real-strip-adjacent source. `scrollIntoView({instant})`
is used rather than `node.scrollLeft = X` so the viewport's CSS
`scroll-behavior: smooth` doesn't silently turn the rebase into yet
another animated scroll. Direction-based detection (rather than a
`scrollLeft` threshold) fires even on an ultra-fast double-click that
beats the first animation frame. Single-click behavior and native
swipe paths are unchanged.
