import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface FABProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon or glyph rendered inside the FAB. Defaults to `✦`. */
  icon?: ReactNode;
  /** Required: accessible label. Maps to `aria-label`. */
  'aria-label': string;
}

/**
 * Floating action button — round, accent-bg, accent-glow shadow. Use for the
 * single most-prominent action on a surface (e.g., "Ask anything" trigger).
 */
export const FAB = forwardRef<HTMLButtonElement, FABProps>(function FAB(
  { icon = '✦', type, className, style, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(
        'grid h-12 w-12 place-items-center rounded-full',
        'bg-accent text-on-accent text-lg font-semibold',
        'shadow-[0_10px_30px_var(--color-accent-glow),0_2px_6px_rgba(0,0,0,0.4)]',
        'transition-[transform,box-shadow] duration-200',
        'hover:-translate-y-px hover:shadow-[0_14px_36px_var(--color-accent-glow),0_4px_10px_rgba(0,0,0,0.45)]',
        'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      style={style}
      {...props}
    >
      {icon}
    </button>
  );
});

FAB.displayName = 'FAB';
