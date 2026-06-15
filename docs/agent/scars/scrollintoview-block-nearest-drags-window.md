---
type: scar
status: active
created: 2026-06-14
updated: 2026-06-14
author: claude-opus-4-8
tags: [carousel, scroll, dom, scrollintoview, viewport]
incident-date: 2026-06-14
tripwire: "if you call element.scrollIntoView({ inline: 'start' }) to reposition a horizontal scroll-snap viewport, know it ALSO scrolls the vertical axis — block defaults to 'start' and even block: 'nearest' scrolls the document vertically when the element is off-screen. For horizontal-only repositioning that never touches the window, use viewport.scrollTo({ left, behavior }) instead."
---

# `scrollIntoView({ inline: 'start' })` is not horizontal-only — it scrolls the window too

## What Happened

A looping `Carousel` (and `ListingCard` / `ListingDetail` with a truthy
`loop`) rendered below the fold auto-scrolled the whole page down to
itself on cold load. With several such carousels on one page, the window
landed on whichever initialized last. It felt intermittent because
browser scroll-restoration / framework scroll-reset / image reflow
sometimes raced and masked it.

Every looping reposition path called
`child.scrollIntoView({ behavior, block: 'nearest', inline: 'start' })`.
The intent was horizontal-only alignment at the snap point
(`inline: 'start'`), but `scrollIntoView` acts on BOTH axes. `block:
'nearest'` scrolls the nearest scrollable ancestor — the document — on
the vertical axis whenever the target is outside the vertical viewport.
On a cold load an off-screen carousel is outside the viewport, so seeding
the initial real slide past the leading clone (a mount `useLayoutEffect`
that fires on every load) dragged the window down. The other reposition
paths (controlled-index sync, clone→real edge snaps, consecutive-wrap
rebase) had the same latent defect.

## Tripwire

If you reach for `element.scrollIntoView({ inline: 'start' })` to move a
horizontal scroll-snap viewport, stop. `scrollIntoView` cannot be made
single-axis — `block` is not optional in effect (defaults to `'start'`,
and `'nearest'` still scrolls vertically when the element is off-screen),
and it walks up to scroll ancestors including the document. For a
reposition that must only move the viewport's own horizontal scroll box
and never the window, use `viewport.scrollTo({ left, behavior })` (each
full-width slide `d` sits at `left = d * viewport.clientWidth`).

## Why It Hurt

- User-visible on every cold load of any page with a below-the-fold
  looping carousel: the page jumped down on its own. Multiple carousels
  fought over the final scroll position.
- Invisible to the unit suite: jsdom mocks `scrollIntoView` to a no-op,
  so it never moved a (also-fake) window. The tests asserted _which
  child_ got `scrollIntoView` — they could not see the second-axis
  side effect at all.

## Don't Do This

```tsx
// ❌ Two-axis. block:'nearest' drags the document down to an off-screen
//    carousel on cold load.
slide.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' });

// ✅ Horizontal-only. scrollTo on the element moves only its own scroll
//    box and never an ancestor / the window. 'instant' overrides the
//    viewport's scroll-smooth CSS; 'smooth' keeps nav animated.
viewport.scrollTo({ left: domIdx * viewport.clientWidth, behavior });
```

Note jsdom does not implement `Element.prototype.scrollTo` — stub it in
the test setup (`packages/ui/src/test/setup.ts`) or renders that trigger
a reposition throw.

## Related

- [scroll-behavior-smooth-overrides-scrollleft-setter](scroll-behavior-smooth-overrides-scrollleft-setter.md) —
  why the instant `scrollTo` uses `behavior: 'instant'` and not a bare
  `scrollLeft =` setter (which animates under `scroll-smooth`).
- [rebase-instant-scroll-fires-edge-snap](rebase-instant-scroll-fires-edge-snap.md) —
  a programmatic reposition still fires a synthetic scroll event the
  onScroll listener must absorb; `scrollTo` is no different from
  `scrollIntoView` there. The existing consume-refs are preserved.
- [math-round-midpoint-fires-onscroll-edge-mid-animation](math-round-midpoint-fires-onscroll-edge-mid-animation.md) —
  sibling Carousel onScroll scar.
