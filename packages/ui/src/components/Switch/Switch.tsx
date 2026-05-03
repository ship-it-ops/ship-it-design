'use client';

import * as RadixSwitch from '@radix-ui/react-switch';
import { forwardRef, useId, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface SwitchProps extends Omit<RadixSwitch.SwitchProps, 'asChild' | 'children'> {
  /** Optional inline label rendered to the right of the switch. */
  label?: ReactNode;
  /** Visual size. Default `md`. */
  size?: 'sm' | 'md';
}

const trackClasses = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
} as const;

const thumbClasses = {
  sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
  md: 'h-4 w-4 data-[state=checked]:translate-x-4',
} as const;

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, size = 'md', className, id: idProp, ...props },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `sw-${reactId}`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 select-none',
        props.disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
    >
      <RadixSwitch.Root
        ref={ref}
        id={id}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border transition-colors duration-(--duration-micro)',
          'bg-panel-2 border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent',
          'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
          'disabled:cursor-not-allowed',
          trackClasses[size],
        )}
        {...props}
      >
        <RadixSwitch.Thumb
          className={cn(
            'bg-text absolute top-1/2 left-[1px] -translate-y-1/2 rounded-full shadow-sm',
            'data-[state=checked]:bg-on-accent transition-transform duration-(--duration-micro)',
            thumbClasses[size],
          )}
        />
      </RadixSwitch.Root>
      {label && (
        <label htmlFor={id} className="cursor-pointer text-[13px]">
          {label}
        </label>
      )}
    </span>
  );
});

Switch.displayName = 'Switch';
