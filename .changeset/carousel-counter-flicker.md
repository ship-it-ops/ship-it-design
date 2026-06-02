---
'@ship-it-ui/ui': patch
---

Fix active-index flicker during `Carousel` arrow / dot clicks. Each
`goTo` call commits the destination as `activeIdx` optimistically, then
starts a smooth scroll — but intermediate scroll events would briefly
overwrite the optimistic value as `scrollLeft` crossed the round
threshold of the next slide (e.g. `setActive(0)` momentarily during a
`goTo(1)` smooth scroll). Dot indicators absorbed this via CSS
transition; consumer-rendered counters (notably the X/Y pill on
`ListingCard`'s spec variant) showed the flicker as
"2/5 → 1/5 → 2/5" within ~150ms.

The wrap-in-progress guard already shipped for circular loop wraps is
now generalized to suppress non-edge `setActive` during any in-flight
`goTo` smooth scroll, regardless of variant or wrap status. The guard
releases automatically once the scroll lands on the optimistic target
(realIdx catches up to activeIdx), and a `pointerdown` listener on the
viewport releases it on any direct user interaction so a swipe
interrupting the animation tracks the user's chosen position
immediately. Native swipe paths are unchanged — the guard is only set
by `goTo`.
