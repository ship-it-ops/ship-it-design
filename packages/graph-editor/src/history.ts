'use client';

import type { Edge, Node } from '@xyflow/react';
import { useCallback, useMemo, useRef } from 'react';

/**
 * Editor history stack. Every user action pushes a `Command`; `undo()` pops
 * the top and returns its inverse for the caller to apply. The caller is
 * responsible for translating the inverse into the right internal-state
 * mutation + consumer-callback combination — `history.ts` is engine-agnostic.
 *
 * The stack is bounded by `maxSize`. Pushing past the cap drops the oldest
 * entry (FIFO eviction). A new push after `undo()` truncates any redo
 * entries — same as every editor.
 */

export type Command =
  | { kind: 'add-node'; node: Node }
  | { kind: 'delete-node'; node: Node; incidentEdges: Edge[] }
  | { kind: 'add-edge'; edge: Edge }
  | { kind: 'delete-edge'; edge: Edge }
  | { kind: 'move-node'; id: string; from: { x: number; y: number }; to: { x: number; y: number } }
  | { kind: 'batch'; commands: Command[] };

export function inverseOf(command: Command): Command {
  switch (command.kind) {
    case 'add-node':
      return { kind: 'delete-node', node: command.node, incidentEdges: [] };
    case 'delete-node':
      // Re-introducing a deleted node also restores any edges that were
      // dropped with it. The batch shape lets a single undo replay both.
      return {
        kind: 'batch',
        commands: [
          { kind: 'add-node', node: command.node },
          ...command.incidentEdges.map<Command>((edge) => ({ kind: 'add-edge', edge })),
        ],
      };
    case 'add-edge':
      return { kind: 'delete-edge', edge: command.edge };
    case 'delete-edge':
      return { kind: 'add-edge', edge: command.edge };
    case 'move-node':
      return { kind: 'move-node', id: command.id, from: command.to, to: command.from };
    case 'batch':
      return { kind: 'batch', commands: command.commands.map(inverseOf).reverse() };
  }
}

export interface UseHistoryOptions {
  /** Cap on the undo stack length. 0 disables history entirely. */
  maxSize?: number;
}

export interface UseHistoryReturn {
  /** Push a command onto the undo stack. Truncates pending redo. */
  push: (cmd: Command) => void;
  /** Pop the undo-stack top and return its inverse, or null if empty. */
  undo: () => Command | null;
  /** Pop the redo-stack top and return its inverse, or null if empty. */
  redo: () => Command | null;
  /** Clear both stacks (used when a fresh `elements` prop arrives). */
  reset: () => void;
  /** Read-only count snapshot for inspection. */
  size: () => { undo: number; redo: number };
}

export function useHistory({ maxSize = 50 }: UseHistoryOptions = {}): UseHistoryReturn {
  // Refs rather than state — pushing a command shouldn't trigger a render.
  // The canvas re-renders for its own reasons when the underlying RF state
  // changes; history is bookkeeping.
  const undoStack = useRef<Command[]>([]);
  const redoStack = useRef<Command[]>([]);

  const push = useCallback(
    (cmd: Command) => {
      if (maxSize <= 0) return;
      undoStack.current.push(cmd);
      if (undoStack.current.length > maxSize) undoStack.current.shift();
      // Any new edit invalidates the redo path.
      redoStack.current.length = 0;
    },
    [maxSize],
  );

  const undo = useCallback(() => {
    if (maxSize <= 0) return null;
    const cmd = undoStack.current.pop();
    if (!cmd) return null;
    redoStack.current.push(cmd);
    return inverseOf(cmd);
  }, [maxSize]);

  const redo = useCallback(() => {
    if (maxSize <= 0) return null;
    const cmd = redoStack.current.pop();
    if (!cmd) return null;
    undoStack.current.push(cmd);
    return cmd;
  }, [maxSize]);

  const reset = useCallback(() => {
    undoStack.current.length = 0;
    redoStack.current.length = 0;
  }, []);

  const size = useCallback(
    () => ({ undo: undoStack.current.length, redo: redoStack.current.length }),
    [],
  );

  // Memoize the wrapper so `useEffect` deps that include this object don't
  // fire on every render. The individual fns are already `useCallback`-stable.
  return useMemo(() => ({ push, undo, redo, reset, size }), [push, undo, redo, reset, size]);
}
