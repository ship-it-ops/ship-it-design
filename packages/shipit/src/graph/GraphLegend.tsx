'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { ENTITY_LABEL, type EntityType } from '../entity/types';
import { cn } from '../utils/cn';

/**
 * GraphLegend — translucent floating legend panel for the graph viewport.
 * Use the `entries` prop for the canonical entity-type list, or compose
 * children directly for a custom legend.
 */

const typeColorVar: Record<EntityType, string> = {
  service: 'var(--color-accent)',
  person: 'var(--color-purple)',
  document: 'var(--color-pink)',
  deployment: 'var(--color-ok)',
  incident: 'var(--color-warn)',
  ticket: 'var(--color-text-muted)',
};

export interface GraphLegendEntry {
  /** Entity type (resolves color + label automatically) or a custom shape. */
  type?: EntityType;
  color?: string;
  label: ReactNode;
}

export interface GraphLegendProps extends HTMLAttributes<HTMLDivElement> {
  entries?: ReadonlyArray<GraphLegendEntry>;
  /** Heading rendered above the entries. Default `Legend`. */
  heading?: ReactNode;
}

const DEFAULT_ENTRIES: GraphLegendEntry[] = [
  { type: 'service', label: ENTITY_LABEL.service },
  { type: 'person', label: ENTITY_LABEL.person },
  { type: 'document', label: ENTITY_LABEL.document },
];

export const GraphLegend = forwardRef<HTMLDivElement, GraphLegendProps>(function GraphLegend(
  { entries = DEFAULT_ENTRIES, heading = 'Legend', className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-base border-border bg-panel/85 inline-flex flex-col gap-[6px] border p-[10px] text-[11px] backdrop-blur-[8px]',
        className,
      )}
      {...props}
    >
      {heading && (
        <div className="text-text-dim font-mono text-[9px] tracking-[1.4px] uppercase">
          {heading}
        </div>
      )}
      {children ??
        entries.map((entry, i) => {
          const color = entry.color ?? (entry.type ? typeColorVar[entry.type] : 'currentColor');
          return (
            <div key={i} className="flex items-center gap-[6px]">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: color }} />
              <span>{entry.label}</span>
            </div>
          );
        })}
    </div>
  );
});

GraphLegend.displayName = 'GraphLegend';
