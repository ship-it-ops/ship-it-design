'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

import { GraphNodeShell } from './GraphNodeShell';

/**
 * Default React Flow node for `<GraphEditorCanvas>`. Wraps `<GraphNodeShell>`
 * (the canonical visual) and adds the four edge-attachment handles React Flow
 * needs to draw connections from. Handles are invisible by default — they
 * become discoverable on hover so the canvas doesn't look busier than the
 * viewer when idle.
 *
 * When the consumer passes their own `renderNode`, this default is replaced
 * via `nodeTypes`. The shell + handle helpers stay exported so a custom node
 * can still adopt the canonical selection ring without re-rolling it.
 */

export interface DefaultNodeData {
  /** Caption rendered below the square. */
  label?: string;
  /** Registered entity type. Drives glyph + color. */
  entityType?: string;
  /** Optional state override — `path` / `dim` show through to the shell. */
  state?: 'default' | 'hover' | 'selected' | 'path' | 'dim';
  [key: string]: unknown;
}

export function DefaultNode(props: NodeProps) {
  const data = (props.data ?? {}) as DefaultNodeData;
  const type = (data.entityType ?? 'service') as Parameters<typeof GraphNodeShell>[0]['type'];
  const state = props.selected ? 'selected' : (data.state ?? 'default');
  return (
    <>
      <Handle type="target" position={Position.Top} className="ship-graph-handle" />
      <Handle type="target" position={Position.Left} className="ship-graph-handle" />
      <GraphNodeShell type={type} state={state} label={data.label} />
      <Handle type="source" position={Position.Bottom} className="ship-graph-handle" />
      <Handle type="source" position={Position.Right} className="ship-graph-handle" />
    </>
  );
}
