---
type: scar
status: active
created: 2026-06-02
updated: 2026-06-02
author: claude-session-2026-06-02-carousel-rebase
tags: [carousel, scroll-events, jsdom, race]
importance: standard
incident-date: 2026-06-02
tripwire: "If you call scrollIntoView({behavior:'instant'}) to deliberately park scrollLeft at a position your scroll-listener treats as significant, arm an explicit consume-ref BEFORE the call — the resulting scroll event will fire your listener and your listener will not know whether it was synthetic."
---

# scrollIntoView(instant) fires a scroll event your listener can't tell from a real landing

## What Happened

`Carousel` ships a wrap-consolidation rebase: when a second wrap click
arrives before the first wrap's smooth scroll has landed, goTo jumps
scrollLeft to the OPPOSITE clone via `scrollIntoView({behavior:
'instant'})` so the new smooth scroll runs forward from a real-strip-
adjacent source. That instant jump fires a synthetic scroll event whose
scrollLeft is exactly at the clone edge (0 or `(N+1)*width`). onScroll's
edge branch read that event as the natural tail of a wrap-toward animation
— snapping to the twin and setting activeIdx to the wrong real slide.
On spam-clicks (Luxor Motors → 10-15 rapid Next on a 5-photo
`ListingDetail` gallery) the desync compounded: activeIdx ended up at
N - 1 while the smooth scroll was heading mid-strip, leaving the carousel
visually stuck oscillating between slides 5 and 1.

## Tripwire

If you call `scrollIntoView({behavior:'instant'})` (or set `scrollLeft`
directly) to deliberately park the viewport at a position your scroll
listener treats as significant — clone edge, snap boundary, etc. — arm
an explicit "consume-ref" BEFORE the call. The resulting scroll event
will fire your listener and your listener cannot distinguish "I just
parked us here on purpose" from "we just landed here naturally". A
position-based tolerance check (`scrollLeft > 1`) is not enough — the
synthetic event reports the exact rebase position and you have to
remember you put it there.

## Why It Hurt

- User-visible: spam-clicking past the end (a normal browsing pattern in
  a photo gallery) bricked the gallery's slide tracking. Subsequent
  normal clicks only oscillated between slides 5 and 1.
- Hard to spot in jsdom: `scrollIntoView` is mocked in our tests, so the
  synthetic event never fires under unit test unless you `dispatchEvent`
  it yourself. The existing wrap tests asserted scrollIntoView CALLS but
  never simulated the resulting scroll-event landing — so the rebase
  shipped in 0.0.13 without a regression for this race.
- Time-sensitive: the bug only manifests when the scroll listener fires
  BEFORE the smooth scroll progresses past `Math.round(scrollLeft/width)`
  out of the rebase domIdx slot. On a slow render frame or under React's
  controlled re-render cycle, that window is real.

## Don't Do This

- Don't rely on `scrollLeft > 1` (or similar small-tolerance) checks
  alone to gate "is this event the natural landing of an animation?" —
  the synthetic event from a deliberate position-jump satisfies the
  same check.
- Don't expect `behavior:'instant'` scrollIntoView to be silent. It
  fires a scroll event same as a settled smooth animation.
- Don't rely on the controlled-sync's `internalScrollRef` to also gate
  onScroll. That ref is for the controlled-prop sync effect, not the
  scroll-listener — wiring it into onScroll has different lifecycle
  needs (you'd need to clear it on first scroll, not next-render).

## Related

- [scroll-behavior-smooth-overrides-scrollleft-setter](scroll-behavior-smooth-overrides-scrollleft-setter.md) —
  related class of bug: scroll-behavior:smooth + manual position writes.
- [math-round-midpoint-fires-onscroll-edge-mid-animation](math-round-midpoint-fires-onscroll-edge-mid-animation.md) —
  prior scar in the same onScroll: Math.round threshold fires mid-animation.
