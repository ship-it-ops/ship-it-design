'use client';

import { DynamicIconGlyph } from '@ship-it-ui/icons';
import { getEntityTypeMeta, type EntityType } from '@ship-it-ui/shipit';
import { cn } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Visual shell used by the editor's default node renderer. Exported so
 * consumers writing custom `renderNode` can opt back into the selection ring
 * / glow without re-implementing the canonical visual.
 *
 * Mirrors `<GraphNode>` from `@ship-it-ui/shipit/graph` (52px round-rectangle,
 * entity-type color, glow, label below). Visual parity with the cytoscape
 * viewer is a design contract — when this drifts, the editor will start to
 * look like a React Flow demo rather than a Ship-It surface.
 */

export type GraphNodeShellState = 'default' | 'hover' | 'selected' | 'path' | 'dim';

export interface GraphNodeShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Registered entity type. Drives both glyph and color. */
  type: EntityType;
  /** Visual state. Selection ring + glow are state-driven. */
  state?: GraphNodeShellState;
  /** Override the leading glyph. */
  glyph?: ReactNode;
  /** Caption rendered below the square. */
  label?: ReactNode;
  /** Pixel size of the square. Default 52 — matches `<GraphNode>`. */
  size?: number;
  /** Override the "on-path" purple ring color. */
  pathColor?: string;
}

export const GraphNodeShell = forwardRef<HTMLDivElement, GraphNodeShellProps>(
  function GraphNodeShell(
    { type, state = 'default', glyph, label, size = 52, pathColor, className, style, ...props },
    ref,
  ) {
    const meta = getEntityTypeMeta(type);
    const color = state === 'path' ? (pathColor ?? 'var(--color-purple)') : meta.colorVar;
    const glowPct = state === 'hover' ? 50 : 25;
    const opacity = state === 'dim' ? 0.35 : 1;
    const showRing = state === 'selected' || state === 'path';
    return (
      <div
        ref={ref}
        role="img"
        aria-label={typeof label === 'string' ? label : `${type} node`}
        data-state={state}
        data-entity-type={type}
        className={cn('inline-flex flex-col items-center gap-[6px]', className)}
        style={style}
        {...props}
      >
        <div
          className="bg-panel grid place-items-center rounded-[14px] border-[1.5px] transition-all duration-(--duration-micro)"
          style={{
            width: size,
            height: size,
            borderColor: color,
            color,
            fontSize: Math.round(size * 0.42),
            boxShadow: `0 0 ${state === 'hover' ? 30 : 20}px color-mix(in oklab, ${color} ${glowPct}%, transparent)`,
            outline: showRing ? `2px solid ${color}` : undefined,
            outlineOffset: showRing ? 4 : undefined,
            opacity,
          }}
        >
          {glyph ?? <DynamicIconGlyph name={meta.iconName} size={Math.round(size * 0.42)} />}
        </div>
        {label && <span className="text-text-dim font-mono text-[10px]">{label}</span>}
      </div>
    );
  },
);

GraphNodeShell.displayName = 'GraphNodeShell';
