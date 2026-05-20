/**
 * Adapter between Cytoscape's flat `ElementDefinition[]` shape and React Flow's
 * split `{ nodes, edges }` arrays. The contract:
 *
 *   - Position round-trips lossless. `{ x, y }` in equals `{ x, y }` out.
 *   - Edge identity is `data.id`; if absent, an `${source}->${target}` id is
 *     synthesised. Round-trip preserves synthesised ids verbatim.
 *   - Every key inside `data` (other than `id`/`source`/`target`) passes
 *     through untouched in both directions — this is the consumer's domain
 *     bag, the adapter is not allowed to interpret it.
 *   - Cytoscape `classes` (space-separated string) ↔ React Flow `className`.
 *
 * Untested edge cases that fall through to "do nothing surprising":
 *   - Elements without `data.id` on the node side are dropped (Cytoscape
 *     auto-generates ids; we'd lose track of identity across round-trips).
 *   - Unknown top-level keys on the input element are preserved on a
 *     `_extra` field so we never silently lose data.
 */

import type { Edge as RFEdge, Node as RFNode } from '@xyflow/react';

export interface GraphElementData {
  id?: string;
  source?: string;
  target?: string;
  [key: string]: unknown;
}

export interface GraphElement {
  data: GraphElementData;
  position?: { x: number; y: number };
  classes?: string;
  /** Free-form metadata preserved across round-trip (e.g., `grabbable`). */
  [extraKey: string]: unknown;
}

export interface GraphElementsSplit {
  nodes: RFNode[];
  edges: RFEdge[];
}

const RF_NODE_RESERVED = new Set<string>(['_extra']);
const RF_EDGE_RESERVED = new Set<string>(['_extra']);

function pickDataPassthrough(
  data: GraphElementData,
  exclude: ReadonlyArray<string>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(data)) {
    if (exclude.includes(key)) continue;
    out[key] = data[key];
  }
  return out;
}

function pickElementExtras(element: GraphElement): {
  extras: Record<string, unknown> | undefined;
  hasExtras: boolean;
} {
  const extras: Record<string, unknown> = {};
  let hasExtras = false;
  for (const key of Object.keys(element)) {
    if (key === 'data' || key === 'position' || key === 'classes') continue;
    extras[key] = element[key];
    hasExtras = true;
  }
  return { extras: hasExtras ? extras : undefined, hasExtras };
}

/**
 * Partition a Cytoscape `elements[]` array into React Flow `{ nodes, edges }`.
 * An element is an edge if `data.source` is set; otherwise a node.
 */
export function toFlowElements(elements: ReadonlyArray<GraphElement>): GraphElementsSplit {
  const nodes: RFNode[] = [];
  const edges: RFEdge[] = [];

  for (const el of elements) {
    const data = el.data ?? {};
    const isEdge = typeof data.source === 'string' && typeof data.target === 'string';
    if (isEdge) {
      const id = typeof data.id === 'string' ? data.id : `${data.source}->${data.target}`;
      const { extras, hasExtras } = pickElementExtras(el);
      const edge: RFEdge = {
        id,
        source: data.source as string,
        target: data.target as string,
        data: {
          ...pickDataPassthrough(data, ['id', 'source', 'target']),
          ...(hasExtras ? { _extra: extras } : {}),
        },
      };
      if (el.classes) edge.className = el.classes;
      edges.push(edge);
    } else {
      const id = data.id;
      if (typeof id !== 'string') continue; // Identity-less nodes dropped — see file header.
      const { extras, hasExtras } = pickElementExtras(el);
      const node: RFNode = {
        id,
        position: el.position ?? { x: 0, y: 0 },
        data: {
          ...pickDataPassthrough(data, ['id']),
          ...(hasExtras ? { _extra: extras } : {}),
        },
      };
      if (el.classes) node.className = el.classes;
      nodes.push(node);
    }
  }

  return { nodes, edges };
}

/**
 * Inverse of `toFlowElements`. Nodes are emitted before edges to match
 * Cytoscape's expectation (an edge's source/target nodes must exist by the
 * time the engine sees the edge).
 */
export function toCytoscapeElements(split: GraphElementsSplit): GraphElement[] {
  const out: GraphElement[] = [];

  for (const node of split.nodes) {
    const data = (node.data ?? {}) as Record<string, unknown>;
    const passthrough = { ...data };
    const extras = passthrough._extra as Record<string, unknown> | undefined;
    delete passthrough._extra;
    const element: GraphElement = {
      data: { id: node.id, ...passthrough },
      position: { x: node.position.x, y: node.position.y },
    };
    if (node.className) element.classes = node.className;
    if (extras) {
      for (const key of Object.keys(extras)) {
        if (key === 'data' || key === 'position' || key === 'classes') continue;
        element[key] = extras[key];
      }
    }
    out.push(element);
  }

  for (const edge of split.edges) {
    const data = (edge.data ?? {}) as Record<string, unknown>;
    const passthrough = { ...data };
    const extras = passthrough._extra as Record<string, unknown> | undefined;
    delete passthrough._extra;
    const element: GraphElement = {
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        ...passthrough,
      },
    };
    if (edge.className) element.classes = edge.className;
    if (extras) {
      for (const key of Object.keys(extras)) {
        if (key === 'data' || key === 'position' || key === 'classes') continue;
        element[key] = extras[key];
      }
    }
    out.push(element);
  }

  return out;
}

// Re-export for consumers writing their own renderers, so they don't need to
// pull `@xyflow/react` types directly when they only need the node/edge shape.
export type { RFNode as FlowNode, RFEdge as FlowEdge };

// Cytoscape-side reserved keys exposed for tests that want to assert the
// passthrough excludes them.
export const _RF_NODE_RESERVED = RF_NODE_RESERVED;
export const _RF_EDGE_RESERVED = RF_EDGE_RESERVED;
