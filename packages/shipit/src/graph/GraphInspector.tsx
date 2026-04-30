import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';
import { EntityBadge } from '../entity/EntityBadge';
import { type EntityType } from '../entity/types';

/**
 * GraphInspector — drill-in panel that appears next to a selected graph node.
 * Header (type badge + id), title + description, properties table, and a
 * relations list.
 *
 * The component is presentation-only: data shape mirrors what an inspector
 * needs to show, without prescribing how the consumer fetches it.
 */

export interface InspectorProperty {
  key: ReactNode;
  value: ReactNode;
}

export interface InspectorRelation {
  /** Direction or label, e.g., `→ depends on`. Rendered in mono. */
  relation: ReactNode;
  /** Related entity name. */
  entity: ReactNode;
}

export interface GraphInspectorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  type: EntityType;
  /** Right-side machine id (e.g., `ent_0x7a2f`). */
  entityId?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  properties?: ReadonlyArray<InspectorProperty>;
  relations?: ReadonlyArray<InspectorRelation>;
  /** Total relation count if `relations` is a partial slice. */
  relationCount?: number;
}

export const GraphInspector = forwardRef<HTMLDivElement, GraphInspectorProps>(
  function GraphInspector(
    { type, entityId, title, description, properties, relations, relationCount, className, ...props },
    ref,
  ) {
    const total = relationCount ?? relations?.length ?? 0;
    return (
      <aside
        ref={ref}
        aria-label={typeof title === 'string' ? `${title} inspector` : 'Node inspector'}
        className={cn(
          'flex w-[340px] flex-col gap-3 rounded-base border border-border bg-panel p-4',
          className,
        )}
        {...props}
      >
        <div className="flex items-center">
          <EntityBadge type={type} size="sm" />
          {entityId && (
            <span className="ml-auto font-mono text-[10px] text-text-dim">{entityId}</span>
          )}
        </div>
        <div>
          <div className="text-[17px] font-medium">{title}</div>
          {description && (
            <div className="mt-[2px] text-[12px] text-text-muted">{description}</div>
          )}
        </div>
        {properties && properties.length > 0 && (
          <section>
            <div className="mb-2 font-mono text-[9px] uppercase tracking-[1.4px] text-text-dim">
              Properties
            </div>
            <dl className="flex flex-col gap-1 m-0 text-[11px] font-mono">
              {properties.map((p, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex border-border py-1',
                    i < properties.length - 1 && 'border-b',
                  )}
                >
                  <dt className="w-[70px] text-text-dim">{p.key}</dt>
                  <dd className="m-0 flex-1">{p.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        {relations && relations.length > 0 && (
          <section>
            <div className="mb-2 font-mono text-[9px] uppercase tracking-[1.4px] text-text-dim">
              Relations · {total}
            </div>
            <ul className="flex flex-col gap-1 m-0 p-0 text-[11px] list-none">
              {relations.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-[100px] font-mono text-text-dim">{r.relation}</span>
                  <span>{r.entity}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    );
  },
);
