import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional keyboard shortcut hint (e.g., `⌘K`) shown on the right edge. */
  shortcut?: string;
  /** Pixel width or any CSS length. Defaults to `360px`. */
  width?: number | string;
}

/**
 * The hero search field — taller than a regular Input, with a leading magnifying-glass
 * glyph and an optional trailing keyboard-shortcut chip. Used for command bars,
 * topbar search, and entity search.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { shortcut = '⌘K', width = 360, className, style, placeholder = 'Search…', ...props },
  ref,
) {
  return (
    <div
      className={cn(
        'rounded-base flex h-9 items-center gap-2 px-3 font-sans',
        'bg-panel-2 border-border border',
        'focus-within:border-accent focus-within:ring-accent-dim focus-within:ring-[3px]',
        'transition-[border-color,box-shadow] duration-(--duration-micro)',
        className,
      )}
      style={{ width, ...style }}
    >
      <span className="text-text-dim leading-none">⌕</span>
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className="text-text placeholder:text-text-dim min-w-0 flex-1 border-none bg-transparent text-[13px] outline-none"
        {...props}
      />
      {shortcut && (
        <kbd className="text-text-dim border-border rounded-xs border px-[6px] py-[2px] font-mono text-[10px]">
          {shortcut}
        </kbd>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
