import { forwardRef, type HTMLAttributes } from 'react';

import { IconButton } from '../../components/Button/IconButton';
import { cn } from '../../utils/cn';

/**
 * Pagination — page selector for paginated lists/tables. Renders prev/next
 * arrows plus a compact range of numbered pages. Use `siblings` to control how
 * many pages flank the current page; ellipses are inserted automatically.
 */

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Currently selected page (1-indexed). */
  page: number;
  /** Total number of pages. */
  total: number;
  /** Called with the new page when the user clicks a page or arrow. */
  onPageChange: (page: number) => void;
  /** How many sibling pages to show on each side of the current page. Default 1. */
  siblings?: number;
}

type PageItem = number | 'start-ellipsis' | 'end-ellipsis';

function buildRange(page: number, total: number, siblings: number): PageItem[] {
  if (total <= 0) return [];
  const items: PageItem[] = [];
  const left = Math.max(2, page - siblings);
  const right = Math.min(total - 1, page + siblings);

  items.push(1);
  if (left > 2) items.push('start-ellipsis');
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push('end-ellipsis');
  if (total > 1) items.push(total);
  return items;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, total, onPageChange, siblings = 1, className, ...props },
  ref,
) {
  const items = buildRange(page, total, siblings);

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      <IconButton
        size="sm"
        variant="ghost"
        icon="‹"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      />
      {items.map((item, i) => {
        if (item === 'start-ellipsis' || item === 'end-ellipsis') {
          return (
            <span
              key={`ellipsis-${i}`}
              aria-hidden
              className="text-text-dim grid h-[26px] min-w-[26px] place-items-center px-2 font-mono text-[12px]"
            >
              …
            </span>
          );
        }
        const isActive = item === page;
        return (
          <button
            key={item}
            type="button"
            aria-label={`Go to page ${item}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              'h-[26px] min-w-[26px] rounded-[5px] px-2 font-mono text-[12px] outline-none',
              'cursor-pointer transition-colors duration-(--duration-micro)',
              'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
              isActive
                ? 'bg-accent-dim text-accent border-accent border'
                : 'text-text-muted hover:bg-panel-2 hover:text-text border border-transparent',
            )}
          >
            {item}
          </button>
        );
      })}
      <IconButton
        size="sm"
        variant="ghost"
        icon="›"
        aria-label="Next page"
        disabled={page >= total}
        onClick={() => onPageChange(Math.min(total, page + 1))}
      />
    </nav>
  );
});
