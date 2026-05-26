'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { tintStyle, warnIfInvalidColor } from '../../utils/color-override';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Optional close button. When provided, a `×` rendered on the right calls it. */
  onRemove?: () => void;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Pixel height. Defaults to 22px. */
  size?: number;
  /** Arbitrary CSS color. When set, the default neutral tint is replaced with this color. */
  color?: string;
  children: ReactNode;
}

/**
 * Compact label with optional remove button. Used for selected filters,
 * applied tags, mention tokens.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { onRemove, icon, size = 22, color, className, children, style, ...props },
  ref,
) {
  const useColor = color && warnIfInvalidColor(color, 'Tag');

  const structural =
    'inline-flex items-center gap-[6px] px-2 py-[3px] font-sans text-[11px] rounded-xs border';
  const defaultPaint = 'bg-panel-2 text-text border-border';

  return (
    <span
      ref={ref}
      className={cn(structural, !useColor && defaultPaint, className)}
      style={{
        height: size,
        ...(useColor ? { ...tintStyle(color!), borderColor: 'transparent' } : {}),
        ...style,
      }}
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
