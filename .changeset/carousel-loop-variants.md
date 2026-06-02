---
'@ship-it-ui/ui': patch
---

Add named loop variants to `Carousel`. `loop` now accepts
`boolean | "circular" | "sweep"`:

- `loop="circular"` (or `loop={true}`, the default alias) — boundary
  arrow clicks smooth-scroll one slide width through a hidden clone of
  the opposite end, then invisibly snap to the real twin. The motion is
  always one slide regardless of strip length — an endless-reel feel.
  This is the behavior shipped in the previous patch and remains the
  default for `loop={true}`.
- `loop="sweep"` — boundary arrow clicks smooth-scroll the full
  distance across the strip back to the real first / last slide. The
  transition reads as a wide arc across every item between, useful when
  you want users to re-perceive intermediate slides on each wrap.

Native swipe past the edge uses the clone-snap in both variants. No
breaking change: existing `loop={true}` / `loop={false}` call sites keep
their current behavior.
