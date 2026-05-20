---
'@ship-it-ui/icons': patch
---

`iconToSvgDataUrl` now sets `style="color:…"` on the wrapper SVG in addition to `fill`. Lucide-style icon bodies use `stroke="currentColor"` with `fill="none"`, so the wrapper's `fill` alone didn't paint them — and `currentColor` inside an `<img src="data:image/svg+xml">` falls back to the user-agent default (black) without an inherited `color` cascade. The fix means icons inside cytoscape nodes (and any other non-DOM consumer of this helper) now render in the entity-type color on every theme. Previously the glyphs disappeared against dark-mode node backgrounds.
