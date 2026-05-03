'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export type StatusState = 'ok' | 'warn' | 'err' | 'off' | 'sync' | 'accent';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic status. */
  state?: StatusState;
  /** Optional label rendered next to the dot. */
  label?: ReactNode;
  /** Pulse the dot — used for `sync` state to indicate live activity. */
  pulse?: boolean;
  /** Pixel diameter. Defaults to 8px. */
  size?: number;
}

const stateColor: Record<StatusState, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  err: 'bg-err',
  off: 'bg-text-dim',
  sync: 'bg-accent',
  accent: 'bg-accent',
};

const stateText: Record<StatusState, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
  off: 'text-text-dim',
  sync: 'text-accent',
  accent: 'text-accent',
};

/**
 * Human-friendly accessible names for each status. Used as the default
 * `aria-label` when no `label` is provided so screen readers announce
 * "Online" instead of the raw enum token "ok". Exported so other components
 * (e.g., `Avatar`'s status indicator) can reuse the same vocabulary.
 */
export const stateLabel: Record<StatusState, string> = {
  ok: 'Online',
  warn: 'Warning',
  err: 'Error',
  off: 'Offline',
  sync: 'Syncing',
  accent: 'Active',
};

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  { state = 'ok', label, pulse, size = 8, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? 'status' : 'img'}
      aria-label={!label ? stateLabel[state] : undefined}
      className={cn('inline-flex items-center gap-[6px]', className)}
      {...props}
    >
      <span
        className={cn(
          'inline-block rounded-full',
          stateColor[state],
          pulse && 'animate-[ship-pulse-ring_1.6s_infinite]',
          stateText[state],
        )}
        style={{ width: size, height: size }}
      />
      {label && <span className="text-text-muted text-[12px]">{label}</span>}
    </span>
  );
});

StatusDot.displayName = 'StatusDot';
