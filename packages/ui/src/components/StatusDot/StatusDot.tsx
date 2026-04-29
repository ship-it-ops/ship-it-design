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

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  { state = 'ok', label, pulse, size = 8, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? 'status' : 'img'}
      aria-label={!label && typeof state === 'string' ? state : undefined}
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
      {label && <span className="text-[12px] text-text-muted">{label}</span>}
    </span>
  );
});
