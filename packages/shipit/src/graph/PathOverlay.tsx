import { forwardRef, type SVGAttributes } from 'react';

/**
 * PathOverlay — `<polyline>` highlighting a multi-hop path through the graph.
 * Renders inside a parent `<svg>`; takes the path as a list of `{ x, y }`
 * waypoints and draws a thicker, accent-tone line plus an optional shadow
 * stroke for legibility on busy backgrounds.
 */

export interface PathPoint {
  x: number;
  y: number;
}

export interface PathOverlayProps extends Omit<SVGAttributes<SVGGElement>, 'points'> {
  points: ReadonlyArray<PathPoint>;
  /** Stroke color. Defaults to the path-emphasis purple. */
  color?: string;
  /** Stroke width in px. Default 2.5. */
  width?: number;
  /** Halo shadow stroke for legibility. Default true. */
  halo?: boolean;
}

export const PathOverlay = forwardRef<SVGGElement, PathOverlayProps>(function PathOverlay(
  { points, color = 'var(--color-purple)', width = 2.5, halo = true, ...props },
  ref,
) {
  if (points.length < 2) return null;
  const coords = points.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <g ref={ref} {...props}>
      {halo && (
        <polyline
          points={coords}
          fill="none"
          stroke="var(--color-bg)"
          strokeWidth={width + 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.65}
        />
      )}
      <polyline
        points={coords}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
});

PathOverlay.displayName = 'PathOverlay';
