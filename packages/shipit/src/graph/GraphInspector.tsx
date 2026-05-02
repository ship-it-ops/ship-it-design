import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { EntityBadge } from '../entity/EntityBadge';
import { type EntityType } from '../entity/types';
import { cn } from '../utils/cn';

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
    {
      type,
      entityId,
      title,
      description,
      properties,
      relations,
      relationCount,
      className,
      ...props
    },
    ref,
  ) {
    const total = relationCount ?? relations?.length ?? 0;
    return (
      <aside
        ref={ref}
        aria-label={typeof title === 'string' ? `${title} inspector` : 'Node inspector'}
        className={cn(
          'rounded-base border-border bg-panel flex w-[340px] flex-col gap-3 border p-4',
          className,
        )}
        {...props}
      >
        <div className="flex items-center">
          <EntityBadge type={type} size="sm" />
          {entityId && (
            <span className="text-text-dim ml-auto font-mono text-[10px]">{entityId}</span>
          )}
        </div>
        <div>
          <div className="text-[17px] font-medium">{title}</div>
          {description && <div className="text-text-muted mt-[2px] text-[12px]">{description}</div>}
        </div>
        {properties && properties.length > 0 && (
          <section>
            <div className="text-text-dim mb-2 font-mono text-[9px] tracking-[1.4px] uppercase">
              Properties
            </div>
            <dl className="m-0 flex flex-col gap-1 font-mono text-[11px]">
              {properties.map((p, i) => (
                <div
                  key={i}
                  className={cn('border-border flex py-1', i < properties.length - 1 && 'border-b')}
                >
                  <dt className="text-text-dim w-[70px]">{p.key}</dt>
                  <dd className="m-0 flex-1">{p.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        {relations && relations.length > 0 && (
          <section>
            <div className="text-text-dim mb-2 font-mono text-[9px] tracking-[1.4px] uppercase">
              Relations · {total}
            </div>
            <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[11px]">
              {relations.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-text-dim w-[100px] font-mono">{r.relation}</span>
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

GraphInspector.displayName = 'GraphInspector';
