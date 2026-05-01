import * as RadixRadio from '@radix-ui/react-radio-group';
import { forwardRef, useId, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/* ───── RadioGroup ───── */

export type RadioGroupProps = Omit<RadixRadio.RadioGroupProps, 'asChild'>;

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
  return <RadixRadio.Root ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />;
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
        props.disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
    >
      <RadixRadio.Item
        ref={ref}
        id={id}
        className={cn(
          'grid h-4 w-4 place-items-center rounded-full',
          'bg-panel border-border-strong border',
          'data-[state=checked]:border-accent',
          'transition-[border-color] duration-(--duration-micro)',
          'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
        )}
        {...props}
      >
        <RadixRadio.Indicator className="bg-accent block h-[7px] w-[7px] rounded-full" />
      </RadixRadio.Item>
      {label && (
        <label htmlFor={id} className="cursor-pointer text-[13px]">
          {label}
        </label>
      )}
    </span>
  );
});
