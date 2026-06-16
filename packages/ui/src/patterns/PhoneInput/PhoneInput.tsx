'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { Select } from '../../components/Select';
import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

import { phoneCountries, type PhoneCountry } from './countries';

/**
 * PhoneInput — country-code Select + national-number text input. Emits
 * E.164-formatted strings (`+CC<NSN>`) via `onValueChange`.
 *
 * The country list is a curated subset of common origins. Pass a custom
 * `countries` prop to supply your own (e.g. via `libphonenumber-js`).
 */

export interface PhoneInputProps {
  /** E.164 value (controlled), e.g. `+14155550100`. */
  value?: string;
  /** Default E.164 value (uncontrolled). */
  defaultValue?: string;
  /** Fires with the new E.164 value. Empty national number → empty string. */
  onValueChange?: (value: string) => void;
  /** Custom country list. Defaults to the bundled subset. */
  countries?: ReadonlyArray<PhoneCountry>;
  /** Default selected country code. Default `'US'`. */
  defaultCountry?: string;
  placeholder?: string;
  disabled?: boolean;
  /**
   * `id` for the national-number `<input>` so an external `<label htmlFor>`
   * (or a `Field` render-prop's generated id) can target it.
   */
  id?: string;
  /** Accessible label for the national-number input. */
  'aria-label'?: string;
  /** Forwarded to the national-number input — e.g. a `Field`'s describedby id. */
  'aria-describedby'?: string;
  /** Forwarded to the national-number input — e.g. a `Field`'s invalid flag. */
  'aria-invalid'?: boolean;
}

interface ParsedPhone {
  country: PhoneCountry;
  national: string;
}

function parseE164(value: string, list: ReadonlyArray<PhoneCountry>): ParsedPhone | null {
  if (!value.startsWith('+')) return null;
  const digits = value.slice(1);
  // Match the longest dial code first so `+1` doesn't shadow `+1242` (Bahamas).
  const sorted = [...list].sort((a, b) => b.dialCode.length - a.dialCode.length);
  const match = sorted.find((c) => digits.startsWith(c.dialCode));
  if (!match) return null;
  return { country: match, national: digits.slice(match.dialCode.length) };
}

function toE164(country: PhoneCountry, national: string): string {
  const cleaned = national.replace(/\D/g, '');
  if (cleaned.length === 0) return '';
  return `+${country.dialCode}${cleaned}`;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    value,
    defaultValue,
    onValueChange,
    countries = phoneCountries,
    defaultCountry = 'US',
    placeholder = 'Phone number',
    disabled,
    id,
    'aria-label': ariaLabel = 'Phone number',
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
  },
  ref,
) {
  const [committed, setCommitted] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });

  const parsed = useMemo(() => parseE164(committed ?? '', countries), [committed, countries]);

  const [country, setCountry] = useState<PhoneCountry>(
    parsed?.country ?? countries.find((c) => c.code === defaultCountry) ?? countries[0]!,
  );
  const [national, setNational] = useState<string>(parsed?.national ?? '');

  // Re-sync local country/national whenever the *external* committed value
  // changes — form resets, route restores, or any controlled-mode update
  // from above. Without this the visible inputs drift from `value`.
  //
  // We guard with `lastEmittedRef` so the effect skips its own emissions:
  // when the user types `4` the controller calls `setCommitted('+14')`,
  // which would otherwise re-parse and rewrite `national` to `'4'` on the
  // next render — fine for digits, but it strips formatting like spaces
  // and resets the caret. Tracking what we just wrote lets us tell apart
  // "user typed" from "parent reset the value".
  const lastEmittedRef = useRef<string>(committed ?? '');
  useEffect(() => {
    const current = committed ?? '';
    if (current === lastEmittedRef.current) return;
    lastEmittedRef.current = current;
    const next = parseE164(current, countries);
    if (next) {
      setCountry(next.country);
      setNational(next.national);
    } else if (current === '') {
      setNational('');
    }
  }, [committed, countries]);

  const handleCountry = (code: string) => {
    const next = countries.find((c) => c.code === code) ?? country;
    setCountry(next);
    const emitted = toE164(next, national);
    lastEmittedRef.current = emitted;
    setCommitted(emitted);
  };

  const handleNational = (raw: string) => {
    setNational(raw);
    const emitted = toE164(country, raw);
    lastEmittedRef.current = emitted;
    setCommitted(emitted);
  };

  const selectOptions = useMemo(
    () =>
      countries.map((c) => ({
        value: c.code,
        label: `${c.flag} +${c.dialCode}`,
      })),
    [countries],
  );

  return (
    <div
      className={cn(
        'border-border bg-panel inline-flex items-center overflow-hidden rounded-md border',
        'focus-within:border-accent focus-within:ring-accent-dim focus-within:ring-[3px]',
        disabled && 'opacity-50',
      )}
    >
      <Select
        options={selectOptions}
        value={country.code}
        onValueChange={handleCountry}
        disabled={disabled}
        aria-label="Country"
      />
      <input
        ref={ref}
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        value={national}
        onChange={(e) => handleNational(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="text-text placeholder:text-text-dim min-w-0 flex-1 bg-transparent px-3 py-2 text-[13px] outline-none"
      />
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';
