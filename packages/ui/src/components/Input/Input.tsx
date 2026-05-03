'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

const inputWrapperStyles = cva(
  [
    'flex items-center gap-[6px] font-sans transition-[border-color,box-shadow] duration-(--duration-micro)',
    'border focus-within:ring-[3px]',
    'has-[:disabled]:opacity-50 has-[:disabled]:bg-panel-2',
  ],
  {
    variants: {
      size: {
        sm: 'h-7 px-2 text-[12px] rounded-md',
        md: 'h-[34px] px-[10px] text-[13px] rounded-md',
        lg: 'h-10 px-3 text-[14px] rounded-md',
      },
      tone: {
        default: 'bg-panel border-border focus-within:border-accent focus-within:ring-accent-dim',
        err:
          'bg-panel border-err focus-within:border-err focus-within:ring-[oklch(0.55_0.18_30/0.18)]',
      },
    },
    defaultVariants: { size: 'md', tone: 'default' },
  },
);

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputWrapperStyles> {
  /** Element rendered to the left of the input (an `IconGlyph`, `@`, etc.). */
  icon?: ReactNode;
  /** Element rendered to the right (a unit suffix, kbd hint, clear button). */
  trailing?: ReactNode;
  /** When true, swaps the wrapper border to error tone (independent of `aria-invalid`). */
  error?: boolean;
  /** Pixel width override; otherwise the wrapper grows to fill its container. */
  width?: number | string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, tone, icon, trailing, error, width, className, style, disabled, ...props },
  ref,
) {
  const computedTone = error ? 'err' : tone;
  return (
    <div
      className={cn(inputWrapperStyles({ size, tone: computedTone }), className)}
      style={{ width, ...style }}
    >
      {icon && <span className="text-text-dim leading-none">{icon}</span>}
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          'text-text min-w-0 flex-1 border-none bg-transparent font-sans outline-none',
          'placeholder:text-text-dim',
          'disabled:cursor-not-allowed',
        )}
        {...props}
      />
      {trailing && <span className="text-text-dim text-[11px]">{trailing}</span>}
    </div>
  );
});

Input.displayName = 'Input';
