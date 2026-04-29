import { forwardRef, useMemo, type SVGAttributes } from 'react';

import { cn } from '../../utils/cn';

/**
 * Sparkline — small inline SVG chart for showing trend at a glance. Computes
 * a polyline path from `values`; optionally fills the area under the line.
 *
 * The only chart we ship — the design system's stance on charting is that
 * production apps should bring their own (Recharts, Visx, etc.) when they
 * need anything more than a quiet trend cue.
 */

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'fill' | 'values'> {
  /** Numeric series. Drawn at uniform horizontal spacing. */
  values: ReadonlyArray<number>;
  /** Pixel width. Default 160. */
  width?: number;
  /** Pixel height. Default 32. */
  height?: number;
  /** Stroke color (CSS color or var). Defaults to `currentColor`. */
  stroke?: string;
  /** Stroke width. Default 1.5. */
  strokeWidth?: number;
  /** When true, fills the area under the line at 16% opacity. */
  fill?: boolean;
  /** Accessible label. Defaults to `Trend`. */
  'aria-label'?: string;
}

function buildPath(values: ReadonlyArray<number>, w: number, h: number) {
  if (values.length === 0) return { line: '', area: '' };
  const pad = 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = values.length === 1 ? 0 : (w - pad * 2) / (values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const line = `M${points.join(' L')}`;
  const area = `${line} L${(pad + (values.length - 1) * stepX).toFixed(2)},${(h - pad).toFixed(
    2,
  )} L${pad.toFixed(2)},${(h - pad).toFixed(2)} Z`;
  return { line, area };
}

export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  {
    values,
    width = 160,
    height = 32,
    stroke = 'currentColor',
    strokeWidth = 1.5,
    fill = false,
    className,
    'aria-label': ariaLabel = 'Trend',
    ...props
  },
  ref,
) {
  const { line, area } = useMemo(() => buildPath(values, width, height), [values, width, height]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn('inline-block', className)}
      {...props}
    >
      {fill && <path d={area} fill={stroke} fillOpacity={0.16} stroke="none" />}
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});
