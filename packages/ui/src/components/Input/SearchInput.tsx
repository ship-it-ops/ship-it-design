'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional keyboard shortcut hint (e.g., `⌘K`) shown on the right edge. */
  shortcut?: string;
  /** Pixel width or any CSS length. Defaults to `360px`. */
  width?: number | string;
  /**
   * `'comfortable'` (default) renders the desktop 36px-tall pill. `'touch'`
   * bumps to 44pt for thumb tapping and removes the kbd shortcut by default
   * (consumers can still pass `shortcut` explicitly).
   */
  density?: 'comfortable' | 'touch';
}

/**
 * The hero search field — taller than a regular Input, with a leading magnifying-glass
 * glyph and an optional trailing keyboard-shortcut chip. Used for command bars,
 * topbar search, and entity search.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    shortcut,
    width,
    density = 'comfortable',
    className,
    style,
    placeholder = 'Search…',
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const isTouch = density === 'touch';
  // Desktop defaults: 360px width, ⌘K shortcut hint.
  // Touch defaults: full width, no kbd hint (irrelevant without a hardware keyboard).
  const resolvedWidth = width ?? (isTouch ? '100%' : 360);
  const resolvedShortcut = shortcut ?? (isTouch ? undefined : '⌘K');
  return (
    <div
      className={cn(
        'flex items-center gap-2 font-sans',
        isTouch ? 'h-touch rounded-m-tab px-[14px]' : 'rounded-base h-9 px-3',
        'bg-panel-2 border-border border',
        'focus-within:border-accent focus-within:ring-accent-dim focus-within:ring-[3px]',
        'transition-[border-color,box-shadow] duration-(--duration-micro)',
        className,
      )}
      style={{ width: resolvedWidth, ...style }}
    >
      <span className={cn('text-text-dim leading-none', isTouch && 'text-[18px]')} aria-hidden>
        ⌕
      </span>
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        // Default the accessible name to the placeholder. WCAG 4.1.2 / 3.3.2
        // require a programmatic name; placeholder alone does not satisfy
        // either criterion. Consumers can still override by passing aria-label.
        aria-label={ariaLabel ?? (typeof placeholder === 'string' ? placeholder : 'Search')}
        className={cn(
          'text-text placeholder:text-text-dim min-w-0 flex-1 border-none bg-transparent outline-none',
          isTouch ? 'text-m-body' : 'text-[13px]',
        )}
        {...props}
      />
      {resolvedShortcut && (
        <kbd className="text-text-dim border-border rounded-xs border px-[6px] py-[2px] font-mono text-[10px]">
          {resolvedShortcut}
        </kbd>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
