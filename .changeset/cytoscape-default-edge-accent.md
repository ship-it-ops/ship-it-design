---
'@ship-it-ui/cytoscape': patch
---

Default cytoscape edges now draw in `--color-accent` rather than
`--color-border`. The previous tone was the same as surface-divider lines
and made edges almost invisible against the panel background on dark
themes; the canonical `<GraphEdge edgeStyle="solid">` in the docs already
drew in accent, so the adapter now matches it. Apps that intentionally
want subdued edges can still override via `buildShipItStylesheet({ extra })`.
