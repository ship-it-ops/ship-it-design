---
type: pattern
status: active
created: 2026-06-02
updated: 2026-06-02
author: claude-opus-4-7
tags: [carousel, tailwind, render-prop, selection, ring]
---

# Apply selection rings to the consumer-rendered child, not the wrapper

## When to Use

A component takes a `renderItem` / `renderThumbnail` / `renderTrigger`
render prop, wraps the result in a `<button>` (or similar) to handle
click / keyboard / aria, and needs to show an active / selected state
as a ring or border around the rendered shape.

Symptom that triggers this pattern: the wrapper has a hard-coded
`rounded` (or no radius), the consumer-rendered child has a different
`rounded-lg` / `rounded-full` / etc., and the ring traces the wrong
shape — visible as a tight rectangle around a pill, or a small-radius
box clipped against a larger-radius tile.

## Implementation

Put the ring utilities behind a child-selector variant gated on a data
attribute on the wrapper. `box-shadow` (what `ring-*` compiles to)
follows the element's own `border-radius`, so applying it on the child
makes it auto-match whatever shape the consumer rendered:

```tsx
<button
  data-active={isActive ? 'true' : undefined}
  className={cn(
    'shrink-0 cursor-pointer transition-opacity',
    '[&[data-active]>*]:ring-accent [&[data-active]>*]:ring-2',
    isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100',
  )}
>
  {renderThumbnail(item, i)}
</button>
```

The wrapper carries no `rounded` / `overflow-hidden` of its own — the
child's natural shape is the visible shape. Click area is still the
full wrapper bounding box, which is fine for keyboard / aria; small
corner regions outside the child stay clickable but are visually
transparent.

The scroll container the wrapper lives in usually needs a small
padding (`p-0.5`) so the ring isn't clipped by `overflow-x-auto` —
non-visible overflow on one axis also clips the other.

## Examples

- `packages/ui/src/patterns/Carousel/Carousel.tsx` — thumbnail strip:
  the `[&[data-active]>*]:ring-accent [&[data-active]>*]:ring-2`
  variant on the thumbnail button, with `p-0.5 -mx-0.5` on the
  scroll container so the ring has room to render at the edges.

## Gotchas

- **The child must be a single element**, not a fragment. `>*`
  targets direct children; a fragment renders multiple roots and the
  ring would land on each one separately.
- **The child must own its border-radius.** If the consumer renders
  a bare `<img>` with no radius, the ring is rectangular. That is
  the _correct_ dynamic behavior — the wrapper deliberately does not
  override the consumer's shape choice.
- **Scroll container padding is still needed.** Ring still extends
  outside the child's box, which extends to the wrapper's box; if
  the wrapper sits at the edge of an `overflow-*` container, the
  ring is clipped without breathing-room padding.
- **Don't move opacity / hover state onto the child the same way.**
  Those belong on the wrapper so the click target's whole hit area
  shares them; only the visual ring needs to ride the child's shape.

## Related

- [[component-authoring-shape]] — render-prop API conventions in this
  codebase.
