'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { IconButton } from '../../components/Button/IconButton';
import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * Calendar — single-month date grid. Displays the month named by
 * `month`/`year` (0-indexed month) and surfaces the selected date via
 * `value` / `onValueChange`.
 *
 * Uses native `Date` only (no external date lib). Days outside the current
 * month are not rendered (ShipIt's design uses leading whitespace, not
 * leading-/trailing-month grays).
 *
 * Keyboard model (APG date-picker):
 * - Arrow Left/Right: move focus ±1 day
 * - Arrow Up/Down: move focus ±1 week
 * - Home/End: jump to start/end of week
 * - PageUp/PageDown: ±1 month (also navigates the visible month)
 * - Roving tabindex: only the focused day cell is in the tab order.
 */

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'defaultValue'> {
  /** Currently selected date (controlled). */
  value?: Date;
  /** Default selected date (uncontrolled). */
  defaultValue?: Date;
  /** Fires with the newly selected date. */
  onValueChange?: (date: Date) => void;
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

function clampDay(year: number, month: number, day: number) {
  const max = new Date(year, month + 1, 0).getDate();
  return Math.min(Math.max(1, day), max);
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    value,
    defaultValue,
    onValueChange,
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
  // Stable "today" so render is deterministic across re-renders within a
  // session. We still gate today-specific markup behind a post-hydration
  // flag so the server-rendered HTML never includes today-only attrs/classes
  // (avoids hydration mismatches at midnight or across clock-skewed servers).
  const [today] = useState(() => new Date());
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [selectedDate, setSelectedDate] = useControllableState<Date>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const initialMonth = defaultMonth ?? defaultValue?.getMonth() ?? today.getMonth();
  const initialYear = defaultYear ?? defaultValue?.getFullYear() ?? today.getFullYear();
  const [internalMonth, setInternalMonth] = useState(initialMonth);
  const [internalYear, setInternalYear] = useState(initialYear);

  const month = monthProp ?? internalMonth;
  const year = yearProp ?? internalYear;
  const isControlled = monthProp !== undefined && yearProp !== undefined;

  const setVisible = useCallback(
    (m: number, y: number) => {
      if (!isControlled) {
        setInternalMonth(m);
        setInternalYear(y);
      }
      onVisibleMonthChange?.({ month: m, year: y });
    },
    [isControlled, onVisibleMonthChange],
  );

  const goPrev = useCallback(() => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    setVisible(m, y);
  }, [month, year, setVisible]);
  const goNext = useCallback(() => {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    setVisible(m, y);
  }, [month, year, setVisible]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Roving-tabindex focus state. Defaults to the selected day, then today
  // (only after hydration), then day 1. We track focus by full date so we
  // can carry it across month boundaries when Arrow / PageUp / PageDown
  // crosses into the next/prev month.
  const [focusedDate, setFocusedDate] = useState<Date>(() => {
    if (selectedDate) return selectedDate;
    return new Date(initialYear, initialMonth, 1);
  });

  // If the selected date changes (controlled mode), follow it.
  useEffect(() => {
    if (selectedDate) setFocusedDate(selectedDate);
  }, [selectedDate]);

  // If the focused date isn't in the visible month, clamp it so the
  // currently-rendered grid always has a `tabIndex=0` cell.
  const focusedInVisibleMonth =
    focusedDate.getMonth() === month && focusedDate.getFullYear() === year;
  const effectiveFocusDay = focusedInVisibleMonth
    ? focusedDate.getDate()
    : clampDay(year, month, focusedDate.getDate());

  const dayRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());
  const shouldFocusRef = useRef(false);

  // After a keyboard navigation that crossed months, move DOM focus to the
  // newly-focused day in the now-rendered grid.
  useEffect(() => {
    if (!shouldFocusRef.current) return;
    shouldFocusRef.current = false;
    const node = dayRefs.current.get(effectiveFocusDay);
    node?.focus();
  }, [effectiveFocusDay, month, year]);

  const moveFocus = useCallback(
    (next: Date) => {
      setFocusedDate(next);
      shouldFocusRef.current = true;
      const nextMonth = next.getMonth();
      const nextYear = next.getFullYear();
      if (nextMonth !== month || nextYear !== year) {
        setVisible(nextMonth, nextYear);
      }
    },
    [month, year, setVisible],
  );

  const onCellKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, day: number) => {
      const current = new Date(year, month, day);
      let next: Date | null = null;
      let handled = true;
      switch (e.key) {
        case 'ArrowLeft':
          next = new Date(year, month, day - 1);
          break;
        case 'ArrowRight':
          next = new Date(year, month, day + 1);
          break;
        case 'ArrowUp':
          next = new Date(year, month, day - 7);
          break;
        case 'ArrowDown':
          next = new Date(year, month, day + 7);
          break;
        case 'Home': {
          const dow = current.getDay();
          next = new Date(year, month, day - dow);
          break;
        }
        case 'End': {
          const dow = current.getDay();
          next = new Date(year, month, day + (6 - dow));
          break;
        }
        case 'PageUp': {
          const targetMonth = month === 0 ? 11 : month - 1;
          const targetYear = month === 0 ? year - 1 : year;
          const targetDay = clampDay(targetYear, targetMonth, day);
          next = new Date(targetYear, targetMonth, targetDay);
          break;
        }
        case 'PageDown': {
          const targetMonth = month === 11 ? 0 : month + 1;
          const targetYear = month === 11 ? year + 1 : year;
          const targetDay = clampDay(targetYear, targetMonth, day);
          next = new Date(targetYear, targetMonth, targetDay);
          break;
        }
        default:
          handled = false;
      }
      if (handled && next) {
        e.preventDefault();
        moveFocus(next);
      }
    },
    [month, year, moveFocus],
  );

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
      {/*
        APG date-grid: outer `role="grid"`, weekday header as a `row` of
        `columnheader` cells, then one `row` per week containing
        `gridcell`-wrapped buttons. `aria-selected` requires this grid
        ancestry to be valid ARIA.
      */}
      <div role="grid" aria-label={`${MONTHS[month]} ${year}`} className="flex flex-col gap-[2px]">
        <div role="row" className="grid grid-cols-7 gap-[2px]">
          {DAYS.map((d, i) => (
            <div
              key={i}
              role="columnheader"
              aria-label={
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]
              }
              className="text-text-dim p-1 text-center font-mono text-[10px]"
            >
              {d}
            </div>
          ))}
        </div>
        {(() => {
          const totalCells = firstDayOfMonth + daysInMonth;
          const rowCount = Math.ceil(totalCells / 7);
          const rows: ReactNode[] = [];
          for (let r = 0; r < rowCount; r++) {
            const cells: ReactNode[] = [];
            for (let c = 0; c < 7; c++) {
              const cellIndex = r * 7 + c;
              const dayNum = cellIndex - firstDayOfMonth + 1;
              if (dayNum < 1 || dayNum > daysInMonth) {
                cells.push(<div key={`pad-${r}-${c}`} role="gridcell" aria-hidden />);
                continue;
              }
              const date = new Date(year, month, dayNum);
              const isSelected = isSameDay(selectedDate, date);
              const isToday = hydrated && isSameDay(today, date);
              const disabled = isDateDisabled?.(date) ?? false;
              const isFocused = dayNum === effectiveFocusDay;
              const day = dayNum;
              cells.push(
                <div key={day} role="gridcell" aria-selected={isSelected}>
                  <button
                    ref={(node) => {
                      if (node) dayRefs.current.set(day, node);
                      else dayRefs.current.delete(day);
                    }}
                    type="button"
                    disabled={disabled}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={date.toDateString()}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={() => {
                      setSelectedDate(date);
                      setFocusedDate(date);
                    }}
                    onKeyDown={(e) => onCellKeyDown(e, day)}
                    className={cn(
                      'w-full cursor-pointer rounded-xs border-0 bg-transparent py-[6px] text-center text-[12px] outline-none',
                      'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
                      'disabled:cursor-not-allowed disabled:opacity-30',
                      !isSelected && !disabled && 'text-text hover:bg-panel-2',
                      isSelected && 'bg-accent text-on-accent font-semibold',
                      !isSelected && isToday && 'border-border-strong border',
                    )}
                  >
                    {day}
                  </button>
                </div>,
              );
            }
            rows.push(
              <div key={`row-${r}`} role="row" className="grid grid-cols-7 gap-[2px]">
                {cells}
              </div>,
            );
          }
          return rows;
        })()}
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';
