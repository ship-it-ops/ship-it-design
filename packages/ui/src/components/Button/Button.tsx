import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

/**
 * Variant + size styles. All classes use semantic tokens from @ship-it/tokens, so
 * swapping the palette (or shifting `--accent-h`) automatically reflows the Button.
 *
 * Note: Phase 2 rewrites this with the full 7-variant matrix from the handoff
 * (primary / secondary / ghost / outline / destructive / success / link). For now
 * this preserves the scaffold's three variants against the new token names so
 * Phase 1 verification works.
 */
const buttonStyles = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium whitespace-nowrap rounded-md',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:brightness-110',
        secondary: 'bg-panel-2 text-text border border-border hover:bg-accent-dim',
        ghost: 'bg-transparent text-text hover:bg-accent-dim',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  /**
   * Render as a child element instead of a `<button>`. Useful for `<Link>`
   * wrappers — `<Button asChild><Link href="/">Home</Link></Button>`.
   */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, type, ...props },
  ref,
) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      ref={ref}
      type={asChild ? undefined : (type ?? 'button')}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
});

export { buttonStyles };
