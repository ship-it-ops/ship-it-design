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
          'inline-flex cursor-pointer items-center gap-[6px] rounded-full border border-border bg-panel px-[10px] py-[6px] text-[12px] text-text outline-none',
          'transition-colors duration-(--duration-micro)',
          'hover:border-border-strong hover:bg-panel-2',
          'focus-visible:ring-[3px] focus-visible:ring-accent-dim',
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
