'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export type StatTrend = 'up' | 'down' | 'flat';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** UPPERCASE eyebrow label above the value. */
  label: ReactNode;
  /** The big number / value. Renders in tabular-nums monospace for ticker comparison. */
  value: ReactNode;
  /** Optional delta string ("+284 today", "-0.3%"). */
  delta?: ReactNode;
  /** Pairs with `delta` to color the change: up = ok, down = err, flat = neutral. */
  trend?: StatTrend;
  /** Optional trailing icon, top-right. */
  icon?: ReactNode;
}

const trendClasses: Record<StatTrend, string> = {
  up: 'text-ok',
  down: 'text-err',
  flat: 'text-text-dim',
};

const trendArrows: Record<StatTrend, string> = { up: '↑', down: '↓', flat: '→' };

/**
 * Card subclass for a single metric. Use in dashboard grids; cap at 4 per row.
 */
export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(function StatCard(
  { label, value, delta, trend = 'flat', icon, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('bg-panel border-border rounded-base block border p-[18px]', className)}
      {...props}
    >
      <div className="mb-[10px] flex items-center justify-between">
        <div className="text-text-dim font-mono text-[10px] tracking-wide uppercase">{label}</div>
        {icon && <div className="text-text-dim text-[14px]">{icon}</div>}
      </div>
      <div className="text-text font-mono text-[26px] leading-none font-medium tracking-tight">
        {value}
      </div>
      {delta !== undefined && (
        <div className={cn('mt-[6px] font-mono text-[11px]', trendClasses[trend])}>
          {trendArrows[trend]} {delta}
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';
