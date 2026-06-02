---
'@ship-it-ui/ui': patch
---

Fix `Carousel` `loop` mode so prev/next arrow clicks at the boundaries
smooth-scroll a single slide through the adjacent clone instead of
rewinding across the whole strip. Previously, clicking "next" on the
last real slide would `scrollIntoView` the real first slide and animate
backwards through every slide between them (and the symmetric
"fast-forward" on prev from the first slide). Now the wrap step targets
the clone-twin one slide width away and the existing onScroll edge
branch performs the invisible clone→real snap once the animation
settles — matching the native-swipe path's "one-slide-and-snap"
behavior.

Also fix a related dot-indicator flicker: while the wrap smooth-scroll
traverses intermediate DOM indices, `onScroll`'s non-edge branch no
longer overwrites the optimistic active index back to the previous
slide.

Mid-strip jumps (dot clicks across the strip, multi-step `goTo` calls)
keep their current behavior — they target the real twin directly so
direction-of-travel matches user intent. No API change.
