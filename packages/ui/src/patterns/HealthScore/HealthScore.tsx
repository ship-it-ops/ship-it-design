'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { HoverCard } from '../../components/HoverCard';
import { cn } from '../../utils/cn';
import { RadialProgress, type RadialTone } from '../RadialProgress';

/**
 * HealthScore — `RadialProgress` + delta indicator + optional breakdown
 * tooltip. The shape generalizes recurring product surfaces like service
 * health, deployment confidence, and graph health.
 *
 * Delta sign drives the arrow direction and tone (positive = ok, negative =
 * err) unless an explicit `tone` is set. When a `breakdown` is supplied, the
 * score wraps in a `HoverCard` that reveals the per-bucket contributions.
 */

export interface HealthScoreBreakdownEntry {
  label: ReactNode;
  value: number;
  /** Tone for the value text. Defaults to inheriting the parent score tone. */
  tone?: RadialTone;
}

export interface HealthScoreProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Current value, 0..max. */
  value: number;
  /** Maximum value. Default 100. */
  max?: number;
  /**
   * Signed change vs. the previous period. Positive draws an up-arrow + ok
   * tone, negative draws a down-arrow + err tone. Pass `0` to render a flat
   * indicator.
   */
  delta?: number;
  /** Label rendered under the score. */
  label?: ReactNode;
  /** Optional per-bucket contributions revealed in a HoverCard. */
  breakdown?: ReadonlyArray<HealthScoreBreakdownEntry>;
  /** Pixel size for the RadialProgress. Default 72. */
  size?: number;
  /** Color tone for the ring. Auto-derived when omitted. */
  tone?: RadialTone;
  /** Accessible label for the score. Defaults to `${pct}% health`. */
  'aria-label'?: string;
}

function deltaTone(delta: number): RadialTone {
  if (delta > 0) return 'ok';
  if (delta < 0) return 'err';
  return 'accent';
}

function deltaGlyph(delta: number) {
  if (delta > 0) return '↑';
  if (delta < 0) return '↓';
  return '·';
}

const toneTextClass: Record<RadialTone, string> = {
  accent: 'text-text-muted',
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
};

export const HealthScore = forwardRef<HTMLDivElement, HealthScoreProps>(function HealthScore(
  {
    value,
    max = 100,
    delta,
    label,
    breakdown,
    size = 72,
    tone,
    className,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const pct = max > 0 ? Math.round((Math.min(max, Math.max(0, value)) / max) * 100) : 0;
  const resolvedTone: RadialTone = tone ?? (pct >= 80 ? 'ok' : pct >= 50 ? 'accent' : 'warn');
  const indicatorTone = typeof delta === 'number' ? deltaTone(delta) : 'accent';

  const core = (
    <div
      ref={ref}
      className={cn('inline-flex flex-col items-center gap-1', className)}
      aria-label={ariaLabel ?? `${pct}% health`}
      {...props}
    >
      <RadialProgress value={value} max={max} size={size} tone={resolvedTone} />
      {label && <div className="text-text-muted mt-1 text-[12px] leading-tight">{label}</div>}
      {typeof delta === 'number' && (
        <div className={cn('font-mono text-[11px] tabular-nums', toneTextClass[indicatorTone])}>
          <span aria-hidden>{deltaGlyph(delta)}</span> {Math.abs(delta)}
        </div>
      )}
    </div>
  );

  if (!breakdown || breakdown.length === 0) {
    return core;
  }

  return (
    <HoverCard
      trigger={<span className="inline-flex">{core}</span>}
      content={
        <div className="flex min-w-[180px] flex-col gap-2">
          <div className="text-text-dim font-mono text-[9px] tracking-[1.4px] uppercase">
            Breakdown
          </div>
          <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[12px]">
            {breakdown.map((entry, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-text-muted flex-1 truncate">{entry.label}</span>
                <span
                  className={cn(
                    'font-mono tabular-nums',
                    entry.tone ? toneTextClass[entry.tone] : 'text-text',
                  )}
                >
                  {entry.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
});

HealthScore.displayName = 'HealthScore';
