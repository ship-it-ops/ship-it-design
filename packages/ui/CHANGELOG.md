# @ship-it-ui/ui

## 0.0.3

### Patch Changes

- 597a705: **`NavBar` pattern (new).** Renders primary app navigation as either a
  horizontal top bar (`orientation="horizontal"`) or a vertical side rail
  (`orientation="vertical"`), driven by a flat `items: NavBarItem[]` tree.
  Items can carry nested `children` to produce dropdowns on horizontal and
  expand-collapse groups on vertical. Below `md` the bar collapses to a
  hamburger that opens a Drawer with the items rendered vertically (set
  `responsive={false}` to opt out). Active state can be controlled
  (`value` + `onValueChange`) or uncontrolled (`defaultValue`); items with
  `href` render as anchors, others as buttons. New exports: `NavBar`,
  `NavBarItem`, `NavBarOrientation`, `NavBarProps`.

  **`Sidebar.NavSection` is now collapsible.** Six new optional props on
  `NavSection`, all backwards-compatible (existing consumers keep the static
  eyebrow):
  - `collapsible` — turns the eyebrow into a button that toggles the body.
  - `open` / `defaultOpen` / `onOpenChange` — controlled and uncontrolled open
    state, mirroring our other disclosure components.
  - `icon` — leading glyph next to the eyebrow.
  - `indent` — pixel indent for nested sections, with a subtle left rail.

  **`Slider` `showValue` follows the thumb when uncontrolled.** Previously the
  displayed number was computed once from `defaultValue` and never updated, so
  only fully-controlled sliders (`value` + `onValueChange`) showed live values.
  The fix tracks the live value internally when uncontrolled and forwards every
  change through `onValueChange`, preserving scalar-vs-array shape.

- Updated dependencies [597a705]
  - @ship-it-ui/tokens@0.0.3

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.
- Updated dependencies [3b7a79a]
  - @ship-it-ui/tokens@0.0.2

## 0.0.1

### Patch Changes

- 1035968: v0 launch
