---
'@ship-it-ui/cytoscape': patch
---

Stop letting node glyphs fill the cytoscape node edge-to-edge. The per-entity-type stylesheet block now uses `background-fit: none` (was `contain`) with `background-width` / `background-height` pinned at `50%` and the image centered via `background-position-x` / `background-position-y`. Consumers can override the fraction with the new `glyphScale` option on `buildShipItStylesheet` (default `0.5`, clamped to `[0, 1]`); pass `1` to revert to the legacy edge-to-edge behavior. The visual now matches the `<GraphNode>` React component (≈42% icon inside a 52px square).
