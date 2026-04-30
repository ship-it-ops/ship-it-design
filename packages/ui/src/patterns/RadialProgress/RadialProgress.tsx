import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * RadialProgress — circular SVG progress ring. Renders the percent label in the
 * center by default; pass `children` to override (e.g., a glyph or a count).
 *
 * Tones: accent (default) and ok (auto-applied when value === max).
 */

export type RadialTone = 'accent' | 'ok' | 'warn' | 'err';

export interface RadialProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value, 0..max. */
  value: number;
  /** Maximum value. Default 100. */
  max?: number;
  /** Pixel size of the SVG. Default 64. */
  size?: number;
  /** Stroke width. Default 4. */
  thickness?: number;
  /** Color tone. Auto-flips to `ok` on completion unless explicitly set. */
  tone?: RadialTone;
  /** Replaces the centered percent label. */
  children?: ReactNode;
  /** Accessible label. Falls back to `${pct}%`. */
  'aria-label'?: string;
}

const toneStrokeClass: Record<RadialTone, string> = {
  accent: 'stroke-accent',
  ok: 'stroke-ok',
  warn: 'stroke-warn',
  err: 'stroke-err',
};

export const RadialProgress = forwardRef<HTMLDivElement, RadialProgressProps>(
  function RadialProgress(
    {
      value,
      max = 100,
      size = 64,
      thickness = 4,
      tone,
      children,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) {
    const clamped = Math.min(max, Math.max(0, value));
    const pct = max > 0 ? (clamped / max) * 100 : 0;
    const r = (size - thickness) / 2;
    const c = 2 * Math.PI * r;
    const dash = (pct / 100) * c;
    const resolvedTone: RadialTone = tone ?? (clamped >= max ? 'ok' : 'accent');

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(pct)}
        aria-label={ariaLabel ?? `${Math.round(pct)}%`}
        className={cn('relative inline-grid place-items-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={thickness}
            className="stroke-panel-2"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className={cn(
              'transition-[stroke-dasharray] duration-(--duration-step)',
              toneStrokeClass[resolvedTone],
            )}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-mono text-[11px] font-medium tabular-nums">
          {children ?? `${Math.round(pct)}%`}
        </div>
      </div>
    );
  },
);
