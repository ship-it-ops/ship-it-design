import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import { cn } from '../../utils/cn';

export interface OTPProps {
  /** Number of digit slots. Defaults to 6. */
  length?: number;
  /** Called with the assembled string when every slot has a value. */
  onComplete?: (code: string) => void;
  /** Called with the partial string on every change. */
  onChange?: (value: string) => void;
  /** Initial value (string of digits). */
  defaultValue?: string;
  /** Aria label applied to each individual slot, suffixed with " {n} of {N}". */
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

export type OTPHandle = {
  focus: () => void;
  reset: () => void;
};

/**
 * Six-slot one-time-password input with auto-advance, backspace navigation, and
 * paste-to-fill. Each slot is a single-character `<input>` for screen-reader clarity.
 */
export const OTP = forwardRef<OTPHandle, OTPProps>(function OTP(
  { length = 6, onComplete, onChange, defaultValue = '', ariaLabel = 'Code', className, disabled },
  ref,
) {
  const baseId = useId();
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [values, setValues] = useState<string[]>(() =>
    Array.from({ length }, (_, i) => defaultValue[i] ?? ''),
  );

  useImperativeHandle(ref, () => ({
    focus: () => refs.current[0]?.focus(),
    reset: () => {
      setValues(Array(length).fill(''));
      refs.current[0]?.focus();
    },
  }));

  const writeAt = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    setValues((prev) => {
      const next = [...prev];
      next[i] = char;
      const joined = next.join('');
      onChange?.(joined);
      if (joined.length === length && next.every((c) => c)) onComplete?.(joined);
      return next;
    });
    if (char && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = Array.from({ length }, (_, i) => pasted[i] ?? '');
    setValues(next);
    const joined = next.join('');
    onChange?.(joined);
    if (joined.length === length) onComplete?.(joined);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className={cn('flex gap-2', className)}>
      {values.map((c, i) => (
        <input
          key={i}
          id={`${baseId}-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={c}
          disabled={disabled}
          aria-label={`${ariaLabel} ${i + 1} of ${length}`}
          onChange={(e) => writeAt(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          onFocus={(e) => e.target.select()}
          onPaste={i === 0 ? onPaste : undefined}
          className={cn(
            'text-text bg-panel h-12 w-10 rounded-md text-center font-mono text-[20px] font-medium',
            'border-border border transition-[border-color,box-shadow] duration-(--duration-micro) outline-none',
            'focus:border-accent focus:ring-accent-dim focus:ring-[3px]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        />
      ))}
    </div>
  );
});

OTP.displayName = 'OTP';
