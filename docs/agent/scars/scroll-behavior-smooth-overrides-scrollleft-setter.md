---
type: scar
status: active
created: 2026-06-02
updated: 2026-06-02
author: claude-opus-4-7
tags: [css, scroll, dom, carousel]
incident-date: 2026-06-02
tripwire: "if you set node.scrollLeft = X to do an 'instant' scroll on an element with CSS scroll-behavior: smooth (or the scroll-smooth Tailwind class), the assignment is actually animated — use scrollIntoView({behavior:'instant'}) or scrollTo({left, behavior:'instant'}) instead"
---

# CSS `scroll-behavior: smooth` silently animates the `scrollLeft` setter

## What Happened

Fixing a `Carousel loop="circular"` bug where double-clicking next on the
last slide swept backward across the strip instead of continuing forward.
The plan: when a previous wrap is in flight, rebase `scrollLeft` by
`±N*width` so the next smooth scroll starts from a real-strip-adjacent
position (the clone bracket makes this a visually-invisible jump).

Implementation used `node.scrollLeft -= N * width`. All 22 unit tests
passed (jsdom's `scrollLeft` is a plain data prop). User retested in the
browser and reported "still does the sweep."

Root cause: the carousel viewport has `scroll-smooth` Tailwind class →
`scroll-behavior: smooth`. Per CSSOM-View, the `scrollLeft` setter
performs a scroll with `behavior: 'auto'`, which inherits the element's
CSS `scroll-behavior`. So `scrollLeft = X` was running another smooth
scroll, racing the in-flight one. Net visible motion: still the long
backward sweep.

## Tripwire

If you need an instant scroll on an element whose CSS sets
`scroll-behavior: smooth` (including via `scroll-smooth` Tailwind), do
not use the `scrollLeft` / `scrollTop` setter. Use one of:

- `child.scrollIntoView({ behavior: 'instant', inline: 'start' })` to
  align a child element at a snap point.
- `node.scrollTo({ left: X, behavior: 'instant' })` to set absolute
  position without a child.

The explicit `'instant'` behavior overrides CSS scroll-behavior; the
setter (which translates to `behavior: 'auto'`) does not.

## Why It Hurt

A full extra iteration on a Carousel bug. Shipped a fix that passed all
unit tests but didn't fix the symptom in the user's browser. User had
to re-test three times before the right diagnosis surfaced.

## Don't Do This

```tsx
// ❌ Animates whenever `scroll-behavior: smooth` is set on node
node.scrollLeft -= N * width;

// ✅ Always instant regardless of CSS scroll-behavior
node.scrollTo({ left: node.scrollLeft - N * width, behavior: 'instant' });

// ✅ Or scroll a specific child into view at a snap point
node.children[targetIdx].scrollIntoView({
  behavior: 'instant',
  inline: 'start',
});
```

## Related

- [[math-round-midpoint-fires-onscroll-edge-mid-animation]] — sibling Carousel scar from the same session.
- [[goto-in-progress-suppression]] — pattern that depends on instant scrolls working.
