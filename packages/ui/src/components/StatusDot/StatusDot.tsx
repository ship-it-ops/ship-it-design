'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { warnIfInvalidColor } from '../../utils/color-override';

export type StatusState = 'ok' | 'warn' | 'err' | 'off' | 'sync' | 'accent';

type StatusDotPropsBase = Omit<HTMLAttributes<HTMLSpanElement>, 'color'> & {
  /** Optional label rendered next to the dot. */
  label?: ReactNode;
  /** Pulse the dot — used for `sync` state to indicate live activity. */
  pulse?: boolean;
  /** Pixel diameter. Defaults to 8px. */
  size?: number;
};

/**
 * State path: use a semantic state.
 *   <StatusDot state="ok" />
 *
 * Color path (escape hatch): pass an arbitrary CSS color.
 *   <StatusDot color="#7c3aed" />
 *
 * Setting both is a compile error.
 */
export type StatusDotProps =
  | (StatusDotPropsBase & { state?: StatusState; color?: undefined })
  | (StatusDotPropsBase & { color: string; state?: never });

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

export const stateLabel: Record<StatusState, string> = {
  ok: 'Online',
  warn: 'Warning',
  err: 'Error',
  off: 'Offline',
  sync: 'Syncing',
  accent: 'Active',
};

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  { state = 'ok', color, label, pulse, size = 8, className, ...props },
  ref,
) {
  const useColor = color && warnIfInvalidColor(color, 'StatusDot');

  return (
    <span
      ref={ref}
      role={label ? 'status' : 'img'}
      aria-label={!label ? (useColor ? 'Status' : stateLabel[state]) : undefined}
      className={cn('inline-flex items-center gap-[6px]', className)}
      {...props}
    >
      <span
        className={cn(
          'inline-block rounded-full',
          !useColor && stateColor[state],
          !useColor && stateText[state],
          pulse && 'animate-[ship-pulse-ring_1.6s_infinite]',
        )}
        style={{
          width: size,
          height: size,
          ...(useColor ? { backgroundColor: color, color: color! } : {}),
        }}
      />
      {label && <span className="text-text-muted text-[12px]">{label}</span>}
    </span>
  );
});

StatusDot.displayName = 'StatusDot';
