import * as RadixDialog from '@radix-ui/react-dialog';
import { forwardRef, useEffect, useMemo, type ReactNode } from 'react';

import { useKeyboardList } from '../../hooks/useKeyboardList';
import { cn } from '../../utils/cn';

/**
 * CommandPalette — keyboard-driven command launcher. Built on Radix Dialog
 * (focus trap, Esc, scroll lock for free) with a controlled query input,
 * grouped results, and arrow-key navigation provided by `useKeyboardList`.
 *
 * The component is presentation-only over its results: the consumer owns the
 * query state and is responsible for filtering. Pass already-matched groups
 * via `groups`. For the common substring case, `filterCommandItems(query, …)`
 * is exported as a one-liner.
 */

export interface CommandPaletteItem {
  /** Stable id passed back to `onSelect`. */
  id: string;
  /** Visible label / title. */
  label: ReactNode;
  /** Secondary line beneath the label. */
  description?: ReactNode;
  /** Leading glyph or icon node. */
  glyph?: ReactNode;
  /** Trailing hint, often a kbd shortcut. */
  trailing?: ReactNode;
  /** Lower-cased haystack used by `filterCommandItems`. Defaults to `label + description`. */
  searchText?: string;
}

export interface CommandPaletteGroup {
  /** Group heading label. */
  label?: ReactNode;
  items: ReadonlyArray<CommandPaletteItem>;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  /** Already-matched, ready-to-render groups. Use `filterCommandItems` for the simple case. */
  groups: ReadonlyArray<CommandPaletteGroup>;
  /** Called with the item id when the user picks an item (click or Enter). */
  onSelect: (id: string) => void;
  /** Placeholder text for the search input. */
  placeholder?: string;
  /** Footer hint row (kbd legend). Accepts free-form children. */
  footer?: ReactNode;
  /** Empty-state node when groups resolve to zero items. */
  emptyState?: ReactNode;
  /** Pixel width of the palette panel. Default 540. */
  width?: number;
}

function flatItems(groups: ReadonlyArray<CommandPaletteGroup>): CommandPaletteItem[] {
  return groups.flatMap((g) => g.items as CommandPaletteItem[]);
}

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  function CommandPalette(
    {
      open,
      onOpenChange,
      query,
      onQueryChange,
      groups,
      onSelect,
      placeholder = 'Search…',
      footer,
      emptyState,
      width = 540,
    },
    ref,
  ) {
    const flat = useMemo(() => flatItems(groups), [groups]);
    const { cursor, setCursor, onKeyDown } = useKeyboardList({
      count: flat.length,
      defaultCursor: 0,
      onSelect: (i) => {
        const item = flat[i];
        if (item) onSelect(item.id);
      },
    });

    // Reset the cursor whenever the query or groups shape changes.
    useEffect(() => {
      setCursor(0);
    }, [query, groups, setCursor]);

    return (
      <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
        <RadixDialog.Portal>
          <RadixDialog.Overlay
            className={cn(
              'fixed inset-0 z-50 bg-black/55 backdrop-blur-[4px]',
              'data-[state=open]:animate-[ship-fade-in_150ms_ease]',
            )}
          />
          <RadixDialog.Content
            ref={ref}
            aria-label="Command palette"
            aria-describedby={undefined}
            style={{ width }}
            className={cn(
              'fixed top-[20%] left-1/2 z-[51] max-w-[calc(100%-40px)] -translate-x-1/2',
              'border-border-strong bg-panel overflow-hidden rounded-xl border shadow-lg',
              'outline-none data-[state=open]:animate-[ship-dialog-in_180ms_var(--easing-out)]',
            )}
            onKeyDown={onKeyDown}
          >
            <RadixDialog.Title className="sr-only">Command palette</RadixDialog.Title>
            <div className="border-border flex items-center gap-[10px] border-b px-4 py-[14px]">
              <span aria-hidden className="text-text-dim">
                ⌕
              </span>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Search"
                aria-autocomplete="list"
                className="text-text placeholder:text-text-dim flex-1 border-0 bg-transparent text-[14px] outline-none"
              />
              <span className="border-border text-text-dim rounded-xs border px-[6px] py-[2px] font-mono text-[10px]">
                ESC
              </span>
            </div>
            <div className="min-h-[220px] p-2" role="listbox" aria-label="Results">
              {flat.length === 0 ? (
                (emptyState ?? (
                  <div className="text-text-dim px-3 py-5 text-center text-[12px]">No matches</div>
                ))
              ) : (
                <CommandGroups
                  groups={groups}
                  cursor={cursor}
                  setCursor={setCursor}
                  onSelect={onSelect}
                />
              )}
            </div>
            {footer && (
              <div className="border-border text-text-dim flex gap-4 border-t px-[14px] py-[10px] font-mono text-[10px]">
                {footer}
              </div>
            )}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  },
);

interface CommandGroupsProps {
  groups: ReadonlyArray<CommandPaletteGroup>;
  cursor: number;
  setCursor: (i: number) => void;
  onSelect: (id: string) => void;
}

function CommandGroups({ groups, cursor, setCursor, onSelect }: CommandGroupsProps) {
  let runningIndex = 0;
  return (
    <>
      {groups.map((group, gIdx) => {
        if (group.items.length === 0) return null;
        return (
          <div key={gIdx}>
            {group.label && (
              <div className="text-text-dim px-2 pt-2 pb-1 font-mono text-[9px] tracking-[1.4px] uppercase">
                {group.label} · {group.items.length}
              </div>
            )}
            {group.items.map((item) => {
              const myIndex = runningIndex++;
              const isActive = cursor === myIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => onSelect(item.id)}
                  onMouseEnter={() => setCursor(myIndex)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-[10px] rounded-md border-0 bg-transparent px-[10px] py-2 text-left outline-none',
                    isActive ? 'bg-accent-dim text-accent' : 'text-text hover:bg-panel-2',
                  )}
                >
                  {item.glyph != null && (
                    <span
                      aria-hidden
                      className={cn(
                        'font-mono text-[12px]',
                        isActive ? 'text-accent' : 'text-text-muted',
                      )}
                    >
                      {item.glyph}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px]">{item.label}</span>
                    {item.description && (
                      <span className="text-text-dim block truncate text-[11px]">
                        {item.description}
                      </span>
                    )}
                  </span>
                  {item.trailing && (
                    <span className="text-text-dim font-mono text-[10px]">{item.trailing}</span>
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

/**
 * Substring filter helper. Lower-cases `query` and matches any item whose
 * `searchText` (or computed `label + description`) contains it. Preserves
 * groups; drops empty ones.
 */
export function filterCommandItems(
  query: string,
  groups: ReadonlyArray<CommandPaletteGroup>,
): CommandPaletteGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups.map((g) => ({ ...g, items: [...g.items] }));
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => {
        const haystack =
          item.searchText ??
          `${typeof item.label === 'string' ? item.label : ''} ${typeof item.description === 'string' ? item.description : ''}`;
        return haystack.toLowerCase().includes(q);
      }),
    }))
    .filter((g) => g.items.length > 0);
}
