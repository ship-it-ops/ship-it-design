'use client';

import { DynamicIconGlyph, IconGlyph } from '@ship-it-ui/icons';
import { Button, Input } from '@ship-it-ui/ui';
import { useMemo, useState } from 'react';

/**
 * Searchable, paginated grid of icons. Used on the Iconography docs page —
 * the main glyph inventory has 245+ entries, which doesn't read well in a
 * single static grid. Searches name substrings (case-insensitive); pagination
 * collapses automatically when the filtered set fits in one page.
 */

export interface IconCatalogItem {
  name: string;
  // `connector` is the deprecated alias for `logo`; both resolve to the same icon.
  kind?: 'default' | 'logo' | 'connector';
}

export interface IconCatalogProps {
  items: ReadonlyArray<IconCatalogItem>;
  /** Icons per page. Defaults to 50. */
  pageSize?: number;
  /** Search input placeholder. */
  searchPlaceholder?: string;
  /** Grid column count. Defaults to 8 for glyphs / 5 for connectors. */
  columns?: number;
}

export function IconCatalog({
  items,
  pageSize = 50,
  searchPlaceholder = 'Search icons…',
  columns = 8,
}: IconCatalogProps) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, query]);

  // Clamp the page index — if filtering shrank the list below the current
  // page, snap back to page 0 rather than rendering nothing.
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * pageSize;
  const end = Math.min(start + pageSize, filtered.length);
  const visible = filtered.slice(start, end);
  const showPager = filtered.length > pageSize;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input
        icon={<IconGlyph name="search" />}
        placeholder={searchPlaceholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0);
        }}
        aria-label={searchPlaceholder}
      />

      {filtered.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--color-text-dim)',
            fontSize: 12,
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          No icons match &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: 8,
            }}
          >
            {visible.map((item) => (
              <div
                key={`${item.kind ?? 'default'}:${item.name}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '10px 6px',
                  background: 'var(--color-panel-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                }}
              >
                <DynamicIconGlyph
                  kind={item.kind ?? 'default'}
                  name={item.name}
                  size={22}
                  style={{ color: 'var(--color-text)' }}
                />
                <div
                  style={{
                    fontSize: 9,
                    color: 'var(--color-text-dim)',
                    fontFamily: 'var(--font-family-mono)',
                    textAlign: 'center',
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                  }}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          {showPager && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-dim)',
                  fontFamily: 'var(--font-family-mono)',
                }}
              >
                Showing {start + 1}&ndash;{end} of {filtered.length}
                {query ? ` (filtered from ${items.length})` : ''}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<IconGlyph name="caretLeft" />}
                  disabled={currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                  aria-label="Previous page"
                >
                  Prev
                </Button>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-dim)',
                    fontFamily: 'var(--font-family-mono)',
                    minWidth: 64,
                    textAlign: 'center',
                  }}
                >
                  Page {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<IconGlyph name="caretRight" />}
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setPage(currentPage + 1)}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
