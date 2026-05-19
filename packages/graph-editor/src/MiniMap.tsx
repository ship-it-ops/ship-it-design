'use client';

import { GraphMinimap } from '@ship-it-ui/shipit';
import { useNodes, useViewport, useStore, type Node } from '@xyflow/react';
import { useMemo } from 'react';

/**
 * Mini-map for `<GraphEditorCanvas>`. Wraps `<GraphMinimap>` (already shipped
 * by `@ship-it-ui/shipit`) and feeds it normalized node positions + viewport
 * coordinates from React Flow's internal store. We don't use RF's built-in
 * `<MiniMap>` — visual parity with the cytoscape viewer is a contract, so we
 * adopt the existing component.
 *
 * Padding is added to the bounding box so nodes near the corners aren't
 * pinned against the minimap edges. The viewport rectangle is computed in
 * the same normalized space.
 */

const PADDING = 60; // graph-coordinate padding around the bbox

function nodeBounds(nodes: Node[]): { x: number; y: number; width: number; height: number } | null {
  if (nodes.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    const { x, y } = node.position;
    const w = node.measured?.width ?? node.width ?? 52;
    const h = node.measured?.height ?? node.height ?? 52;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  }
  return {
    x: minX - PADDING,
    y: minY - PADDING,
    width: maxX - minX + 2 * PADDING,
    height: maxY - minY + 2 * PADDING,
  };
}

export interface GraphEditorMiniMapProps {
  /** Pixel width. Default 120. */
  width?: number;
  /** Pixel height. Default 72. */
  height?: number;
  className?: string;
}

export function GraphEditorMiniMap({
  width = 120,
  height = 72,
  className,
}: GraphEditorMiniMapProps) {
  const nodes = useNodes();
  const viewport = useViewport();
  const canvasSize = useStore((s) => ({ width: s.width, height: s.height }));

  const { points, viewportRect } = useMemo(() => {
    const bbox = nodeBounds(nodes);
    if (!bbox || bbox.width === 0 || bbox.height === 0) {
      return { points: [], viewportRect: undefined };
    }
    const norm = (x: number, y: number) => ({
      x: (x - bbox.x) / bbox.width,
      y: (y - bbox.y) / bbox.height,
    });
    const points = nodes.map((node) => {
      const center = {
        x: node.position.x + (node.measured?.width ?? node.width ?? 52) / 2,
        y: node.position.y + (node.measured?.height ?? node.height ?? 52) / 2,
      };
      return norm(center.x, center.y);
    });

    // Visible viewport in graph coordinates: (−viewport.x, −viewport.y)
    // through (−viewport.x + width/zoom, −viewport.y + height/zoom).
    const z = viewport.zoom || 1;
    const vp = {
      x: -viewport.x / z,
      y: -viewport.y / z,
      w: canvasSize.width / z,
      h: canvasSize.height / z,
    };
    const tl = norm(vp.x, vp.y);
    const viewportRect = {
      x: Math.max(0, Math.min(1, tl.x)),
      y: Math.max(0, Math.min(1, tl.y)),
      width: Math.max(0, Math.min(1 - tl.x, vp.w / bbox.width)),
      height: Math.max(0, Math.min(1 - tl.y, vp.h / bbox.height)),
    };
    return { points, viewportRect };
  }, [nodes, viewport, canvasSize.width, canvasSize.height]);

  return (
    <GraphMinimap
      points={points}
      viewport={viewportRect}
      width={width}
      height={height}
      className={className}
    />
  );
}
