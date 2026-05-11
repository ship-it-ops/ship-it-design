import { DataTable, type DataTableColumn, type DataTableProps } from '@ship-it-ui/ui';
import { type Ref } from 'react';

import { EntityBadge } from '../entity/EntityBadge';
import { getEntityTypeMeta, type EntityType } from '../entity/types';

/**
 * EntityTable — DataTable preset with two ShipIt-aware column helpers:
 * `entityColumn(...)` for the typed name cell and `entityTypeColumn()` for a
 * standalone type column. Everything else (sort, selection, sticky header)
 * comes from `@ship-it-ui/ui` DataTable as-is.
 */

interface MinimalEntity {
  id: string;
  type: EntityType;
  name: string;
}

export type EntityTableProps<T extends MinimalEntity> = Omit<DataTableProps<T>, 'rowKey'> & {
  rowKey?: (row: T) => string;
};

export function EntityTable<T extends MinimalEntity>(
  props: EntityTableProps<T> & { ref?: Ref<HTMLTableElement> },
) {
  const { rowKey, ...rest } = props;
  return <DataTable {...rest} rowKey={rowKey ?? ((row: T) => row.id)} />;
}

/**
 * Pre-built column for the entity name. Renders the type glyph (in the type's
 * tone) followed by the name in mono. Sorts on `name`.
 */
export function entityColumn<T extends MinimalEntity>(
  options: { key?: string; header?: string } = {},
): DataTableColumn<T> {
  return {
    key: options.key ?? 'name',
    header: options.header ?? 'Name',
    accessor: (row) => row.name,
    cell: (row) => {
      const meta = getEntityTypeMeta(row.type);
      return (
        <span className="flex items-center gap-2 font-mono" data-entity-type={row.type}>
          <span aria-hidden className={meta.toneClass}>
            {meta.glyph}
          </span>
          {row.name}
        </span>
      );
    },
  };
}

/**
 * Pre-built column rendering the canonical EntityBadge.
 */
export function entityTypeColumn<T extends MinimalEntity>(
  options: { key?: string; header?: string } = {},
): DataTableColumn<T> {
  return {
    key: options.key ?? 'type',
    header: options.header ?? 'Type',
    accessor: (row) => row.type,
    cell: (row) => <EntityBadge type={row.type} size="sm" />,
  };
}
