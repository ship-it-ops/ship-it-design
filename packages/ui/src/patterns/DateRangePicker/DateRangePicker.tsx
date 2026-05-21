'use client';

import * as RadixPopover from '@radix-ui/react-popover';
import { IconGlyph } from '@ship-it-ui/icons';
import { forwardRef, useState, type ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';
import { Calendar, type DateRange } from '../DatePicker/Calendar';

/**
 * DateRangePicker — a button trigger that opens a popover with one or two
 * adjacent `Calendar` grids in `mode="range"`. The anchor of every
 * car-rental booking: pickup → return.
 */

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
  /** Number of months shown side-by-side. Default `2` for desktop, `1` for mobile. */
  months?: 1 | 2;
  /** Placeholder shown when no range is set. */
  placeholder?: string;
  /** Custom formatter. Default uses each date's `toLocaleDateString()`. */
  format?: (d: Date) => string;
  /** Pixel width of the trigger. */
  width?: number | string;
  disabled?: boolean;
  /** Optional disable predicate forwarded to each Calendar. */
  isDateDisabled?: (date: Date) => boolean;
  'aria-label'?: string;
  id?: string;
}

const defaultFormat = (d: Date) => d.toLocaleDateString();

function nextMonth(month: number, year: number): { month: number; year: number } {
  if (month === 11) return { month: 0, year: year + 1 };
  return { month: month + 1, year };
}

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      months = 2,
      placeholder = 'Pickup → Return',
      format = defaultFormat,
      width = 320,
      disabled,
      isDateDisabled,
      'aria-label': ariaLabel,
      id,
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useControllableState<DateRange>({
      value: valueProp,
      defaultValue: defaultValue ?? {},
      onChange: onValueChange,
    });

    const now = new Date();
    const [leftMonth, setLeftMonth] = useState(now.getMonth());
    const [leftYear, setLeftYear] = useState(now.getFullYear());
    const right = nextMonth(leftMonth, leftYear);

    const display: ReactNode =
      value?.from && value.to
        ? `${format(value.from)} → ${format(value.to)}`
        : value?.from
          ? `${format(value.from)} → …`
          : placeholder;

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
              'border-border bg-panel text-text flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-left text-[13px] outline-none',
              'transition-[border,box-shadow] duration-(--duration-micro)',
              'hover:bg-panel-2',
              'focus-visible:border-accent focus-visible:ring-accent-dim focus-visible:ring-[3px]',
              'disabled:cursor-not-allowed disabled:opacity-40',
            )}
            style={{ width }}
          >
            <IconGlyph
              name="calendar"
              size={14}
              className={cn(value?.from ? 'text-accent' : 'text-text-dim', 'shrink-0')}
            />
            <span className={cn('flex-1 truncate', !value?.from && 'text-text-dim')}>
              {display}
            </span>
          </button>
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content
            sideOffset={6}
            align="start"
            className="bg-panel border-border rounded-md border p-0 shadow-lg outline-none"
          >
            <div className="flex gap-2 p-2">
              <Calendar
                mode="range"
                range={value}
                onRangeChange={setValue}
                month={leftMonth}
                year={leftYear}
                onVisibleMonthChange={({ month, year }) => {
                  setLeftMonth(month);
                  setLeftYear(year);
                }}
                isDateDisabled={isDateDisabled}
                className="!border-0 !p-2 !shadow-none"
              />
              {months === 2 && (
                <Calendar
                  mode="range"
                  range={value}
                  onRangeChange={setValue}
                  month={right.month}
                  year={right.year}
                  isDateDisabled={isDateDisabled}
                  className="!border-0 !p-2 !shadow-none"
                />
              )}
            </div>
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';
