import * as RadixPopover from '@radix-ui/react-popover';
import { forwardRef, useState, type ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';
import { Calendar } from './Calendar';

/**
 * DatePicker — a button-style trigger that opens a popover containing a
 * `Calendar`. Pass `value` / `onValueChange` for the selected date.
 */

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date) => void;
  placeholder?: string;
  /** Format the selected date for display. Default: `toLocaleDateString()`. */
  format?: (date: Date) => string;
  /** Optional disable predicate forwarded to Calendar. */
  isDateDisabled?: (date: Date) => boolean;
  /** Pixel width of the trigger button. Default 200. */
  width?: number | string;
  disabled?: boolean;
  /** Content for the trigger when no date is selected. Defaults to `placeholder`. */
  emptyLabel?: ReactNode;
  'aria-label'?: string;
  id?: string;
  name?: string;
}

const defaultFormat = (d: Date) => d.toLocaleDateString();

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder = 'Pick a date',
    format = defaultFormat,
    isDateDisabled,
    width = 200,
    disabled,
    emptyLabel,
    'aria-label': ariaLabel,
    id,
    name,
  },
  ref,
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useControllableState<Date>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <RadixPopover.Trigger asChild>
        <button
          ref={ref}
          id={id}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          className={cn(
            'flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-left text-[13px] text-text outline-none cursor-pointer',
            'transition-[border,box-shadow] duration-(--duration-micro)',
            'hover:bg-panel-2',
            'focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-dim',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
          style={{ width }}
        >
          <span aria-hidden className="text-text-dim">▢</span>
          <span className={cn('flex-1 truncate', !value && 'text-text-dim')}>
            {value ? format(value) : (emptyLabel ?? placeholder)}
          </span>
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align="start"
          sideOffset={6}
          className="z-40 outline-none data-[state=open]:animate-[ship-pop-in_140ms_var(--easing-out)]"
        >
          <Calendar
            selected={value}
            defaultMonth={value?.getMonth()}
            defaultYear={value?.getFullYear()}
            onSelect={(date) => {
              setValue(date);
              setOpen(false);
            }}
            isDateDisabled={isDateDisabled}
          />
        </RadixPopover.Content>
      </RadixPopover.Portal>
      {name && <input type="hidden" name={name} value={value ? value.toISOString() : ''} readOnly />}
    </RadixPopover.Root>
  );
});
