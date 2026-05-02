import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

const iconButtonStyles = cva(
  [
    'inline-grid place-items-center transition-[background,filter,color] duration-(--duration-micro)',
    'outline-none focus-visible:ring-[3px] focus-visible:ring-accent-dim',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent border border-accent hover:brightness-110',
        secondary:
          'bg-panel-2 text-text-muted border border-border hover:bg-[color-mix(in_oklab,var(--color-panel-2),white_4%)]',
        ghost:
          'bg-transparent text-text-muted border border-transparent hover:bg-panel-2 hover:text-text',
        outline:
          'bg-transparent text-text-muted border border-border-strong hover:bg-panel-2 hover:text-text',
      },
      size: {
        sm: 'h-[26px] w-[26px] text-[12px] rounded-[5px]',
        md: 'h-[32px] w-[32px] text-[13px] rounded-md',
        lg: 'h-[38px] w-[38px] text-[15px] rounded-[7px]',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export interface IconButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof iconButtonStyles> {
  /** The glyph or icon node to render. Pure decoration — set `aria-label` for screen readers. */
  icon: ReactNode;
  /**
   * Required: an accessible label since icon buttons have no visible text.
   * Mapped to `aria-label`.
   */
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant, size, icon, type, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(iconButtonStyles({ variant, size }), className)}
      {...props}
    >
      {icon}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export { iconButtonStyles };
