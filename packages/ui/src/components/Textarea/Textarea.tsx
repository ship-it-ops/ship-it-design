import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

const textareaStyles = cva(
  [
    'w-full font-sans text-text bg-panel rounded-md p-[10px]',
    'border outline-none transition-[border-color,box-shadow] duration-(--duration-micro)',
    'placeholder:text-text-dim resize-y',
    'focus-visible:ring-[3px]',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-panel-2',
  ],
  {
    variants: {
      tone: {
        default: 'border-border focus-visible:border-accent focus-visible:ring-accent-dim',
        error: 'border-err focus-visible:border-err focus-visible:ring-[oklch(0.55_0.18_30/0.18)]',
      },
    },
    defaultVariants: { tone: 'default' },
  },
);

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaStyles> {
  /** Error tone shortcut. Sets `aria-invalid` and the error border. */
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { tone, error, rows = 4, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={error || undefined}
      className={cn(textareaStyles({ tone: error ? 'error' : tone }), className)}
      {...props}
    />
  );
});
