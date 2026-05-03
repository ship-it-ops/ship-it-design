'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Alert — inline messaging block. Four tones (accent / ok / warn / err) with a
 * matching glyph, a left accent rule, and an optional dismiss action.
 *
 * For interrupting alerts (errors that need acknowledgment) use AlertDialog.
 * For transient feedback use Toast.
 */

export type AlertTone = 'accent' | 'ok' | 'warn' | 'err';

const alertStyles = cva('flex items-start gap-3 rounded-base border bg-panel p-3 text-[13px]', {
  variants: {
    tone: {
      accent: 'border-border border-l-2 border-l-accent',
      ok: 'border-border border-l-2 border-l-ok',
      warn: 'border-border border-l-2 border-l-warn',
      err: 'border-border border-l-2 border-l-err',
    },
  },
  defaultVariants: { tone: 'accent' },
});

const iconColorClass: Record<AlertTone, string> = {
  accent: 'text-accent',
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
};

const defaultGlyph: Record<AlertTone, string> = {
  accent: 'ℹ',
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
  /** Icon override; defaults to a glyph matched to the tone. */
  icon?: ReactNode;
  /** Optional trailing actions (rendered to the right of the description). */
  action?: ReactNode;
  /**
   * Aria-live behavior for the alert. Default `'polite'`.
   *
   * Alerts that are part of the initial page render should leave this at the
   * default — `role="alert"` (which is `aria-live="assertive"`) interrupts the
   * screen reader on every page load. Set `'assertive'` only for urgent
   * alerts that appear *after* initial render. Set `'off'` to suppress
   * announcements entirely (still rendered, still has `role="status"`).
   */
  live?: 'off' | 'polite' | 'assertive';
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'accent', title, description, icon, action, live = 'polite', className, children, ...props },
  ref,
) {
  const t = (tone ?? 'accent') as AlertTone;
  return (
    <div
      ref={ref}
      role={live === 'assertive' ? 'alert' : 'status'}
      aria-live={live === 'off' ? undefined : live}
      className={cn(alertStyles({ tone }), className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn('mt-[1px] text-[14px] leading-none', iconColorClass[t])}
      >
        {icon ?? defaultGlyph[t]}
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
