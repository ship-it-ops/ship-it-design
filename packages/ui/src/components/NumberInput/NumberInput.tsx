'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * NumberInput — numeric input with `−` / `+` stepper buttons. Long-press the
 * buttons to repeat. Use for guest count, additional drivers, days, child
 * seats — anywhere users tweak a small integer or decimal.
 */

export interface NumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'size'
> {
  /** Current value (controlled). */
  value?: number;
  /** Default value (uncontrolled). */
  defaultValue?: number;
  /** Fires when the value changes via input or stepper. */
  onValueChange?: (value: number) => void;
  /** Minimum allowed value. Default `0`. */
  min?: number;
  /** Maximum allowed value. Default `Infinity`. */
  max?: number;
  /** Step increment. Default `1`. */
  step?: number;
  /** Visual size. Default `'md'`. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label. */
  'aria-label'?: string;
}

const wrapperSizes = {
  sm: 'h-7 text-[12px]',
  md: 'h-[34px] text-[13px]',
  lg: 'h-10 text-[14px]',
} as const;

const buttonSizes = {
  sm: 'w-7',
  md: 'w-8',
  lg: 'w-10',
} as const;

const REPEAT_DELAY = 350;
const REPEAT_INTERVAL = 60;

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = Infinity,
    step = 1,
    size = 'md',
    className,
    disabled,
    id: idProp,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const [current, setCurrent] = useControllableState<number>({
    value,
    defaultValue: defaultValue ?? min,
    onChange: onValueChange,
  });
  const reactId = useId();
  const id = idProp ?? `ni-${reactId}`;
  const repeatTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const repeatInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const clamp = useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

  const bump = useCallback(
    (dir: 1 | -1) => {
      setCurrent((prev) => clamp((prev ?? min) + dir * step));
    },
    [clamp, min, step, setCurrent],
  );

  const stopRepeat = useCallback(() => {
    if (repeatTimer.current) clearTimeout(repeatTimer.current);
    if (repeatInterval.current) clearInterval(repeatInterval.current);
    repeatTimer.current = undefined;
    repeatInterval.current = undefined;
  }, []);

  const startRepeat = (dir: 1 | -1) => {
    bump(dir);
    repeatTimer.current = setTimeout(() => {
      repeatInterval.current = setInterval(() => bump(dir), REPEAT_INTERVAL);
    }, REPEAT_DELAY);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      bump(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      bump(-1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') return;
    const n = Number(raw);
    if (Number.isFinite(n)) setCurrent(clamp(n));
  };

  const canDec = (current ?? min) > min;
  const canInc = (current ?? min) < max;

  return (
    <div
      className={cn(
        'border-border bg-panel inline-flex items-stretch overflow-hidden rounded-md border',
        'focus-within:border-accent focus-within:ring-accent-dim focus-within:ring-[3px]',
        wrapperSizes[size],
        disabled && 'opacity-50',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrement"
        aria-controls={id}
        disabled={disabled || !canDec}
        onPointerDown={() => startRepeat(-1)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        className={cn(
          'text-text-muted hover:bg-panel-2 inline-grid cursor-pointer place-items-center disabled:cursor-not-allowed disabled:opacity-30',
          buttonSizes[size],
        )}
      >
        <IconGlyph name="remove" size={size === 'sm' ? 12 : 14} />
      </button>
      <input
        ref={ref}
        id={id}
        type="number"
        role="spinbutton"
        inputMode="numeric"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-valuenow={current}
        value={current}
        onChange={handleChange}
        onKeyDown={handleKey}
        disabled={disabled}
        className="text-text min-w-0 flex-1 [appearance:textfield] border-x-0 bg-transparent px-1 text-center font-medium outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...rest}
      />
      <button
        type="button"
        aria-label="Increment"
        aria-controls={id}
        disabled={disabled || !canInc}
        onPointerDown={() => startRepeat(1)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        className={cn(
          'text-text-muted hover:bg-panel-2 inline-grid cursor-pointer place-items-center disabled:cursor-not-allowed disabled:opacity-30',
          buttonSizes[size],
        )}
      >
        <IconGlyph name="add" size={size === 'sm' ? 12 : 14} />
      </button>
    </div>
  );
});

NumberInput.displayName = 'NumberInput';
