---
'@ship-it-ui/ui': patch
---

Add `SwatchGroup` — an accessible, curated color-picker component. Renders a
selectable grid of color tiles as a WAI-ARIA `radiogroup`: each tile is a
`role="radio"` with `aria-checked`, roving tabIndex, and arrow-key navigation
(Left/Up previous, Right/Down next with wrap; Home/End jump to ends). Supports
controlled / uncontrolled `value` via `useControllableState`, `sm`/`md`/`lg`
size variants, a token-based selection ring, and a contrast-aware check mark
(luminance-derived from the swatch color) so the mark stays visible on both
light and dark tiles.
