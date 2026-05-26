---
type: pattern
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [tests, axe, radix-portal, jsdom]
---

# Axe must scan `document.body` for Radix-portaled content

## When to Use

Any test that opens a Radix overlay (`Dialog`, `Drawer`, `Sheet`,
`Toast`, `Tooltip`, `Popover`, `HoverCard`, `DropdownMenu`,
`CommandPalette`) and then runs an axe assertion.

## Implementation

RTL's `render` returns a `container` that wraps the _initially-rendered_
DOM. Radix `Content` components portal **outside** that container into
`document.body`. So:

```ts
// WRONG — scans the empty RTL render wrapper
expect(await axe(container)).toHaveNoViolations();

// RIGHT — scans the full document, including portaled Content
expect(await axe(document.body)).toHaveNoViolations();
```

`baseElement` from `render({ baseElement })` is also acceptable when
explicitly set, but `document.body` is the safe default in jsdom.

## Examples

- The fix landed in commit `4993fa1` ("Drawer test: axe scans
  document.body so portaled Content is included") and was the canonical
  fix for the [[drawer-sheet-axe-gap]] scar.
- Same pattern needed for any test that fires a Toast and then asserts —
  the Toast Viewport portals.

## Gotchas

- **Click open before scanning**: testing the initial closed state passes
  trivially. Always interact with the trigger (`userEvent.click(…)`) and
  await `findByRole('dialog')` (or equivalent) before running axe.
- **Side-effects between tests**: a portal left open by an earlier test
  can pollute the next test's axe scan. `afterEach(() => cleanup())` is
  the RTL default but verify the portal nodes are cleaned.
- **Setup duplication**: the jsdom polyfills (`ResizeObserver`,
  `IntersectionObserver`, `matchMedia`, `scrollIntoView`,
  pointer-capture) live in `packages/<pkg>/src/test/setup.ts`. New UI
  packages (`cytoscape`, `graph-editor`, `next`, `map`) duplicate this
  file. If a polyfill is needed for one and not the others, that's
  intentional; if it's needed for all, consider extracting the setup to
  a shared internal package (not yet done — see audit P1).

## Related

- [[drawer-sheet-axe-gap]] — the scar this pattern prevents.
- [[component-authoring-shape]] — every component test follows this.
