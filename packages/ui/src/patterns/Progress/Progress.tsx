import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Progress — linear bar in determinate (`value`) or `indeterminate` mode.
 * Pass `label` for an accessible name and a visible label row above the bar.
 *
 * For value rounding: the bar's width is the raw value clamped to [0, max];
 * the label/aria-valuenow are rounded to whole percent.
 */

const trackStyles = cva('w-full rounded-full bg-panel-2 overflow-hidden', {
  variants: {
    size: {
      sm: 'h-[3px]',
      md: 'h-[4px]',
      lg: 'h-[6px]',
    },
  },
  defaultVariants: { size: 'md' },
});

const fillStyles = cva('h-full rounded-full transition-[width] duration-(--duration-step)', {
  variants: {
    tone: {
      accent: 'bg-accent',
      ok: 'bg-ok',
      warn: 'bg-warn',
      err: 'bg-err',
    },
  },
  defaultVariants: { tone: 'accent' },
});

export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role'>,
    VariantProps<typeof trackStyles>,
    VariantProps<typeof fillStyles> {
  /** Numeric progress, 0..max. Ignored when `indeterminate`. */
  value?: number;
  /** Maximum value. Default 100. */
  max?: number;
  /** When true, shows an indeterminate sliding pill instead of a determinate fill. */
  indeterminate?: boolean;
  /** Optional visible label (rendered above the bar with the percent). */
  label?: ReactNode;
  /** When false, hides the percent readout next to the label. Default true. */
  showValue?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value = 0,
    max = 100,
    indeterminate = false,
    label,
    showValue = true,
    tone,
    size,
    className,
    ...props
  },
  ref,
) {
  const clamped = Math.min(max, Math.max(0, value));
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  const display = Math.round(pct);

  return (
    <div ref={ref} className={cn('flex w-full flex-col gap-2', className)} {...props}>
      {label != null && (
        <div className="flex text-[12px]">
          <span className="text-text-muted">{label}</span>
          {showValue && !indeterminate && (
            <span className="ml-auto font-mono tabular-nums text-text">{display}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : display}
        aria-label={typeof label === 'string' ? label : undefined}
        className={trackStyles({ size })}
      >
        {indeterminate ? (
          <span
            aria-hidden
            className={cn(
              'block h-full w-[40%] rounded-full',
              fillStyles({ tone }),
              'animate-[ship-indeterminate_1.4s_linear_infinite]',
            )}
          />
        ) : (
          <span aria-hidden className={fillStyles({ tone })} style={{ width: `${pct}%` }} />
        )}
      </div>
    </div>
  );
});
