import { forwardRef, useEffect, useId, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useKeyboardList } from '../../hooks/useKeyboardList';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { cn } from '../../utils/cn';

/**
 * Combobox — text input with an attached, type-to-filter listbox. Implements
 * the WAI-ARIA combobox pattern (input owns focus; listbox is referenced via
 * aria-controls; highlighted option via aria-activedescendant).
 *
 * Selection (`value`) and the visible query are independent. Selecting an
 * option syncs the query to the option's label so the user sees what was
 * picked; subsequent typing reopens the list and re-filters.
 */

export type ComboboxOption =
  | string
  | {
      value: string;
      label?: ReactNode;
      description?: ReactNode;
      /** Disable selection without removing the option from the list. */
      disabled?: boolean;
    };

export interface ComboboxProps {
  /** Available options. Strings are normalized to `{ value, label: value }`. */
  options: ReadonlyArray<ComboboxOption>;
  /** Controlled selected option value. */
  value?: string;
  /** Default selected value (uncontrolled). */
  defaultValue?: string;
  /** Fires with the option's `value` when a selection is committed. */
  onValueChange?: (value: string) => void;
  /** Controlled query. */
  query?: string;
  /** Default query (uncontrolled). */
  defaultQuery?: string;
  /** Fires whenever the query changes. */
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  /** Custom matcher. Default: case-insensitive substring on label/description. */
  filter?: (option: NormalizedOption, query: string) => boolean;
  /** Empty-state node rendered when filtering yields nothing. */
  emptyState?: ReactNode;
  /** Pixel or CSS width of the wrapper. Default 260. */
  width?: number | string;
  disabled?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
}

export interface NormalizedOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  searchText: string;
  disabled?: boolean;
}

function normalize(option: ComboboxOption): NormalizedOption {
  if (typeof option === 'string') {
    return { value: option, label: option, searchText: option.toLowerCase() };
  }
  const labelString =
    typeof option.label === 'string'
      ? option.label
      : typeof option.label === 'undefined'
        ? option.value
        : '';
  const descriptionString = typeof option.description === 'string' ? option.description : '';
  return {
    value: option.value,
    label: option.label ?? option.value,
    description: option.description,
    searchText: `${labelString} ${descriptionString}`.toLowerCase(),
    disabled: option.disabled,
  };
}

const defaultFilter = (option: NormalizedOption, query: string) =>
  option.searchText.includes(query.toLowerCase());

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    query: queryProp,
    defaultQuery,
    onQueryChange,
    placeholder,
    filter = defaultFilter,
    emptyState,
    width = 260,
    disabled,
    name,
    id,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const reactId = useId();
  const listboxId = `${id ?? reactId}-listbox`;
  const inputId = id ?? `${reactId}-input`;

  const normalized = useMemo(() => options.map(normalize), [options]);

  const [value, setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const initialQuery = useMemo(() => {
    if (defaultQuery !== undefined) return defaultQuery;
    if (defaultValue !== undefined) {
      const opt = normalized.find((o) => o.value === defaultValue);
      if (opt && typeof opt.label === 'string') return opt.label;
    }
    return '';
  }, [defaultQuery, defaultValue, normalized]);

  const [query, setQuery] = useControllableState<string>({
    value: queryProp,
    defaultValue: initialQuery,
    onChange: onQueryChange,
  });

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useOutsideClick(wrapperRef, () => setOpen(false));

  const filtered = useMemo(
    () => (query ? normalized.filter((o) => filter(o, query)) : normalized),
    [normalized, query, filter],
  );

  const { cursor, setCursor, onKeyDown } = useKeyboardList({
    count: filtered.length,
    defaultCursor: 0,
    onSelect: (i) => {
      const item = filtered[i];
      if (item && !item.disabled) commit(item);
    },
  });

  useEffect(() => {
    setCursor(0);
  }, [query, setCursor]);

  function commit(option: NormalizedOption) {
    setValue(option.value);
    if (typeof option.label === 'string') setQuery(option.label);
    setOpen(false);
  }

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(true);
    }
    onKeyDown(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative" style={{ width }}>
      <input
        ref={ref}
        id={inputId}
        name={name}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && filtered.length > 0 ? `${listboxId}-option-${cursor}` : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        placeholder={placeholder}
        value={query ?? ''}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (value !== undefined) setValue('');
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKey}
        className={cn(
          'block w-full rounded-md border border-border bg-panel px-3 py-2 text-[13px] text-text outline-none',
          'transition-[border,box-shadow] duration-(--duration-micro)',
          'placeholder:text-text-dim',
          'focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-dim',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
      />
      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? 'Suggestions'}
          className={cn(
            'absolute left-0 right-0 top-full z-30 mt-1 max-h-[220px] overflow-auto',
            'rounded-md border border-border bg-panel p-1 shadow-lg',
          )}
        >
          {filtered.length === 0 ? (
            <li className="px-2 py-3 text-center text-[12px] text-text-dim" role="presentation">
              {emptyState ?? 'No matches'}
            </li>
          ) : (
            filtered.map((option, i) => {
              const isActive = i === cursor;
              return (
                <li
                  key={option.value}
                  id={`${listboxId}-option-${i}`}
                  role="option"
                  aria-selected={isActive}
                  aria-disabled={option.disabled || undefined}
                  onMouseEnter={() => setCursor(i)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep focus on input
                    if (!option.disabled) commit(option);
                  }}
                  className={cn(
                    'cursor-pointer rounded-sm px-[10px] py-2 text-[12px] text-text',
                    isActive && 'bg-accent-dim text-accent',
                    option.disabled && 'opacity-40 pointer-events-none',
                  )}
                >
                  <div>{option.label}</div>
                  {option.description && (
                    <div className="text-[11px] text-text-dim">{option.description}</div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
      {name && <input type="hidden" name={name} value={value ?? ''} readOnly />}
    </div>
  );
});
