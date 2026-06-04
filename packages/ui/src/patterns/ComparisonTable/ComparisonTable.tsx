'use client';

import { IconGlyph, type GlyphName } from '@ship-it-ui/icons';
import { Fragment, isValidElement, type ReactNode, type Ref } from 'react';

import { cn } from '../../utils/cn';
import { JsonLd } from '../../utils/JsonLd';

/**
 * ComparisonTable — option-vs-option matrix. Rows are features, columns are
 * options (products, plan tiers, spec sheets), cells are booleans (rendered as
 * check/cross with sr-only "Yes"/"No"), strings, numbers, or `{ value, note }`
 * objects for a primary value with a small footnote.
 *
 * Designed for AI/SEO consumption: emits a `<script type="application/ld+json">`
 * next to the table by default — one schema.org entity per option, with each
 * row contributing an `additionalProperty` `PropertyValue`. Pass `schema` to
 * change the `@type` (default `Product`), or `noStructuredData` to suppress
 * the script entirely.
 *
 * Semantic HTML: `<caption>` (sr-only), `<th scope="col">` for option headers,
 * `<th scope="row">` for feature names, optional `<tfoot>` for CTA actions.
 * Featured columns carry `data-featured="true"`; every cell carries
 * `data-cell-type` and (when meaningful) `data-cell-value` for crawlers and
 * scrapers that don't execute JS.
 */

export type ComparisonCellValue =
  | boolean
  | string
  | number
  | { value: ReactNode; note?: ReactNode };

export interface ComparisonOption {
  /** Stable key — must match the keys used in each `ComparisonRow.values`. */
  id: string;
  /** Visible column header. */
  name: ReactNode;
  /** Used as the JSON-LD `name` when `name` is JSX. Falls back to `name` if it's a string. */
  schemaName?: string;
  /**
   * Short description, rendered as a muted line under the name AND used as the
   * JSON-LD `description`.
   */
  description?: ReactNode;
  /** JSON-LD `url`. */
  url?: string;
  /**
   * Short eyebrow line rendered above the name (uppercase mono). Use for labels
   * like `STARTER` or `MOST POPULAR` that should live above the tier name
   * itself.
   */
  tagline?: ReactNode;
  /**
   * Inline glyph rendered before the name. Pass a `GlyphName` string for a
   * type-checked icon from the design-system manifest, or any `ReactNode` for
   * custom imagery (brand logos, avatars).
   */
  icon?: GlyphName | ReactNode;
  /** Highlight as the recommended option — accent-tinted column + auto badge. */
  featured?: boolean;
  /** Override the auto "recommended" badge. Set to `null` to suppress entirely. */
  badge?: ReactNode;
  /** Optional CTA rendered in a `<tfoot>` row when any option provides one. */
  action?: ReactNode;
}

export interface ComparisonRow {
  /** Visible row header (`<th scope="row">`). */
  feature: ReactNode;
  /** Used as the JSON-LD `PropertyValue.name` when `feature` is JSX. */
  schemaName?: string;
  /** Small muted line rendered under the feature name. */
  description?: ReactNode;
  /** Optional grouping label — sibling rows with the same `group` cluster together. */
  group?: string;
  /** Cell values keyed by `ComparisonOption.id`. */
  values: Record<string, ComparisonCellValue | undefined>;
}

export type ComparisonSchemaType = 'Product' | 'Service' | 'SoftwareApplication' | (string & {});

export interface ComparisonTableProps {
  /** Columns. */
  options: ReadonlyArray<ComparisonOption>;
  /** Rows. */
  rows: ReadonlyArray<ComparisonRow>;
  /** Visible-to-AT caption. Also used as the JSON-LD comparison `name`. */
  caption: ReactNode;
  /** schema.org `@type` per option in JSON-LD. Default `'Product'`. */
  schema?: ComparisonSchemaType;
  /** Opt out of emitting the JSON-LD `<script>`. */
  noStructuredData?: boolean;
  /** Visual density. Default `'comfortable'`. */
  density?: 'comfortable' | 'compact';
  /** Sticky table header (requires the table to live in a scroll container). */
  stickyHeader?: boolean;
  /**
   * Option-name text scale in the header. `'sm'` for dense spec sheets,
   * `'lg'` for marketing pricing-tier tables. Default `'md'`.
   */
  headerSize?: 'sm' | 'md' | 'lg';
  /**
   * Horizontal alignment for option columns — affects both the header cell
   * and data cells in option columns. The row-header (feature-name) column
   * always stays left-aligned. Default `'left'`.
   */
  headerAlign?: 'left' | 'center';
  /**
   * Lift the featured column visually: stronger header background, top + side
   * accent borders, larger padding, and a soft shadow. Pair with
   * `headerAlign="center"` and `headerSize="lg"` for a PricingCard-style tier
   * comparison.
   */
  prominentFeatured?: boolean;
  className?: string;
}

const densityRow = {
  comfortable: 'py-3',
  compact: 'py-[6px]',
} as const;

const nameSizeClass = {
  sm: 'text-[12px]',
  md: 'text-[14px]',
  lg: 'text-[18px]',
} as const;

const iconSizePx = {
  sm: 14,
  md: 16,
  lg: 20,
} as const;

const colAlignClass = {
  left: 'text-left',
  center: 'text-center',
} as const;

const headerRowJustify = {
  left: '',
  center: 'justify-center',
} as const;

function renderOptionIcon(icon: ComparisonOption['icon'], size: number): ReactNode {
  if (icon === undefined || icon === null || icon === false) return null;
  if (typeof icon === 'string') {
    return <IconGlyph name={icon as GlyphName} size={size} />;
  }
  if (isValidElement(icon)) return icon;
  return icon as ReactNode;
}

function isCellObject(cell: ComparisonCellValue): cell is { value: ReactNode; note?: ReactNode } {
  return typeof cell === 'object' && cell !== null;
}

function reactNodeToString(node: ReactNode): string | null {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  return null;
}

function cellToSchemaString(cell: ComparisonCellValue | undefined): string | null {
  if (cell === undefined || cell === null) return null;
  if (typeof cell === 'boolean') return cell ? 'Yes' : 'No';
  if (typeof cell === 'string' || typeof cell === 'number') return String(cell);
  // object cell: only emit a schema value if `value` is a string/number.
  return reactNodeToString(cell.value);
}

function cellDataAttrs(cell: ComparisonCellValue | undefined): {
  'data-cell-type': string;
  'data-cell-value'?: string;
} {
  if (cell === undefined || cell === null) return { 'data-cell-type': 'empty' };
  if (typeof cell === 'boolean') {
    return { 'data-cell-type': 'boolean', 'data-cell-value': cell ? 'true' : 'false' };
  }
  if (typeof cell === 'number') {
    return { 'data-cell-type': 'number', 'data-cell-value': String(cell) };
  }
  if (typeof cell === 'string') {
    return { 'data-cell-type': 'text', 'data-cell-value': cell };
  }
  const v = reactNodeToString(cell.value);
  return v != null
    ? { 'data-cell-type': 'rich', 'data-cell-value': v }
    : { 'data-cell-type': 'rich' };
}

interface StructuredItem {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  url?: string;
  additionalProperty: Array<{ '@type': 'PropertyValue'; name: string; value: string }>;
}

function buildStructuredData(
  options: ReadonlyArray<ComparisonOption>,
  rows: ReadonlyArray<ComparisonRow>,
  schema: ComparisonSchemaType,
): StructuredItem[] {
  const items: StructuredItem[] = [];
  for (const option of options) {
    const name = option.schemaName ?? reactNodeToString(option.name);
    if (!name) continue;
    const additionalProperty: StructuredItem['additionalProperty'] = [];
    for (const row of rows) {
      const propName = row.schemaName ?? reactNodeToString(row.feature);
      if (!propName) continue;
      const value = cellToSchemaString(row.values[option.id]);
      if (value === null) continue;
      additionalProperty.push({ '@type': 'PropertyValue', name: propName, value });
    }
    const descriptionString = reactNodeToString(option.description);
    items.push({
      '@context': 'https://schema.org',
      '@type': schema,
      name,
      ...(descriptionString ? { description: descriptionString } : {}),
      ...(option.url ? { url: option.url } : {}),
      additionalProperty,
    });
  }
  return items;
}

function renderCell(cell: ComparisonCellValue | undefined): ReactNode {
  if (cell === undefined || cell === null) {
    return <span className="text-text-dim">—</span>;
  }
  if (typeof cell === 'boolean') {
    return cell ? (
      <span className="text-ok inline-flex items-center">
        <IconGlyph name="check" size={16} />
        <span className="sr-only">Yes</span>
      </span>
    ) : (
      <span className="text-err inline-flex items-center">
        <IconGlyph name="close" size={16} />
        <span className="sr-only">No</span>
      </span>
    );
  }
  if (typeof cell === 'string' || typeof cell === 'number') {
    return cell;
  }
  return (
    <>
      <span>{cell.value}</span>
      {cell.note !== undefined && cell.note !== null && (
        <span className="text-text-dim mt-[2px] block text-[11px]">{cell.note}</span>
      )}
    </>
  );
}

interface RowGroup {
  name: string | null;
  rows: ReadonlyArray<ComparisonRow>;
}

function groupRows(rows: ReadonlyArray<ComparisonRow>): RowGroup[] {
  const out: { name: string | null; rows: ComparisonRow[] }[] = [];
  for (const row of rows) {
    const name = row.group ?? null;
    const last = out[out.length - 1];
    if (last && last.name === name) {
      last.rows.push(row);
    } else {
      out.push({ name, rows: [row] });
    }
  }
  return out;
}

// Plain function (not forwardRef) so the generic surface stays open for future
// row-type generics, mirroring DataTable.
export function ComparisonTable(props: ComparisonTableProps & { ref?: Ref<HTMLTableElement> }) {
  const {
    options,
    rows,
    caption,
    schema = 'Product',
    noStructuredData,
    density = 'comfortable',
    stickyHeader,
    headerSize = 'md',
    headerAlign = 'left',
    prominentFeatured,
    className,
    ref,
  } = props;

  const hasAnyAction = options.some((o) => o.action !== undefined && o.action !== null);
  const groups = groupRows(rows);
  const totalCols = options.length + 1; // +1 for the row-header column

  const structuredData = !noStructuredData ? buildStructuredData(options, rows, schema) : null;
  const hasStructuredData = structuredData !== null && structuredData.length > 0;

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      {hasStructuredData && <JsonLd data={structuredData} />}
      <table
        ref={ref}
        data-comparison-table=""
        className="relative w-full border-collapse text-[12px]"
      >
        <caption className="sr-only">{caption}</caption>
        <thead className={cn('bg-panel-2', stickyHeader && 'z-raised sticky top-0')}>
          <tr>
            <th scope="col" className="border-border border-b px-3 py-3" aria-hidden />
            {options.map((option) => {
              const showAutoBadge = option.featured && option.badge === undefined;
              const explicitBadge = option.badge !== undefined ? option.badge : null;
              const iconNode = renderOptionIcon(option.icon, iconSizePx[headerSize]);
              const isProminent = !!(option.featured && prominentFeatured);
              return (
                <th
                  key={option.id}
                  scope="col"
                  data-featured={option.featured ? 'true' : undefined}
                  data-prominent-featured={isProminent ? 'true' : undefined}
                  className={cn(
                    'border-b align-bottom',
                    colAlignClass[headerAlign],
                    isProminent
                      ? 'border-accent bg-accent-dim/60 text-accent shadow-accent-dim rounded-t-md border-x-2 border-t-2 px-3 py-4 shadow-[0_-8px_24px_-12px]'
                      : option.featured
                        ? 'border-accent bg-accent-dim/30 text-accent px-3 py-3'
                        : 'border-border text-text px-3 py-3',
                  )}
                >
                  <div className={cn('flex flex-col gap-[6px]', colAlignClass[headerAlign])}>
                    {option.tagline !== undefined && option.tagline !== null && (
                      <span
                        className={cn(
                          'text-text-dim font-mono text-[10px] font-medium tracking-[1.4px] uppercase',
                          option.featured && 'text-accent/70',
                        )}
                      >
                        {option.tagline}
                      </span>
                    )}
                    <div
                      className={cn(
                        'flex flex-wrap items-center gap-2',
                        headerRowJustify[headerAlign],
                      )}
                    >
                      {iconNode !== null && (
                        <span className="inline-flex items-center">{iconNode}</span>
                      )}
                      <span className={cn('font-medium', nameSizeClass[headerSize])}>
                        {option.name}
                      </span>
                      {showAutoBadge ? (
                        <span
                          className={cn(
                            'bg-accent-dim text-accent rounded-full font-mono',
                            isProminent
                              ? 'px-[8px] py-[2px] text-[11px] font-medium tracking-[0.6px] uppercase'
                              : 'px-[6px] py-[1px] text-[10px]',
                          )}
                        >
                          recommended
                        </span>
                      ) : (
                        explicitBadge
                      )}
                    </div>
                    {option.description !== undefined && option.description !== null && (
                      <span
                        className={cn(
                          'text-[12px] font-normal',
                          option.featured ? 'text-accent/80' : 'text-text-dim',
                        )}
                      >
                        {option.description}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        {groups.map((group, groupIndex) => (
          <tbody key={group.name ?? `__nogroup_${groupIndex}`} data-group={group.name ?? undefined}>
            {group.name !== null && (
              <tr data-group-header="">
                <th
                  colSpan={totalCols}
                  scope="colgroup"
                  className="bg-panel-2/50 text-text-dim border-border border-y px-3 py-2 text-left font-mono text-[10px] font-medium tracking-[1.4px] uppercase"
                >
                  {group.name}
                </th>
              </tr>
            )}
            {group.rows.map((row, rowIndex) => {
              const rowKey =
                row.schemaName ?? reactNodeToString(row.feature) ?? `${groupIndex}-${rowIndex}`;
              return (
                <tr key={rowKey} className="border-border border-b last:border-0">
                  <th
                    scope="row"
                    className={cn(
                      'px-3 text-left align-top text-[13px] font-medium',
                      densityRow[density],
                    )}
                  >
                    <span>{row.feature}</span>
                    {row.description !== undefined && row.description !== null && (
                      <span className="text-text-dim mt-[2px] block text-[12px] font-normal">
                        {row.description}
                      </span>
                    )}
                  </th>
                  {options.map((option) => {
                    const cell = row.values[option.id];
                    const attrs = cellDataAttrs(cell);
                    return (
                      <td
                        key={option.id}
                        {...attrs}
                        data-featured={option.featured ? 'true' : undefined}
                        className={cn(
                          'px-3 align-top text-[13px]',
                          densityRow[density],
                          colAlignClass[headerAlign],
                          option.featured && 'bg-accent-dim/30',
                        )}
                      >
                        {renderCell(cell)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        ))}
        {hasAnyAction && (
          <tfoot>
            <tr>
              <th scope="row" className="sr-only">
                Get started
              </th>
              {options.map((option) => (
                <td
                  key={option.id}
                  data-featured={option.featured ? 'true' : undefined}
                  className={cn(
                    'border-border border-t px-3 py-3 align-top',
                    colAlignClass[headerAlign],
                    option.featured && 'bg-accent-dim/30',
                  )}
                >
                  {option.action ?? <Fragment />}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
