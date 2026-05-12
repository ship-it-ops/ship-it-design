'use client';

import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { forwardRef, useId, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<RadixCheckbox.CheckboxProps, 'asChild' | 'children'> {
  /** Optional inline label rendered to the right of the box. */
  label?: ReactNode;
  /**
   * `'comfortable'` (default) renders the desktop checkbox. `'touch'` bumps the
   * box to 22×22 inside a 44pt-min row so the whole label is tappable.
   */
  density?: 'comfortable' | 'touch';
}

/**
 * Tri-state checkbox. Set `checked="indeterminate"` for the dash-mark state used
 * in select-all rows.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, density = 'comfortable', className, id: idProp, ...props },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `cb-${reactId}`;
  const isTouch = density === 'touch';

  return (
    <span
      className={cn(
        'inline-flex items-center select-none',
        isTouch ? 'min-h-touch gap-3' : 'gap-2',
        props.disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
    >
      <RadixCheckbox.Root
        ref={ref}
        id={id}
        className={cn(
          'grid place-items-center',
          isTouch ? 'h-[22px] w-[22px] rounded-sm border-[1.5px]' : 'h-4 w-4 rounded-xs border',
          'bg-panel border-border-strong',
          'data-[state=checked]:bg-accent data-[state=checked]:border-accent',
          'data-[state=indeterminate]:bg-accent data-[state=indeterminate]:border-accent',
          'transition-[background,border-color] duration-(--duration-micro)',
          'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
        )}
        {...props}
      >
        <RadixCheckbox.Indicator
          className={cn('text-on-accent leading-none', isTouch ? 'text-[14px]' : 'text-[11px]')}
        >
          {props.checked === 'indeterminate' ? '−' : '✓'}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label
          htmlFor={id}
          className={cn('cursor-pointer', isTouch ? 'text-m-body' : 'text-[13px]')}
        >
          {label}
        </label>
      )}
    </span>
  );
});

Checkbox.displayName = 'Checkbox';
