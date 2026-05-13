'use client';

import {
  forwardRef,
  useCallback,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';

/**
 * TabBar — mobile bottom navigation. Renders an evenly-spaced row of items
 * (typically 4–5) with optional `elevated` styling for one center action.
 *
 * Active state can be controlled (`value` + `onValueChange`) or uncontrolled
 * (`defaultValue`). The bar sits at the bottom of the screen; pair with
 * `pb-[env(safe-area-inset-bottom)]` on the surrounding scroll container to
 * respect the iOS home indicator.
 */

export interface TabBarItem {
  /** Stable identifier — what `value` / `onValueChange` reference. */
  id: string;
  /** Short label rendered under the icon. */
  label: ReactNode;
  /** Glyph node — pass an SVG, IconGlyph, or string emoji. */
  icon: ReactNode;
  /** Optional unread / count badge rendered top-right of the icon. */
  badge?: ReactNode;
  /**
   * Render this slot as an elevated pill (the center "Ask"-style action). Only
   * one item should set this true. Disables the active-color treatment for
   * this slot since it's always the focal action.
   */
  elevated?: boolean;
  disabled?: boolean;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue'> {
  items: TabBarItem[];
  /** Controlled active item id. */
  value?: string;
  /** Uncontrolled initial active item id. */
  defaultValue?: string;
  /** Fired when a tab is activated. */
  onValueChange?: (id: string) => void;
}

export const TabBar = forwardRef<HTMLElement, TabBarProps>(function TabBar(
  { items, value, defaultValue, onValueChange, className, ...props },
  ref,
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const activeId = isControlled ? value : internalValue;

  const handleSelect = useCallback(
    (id: string, e: MouseEvent<HTMLButtonElement>) => {
      if (!isControlled) setInternalValue(id);
      onValueChange?.(id);
      // Defensively prevent the click from propagating to any container that
      // also handles taps (page wrappers commonly forward taps to a hidden
      // dismiss action).
      e.stopPropagation();
    },
    [isControlled, onValueChange],
  );

  // Semantics: a TabBar is *navigation* (each slot switches screens), not the
  // WAI-ARIA tabs pattern (which expects associated tabpanels). Render as a
  // `<nav>` landmark with `aria-current="page"` on the active button — no
  // role="tablist"/role="tab" so assistive tech doesn't promise tabpanel
  // semantics we don't deliver.
  return (
    <nav
      ref={ref}
      aria-label="Primary"
      // Grid keeps slot widths identical regardless of label length.
      // pb keeps the labels above the home indicator on iOS.
      className={cn(
        'border-border bg-panel h-tabbar grid items-center border-t',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      {...props}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        if (item.elevated) {
          return (
            <div key={item.id} className="grid place-items-center">
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                disabled={item.disabled}
                onClick={(e) => handleSelect(item.id, e)}
                // Negative margin lifts the elevated pill above the bar's top edge.
                className={cn(
                  'bg-accent text-on-accent grid place-items-center rounded-2xl shadow-lg',
                  '-mt-[10px] h-[52px] w-[52px]',
                  'transition-[filter,transform] duration-(--duration-micro)',
                  'hover:brightness-110 active:scale-95',
                  'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                <span aria-hidden>{item.icon}</span>
                {/* Accessible name. `aria-label` only works for string labels;
                    when `label` is a ReactNode (e.g. an icon + counter), an
                    sr-only text node is the only reliable way to give the
                    button a name regardless of label shape. Same pattern the
                    non-elevated branch uses. */}
                <span className="sr-only">{item.label}</span>
              </button>
            </div>
          );
        }
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            disabled={item.disabled}
            onClick={(e) => handleSelect(item.id, e)}
            className={cn(
              'flex flex-col items-center justify-center gap-[3px] border-0 bg-transparent',
              'h-full cursor-pointer outline-none',
              'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
              'disabled:cursor-not-allowed disabled:opacity-40',
              isActive ? 'text-accent-text' : 'text-text-muted hover:text-text',
            )}
          >
            <span className="relative inline-flex" aria-hidden>
              {item.icon}
              {item.badge != null && (
                <span
                  className={cn(
                    'absolute -top-1 -right-2 rounded-full font-mono leading-none',
                    'bg-err text-on-accent min-w-[16px] px-[5px] py-[2px] text-center text-[9px]',
                  )}
                >
                  {item.badge}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium tracking-tight">
              {item.label}
              {/* Badge count is rendered inside an aria-hidden subtree above, so
                  AT users never hear it from the icon. Inline it into the
                  accessible name so screen readers announce e.g. "Graph, 3
                  unread" instead of just "Graph". */}
              {item.badge != null && <span className="sr-only">, {item.badge} unread</span>}
            </span>
          </button>
        );
      })}
    </nav>
  );
});

TabBar.displayName = 'TabBar';
