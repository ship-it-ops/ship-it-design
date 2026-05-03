'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { ENTITY_GLYPH, type EntityType } from '../entity/types';
import { cn } from '@ship-it-ui/ui';

/**
 * GraphNode — visual representation of a graph node. Six entity-type variants
 * × five states (default, hover, selected, on-path, dimmed). The component
 * itself is presentation-only; pan / zoom / drag is the host's job.
 */

export type GraphNodeState = 'default' | 'hover' | 'selected' | 'path' | 'dim';

const typeColorVar: Record<EntityType, string> = {
  service: 'var(--color-accent)',
  person: 'var(--color-purple)',
  document: 'var(--color-pink)',
  deployment: 'var(--color-ok)',
  incident: 'var(--color-warn)',
  ticket: 'var(--color-text-muted)',
};

export interface GraphNodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  type: EntityType;
  state?: GraphNodeState;
  /** Override the leading glyph. */
  glyph?: ReactNode;
  /** Caption rendered below the node. */
  label?: ReactNode;
  /** Pixel size of the square. Default 52. */
  size?: number;
  /** Use the node's "on a path" purple ring even if state isn't `path`. */
  pathColor?: string;
}

export const GraphNode = forwardRef<HTMLDivElement, GraphNodeProps>(function GraphNode(
  { type, state = 'default', glyph, label, size = 52, pathColor, className, style, ...props },
  ref,
) {
  const color = state === 'path' ? (pathColor ?? 'var(--color-purple)') : typeColorVar[type];
  // Glow opacity expressed as a percent for color-mix; hover ≈ 50% (was hex 80), default ≈ 25% (was hex 40).
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
        {glyph ?? ENTITY_GLYPH[type]}
      </div>
      {label && <span className="text-text-dim font-mono text-[10px]">{label}</span>}
    </div>
  );
});

GraphNode.displayName = 'GraphNode';
