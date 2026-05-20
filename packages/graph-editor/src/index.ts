/**
 * @ship-it-ui/graph-editor — graph-editing canvas for the Ship-It design
 * system. React Flow under the hood; same `elements[]` shape as
 * `@ship-it-ui/cytoscape` so consumers can swap viewer ↔ editor.
 *
 * Three layered exports:
 *   - {@link GraphEditorCanvas}  — the public component.
 *   - {@link GraphNodeShell}     — the canonical visual, exported so custom
 *                                  `renderNode` consumers can adopt the
 *                                  selection ring without re-rolling it.
 *   - {@link toFlowElements}, {@link toCytoscapeElements} — adapter for
 *                                  consumers who need to interop with
 *                                  `<GraphCanvas>` (Cytoscape) or persist
 *                                  the editor's output.
 */

export {
  GraphEditorCanvas,
  type EdgeRenderProps,
  type GraphEditorCanvasHandle,
  type GraphEditorCanvasProps,
  type NodeRenderProps,
} from './GraphEditorCanvas';

export {
  GraphNodeShell,
  type GraphNodeShellProps,
  type GraphNodeShellState,
} from './GraphNodeShell';

export { DefaultNode, type DefaultNodeData } from './DefaultNode';

export {
  toCytoscapeElements,
  toFlowElements,
  type FlowEdge,
  type FlowNode,
  type GraphElement,
  type GraphElementData,
  type GraphElementsSplit,
} from './adapter';

export { useGraphEditorTheme, type UseGraphEditorThemeReturn } from './theme-bridge';
