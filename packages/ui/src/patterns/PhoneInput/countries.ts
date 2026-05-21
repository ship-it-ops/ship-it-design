/**
 * Country data for `PhoneInput`. Subset of common origins — extend as the
 * product grows or replace with a full ISO 3166-1 list (e.g. `libphonenumber-js`
 * `getCountries()`). Each country lists its ISO code (cca2), display name,
 * E.164 dial code, and flag emoji.
 */

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 code, e.g. "US". */
  code: string;
  /** Display name. */
  name: string;
  /** E.164 country calling code without `+`, e.g. "1" or "44". */
  dialCode: string;
  /** Unicode flag (regional indicator pair). */
  flag: string;
}

export const phoneCountries: ReadonlyArray<PhoneCountry> = [
  { code: 'US', name: 'United States', dialCode: '1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '1', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', dialCode: '52', flag: '🇲🇽' },
  { code: 'GB', name: 'United Kingdom', dialCode: '44', flag: '🇬🇧' },
  { code: 'IE', name: 'Ireland', dialCode: '353', flag: '🇮🇪' },
  { code: 'DE', name: 'Germany', dialCode: '49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '33', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', dialCode: '34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dialCode: '39', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', dialCode: '351', flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', dialCode: '31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dialCode: '32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dialCode: '43', flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden', dialCode: '46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', dialCode: '48', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czechia', dialCode: '420', flag: '🇨🇿' },
  { code: 'GR', name: 'Greece', dialCode: '30', flag: '🇬🇷' },
  { code: 'TR', name: 'Turkey', dialCode: '90', flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', dialCode: '972', flag: '🇮🇱' },
  { code: 'AE', name: 'UAE', dialCode: '971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '966', flag: '🇸🇦' },
  { code: 'IN', name: 'India', dialCode: '91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dialCode: '86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '65', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', dialCode: '61', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', dialCode: '64', flag: '🇳🇿' },
  { code: 'BR', name: 'Brazil', dialCode: '55', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', dialCode: '54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dialCode: '57', flag: '🇨🇴' },
  { code: 'ZA', name: 'South Africa', dialCode: '27', flag: '🇿🇦' },
];
