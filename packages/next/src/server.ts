/**
 * @ship-it-ui/next/server — server-safe subset of `@ship-it-ui/next`.
 *
 * Re-exports only the cookie helpers that have no React dependency, so they
 * can be imported from a server `layout.tsx` without `tsup`'s preserved
 * `'use client'` directive (hoisted from `ThemeToggle.tsx` in the root entry)
 * tagging the whole module as a client reference.
 */

export {
  getThemeFromCookies,
  parseThemeCookie,
  THEME_COOKIE_NAME,
  THEME_COOKIE_MAX_AGE,
  type CookieGetter,
} from './theme-cookie';
