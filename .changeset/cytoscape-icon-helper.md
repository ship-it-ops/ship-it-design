---
'@ship-it-ui/cytoscape': patch
---

Route per-entity-type `background-image` styles through
`iconToSvgDataUrl()` from `@ship-it-ui/icons` instead of the hand-rolled
`glyphDataUrl()`. Entity types now paint with real Iconify SVGs inside
cytoscape nodes.

Adds `@ship-it-ui/icons` as a peer dependency (and devDependency for local
builds). No cytoscape API change.
