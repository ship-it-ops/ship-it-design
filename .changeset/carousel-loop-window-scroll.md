---
'@ship-it-ui/ui': patch
---

`Carousel`: stop the looping variant from scrolling the whole window
vertically on mount.

A looping `Carousel` (and `ListingCard` / `ListingDetail` with a truthy
`loop`) rendered below the fold auto-scrolled the page down to itself on
initial load. The looping reposition paths used
`element.scrollIntoView({ block: 'nearest', inline: 'start' })` — the
intent was horizontal-only (`inline: 'start'`), but `scrollIntoView` acts
on both axes, and `block: 'nearest'` scrolls the document vertically
whenever the off-screen carousel is outside the viewport.

All instant repositions (mount seed, controlled-index sync, clone→real
edge snaps, consecutive-wrap rebase) and the smooth arrow/dot navigation
now use `viewport.scrollTo({ left, behavior })`, which only moves the
viewport's own horizontal scroll box and never touches the window.
Arrow/dot nav, native swipe, and circular wrap-around are unchanged and
remain visually instant where they were instant before.
