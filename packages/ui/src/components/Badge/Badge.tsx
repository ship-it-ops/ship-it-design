import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

const badgeStyles = cva(
  'inline-flex items-center font-sans leading-none whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'bg-panel-2 text-text-muted border border-border',
        accent: 'bg-accent-dim text-accent border border-transparent',
        ok: 'bg-[color-mix(in_oklab,var(--color-ok),transparent_85%)] text-ok border border-transparent',
        warn: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_85%)] text-warn border border-transparent',
        err: 'bg-[color-mix(in_oklab,var(--color-err),transparent_85%)] text-err border border-transparent',
        purple:
          'bg-[color-mix(in_oklab,var(--color-purple),transparent_85%)] text-purple border border-transparent',
        pink:
          'bg-[color-mix(in_oklab,var(--color-pink),transparent_85%)] text-pink border border-transparent',
        outline: 'bg-transparent text-text border border-border-strong',
        solid: 'bg-text text-bg border border-text',
      },
      size: {
        sm: 'h-[18px] px-[6px] py-[1px] text-[10px] gap-1 rounded-full',
        md: 'h-[22px] px-2 py-[2px] text-[11px] gap-[5px] rounded-full',
        lg: 'h-[26px] px-[10px] py-[3px] text-[12px] gap-[6px] rounded-full',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {
  /** Show a colored leading dot. */
  dot?: boolean;
  /** Optional leading icon (defers to children). */
  icon?: ReactNode;
}

const dotColorClass = {
  neutral: 'bg-text-dim',
  accent: 'bg-accent',
  ok: 'bg-ok',
  warn: 'bg-warn',
  err: 'bg-err',
  purple: 'bg-purple',
  pink: 'bg-pink',
  outline: 'bg-text-muted',
  solid: 'bg-bg',
} as const;

const dotSize = { sm: 'h-[5px] w-[5px]', md: 'h-[6px] w-[6px]', lg: 'h-[7px] w-[7px]' } as const;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', size = 'md', dot, icon, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(badgeStyles({ variant, size }), className)} {...props}>
      {dot && (
        <span
          aria-hidden
          className={cn('inline-block rounded-full', dotSize[size!], dotColorClass[variant!])}
        />
      )}
      {icon && <span className="inline-flex leading-none">{icon}</span>}
      {children}
    </span>
  );
});

export { badgeStyles };
