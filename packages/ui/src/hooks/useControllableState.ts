'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * Standard controlled/uncontrolled state hook. Mirrors Radix's
 * `useControllableState` — when `value` is provided, the hook stays in sync
 * with it; otherwise it manages an internal state seeded by `defaultValue`.
 *
 * Use this for any composite that needs to support both modes (Tabs,
 * Combobox, Tree, DatePicker, Switch, etc.).
 */

export interface UseControllableStateProps<T> {
  /** Controlled value. When provided, the hook is in controlled mode. */
  value?: T;
  /** Default for uncontrolled mode. Used only when `value` is undefined. */
  defaultValue?: T;
  /** Change callback fired in both modes whenever the value would change. */
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [
  T | undefined,
  (next: T | ((prev: T | undefined) => T)) => void,
] {
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  const setValue = useCallback(
    (next: T | ((prev: T | undefined) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T | undefined) => T)(valueRef.current) : next;
      if (!isControlled) {
        setUncontrolledValue(resolved);
      }
      if (resolved !== valueRef.current) {
        onChangeRef.current?.(resolved);
      }
    },
    [isControlled],
  );

  return [value, setValue];
}
