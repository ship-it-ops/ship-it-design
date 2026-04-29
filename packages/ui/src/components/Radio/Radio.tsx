import * as RadixRadio from '@radix-ui/react-radio-group';
import { forwardRef, useId, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/* ───── RadioGroup ───── */

export interface RadioGroupProps extends Omit<RadixRadio.RadioGroupProps, 'asChild'> {}

/**
 * Container for radio items. Wires up roving focus + arrow-key navigation.
 *
 *   <RadioGroup value={v} onValueChange={setV}>
 *     <Radio value="team" label="Everyone on team" />
 *     <Radio value="admins" label="Admins only" />
 *   </RadioGroup>
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, ...props },
  ref,
) {
  return (
    <RadixRadio.Root
      ref={ref}
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
});

/* ───── Radio ───── */

export interface RadioProps extends Omit<RadixRadio.RadioGroupItemProps, 'asChild' | 'children'> {
  /** Optional inline label. */
  label?: ReactNode;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { label, className, id: idProp, ...props },
  ref,
) {
  const reactId = useId();
  const id = idProp ?? `radio-${reactId}`;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 select-none',
        props.disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
    >
      <RadixRadio.Item
        ref={ref}
        id={id}
        className={cn(
          'h-4 w-4 grid place-items-center rounded-full',
          'bg-panel border border-border-strong',
          'data-[state=checked]:border-accent',
          'transition-[border-color] duration-(--duration-micro)',
          'outline-none focus-visible:ring-[3px] focus-visible:ring-accent-dim',
        )}
        {...props}
      >
        <RadixRadio.Indicator className="block h-[7px] w-[7px] rounded-full bg-accent" />
      </RadixRadio.Item>
      {label && (
        <label htmlFor={id} className="text-[13px] cursor-pointer">
          {label}
        </label>
      )}
    </span>
  );
});
