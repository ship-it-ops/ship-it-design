/**
 * @ship-it-ui/next — Next.js (App Router) helpers for the Ship-It design
 * system. SSR-safe theme persistence with FOUC prevention, cookie helpers,
 * and a token-styled theme toggle that reuses `useTheme` from
 * `@ship-it-ui/ui`.
 */

export { ThemeBootstrap, buildBootstrapScript } from './ThemeBootstrap';
export { ThemeToggle, type ThemeToggleProps } from './ThemeToggle';
export {
  getThemeFromCookies,
  parseThemeCookie,
  readThemeCookie,
  writeThemeCookie,
  THEME_COOKIE_NAME,
  THEME_COOKIE_MAX_AGE,
  type CookieGetter,
} from './theme-cookie';
