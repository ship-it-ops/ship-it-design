import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { forwardRef, useId, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface CheckboxProps
  extends Omit<RadixCheckbox.CheckboxProps, 'asChild' | 'children'> {
  /** Optional inline label rendered to the right of the box. */
  label?: ReactNode;
}

/**
 * Tri-state checkbox. Set `checked="indeterminate"` for the dash-mark state used
 * in select-all rows.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, className, id: idProp, ...props },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `cb-${reactId}`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 select-none',
        props.disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
    >
      <RadixCheckbox.Root
        ref={ref}
        id={id}
        className={cn(
          'h-4 w-4 grid place-items-center rounded-xs',
          'bg-panel border border-border-strong',
          'data-[state=checked]:bg-accent data-[state=checked]:border-accent',
          'data-[state=indeterminate]:bg-accent data-[state=indeterminate]:border-accent',
          'transition-[background,border-color] duration-(--duration-micro)',
          'outline-none focus-visible:ring-[3px] focus-visible:ring-accent-dim',
        )}
        {...props}
      >
        <RadixCheckbox.Indicator className="text-on-accent text-[11px] leading-none">
          {props.checked === 'indeterminate' ? '−' : '✓'}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label htmlFor={id} className="text-[13px] cursor-pointer">
          {label}
        </label>
      )}
    </span>
  );
});
