import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * SuggestionChip — pill-shaped prompt suggestion. The ✦ glyph prefix signals
 * "ask about this" and matches the AskBar's identity.
 */

export interface SuggestionChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Override the leading glyph. Defaults to `✦`. */
  glyph?: ReactNode;
}

export const SuggestionChip = forwardRef<HTMLButtonElement, SuggestionChipProps>(
  function SuggestionChip({ glyph = '✦', className, children, type, ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(
          'border-border bg-panel text-text inline-flex cursor-pointer items-center gap-[6px] rounded-full border px-[10px] py-[6px] text-[12px] outline-none',
          'transition-colors duration-(--duration-micro)',
          'hover:border-border-strong hover:bg-panel-2',
          'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
          className,
        )}
        {...props}
      >
        <span aria-hidden className="text-accent">
          {glyph}
        </span>
        {children}
      </button>
    );
  },
);

SuggestionChip.displayName = 'SuggestionChip';
