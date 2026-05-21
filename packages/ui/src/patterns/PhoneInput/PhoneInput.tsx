'use client';

import { forwardRef, useMemo, useState } from 'react';

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
  /** Accessible label for the national-number input. */
  'aria-label'?: string;
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
    'aria-label': ariaLabel = 'Phone number',
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

  const handleCountry = (code: string) => {
    const next = countries.find((c) => c.code === code) ?? country;
    setCountry(next);
    setCommitted(toE164(next, national));
  };

  const handleNational = (raw: string) => {
    setNational(raw);
    setCommitted(toE164(country, raw));
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
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        aria-label={ariaLabel}
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
