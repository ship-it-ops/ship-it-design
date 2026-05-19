---
'@ship-it-ui/graph-editor': patch
---

Add editing behaviors to `<GraphEditorCanvas>`: keyboard handlers (`Delete`/`Backspace` removes selected nodes + edges, arrow keys nudge by 8px, `Shift+Arrow` by 32px, `Esc` clears selection, `⌘Z`/`⌘⇧Z` undo/redo), an internal command-stack history bounded by `historySize` (default 50; 0 disables), a live mini-map that wraps `<GraphMinimap>` from `@ship-it-ui/shipit` and feeds it React Flow's node positions + viewport rectangle, a built-in keyboard-accessible "+ Add" button rendered when no `toolbar` is supplied and `onNodeAdd` is provided, `role="application"` semantics with `tabIndex=0` on the canvas root so it receives keyboard events, and the missing `onNodeDelete` / `onEdgeDelete` events on the public API. Undo / redo also fire the matching consumer event in the reverse direction so persistence layers can keep in sync without polling.
