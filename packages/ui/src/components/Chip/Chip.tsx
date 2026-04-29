import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Pill-style leading icon (typically a glyph or `@`/`#`). */
  icon?: ReactNode;
  /** Optional remove handler — renders an inset close button. */
  removable?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}

/**
 * Pill-shaped filter chip. Used in command palette tag rows, search filter strips,
 * and AI suggestion lists. Differs from `Tag` by being pill-shaped (full radius)
 * and slightly more decorative.
 */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { icon, removable, onRemove, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-[6px] pl-[10px] pr-1 py-[4px] h-[26px] font-sans text-[12px]',
        'bg-panel-2 text-text border border-border rounded-full',
        className,
      )}
      {...props}
    >
      {icon && <span className="inline-flex text-text-dim text-[10px]">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="grid place-items-center h-[18px] w-[18px] rounded-full bg-panel text-text-dim hover:text-text text-[10px] leading-none"
        >
          ×
        </button>
      )}
    </span>
  );
});
