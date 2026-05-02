import { forwardRef, useState, type HTMLAttributes } from 'react';

import { IconButton } from '../../components/Button/IconButton';
import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * Calendar — single-month date grid. Displays the month named by
 * `month`/`year` (0-indexed month) and surfaces the selected date via
 * `selected` / `onSelect`.
 *
 * Uses native `Date` only (no external date lib). Days outside the current
 * month are not rendered (ShipIt's design uses leading whitespace, not
 * leading-/trailing-month grays).
 */

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Currently selected date. */
  selected?: Date;
  /** Default selected date (uncontrolled). */
  defaultSelected?: Date;
  /** Fires with the selected date. */
  onSelect?: (date: Date) => void;
  /** Currently visible month (0-indexed) and year. */
  month?: number;
  year?: number;
  /** Default visible month (0-indexed) and year (uncontrolled). */
  defaultMonth?: number;
  defaultYear?: number;
  /** Fires when the visible month changes. */
  onVisibleMonthChange?: (params: { month: number; year: number }) => void;
  /** Optional disable predicate. */
  isDateDisabled?: (date: Date) => boolean;
}

function isSameDay(a: Date | undefined, b: Date) {
  if (!a) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    selected,
    defaultSelected,
    onSelect,
    month: monthProp,
    year: yearProp,
    defaultMonth,
    defaultYear,
    onVisibleMonthChange,
    isDateDisabled,
    className,
    ...props
  },
  ref,
) {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useControllableState<Date>({
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelect,
  });

  const initialMonth = defaultMonth ?? defaultSelected?.getMonth() ?? today.getMonth();
  const initialYear = defaultYear ?? defaultSelected?.getFullYear() ?? today.getFullYear();
  const [internalMonth, setInternalMonth] = useState(initialMonth);
  const [internalYear, setInternalYear] = useState(initialYear);

  const month = monthProp ?? internalMonth;
  const year = yearProp ?? internalYear;
  const isControlled = monthProp !== undefined && yearProp !== undefined;

  const setVisible = (m: number, y: number) => {
    if (!isControlled) {
      setInternalMonth(m);
      setInternalYear(y);
    }
    onVisibleMonthChange?.({ month: m, year: y });
  };

  const goPrev = () => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    setVisible(m, y);
  };
  const goNext = () => {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    setVisible(m, y);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  return (
    <div
      ref={ref}
      role="group"
      aria-label={`${MONTHS[month]} ${year}`}
      className={cn(
        'rounded-base border-border bg-panel w-[280px] border p-4 shadow-lg',
        className,
      )}
      {...props}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-medium" aria-live="polite">
          {MONTHS[month]} {year}
        </span>
        <div className="flex gap-1">
          <IconButton
            size="sm"
            variant="ghost"
            icon="‹"
            aria-label="Previous month"
            onClick={goPrev}
          />
          <IconButton size="sm" variant="ghost" icon="›" aria-label="Next month" onClick={goNext} />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-[2px]">
        {DAYS.map((d, i) => (
          <div key={i} aria-hidden className="text-text-dim p-1 text-center font-mono text-[10px]">
            {d}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`pad-${i}`} aria-hidden />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const date = new Date(year, month, d);
          const isSelected = isSameDay(selectedDate, date);
          const isToday = isSameDay(today, date);
          const disabled = isDateDisabled?.(date) ?? false;
          return (
            <button
              key={d}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
              aria-label={date.toDateString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                'cursor-pointer rounded-xs border-0 bg-transparent py-[6px] text-center text-[12px] outline-none',
                'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
                'disabled:cursor-not-allowed disabled:opacity-30',
                !isSelected && !disabled && 'text-text hover:bg-panel-2',
                isSelected && 'bg-accent text-on-accent font-semibold',
                !isSelected && isToday && 'border-border-strong border',
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';
