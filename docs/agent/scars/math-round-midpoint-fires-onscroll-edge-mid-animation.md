---
type: scar
status: active
created: 2026-06-02
updated: 2026-06-02
author: claude-opus-4-7
tags: [carousel, scroll-snap, math, animation]
incident-date: 2026-06-02
tripwire: 'if onScroll computes a slide index via Math.round(scrollLeft / width) and runs special edge-index work, the edge work fires HALFWAY through a programmatic smooth scroll (at scrollLeft = (target ± 0.5) * width) — gate the edge work on actual proximity to the target, not just the rounded index'
---

# `Math.round(scrollLeft / width)` crosses the edge index halfway through a smooth scroll

## What Happened

`Carousel` `loop="circular"` wrap path: arrow click on the last real
slide smooth-scrolls to clone-end (`children[N+1]`), and an `onScroll`
edge branch detects `domIdx === N + 1` and instant-snaps to the real
twin (`children[1]`). First version of the wrap-clone fix had a visible
flicker — user described it as "bad flicker then jump back to 1."

Root cause: `Math.round(scrollLeft / width)` crosses to `N + 1` at
`scrollLeft = (N + 0.5) * width`, which is the _midpoint_ of the smooth
wrap animation, not the landing. The edge branch fired halfway through,
cancelled the in-flight smooth scroll mid-flight, and instant-snapped
to the real twin — the user saw the slide-in animation get cut off,
then teleport.

Native scroll-snap doesn't have this problem: scroll-snap commits
scrollLeft to an exact integer multiple of `width` before firing the
final scroll event, so the rounded index and the settled position
coincide. It's only programmatic smooth scrolls (`scrollIntoView({
behavior: 'smooth' })`) where rounding fires the edge work
prematurely.

## Tripwire

In an `onScroll` handler that fires special logic at an edge DOM
index, gate the special logic on actual scroll proximity to that
edge (`Math.abs(scrollLeft - target * width) < 1`), not just on
`Math.round(...) === target`. Skip the gate only for the native-swipe
path (where snap-mandatory settles before firing).

## Why It Hurt

Shipped a partial Carousel fix that the user immediately reported as
_worse_ than the original bug ("smooth fast run to number 1" → "bad
flicker then jump back to 1"). Required a second iteration on the same
task.

## Don't Do This

```tsx
// ❌ Edge work fires at scrollLeft = (target + 0.5) * width
const domIdx = Math.round(scrollLeft / width);
if (domIdx === N + 1) {
  realTwin.scrollIntoView({ behavior: 'instant' });
}

// ✅ Wait until scrollLeft has actually landed (gated when programmatic
// scroll is in flight; native scroll-snap settles cleanly so doesn't
// need the gate)
const domIdx = Math.round(scrollLeft / width);
if (domIdx === N + 1) {
  if (goToInProgressRef.current && scrollLeft < (N + 1) * width - 1) return;
  realTwin.scrollIntoView({ behavior: 'instant' });
}
```

## Related

- [[scroll-behavior-smooth-overrides-scrollleft-setter]] — sibling Carousel scar from the same session.
- [[goto-in-progress-suppression]] — companion pattern for in-flight smooth scrolls.
