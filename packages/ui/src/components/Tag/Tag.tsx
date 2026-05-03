'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional close button. When provided, a `×` rendered on the right calls it. */
  onRemove?: () => void;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Pixel height. Defaults to 22px. */
  size?: number;
  children: ReactNode;
}

/**
 * Compact label with optional remove button. Used for selected filters,
 * applied tags, mention tokens.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { onRemove, icon, size = 22, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-[6px] px-2 py-[3px] font-sans text-[11px]',
        'bg-panel-2 text-text border-border rounded-xs border',
        className,
      )}
      style={{ height: size }}
      {...props}
    >
      {icon && <span className="text-text-dim inline-flex">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="text-text-dim hover:text-text px-[2px] leading-none"
        >
          ×
        </button>
      )}
    </span>
  );
});

Tag.displayName = 'Tag';
