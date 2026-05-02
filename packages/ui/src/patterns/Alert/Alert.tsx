import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Alert — inline messaging block. Four tones (info / ok / warn / err) with a
 * matching glyph, a left accent rule, and an optional dismiss action.
 *
 * For interrupting alerts (errors that need acknowledgment) use AlertDialog.
 * For transient feedback use Toast.
 */

export type AlertVariant = 'info' | 'ok' | 'warn' | 'err';

const alertStyles = cva('flex items-start gap-3 rounded-base border bg-panel p-3 text-[13px]', {
  variants: {
    variant: {
      info: 'border-border border-l-2 border-l-accent',
      ok: 'border-border border-l-2 border-l-ok',
      warn: 'border-border border-l-2 border-l-warn',
      err: 'border-border border-l-2 border-l-err',
    },
  },
  defaultVariants: { variant: 'info' },
});

const iconColorClass: Record<AlertVariant, string> = {
  info: 'text-accent',
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
};

const defaultGlyph: Record<AlertVariant, string> = {
  info: 'ℹ',
  ok: '✓',
  warn: '!',
  err: '×',
};

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertStyles> {
  /** Bold title text. */
  title?: ReactNode;
  /** Body description. */
  description?: ReactNode;
  /** Icon override; defaults to a glyph matched to the variant. */
  icon?: ReactNode;
  /** Optional trailing actions (rendered to the right of the description). */
  action?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', title, description, icon, action, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={variant === 'err' || variant === 'warn' ? 'alert' : 'status'}
      className={cn(alertStyles({ variant }), className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn('mt-[1px] text-[14px] leading-none', iconColorClass[variant!])}
      >
        {icon ?? defaultGlyph[variant!]}
      </span>
      <div className="min-w-0 flex-1">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-text-muted mt-[2px] text-[12px]">{description}</div>}
        {children}
      </div>
      {action && <div className="ml-1 shrink-0">{action}</div>}
    </div>
  );
});

Alert.displayName = 'Alert';
