---
'@ship-it-ui/cytoscape': patch
---

Fix entity glyphs not painting on the Cytoscape canvas. The SVG data-URL
emitted by `buildShipItStylesheet`'s `background-image` carried only a
`viewBox` attribute; Cytoscape rasterises canvas background-images through
`<img>`, which treats a `viewBox`-only `<svg>` as 0×0 intrinsic dimensions
and renders nothing. Added explicit `width='52' height='52'` to match the
existing viewBox so the glyph paints at the node's full size (with
`background-fit: contain` unchanged).
