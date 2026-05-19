'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeChange,
  type NodeTypes,
  type OnConnect,
  type OnNodesChange,
  type ReactFlowProps,
} from '@xyflow/react';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import './styles.css';

import { toFlowElements, type GraphElement, type GraphElementsSplit } from './adapter';
import { DefaultNode } from './DefaultNode';
import { useHistory, type Command } from './history';
import { useGraphEditorKeyboard } from './keyboard';
import { GraphEditorMiniMap } from './MiniMap';
import { useGraphEditorTheme } from './theme-bridge';

/**
 * `<GraphEditorCanvas>` — the editing analog of `<GraphCanvas>`. Same
 * `elements[]` shape; React Flow under the hood. Consumers wire editing
 * events to their domain model; the canvas does not know about ShipIt-AI's
 * "node types" / "schemas".
 *
 * Built-in behaviors:
 *   - Pan + zoom (React Flow).
 *   - Click to select; pane click to clear.
 *   - Drag from a node handle to another node to connect.
 *   - Drag a node to move it.
 *   - Delete / Backspace to remove selected; Esc to clear selection; arrows
 *     to nudge selected nodes (Shift = 32px steps).
 *   - ⌘Z / ⌘⇧Z for undo / redo, bounded by `historySize` (default 50).
 *   - Built-in "+ Add" button when `toolbar` is omitted.
 *   - Mini-map (wraps `<GraphMinimap>` from `@ship-it-ui/shipit`, fed live
 *     viewport + node positions).
 *   - Theme-token sync — repaints React Flow's CSS variables from the
 *     Ship-It token palette on mount and on every `data-theme` flip.
 *
 * Undo policy: undo mutates internal RF state directly AND fires the
 * relevant consumer event in the reverse direction (e.g., undoing a
 * `delete-edge` calls `onConnect`). Node `add` / `delete` round-trips also
 * fire the matching consumer event; consumers persisting via these events
 * will see un-undone state in their store and should treat the canvas as
 * the editing source of truth during a session.
 */

export interface NodeRenderProps {
  id: string;
  data: Record<string, unknown>;
  selected: boolean;
  position: { x: number; y: number };
}

export interface EdgeRenderProps {
  id: string;
  source: string;
  target: string;
  data: Record<string, unknown>;
  selected: boolean;
}

export interface GraphEditorCanvasProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'children'
> {
  /** Same shape as `<GraphCanvas>`'s `elements`. */
  elements: GraphElement[];

  /* Editing events.
   *
   * `id` on `onNodeAdd` / `onConnect` is always present and authoritative —
   * the canvas generates it on user-initiated adds and replays the original
   * id during undo of a delete, so consumers can use it directly as the
   * identity in their persisted store.
   */
  onNodeAdd?: (node: {
    id: string;
    position: { x: number; y: number };
    /** Empty on fresh adds; populated with the prior node's data on undo. */
    data?: Record<string, unknown>;
  }) => void;
  onConnect?: (edge: { id: string; source: string; target: string }) => void;
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeDelete?: (nodeId: string) => void;
  onEdgeDelete?: (edgeId: string) => void;

  /* Selection (matches `<GraphCanvas>`'s `onSelect` shape). */
  onSelect?: (target: { kind: 'node' | 'edge'; id: string }) => void;
  onClearSelection?: () => void;

  /* Render slots. */
  renderNode?: (props: NodeRenderProps) => ReactNode;
  renderEdge?: (props: EdgeRenderProps) => ReactNode;
  toolbar?: ReactNode;
  inspector?: ReactNode;

  /* Behaviors. */
  panZoom?: boolean;
  /** 0 disables undo/redo. Default 50. */
  historySize?: number;
  /** Show the floating mini-map (bottom-right). Default true. */
  miniMap?: boolean;
  /** Show a faint dot grid in the background. Default 'none'. */
  background?: 'none' | 'dots';

  /** Accessible label for the canvas root. */
  'aria-label'?: string;
}

export interface GraphEditorCanvasHandle {
  /** Re-read tokens and re-paint the canvas CSS variables. */
  refreshStyles: () => void;
  /** Programmatic undo. */
  undo: () => void;
  /** Programmatic redo. */
  redo: () => void;
}

/** Inner component — assumes a `<ReactFlowProvider>` ancestor. */
const GraphEditorCanvasInner = forwardRef<GraphEditorCanvasHandle, GraphEditorCanvasProps>(
  function GraphEditorCanvasInner(
    {
      elements,
      onNodeAdd,
      onConnect,
      onNodeMove,
      onNodeDelete,
      onEdgeDelete,
      onSelect,
      onClearSelection,
      renderNode,
      renderEdge,
      toolbar,
      inspector,
      panZoom = true,
      historySize = 50,
      miniMap = true,
      background = 'none',
      className,
      'aria-label': ariaLabel = 'Graph editor',
      ...rest
    },
    forwardedRef,
  ) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { refresh } = useGraphEditorTheme(wrapperRef);
    const { getViewport, screenToFlowPosition } = useReactFlow();

    // `elements` is read once as the initial value. The canvas is the source
    // of truth for editing state from this point on; consumers observe via
    // the event callbacks (`onConnect`, `onNodeMove`, etc.) and persist as
    // they see fit. To load a different graph, remount via a `key` prop.
    //
    // Earlier revisions re-synced state on every `elements` change, but that
    // clobbered the undo history any time a consumer pushed state back from
    // an event (the common pattern shown in the docs examples).
    const initialRef = useRef<GraphElementsSplit | null>(null);
    if (initialRef.current === null) initialRef.current = toFlowElements(elements);
    const [nodes, setNodes, baseOnNodesChange] = useNodesState(initialRef.current.nodes);
    const [edges, setEdges, baseOnEdgesChange] = useEdgesState(initialRef.current.edges);

    const history = useHistory({ maxSize: historySize });

    const nodeTypes = useMemo<NodeTypes>(() => {
      if (!renderNode) return { default: DefaultNode };
      const ConsumerNode = (props: {
        id: string;
        data: unknown;
        selected?: boolean;
        positionAbsoluteX?: number;
        positionAbsoluteY?: number;
      }) => (
        <>
          {renderNode({
            id: props.id,
            data: (props.data ?? {}) as Record<string, unknown>,
            selected: Boolean(props.selected),
            position: { x: props.positionAbsoluteX ?? 0, y: props.positionAbsoluteY ?? 0 },
          })}
        </>
      );
      return { default: ConsumerNode as unknown as NodeTypes['default'] };
    }, [renderNode]);

    const edgeTypes = useMemo<EdgeTypes | undefined>(() => {
      if (!renderEdge) return undefined;
      const ConsumerEdge = (props: {
        id: string;
        source: string;
        target: string;
        data: unknown;
        selected?: boolean;
      }) => (
        <>
          {renderEdge({
            id: props.id,
            source: props.source,
            target: props.target,
            data: (props.data ?? {}) as Record<string, unknown>,
            selected: Boolean(props.selected),
          })}
        </>
      );
      return { default: ConsumerEdge as unknown as EdgeTypes['default'] };
    }, [renderEdge]);

    const handleConnect = useCallback<OnConnect>(
      (connection: Connection) => {
        if (!connection.source || !connection.target) return;
        const id = `e-${connection.source}-${connection.target}-${Date.now()}`;
        const edge: Edge = {
          id,
          source: connection.source,
          target: connection.target,
        };
        setEdges((prev) => [...prev, edge]);
        history.push({ kind: 'add-edge', edge });
        onConnect?.({ id, source: connection.source, target: connection.target });
      },
      [setEdges, history, onConnect],
    );

    // Track in-progress drags so the history stack captures the position
    // delta, not each intermediate frame. `dragging=true` events are the
    // drag-start; `dragging=false` is drag-end.
    const dragStartPositions = useRef(new Map<string, { x: number; y: number }>());

    const handleNodesChange = useCallback<OnNodesChange>(
      (changes: NodeChange[]) => {
        baseOnNodesChange(changes);
        for (const change of changes) {
          if (change.type !== 'position') continue;
          if (change.dragging === true) {
            // First frame of a drag — capture origin if we don't have one.
            if (!dragStartPositions.current.has(change.id)) {
              const node = nodes.find((n) => n.id === change.id);
              if (node) dragStartPositions.current.set(change.id, { ...node.position });
            }
            continue;
          }
          if (change.dragging === false && change.position) {
            const from = dragStartPositions.current.get(change.id);
            dragStartPositions.current.delete(change.id);
            if (from) {
              history.push({
                kind: 'move-node',
                id: change.id,
                from,
                to: change.position,
              });
            }
            onNodeMove?.(change.id, change.position);
          }
        }
      },
      [baseOnNodesChange, history, nodes, onNodeMove],
    );

    const handleEdgesChange = baseOnEdgesChange;

    const handleNodeClick = useCallback<NonNullable<ReactFlowProps['onNodeClick']>>(
      (_event, node: Node) => {
        onSelect?.({ kind: 'node', id: node.id });
      },
      [onSelect],
    );

    const handleEdgeClick = useCallback<NonNullable<ReactFlowProps['onEdgeClick']>>(
      (_event, edge: Edge) => {
        onSelect?.({ kind: 'edge', id: edge.id });
      },
      [onSelect],
    );

    const handlePaneClick = useCallback<NonNullable<ReactFlowProps['onPaneClick']>>(() => {
      onClearSelection?.();
    }, [onClearSelection]);

    // Forward-direction delete handler. Combined node + edge so we never
    // record an incident edge in *both* the node-delete batch and the
    // standalone edge-delete list — undo would re-add it twice otherwise.
    const deleteSelected = useCallback(() => {
      const selectedNodes = nodes.filter((n) => n.selected);
      const selectedEdges = edges.filter((e) => e.selected);
      if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

      const removedNodeIds = new Set(selectedNodes.map((n) => n.id));
      // Edges that disappear *because* their endpoint is being removed. These
      // ride along inside the `delete-node` command and must not also be
      // recorded as standalone `delete-edge` commands.
      const incidentByNodeId = new Map<string, Edge[]>();
      const incidentEdgeIds = new Set<string>();
      for (const node of selectedNodes) {
        const incident = edges.filter((e) => e.source === node.id || e.target === node.id);
        incidentByNodeId.set(node.id, incident);
        for (const e of incident) incidentEdgeIds.add(e.id);
      }

      // History — nodes first (so undo re-adds them before their edges).
      for (const node of selectedNodes) {
        history.push({
          kind: 'delete-node',
          node,
          incidentEdges: incidentByNodeId.get(node.id) ?? [],
        });
      }
      for (const edge of selectedEdges) {
        if (incidentEdgeIds.has(edge.id)) continue; // already captured above
        history.push({ kind: 'delete-edge', edge });
      }

      // Consumer events — same dedup.
      for (const node of selectedNodes) onNodeDelete?.(node.id);
      for (const edge of selectedEdges) {
        if (incidentEdgeIds.has(edge.id)) continue;
        onEdgeDelete?.(edge.id);
      }

      // Internal RF state.
      if (removedNodeIds.size > 0) {
        setNodes((prev) => prev.filter((n) => !removedNodeIds.has(n.id)));
      }
      const droppedEdgeIds = new Set<string>(incidentEdgeIds);
      for (const e of selectedEdges) droppedEdgeIds.add(e.id);
      if (droppedEdgeIds.size > 0) {
        setEdges((prev) => prev.filter((e) => !droppedEdgeIds.has(e.id)));
      }
    }, [edges, history, nodes, onEdgeDelete, onNodeDelete, setEdges, setNodes]);

    // Undo / redo. When we apply a command (forward or reverse), we mutate
    // internal RF state directly and re-emit the matching consumer event so
    // the consumer's persistence layer can stay in sync.
    const applyCommand = useCallback(
      (command: Command) => {
        switch (command.kind) {
          case 'add-node':
            setNodes((prev) => [...prev, command.node]);
            // Replay carries the full node so the consumer can restore the
            // exact identity + data they previously persisted. Fresh adds
            // (from `handleAddClick`) pass an empty `data` bag.
            onNodeAdd?.({
              id: command.node.id,
              position: command.node.position,
              data: (command.node.data ?? {}) as Record<string, unknown>,
            });
            return;
          case 'delete-node': {
            const removedId = command.node.id;
            setNodes((prev) => prev.filter((n) => n.id !== removedId));
            const incidentIds = new Set(command.incidentEdges.map((e) => e.id));
            setEdges((prev) => prev.filter((e) => !incidentIds.has(e.id)));
            onNodeDelete?.(removedId);
            return;
          }
          case 'add-edge':
            setEdges((prev) => [...prev, command.edge]);
            onConnect?.({
              id: command.edge.id,
              source: command.edge.source,
              target: command.edge.target,
            });
            return;
          case 'delete-edge':
            setEdges((prev) => prev.filter((e) => e.id !== command.edge.id));
            onEdgeDelete?.(command.edge.id);
            return;
          case 'move-node':
            setNodes((prev) =>
              prev.map((n) => (n.id === command.id ? { ...n, position: command.to } : n)),
            );
            onNodeMove?.(command.id, command.to);
            return;
          case 'batch':
            for (const child of command.commands) applyCommand(child);
            return;
        }
      },
      [onConnect, onEdgeDelete, onNodeAdd, onNodeDelete, onNodeMove, setEdges, setNodes],
    );

    const undo = useCallback(() => {
      const inverse = history.undo();
      if (inverse) applyCommand(inverse);
    }, [history, applyCommand]);

    const redo = useCallback(() => {
      const cmd = history.redo();
      if (cmd) applyCommand(cmd);
    }, [history, applyCommand]);

    // Keyboard handler — owns Delete/Arrow/Esc/⌘Z. The keyboard hook reports
    // selection-based removals via `onNodesChange` + `onEdgesChange` in two
    // separate calls within a single keypress. We re-route the first batch
    // through `deleteSelected` (which dedupes node + incident-edge
    // bookkeeping) and let the ref short-circuit the second call so we don't
    // double-fire history pushes.
    const deleteFlushedRef = useRef(false);
    const onKeyDown = useGraphEditorKeyboard({
      nodes,
      edges,
      onNodesChange: (changes) => {
        const removals = changes.filter((c) => c.type === 'remove');
        if (removals.length > 0) {
          if (!deleteFlushedRef.current) {
            deleteSelected();
            deleteFlushedRef.current = true;
            // Reset after the current microtask so the next Delete keypress
            // starts fresh.
            queueMicrotask(() => {
              deleteFlushedRef.current = false;
            });
          }
          const remaining = changes.filter((c) => c.type !== 'remove');
          if (remaining.length > 0) baseOnNodesChange(remaining);
        } else {
          baseOnNodesChange(changes);
        }
      },
      onEdgesChange: (changes) => {
        const removals = changes.filter((c) => c.type === 'remove');
        if (removals.length > 0) {
          if (!deleteFlushedRef.current) {
            deleteSelected();
            deleteFlushedRef.current = true;
            queueMicrotask(() => {
              deleteFlushedRef.current = false;
            });
          }
          const remaining = changes.filter((c) => c.type !== 'remove');
          if (remaining.length > 0) baseOnEdgesChange(remaining);
        } else {
          baseOnEdgesChange(changes);
        }
      },
      // Don't double-fire delete events — deleteSelected*() already does that.
      onNodeDelete: undefined,
      onEdgeDelete: undefined,
      onNodeMove,
      onArrowNudge: (id, from, to) => {
        history.push({ kind: 'move-node', id, from, to });
      },
      onClearSelection,
      undo,
      redo,
    });

    // Built-in "+ Add" button. Pressed → fires `onNodeAdd` with the current
    // viewport center, expressed in graph (flow) coordinates so the consumer
    // can drop a new node where the user is looking. Suppressed when the
    // consumer supplies their own toolbar.
    const handleAddClick = useCallback(() => {
      const vp = getViewport();
      const wrapper = wrapperRef.current;
      const rect = wrapper?.getBoundingClientRect();
      const position = rect
        ? screenToFlowPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          })
        : { x: -vp.x, y: -vp.y };
      // The canvas owns the id so subsequent events (delete, undo) carry the
      // same identity the consumer just persisted.
      const id = `node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      onNodeAdd?.({ id, position, data: {} });
    }, [getViewport, screenToFlowPosition, onNodeAdd]);

    useImperativeHandle(forwardedRef, () => ({ refreshStyles: refresh, undo, redo }), [
      refresh,
      undo,
      redo,
    ]);

    return (
      // `role="application"` is the ARIA-recommended container for a custom
      // widget that owns its keyboard semantics — the canvas implements its
      // own arrow-nudge / Delete / Escape / ⌘Z bindings. eslint-jsx-a11y
      // doesn't recognize `application` as interactive, so the rules below
      // are disabled for this single element.
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
      <div
        ref={wrapperRef}
        role="application"
        aria-label={ariaLabel}
        tabIndex={0}
        data-background={background}
        className={['ship-graph-editor', className].filter(Boolean).join(' ')}
        onKeyDown={onKeyDown}
        {...rest}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onPaneClick={handlePaneClick}
          panOnDrag={panZoom}
          zoomOnScroll={panZoom}
          zoomOnPinch={panZoom}
          zoomOnDoubleClick={false}
          // We own keyboard via onKeyDown above — disable RF's defaults so
          // they don't double-fire alongside ours.
          deleteKeyCode={null}
          proOptions={{ hideAttribution: true }}
          fitView
        >
          {background === 'dots' && (
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          )}
        </ReactFlow>

        {/* Toolbar slot (top-left). Built-in "+ Add" rendered when none provided. */}
        {toolbar ? (
          <div className="absolute top-4 left-4 z-10">{toolbar}</div>
        ) : (
          onNodeAdd && (
            <div className="absolute top-4 left-4 z-10">
              <button
                type="button"
                onClick={handleAddClick}
                aria-label="Add node"
                className="bg-panel border-border text-text hover:bg-panel-2 focus-visible:ring-accent-dim flex h-8 items-center gap-1 rounded-md border px-3 text-[12px] font-medium transition-colors outline-none focus-visible:ring-[3px]"
              >
                <IconGlyph name="add" size={14} />
                <span>Add</span>
              </button>
            </div>
          )
        )}

        {/* Inspector slot (top-right). */}
        {inspector && <div className="absolute top-4 right-4 z-10">{inspector}</div>}

        {/* Mini-map (bottom-right). */}
        {miniMap && (
          <div className="absolute right-4 bottom-4 z-10">
            <GraphEditorMiniMap />
          </div>
        )}
      </div>
      /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
    );
  },
);

/**
 * Public component. Wraps the inner canvas in a `<ReactFlowProvider>` so
 * consumers don't need to set one up themselves — and so `useReactFlow`
 * hooks inside the inner tree work even when the canvas is rendered
 * standalone.
 */
export const GraphEditorCanvas = forwardRef<GraphEditorCanvasHandle, GraphEditorCanvasProps>(
  function GraphEditorCanvas(props, ref) {
    return (
      <ReactFlowProvider>
        <GraphEditorCanvasInner {...props} ref={ref} />
      </ReactFlowProvider>
    );
  },
);

GraphEditorCanvas.displayName = 'GraphEditorCanvas';
