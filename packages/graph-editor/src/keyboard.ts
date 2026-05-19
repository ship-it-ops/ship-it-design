'use client';

import type { Edge, Node, OnEdgesChange, OnNodesChange } from '@xyflow/react';
import { useCallback, type KeyboardEvent as ReactKeyboardEvent } from 'react';

/**
 * Keyboard handler factory for `<GraphEditorCanvas>`. Returns a single
 * `onKeyDown` handler that the canvas wires to its `role=application` root.
 *
 * Wires:
 *   - `Delete` / `Backspace` — fires `onNodeDelete` / `onEdgeDelete` for each
 *     selected entity, then mutates internal RF state via the supplied
 *     change handlers.
 *   - `Escape` — clears selection and fires `onClearSelection`.
 *   - Arrow keys — nudge selected nodes by 8px (Shift = 32px) and fire
 *     `onNodeMove` per affected node.
 *   - `⌘Z` / `Ctrl+Z` — calls `undo` callback (history wiring in the canvas).
 *   - `⌘⇧Z` / `Ctrl+Shift+Z` — calls `redo` callback.
 *
 * The handler is attached to the canvas root (`role=application`), not to
 * `document`, so a graph hosted inside a modal doesn't swallow keys from
 * outside the canvas.
 */

const NUDGE_BASE = 8;
const NUDGE_LARGE = 32;

export interface KeyboardHandlerOptions {
  /** Current internal nodes (for reading selection state). */
  nodes: Node[];
  /** Current internal edges (for reading selection state). */
  edges: Edge[];
  /** RF's onNodesChange — mutates internal state (delete / move). */
  onNodesChange: OnNodesChange;
  /** RF's onEdgesChange — mutates internal state (delete). */
  onEdgesChange: OnEdgesChange;

  /** Consumer-facing events. All optional. */
  onNodeDelete?: (nodeId: string) => void;
  onEdgeDelete?: (edgeId: string) => void;
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  onClearSelection?: () => void;
  /** Called when ⌘Z / Ctrl+Z is pressed. */
  undo?: () => void;
  /** Called when ⌘⇧Z / Ctrl+Shift+Z is pressed. */
  redo?: () => void;
}

export function useGraphEditorKeyboard({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeDelete,
  onEdgeDelete,
  onNodeMove,
  onClearSelection,
  undo,
  redo,
}: KeyboardHandlerOptions) {
  return useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const key = event.key;
      const meta = event.metaKey || event.ctrlKey;

      // Don't hijack keys when the user is typing inside an inline editor or
      // other text field that bubbled into the canvas root.
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        const editable = target.isContentEditable;
        if (editable || tag === 'INPUT' || tag === 'TEXTAREA') return;
      }

      if (meta && (key === 'z' || key === 'Z')) {
        event.preventDefault();
        if (event.shiftKey) redo?.();
        else undo?.();
        return;
      }

      if (key === 'Delete' || key === 'Backspace') {
        const selectedNodes = nodes.filter((n) => n.selected);
        const selectedEdges = edges.filter((e) => e.selected);
        if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
        event.preventDefault();
        for (const n of selectedNodes) onNodeDelete?.(n.id);
        for (const e of selectedEdges) onEdgeDelete?.(e.id);
        if (selectedNodes.length > 0) {
          onNodesChange(selectedNodes.map((n) => ({ type: 'remove', id: n.id })));
        }
        if (selectedEdges.length > 0) {
          onEdgesChange(selectedEdges.map((e) => ({ type: 'remove', id: e.id })));
        }
        return;
      }

      if (key === 'Escape') {
        const selectedNodes = nodes.filter((n) => n.selected);
        const selectedEdges = edges.filter((e) => e.selected);
        if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
        event.preventDefault();
        onNodesChange(selectedNodes.map((n) => ({ type: 'select', id: n.id, selected: false })));
        onEdgesChange(selectedEdges.map((e) => ({ type: 'select', id: e.id, selected: false })));
        onClearSelection?.();
        return;
      }

      const dx = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : 0;
      const dy = key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : 0;
      if (dx === 0 && dy === 0) return;
      const selectedNodes = nodes.filter((n) => n.selected);
      if (selectedNodes.length === 0) return;
      event.preventDefault();
      const step = event.shiftKey ? NUDGE_LARGE : NUDGE_BASE;
      const changes = selectedNodes.map((n) => {
        const nextPos = { x: n.position.x + dx * step, y: n.position.y + dy * step };
        onNodeMove?.(n.id, nextPos);
        return {
          type: 'position' as const,
          id: n.id,
          position: nextPos,
          dragging: false,
        };
      });
      onNodesChange(changes);
    },
    [
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onNodeDelete,
      onEdgeDelete,
      onNodeMove,
      onClearSelection,
      undo,
      redo,
    ],
  );
}
