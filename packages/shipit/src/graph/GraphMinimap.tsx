'use client';

import { cn } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes } from 'react';


/**
 * GraphMinimap — miniature scatter of node positions with a translucent
 * rectangle marking the current viewport. Coordinates are normalized to
 * [0, 1] × [0, 1]; the minimap renders them inside its fixed pixel box.
 */

export interface MinimapPoint {
  /** Normalized x, 0..1. */
  x: number;
  /** Normalized y, 0..1. */
  y: number;
  /** Optional dot color. */
  color?: string;
}

export interface MinimapViewport {
  /** Top-left x, normalized 0..1. */
  x: number;
  /** Top-left y, normalized 0..1. */
  y: number;
  /** Width as a fraction of the minimap, 0..1. */
  width: number;
  /** Height as a fraction of the minimap, 0..1. */
  height: number;
}

export interface GraphMinimapProps extends HTMLAttributes<HTMLDivElement> {
  points: ReadonlyArray<MinimapPoint>;
  viewport?: MinimapViewport;
  /** Pixel width. Default 120. */
  width?: number;
  /** Pixel height. Default 72. */
  height?: number;
}

export const GraphMinimap = forwardRef<HTMLDivElement, GraphMinimapProps>(function GraphMinimap(
  { points, viewport, width = 120, height = 72, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Graph minimap"
      className={cn(
        'border-border bg-panel/85 relative rounded-md border p-1 backdrop-blur-[8px]',
        className,
      )}
      style={{ width, height }}
      {...props}
    >
      <div className="relative h-full w-full">
        {points.map((p, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute h-[2px] w-[2px] rounded-full"
            style={{
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              background: p.color ?? 'var(--color-accent)',
            }}
          />
        ))}
        {viewport && (
          <span
            aria-hidden
            data-testid="minimap-viewport"
            className="border-accent absolute rounded-[2px] border"
            style={{
              left: `${viewport.x * 100}%`,
              top: `${viewport.y * 100}%`,
              width: `${viewport.width * 100}%`,
              height: `${viewport.height * 100}%`,
              background: 'var(--color-accent-glow)',
            }}
          />
        )}
      </div>
    </div>
  );
});

GraphMinimap.displayName = 'GraphMinimap';
