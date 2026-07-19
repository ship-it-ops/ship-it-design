---
type: status
status: completed
created: 2026-06-14
updated: 2026-07-18
author: claude-opus-4-8
branch: fix-scroll
agent: claude-session-2026-06-14-carousel-scroll
tags: [carousel, scroll, loop, dom]
---

# Fixing: looping Carousel auto-scrolls the window vertically on cold load

## Scope

`packages/ui/src/patterns/Carousel/Carousel.tsx` — replacing all 6
`scrollIntoView({block:'nearest', inline:'start'})` reposition call sites
with horizontal-only `node.scrollTo({left, behavior})` on the viewport.
Also `packages/ui/src/patterns/Carousel/Carousel.test.tsx` (assertions
move from "which child got scrollIntoView" to "viewport scrollTo left")
and `packages/ui/src/test/setup.ts` (polyfill `Element.prototype.scrollTo`,
which jsdom does not implement).

## Why

`scrollIntoView({block:'nearest'})` scrolls the document vertically when
the carousel is off-screen; below-the-fold looping carousels drag the
window down to themselves on mount. `scrollTo` on the element only moves
its own horizontal scroll box. See
[[scroll-behavior-smooth-overrides-scrollleft-setter]] for why we use
`scrollTo({behavior:'instant'})` rather than the `scrollLeft =` setter,
and [[scrollintoview-block-nearest-drags-window]] for the root-cause scar.

## State

Implementation complete on branch `fix-scroll`. All 6 reposition call
sites switched to `viewport.scrollTo`; helper `scrollViewportToDom` added;
`Element.prototype.scrollTo` stubbed in test setup; Carousel +
ListingDetail tests rewritten to assert scrollTo `left` targets. Changeset
`carousel-loop-window-scroll.md` (patch) added. Verified: typecheck,
lint, and full `@ship-it-ui/ui` suite (588 tests) pass. NOT yet verified
in a live browser (jsdom mocks scroll APIs, so unit tests can't observe
`window.scrollY`); the fix is correct by DOM construction (Element
`scrollTo` cannot move an ancestor / the window). Awaiting review + merge.
