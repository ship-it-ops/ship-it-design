'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/* ───── Atomic Radix wrappers (advanced API) ───── */

export const SelectRoot = RadixSelect.Root;
export const SelectValue = RadixSelect.Value;
export const SelectGroup = RadixSelect.Group;
export const SelectLabel = RadixSelect.Label;

const triggerClasses = {
  sm: 'h-7 px-2 text-[12px]',
  md: 'h-[34px] px-[10px] text-[13px]',
  lg: 'h-10 px-3 text-[14px]',
} as const;

export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  RadixSelect.SelectTriggerProps & { size?: keyof typeof triggerClasses }
>(function SelectTrigger({ size = 'md', className, children, ...props }, ref) {
  return (
    <RadixSelect.Trigger
      ref={ref}
      className={cn(
        'text-text bg-panel border-border inline-flex items-center justify-between gap-2 rounded-md border font-sans',
        'data-[state=open]:border-accent',
        'focus-visible:ring-accent-dim outline-none focus-visible:ring-[3px]',
        'data-[disabled]:bg-panel-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        'transition-[border-color,box-shadow] duration-(--duration-micro)',
        triggerClasses[size],
        className,
      )}
      {...props}
    >
      {children}
      <RadixSelect.Icon className="text-text-dim text-[11px] leading-none">▾</RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent = forwardRef<HTMLDivElement, RadixSelect.SelectContentProps>(
  function SelectContent(
    { className, children, position = 'popper', sideOffset = 6, ...props },
    ref,
  ) {
    return (
      <RadixSelect.Portal>
        <RadixSelect.Content
          ref={ref}
          position={position}
          sideOffset={sideOffset}
          className={cn(
            'bg-panel border-border z-popover min-w-[var(--radix-select-trigger-width)] rounded-md border p-1 shadow',
            'data-[state=open]:animate-[ship-pop-in_140ms_var(--easing-out)]',
            className,
          )}
          {...props}
        >
          <RadixSelect.Viewport>{children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    );
  },
);

SelectContent.displayName = 'SelectContent';

export const SelectItem = forwardRef<HTMLDivElement, RadixSelect.SelectItemProps>(
  function SelectItem({ className, children, ...props }, ref) {
    return (
      <RadixSelect.Item
        ref={ref}
        className={cn(
          'relative flex cursor-pointer items-center rounded-sm px-2 py-[6px] text-[13px] outline-none',
          'data-[highlighted]:bg-accent-dim data-[highlighted]:text-accent',
          'data-[state=checked]:font-medium',
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
          className,
        )}
        {...props}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      </RadixSelect.Item>
    );
  },
);

SelectItem.displayName = 'SelectItem';

/* ───── Convenience wrapper ───── */

export type SelectOption = string | { value: string; label: ReactNode };

export interface SelectProps extends Omit<RadixSelect.SelectProps, 'children'> {
  /** Array of strings, or `{value, label}` objects. */
  options: SelectOption[];
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Trigger size. */
  size?: keyof typeof triggerClasses;
  /** Optional className for the trigger. */
  className?: string;
  /** Accessible label forwarded to the trigger button. */
  'aria-label'?: string;
  /** ID of an element labelling the trigger. */
  'aria-labelledby'?: string;
}

/**
 * One-line Select. For composition (groups, separators), use the lower-level
 * `SelectRoot/Trigger/Content/Item` exports directly.
 */
export function Select({
  options,
  placeholder = 'Select…',
  size,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rootProps
}: SelectProps) {
  return (
    <RadixSelect.Root {...rootProps}>
      <SelectTrigger
        size={size}
        className={className}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </RadixSelect.Root>
  );
}
