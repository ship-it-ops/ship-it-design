---
'@ship-it-ui/graph-editor': patch
---

Add `@ship-it-ui/graph-editor` — `<GraphEditorCanvas>`, the editing analog of `<GraphCanvas>`. React Flow under the hood; same `elements[]` shape on the input so consumers can swap viewer ↔ editor without reshaping data. PR-3 scope: pan/zoom, click-to-select, drag-to-connect, drag-to-move with `onNodeMove`, theme-token sync (reads via `@ship-it-ui/graph-tokens`, paints React Flow's CSS variables on mount + every `data-theme` flip), default node renderer that mirrors `<GraphNode>`'s visual, `renderNode` / `renderEdge` slots, `toolbar` + `inspector` slots, and a round-trip-tested `toFlowElements` / `toCytoscapeElements` adapter. Keyboard handlers, undo/redo, mini-map, roving tabindex, and the keyboard-accessible "+ Add" affordance land in the next iteration.
