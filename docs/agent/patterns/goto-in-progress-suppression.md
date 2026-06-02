---
type: pattern
status: active
created: 2026-06-02
updated: 2026-06-02
author: claude-opus-4-7
tags: [carousel, scroll, react, state, refs]
---

# Suppress position-driven `setActive` during a programmatic smooth scroll

## When to Use

Any scroll-snap component that simultaneously:

1. Updates an `active` index optimistically (set immediately by an
   arrow / dot / keyboard navigation).
2. Tracks the active index reactively from an `onScroll` listener
   (`activeIdx = Math.round(scrollLeft / width)`).
3. Uses programmatic `scrollIntoView({ behavior: 'smooth' })` for its
   navigation (not just native swipe).

Without suppression, intermediate `scroll` events during the smooth
scroll fire `setActive(realIdx)` and overwrite the optimistic active
mid-animation. Symptom: dot indicators absorb it via CSS transition
(easy to miss), but consumer-rendered counters or any bare-text active
display show "2/5 → 1/5 → 2/5" within ~150 ms on a single arrow click.

## Implementation

Live in `packages/ui/src/patterns/Carousel/Carousel.tsx`. Sketch:

```tsx
const goToInProgressRef = useRef(false);

const goTo = useCallback((i: number) => {
  setActive(next);                            // optimistic
  goToInProgressRef.current = true;           // arm the guard
  slide.scrollIntoView({ behavior: 'smooth', inline: 'start' });
}, [...]);

// onScroll handler:
const realIdx = domIdx - 1;
if (goToInProgressRef.current) {
  // Guard auto-clears once the smooth scroll lands on the optimistic
  // target. Position tracking then resumes for native interactions.
  if (realIdx === activeIdx) goToInProgressRef.current = false;
  return;
}
if (realIdx !== activeIdx) setActive(realIdx);

// Plus a pointerdown listener on the viewport, so a user swipe
// interrupting an in-flight goTo releases the guard immediately:
node.addEventListener('pointerdown', () => {
  goToInProgressRef.current = false;
});
```

Native swipe paths are unaffected — only programmatic `goTo` arms the
flag.

## Examples

- `packages/ui/src/patterns/Carousel/Carousel.tsx` — the ref itself and
  the onScroll branch.
- `packages/ui/src/patterns/ListingCard/ListingCard.tsx` (spec
  variant) — consumer-rendered X/Y counter that this pattern protects
  from flicker.

## Gotchas

- **Always wire the `pointerdown` clear** on the viewport. Without it,
  a user swipe interrupting an in-flight `goTo` leaves the guard armed
  and position tracking frozen at the (now wrong) optimistic value.
- **Keep separate from `internalScrollRef`** — that ref gates the
  controlled-sync effect and has a different lifecycle (cleared on the
  next state-driven controlled-sync run, not on a scroll event).
  Conflating them reintroduces a lightbox-close handoff bug.
- **The auto-clear condition (`realIdx === activeIdx`) needs
  companions** for wrap scenarios: the edge branch that performs the
  clone→real snap is the guaranteed terminator of a wrap animation, so
  it should clear the guard too.
- **The edge tolerance check is a separate concern** — see
  [[math-round-midpoint-fires-onscroll-edge-mid-animation]].

## Related

- [[math-round-midpoint-fires-onscroll-edge-mid-animation]] — why the
  edge branch needs its own gate during in-flight smooth scrolls.
- [[scroll-behavior-smooth-overrides-scrollleft-setter]] — why the
  rebase that consolidates wraps uses `scrollIntoView({instant})`
  rather than `scrollLeft = X`.
