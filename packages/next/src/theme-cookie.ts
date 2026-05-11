/**
 * Theme cookie helpers shared between the server-side `getThemeFromCookies`
 * and the client-side `ThemeBootstrap` / `ThemeToggle`. The cookie value is
 * the literal string `'dark'` or `'light'`; anything else falls back to
 * undefined and the consumer's default (typically dark) applies.
 */

import type { Theme } from '@ship-it-ui/ui';

export const THEME_COOKIE_NAME = 'ship-it-theme';

/** One year. The cookie is non-sensitive, so a long lifetime is fine. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Parse a raw cookie string value into a `Theme` or `undefined`. */
export function parseThemeCookie(value: string | null | undefined): Theme | undefined {
  if (value === 'dark' || value === 'light') return value;
  return undefined;
}

/**
 * Server helper for the App Router `cookies()` API. Pass `cookies()` (or any
 * object with `.get(name)` that returns `{ value: string }`) and receive the
 * stored theme.
 *
 * ```ts
 * import { cookies } from 'next/headers';
 * const theme = getThemeFromCookies(await cookies());
 * ```
 */
export interface CookieGetter {
  get(name: string): { value: string } | undefined;
}

export function getThemeFromCookies(cookieStore: CookieGetter): Theme | undefined {
  return parseThemeCookie(cookieStore.get(THEME_COOKIE_NAME)?.value);
}

/**
 * Client-side cookie writer. Sets a path-`/` cookie with a year-long TTL and
 * `SameSite=Lax`, which is safe for theme preferences (non-sensitive, not
 * cross-site). No-op on the server.
 */
export function writeThemeCookie(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}

/** Read the theme cookie from `document.cookie`. No-op on the server. */
export function readThemeCookie(): Theme | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${THEME_COOKIE_NAME}=`));
  if (!match) return undefined;
  return parseThemeCookie(match.slice(THEME_COOKIE_NAME.length + 1));
}
