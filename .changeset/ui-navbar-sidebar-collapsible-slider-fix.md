---
'@ship-it-ui/ui': patch
---

**`NavBar` pattern (new).** Adds a horizontal/vertical navigation pattern with
support for groups, submenus, and active-item state. Composes as
`<NavBar />` with `NavBar.Item`, `NavBar.Group`, and `NavBar.Submenu`
sub-components. Exported from the package root.

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
