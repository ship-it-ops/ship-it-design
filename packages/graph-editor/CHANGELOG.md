# @ship-it-ui/graph-editor

## 0.0.6

### Patch Changes

- Updated dependencies [a793daa]
- Updated dependencies [a793daa]
  - @ship-it-ui/ui@0.0.11
  - @ship-it-ui/icons@0.0.11
  - @ship-it-ui/shipit@0.0.12

## 0.0.5

### Patch Changes

- 1ba01f1: React 19 baseline. Peer range tightened to `react ^19.0.0` /
  `react-dom ^19.0.0` (was `^18.0.0 || ^19.0.0`) and dev installs bumped to
  React 19.2. Drops React 18 from the supported matrix — consumers must be on
  React 19 to install.

  `@ship-it-ui/ui` also refreshes every `@radix-ui/react-*` dependency to the
  latest 1.x. Each one now declares explicit React 19 peer support and ships
  the strict-mode / `forwardRef` compat fixes from the Radix 1.x line. No
  Radix v2 migration in this release; only patch-level moves within 1.x.

- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
  - @ship-it-ui/icons@0.0.10
  - @ship-it-ui/ui@0.0.10
  - @ship-it-ui/shipit@0.0.11

## 0.0.4

### Patch Changes

- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
  - @ship-it-ui/icons@0.0.9
  - @ship-it-ui/ui@0.0.9
  - @ship-it-ui/shipit@0.0.10

## 0.0.3

### Patch Changes

- Updated dependencies [e2b569e]
- Updated dependencies [e2b569e]
  - @ship-it-ui/icons@0.0.8
  - @ship-it-ui/ui@0.0.8
  - @ship-it-ui/shipit@0.0.9

## 0.0.2

### Patch Changes

- 9da43f1: Add editing behaviors to `<GraphEditorCanvas>`: keyboard handlers (`Delete`/`Backspace` removes selected nodes + edges, arrow keys nudge by 8px, `Shift+Arrow` by 32px, `Esc` clears selection, `⌘Z`/`⌘⇧Z` undo/redo), an internal command-stack history bounded by `historySize` (default 50; 0 disables), a live mini-map that wraps `<GraphMinimap>` from `@ship-it-ui/shipit` and feeds it React Flow's node positions + viewport rectangle, a built-in keyboard-accessible "+ Add" button rendered when no `toolbar` is supplied and `onNodeAdd` is provided, `role="application"` semantics with `tabIndex=0` on the canvas root so it receives keyboard events, and the missing `onNodeDelete` / `onEdgeDelete` events on the public API. Undo / redo also fire the matching consumer event in the reverse direction so persistence layers can keep in sync without polling.
- 9da43f1: Add `@ship-it-ui/graph-editor` — `<GraphEditorCanvas>`, the editing analog of `<GraphCanvas>`. React Flow under the hood; same `elements[]` shape on the input so consumers can swap viewer ↔ editor without reshaping data. Surface: pan/zoom, click-to-select, drag-to-connect, drag-to-move with `onNodeMove`, theme-token sync (reads via `@ship-it-ui/graph-tokens`, paints React Flow's CSS variables on mount + every `data-theme` flip), default node renderer that mirrors `<GraphNode>`'s visual, `renderNode` / `renderEdge` slots, `toolbar` + `inspector` slots, and a round-trip-tested `toFlowElements` / `toCytoscapeElements` adapter. See `add-graph-editor-behaviors` for the editing-behavior layer (keyboard, undo/redo, mini-map, built-in "+ Add" button) that ships alongside.
- 9da43f1: `<GraphEditorCanvas>` no longer imports its own stylesheet. Consumers must now add `import '@ship-it-ui/graph-editor/styles.css';` once at their app entry (`app/layout.tsx` for Next.js, `main.tsx` for Vite, etc.). Library-internal global CSS imports break Next.js's App Router CSS rules, and the explicit pattern also lets consumers control load order against their own theme. The CSS export path is unchanged; tsup ships it as a standalone `dist/styles.css` entry. README + docs updated; existing examples already follow the explicit-import pattern.
- 9da43f1: Strip React Flow's built-in node-default chrome inside `.ship-graph-editor`. RF paints every `default`/`input`/`output`/`group` node with a 150px-wide white box, a 1px border, and 10px padding — which showed up in dark mode as a stark white wrapper around our `<GraphNodeShell>`. The new overrides null out `padding`, `border`, `background`, `width`, `border-radius`, `font-size`, and `text-align` on those classes, so the only visual is the shell. Selection / hover / focus box-shadows are also suppressed so the shell's own selection ring stays the canonical visual. Scope is `.ship-graph-editor` so other React Flow surfaces on the same page (if any) aren't affected.
- Updated dependencies [9da43f1]
- Updated dependencies [9da43f1]
- Updated dependencies [9da43f1]
  - @ship-it-ui/ui@0.0.7
  - @ship-it-ui/graph-tokens@0.0.2
  - @ship-it-ui/icons@0.0.7
  - @ship-it-ui/shipit@0.0.8
