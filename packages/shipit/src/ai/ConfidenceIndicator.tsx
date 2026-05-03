'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../utils/cn';

/**
 * ConfidenceIndicator — horizontal bar + percent + tier label. The tier tone
 * is derived automatically from the value (high ≥ 95, medium ≥ 80, low ≥ 50,
 * unverified < 50) but can be overridden via `tier`.
 */

export type ConfidenceTier = 'high' | 'medium' | 'low' | 'unverified';

const tierLabel: Record<ConfidenceTier, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low · review',
  unverified: 'Unverified',
};

const tierBarClass: Record<ConfidenceTier, string> = {
  high: 'bg-ok',
  medium: 'bg-accent',
  low: 'bg-warn',
  unverified: 'bg-err',
};

const tierTextClass: Record<ConfidenceTier, string> = {
  high: 'text-ok',
  medium: 'text-accent',
  low: 'text-warn',
  unverified: 'text-err',
};

function deriveTier(value: number): ConfidenceTier {
  if (value >= 95) return 'high';
  if (value >= 80) return 'medium';
  if (value >= 50) return 'low';
  return 'unverified';
}

export interface ConfidenceIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Confidence value 0..100. */
  value: number;
  /** Override the auto-derived tier. */
  tier?: ConfidenceTier;
  /** Override the tier label. */
  label?: ReactNode;
  /** Pixel width of the bar. Default 120. */
  width?: number;
  /** Hide the percent number. */
  hideValue?: boolean;
}

export const ConfidenceIndicator = forwardRef<HTMLDivElement, ConfidenceIndicatorProps>(
  function ConfidenceIndicator(
    { value, tier: tierProp, label, width = 120, hideValue, className, ...props },
    ref,
  ) {
    const tier = tierProp ?? deriveTier(value);
    const pct = Math.max(0, Math.min(100, value));
    const display = label ?? tierLabel[tier];
    return (
      <div
        ref={ref}
        role="meter"
        aria-label={props['aria-label'] ?? 'Confidence'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)}% — ${typeof display === 'string' ? display : tierLabel[tier]}`}
        className={cn('inline-flex items-center gap-[10px] text-[11px]', className)}
        {...props}
      >
        <span aria-hidden style={{ width }} className="bg-panel-2 h-1 overflow-hidden rounded-full">
          <span
            className={cn(
              'block h-full rounded-full transition-[width] duration-(--duration-step)',
              tierBarClass[tier],
            )}
            style={{ width: `${pct}%` }}
          />
        </span>
        {!hideValue && (
          <span className="text-text min-w-[44px] font-mono tabular-nums">{pct.toFixed(1)}%</span>
        )}
        <span className={tierTextClass[tier]}>{display}</span>
      </div>
    );
  },
);

ConfidenceIndicator.displayName = 'ConfidenceIndicator';
