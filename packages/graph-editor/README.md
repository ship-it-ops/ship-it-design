# @ship-it-ui/graph-editor

`<GraphEditorCanvas>` — the editing analog of `<GraphCanvas>` (from `@ship-it-ui/cytoscape`). React Flow under the hood; same `elements[]` shape on the input so consumers can swap viewer ↔ editor without reshaping data.

## How this fits in

Part of the [Ship-It Design System](../../docs/architecture.md). Sibling to `@ship-it-ui/cytoscape` (read-only graph viewer). Both packages consume `@ship-it-ui/graph-tokens` for theme-token resolution; neither imports the other at runtime — tree-shaking is enforced by package boundary.

## Install + import the stylesheet

```bash
pnpm add @ship-it-ui/graph-editor
```

Then **once** at your app entry (`app/layout.tsx` for Next.js, `main.tsx` for Vite, etc.):

```ts
import '@ship-it-ui/graph-editor/styles.css';
```

The component intentionally does not import its own CSS. Next.js's App Router rejects library-internal global CSS, and explicit consumer imports let you control load order against your own theme. The stylesheet pulls in `@xyflow/react/dist/style.css` and layers Ship-It overrides on top.

## Quick start

```tsx
'use client';

import '@ship-it-ui/graph-editor/styles.css';

import { GraphEditorCanvas, type GraphElement } from '@ship-it-ui/graph-editor';
import { useState } from 'react';

const INITIAL: GraphElement[] = [
  { data: { id: 'a', label: 'Alpha', entityType: 'service' }, position: { x: 0, y: 0 } },
  { data: { id: 'b', label: 'Beta', entityType: 'service' }, position: { x: 200, y: 0 } },
  { data: { id: 'e-ab', source: 'a', target: 'b' } },
];

export default function Editor() {
  const [elements, setElements] = useState(INITIAL);
  return (
    <div style={{ width: '100%', height: 480 }}>
      <GraphEditorCanvas
        elements={elements}
        onConnect={({ id, source, target }) =>
          setElements((prev) => [...prev, { data: { id, source, target } }])
        }
        onNodeMove={(id, position) =>
          setElements((prev) => prev.map((el) => (el.data.id === id ? { ...el, position } : el)))
        }
      />
    </div>
  );
}
```

See the [docs site](https://ship-it-ops.github.io/ship-it-design/graph/editor) for the full API and live examples (toolbar slot, custom-node renderer, keyboard, undo/redo).

## Built-in behaviors

- Pan + zoom + mini-map (wraps `@ship-it-ui/shipit`'s `<GraphMinimap>` so the editor looks identical to the viewer).
- Click-to-select; pane-click to clear.
- Drag-to-connect; drag-to-move (`onNodeMove`).
- `Delete` / `Backspace` removes selection; arrow keys nudge (Shift = 32px); `Escape` clears; `⌘Z` / `⌘⇧Z` undo / redo.
- Theme-token sync via `@ship-it-ui/graph-tokens`.
- Built-in keyboard-accessible "+ Add" button when no `toolbar` is supplied.
- `role="application"` on the canvas root.

## Engine

React Flow (`@xyflow/react@^12`). The viewer (`<GraphCanvas>`) uses Cytoscape.js — same `elements[]` shape passes through via the round-trip-tested adapter (`toFlowElements` / `toCytoscapeElements`).
