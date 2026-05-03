'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';

import { cn } from '../../utils/cn';

/**
 * Seven variants × three sizes × five states. One primary per surface — everything
 * else defers. Variants and sizes match `design-handoff/project/components/Button.jsx`.
 */
const buttonStyles = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap',
    'font-medium transition-[background,filter,box-shadow,color] duration-(--duration-micro)',
    'outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-accent-dim',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-on-accent border border-accent hover:brightness-110 active:brightness-95',
        secondary:
          'bg-panel-2 text-text border border-border hover:bg-[color-mix(in_oklab,var(--color-panel-2),white_4%)]',
        ghost: 'bg-transparent text-text border border-transparent hover:bg-panel-2',
        outline: 'bg-transparent text-text border border-border-strong hover:bg-panel-2',
        destructive:
          'bg-err text-on-accent border border-err hover:brightness-110 active:brightness-95',
        success: 'bg-ok text-on-accent border border-ok hover:brightness-110 active:brightness-95',
        link: 'bg-transparent text-accent border border-transparent underline underline-offset-[3px] hover:brightness-110',
      },
      size: {
        sm: 'h-[26px] px-[10px] text-[11px] gap-[5px] rounded-[5px]',
        md: 'h-[32px] px-3 text-[12px] gap-[6px] rounded-md',
        lg: 'h-[38px] px-4 text-[13px] gap-[7px] rounded-[7px]',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

/** Spinner glyph used for the loading state. Inherits color from the button text. */
function Spinner({ size }: { size: number }) {
  return (
    <span
      aria-hidden
      className="inline-block animate-[ship-spin_0.7s_linear_infinite] rounded-full border-[1.5px] border-current border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonStyles> {
  /** Icon shown to the left of the label (or replacing the spinner when `loading`). */
  icon?: ReactNode;
  /** Icon/text shown to the right of the label. Often a chevron, kbd hint, or arrow. */
  trailing?: ReactNode;
  /** When true, hides the icon, swaps in a spinner, and disables the button. */
  loading?: boolean;
  /**
   * Render the inner content as a child element instead of a `<button>`. Useful for
   * link wrappers — `<Button asChild><Link href="/" /></Button>`.
   */
  asChild?: boolean;
}

/** Pixel size of the icon/spinner inside each button size. */
const iconSize = { sm: 11, md: 12, lg: 13 } as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    fullWidth,
    icon,
    trailing,
    loading = false,
    disabled,
    asChild = false,
    type,
    className,
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const iconPx = iconSize[size ?? 'md'];
  const composedClassName = cn(buttonStyles({ variant, size, fullWidth }), className);

  // asChild defers all rendering to the consumer's element. We just decorate it
  // with Button styles — Slot requires exactly one child, so icon/trailing/loading
  // slots are intentionally not supported on asChild buttons.
  if (asChild) {
    return (
      <Slot
        ref={ref as unknown as Ref<HTMLElement>}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        data-disabled={isDisabled ? '' : undefined}
        className={composedClassName}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={composedClassName}
      {...props}
    >
      {loading ? (
        <Spinner size={iconPx} />
      ) : icon ? (
        <span className="inline-flex">{icon}</span>
      ) : null}
      {children}
      {trailing && <span className="inline-flex opacity-60">{trailing}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export { buttonStyles };
