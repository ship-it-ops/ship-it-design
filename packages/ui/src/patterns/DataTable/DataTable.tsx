'use client';

import { type Ref, useEffect, useMemo, useRef, type ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * DataTable — generic, sortable, selectable table. The component is a
 * "headless-with-defaults": you bring your data and column definitions, the
 * table handles sort state, selection (with indeterminate "select-all"),
 * sticky header, and basic ARIA.
 *
 * Sort: if a column declares an `accessor`, clicking its header toggles the
 * direction. Selection: pass `selectable` to render a checkbox column with a
 * select-all in the header.
 */

export interface DataTableColumn<T> {
  /** Stable id used for sorting state. */
  key: string;
  /** Header content. */
  header: ReactNode;
  /** Custom cell renderer. Defaults to the accessor's stringified value. */
  cell?: (row: T) => ReactNode;
  /** Returns the sort key for `row`. When omitted, the column is not sortable. */
  accessor?: (row: T) => string | number;
  align?: 'left' | 'right' | 'center';
  /** CSS width — string or number (px). */
  width?: number | string;
}

export interface DataTableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T> {
  data: ReadonlyArray<T>;
  columns: ReadonlyArray<DataTableColumn<T>>;
  /** Returns a stable id for `row`. Required for selection + React keys. */
  rowKey: (row: T) => string;
  /** Controlled sort state. */
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Show the leading checkbox column. */
  selectable?: boolean;
  /** Controlled selection. */
  selected?: ReadonlySet<string>;
  defaultSelected?: ReadonlyArray<string>;
  onSelectionChange?: (selection: ReadonlySet<string>) => void;
  /** Rendered when `data` is empty. */
  emptyState?: ReactNode;
  /** Sticky table header (requires the table to live in a scroll container). */
  stickyHeader?: boolean;
  /** Caption for screen readers. */
  caption?: ReactNode;
  className?: string;
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
} as const;

/**
 * Stable empty-set fallback for unset controlled `selected`. Using a single
 * frozen instance keeps `.has(id)` lookups cheap and avoids referential churn
 * in render-derived memos.
 */
const EMPTY_SET: ReadonlySet<string> = new Set();

// Note: this is a generic component. The forwardRef helper loses the generic
// type, so we keep it as a plain function and accept an optional ref via props.
export function DataTable<T>(props: DataTableProps<T> & { ref?: Ref<HTMLTableElement> }) {
  const {
    data,
    columns,
    rowKey,
    sort: sortProp,
    defaultSort,
    onSortChange,
    selectable,
    selected: selectedProp,
    defaultSelected,
    onSelectionChange,
    emptyState,
    stickyHeader,
    caption,
    className,
    ref,
  } = props;

  const [sort, setSort] = useControllableState<DataTableSort | null>({
    value: sortProp,
    defaultValue: defaultSort ?? null,
    onChange: onSortChange,
  });

  const [selected, setSelected] = useControllableState<ReadonlySet<string>>({
    value: selectedProp,
    defaultValue: new Set(defaultSelected ?? []),
    onChange: onSelectionChange,
  });

  const sortableMap = useMemo(() => {
    const m = new Map<string, DataTableColumn<T>>();
    for (const c of columns) if (c.accessor) m.set(c.key, c);
    return m;
  }, [columns]);

  const sortedData = useMemo(() => {
    if (!sort) return [...data];
    const col = sortableMap.get(sort.key);
    if (!col || !col.accessor) return [...data];
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = col.accessor!(a);
      const bv = col.accessor!(b);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
      return String(av).localeCompare(String(bv)) * factor;
    });
  }, [data, sort, sortableMap]);

  const allIds = useMemo(() => sortedData.map(rowKey), [sortedData, rowKey]);
  const selectedSet = selected ?? EMPTY_SET;
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedSet.has(id));
  const someSelected = !allSelected && allIds.some((id) => selectedSet.has(id));

  const headerCheckRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headerCheckRef.current) headerCheckRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleSort = (key: string) => {
    const col = sortableMap.get(key);
    if (!col) return;
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev ?? []);
      if (allSelected) {
        for (const id of allIds) next.delete(id);
      } else {
        for (const id of allIds) next.add(id);
      }
      return next;
    });
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev ?? []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <table ref={ref} className={cn('w-full border-collapse text-[12px]', className)}>
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead className={cn('bg-panel-2', stickyHeader && 'z-raised sticky top-0')}>
        <tr>
          {selectable && (
            <th scope="col" className="border-border w-8 border-b px-3 py-2 text-left">
              <input
                ref={headerCheckRef}
                type="checkbox"
                aria-label="Select all rows"
                checked={allSelected}
                onChange={toggleAll}
                className="cursor-pointer accent-[var(--color-accent)]"
              />
            </th>
          )}
          {columns.map((col) => {
            const sortable = !!col.accessor;
            const isSorted = sort?.key === col.key;
            const ariaSort = !sortable
              ? undefined
              : isSorted
                ? sort?.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none';
            const align = col.align ?? 'left';
            const indicator = sortable && isSorted && (
              <span aria-hidden className="ml-1">
                {sort?.direction === 'asc' ? '↑' : '↓'}
              </span>
            );
            return (
              <th
                key={col.key}
                scope="col"
                aria-sort={ariaSort}
                style={col.width != null ? { width: col.width } : undefined}
                className={cn(
                  'border-border border-b px-3 py-2 font-mono text-[10px] font-medium tracking-[1.4px] uppercase select-none',
                  alignClass[align],
                  sortable && 'cursor-pointer',
                  isSorted ? 'text-accent' : 'text-text-dim',
                )}
              >
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="focus-visible:ring-accent-dim inline-flex cursor-pointer items-center gap-1 font-mono text-[10px] font-medium tracking-[1.4px] uppercase outline-none focus-visible:ring-[3px]"
                  >
                    {col.header}
                    {indicator}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedData.length === 0 && (
          <tr>
            <td
              colSpan={columns.length + (selectable ? 1 : 0)}
              className="text-text-dim px-3 py-8 text-center"
            >
              {emptyState ?? 'No data'}
            </td>
          </tr>
        )}
        {sortedData.map((row) => {
          const id = rowKey(row);
          const isSelected = selectedSet.has(id);
          return (
            <tr
              key={id}
              data-state={isSelected ? 'selected' : undefined}
              className={cn(
                'border-border border-b transition-colors duration-(--duration-micro) last:border-0',
                isSelected ? 'bg-accent-dim/50' : 'hover:bg-panel-2',
              )}
            >
              {selectable && (
                <td className="px-3 py-[10px]">
                  <input
                    type="checkbox"
                    aria-label={`Select row ${id}`}
                    checked={isSelected}
                    onChange={() => toggleRow(id)}
                    className="cursor-pointer accent-[var(--color-accent)]"
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className={cn('px-3 py-[10px]', alignClass[col.align ?? 'left'])}>
                  {col.cell ? col.cell(row) : col.accessor ? String(col.accessor(row)) : null}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
