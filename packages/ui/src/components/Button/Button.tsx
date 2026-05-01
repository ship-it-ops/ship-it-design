import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

/**
 * Variant + size styles. All classes use semantic tokens (bg-brand, text-on-brand)
 * so swapping the palette via @ship-it/tokens automatically reflows the Button.
 */
const buttonStyles = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium whitespace-nowrap rounded-md',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand text-on-brand hover:bg-brand-hover',
        secondary: 'bg-surface text-text border border-border hover:bg-brand-subtle',
        ghost: 'bg-transparent text-text hover:bg-brand-subtle',
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
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonStyles> {
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
