import { forwardRef, type SVGAttributes } from 'react';

/**
 * GraphEdge — SVG `<line>` (or `<path>` if curve points are provided) rendered
 * with one of four canonical styles. Place inside a parent `<svg>`.
 *
 * For curves, pass `curve={{ cx, cy }}` — the edge becomes `M x1,y1 Q cx,cy x2,y2`.
 * Pass `arrowheadId="arr-accent"` and define a matching `<defs><marker id="arr-accent">…</marker></defs>`
 * once in your SVG to enable arrows.
 */

export type GraphEdgeStyle = 'solid' | 'dashed' | 'highlighted' | 'dim';

export interface GraphEdgeProps extends Omit<SVGAttributes<SVGElement>, 'd'> {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Optional Q-curve control point. */
  curve?: { cx: number; cy: number };
  edgeStyle?: GraphEdgeStyle;
  /** Stroke color override. Defaults to the style's tone. */
  color?: string;
  /** Marker id for an arrowhead. */
  arrowheadId?: string;
}

const styleProps: Record<
  GraphEdgeStyle,
  { stroke: string; strokeWidth: number; strokeDasharray?: string; opacity?: number }
> = {
  solid: { stroke: 'var(--color-accent)', strokeWidth: 1.5 },
  dashed: { stroke: 'var(--color-accent)', strokeWidth: 1.5, strokeDasharray: '4 3' },
  highlighted: { stroke: 'var(--color-purple)', strokeWidth: 2.5 },
  dim: { stroke: 'var(--color-text-dim)', strokeWidth: 1, opacity: 0.4 },
};

export const GraphEdge = forwardRef<SVGElement, GraphEdgeProps>(function GraphEdge(
  { x1, y1, x2, y2, curve, edgeStyle = 'solid', color, arrowheadId, ...props },
  ref,
) {
  const base = styleProps[edgeStyle];
  const stroke = color ?? base.stroke;
  const sharedProps = {
    fill: 'none' as const,
    stroke,
    strokeWidth: base.strokeWidth,
    strokeDasharray: base.strokeDasharray,
    opacity: base.opacity,
    markerEnd: arrowheadId ? `url(#${arrowheadId})` : undefined,
    ...props,
  };
  if (curve) {
    return (
      <path
        ref={ref as React.Ref<SVGPathElement>}
        d={`M${x1},${y1} Q${curve.cx},${curve.cy} ${x2},${y2}`}
        {...sharedProps}
      />
    );
  }
  return (
    <line
      ref={ref as React.Ref<SVGLineElement>}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      {...sharedProps}
    />
  );
});
