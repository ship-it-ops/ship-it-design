# @ship-it-ui/next

## 0.0.2

### Patch Changes

- 01246b3: **New package: `@ship-it-ui/next`.** App Router-aware helpers for Next.js
  consumers of the design system. Three exports, plus a small set of cookie
  utilities:
  - **`<ThemeBootstrap />`** — synchronous inline `<script>` rendered in your
    root layout's `<head>`. Reads the `ship-it-theme` cookie before first paint
    and sets `<html data-theme>` accordingly, killing the dark→light flash for
    light-theme users.
  - **`getThemeFromCookies(cookies())`** — server helper that reads the App
    Router `cookies()` store and returns the stored theme (`'dark'`, `'light'`,
    or `undefined`). Use the return value to seed `data-theme` on `<html>` for
    the very first server-rendered frame.
  - **`<ThemeToggle />`** — token-styled `Switch` bound to the active theme.
    Reuses the shared `useTheme` hook from `@ship-it-ui/ui` for client state and
    writes the cookie so the next request's `ThemeBootstrap` can render the
    correct theme synchronously.

  Also exported: `parseThemeCookie`, `readThemeCookie`, `writeThemeCookie`,
  `buildBootstrapScript`, `THEME_COOKIE_NAME`, `THEME_COOKIE_MAX_AGE`,
  `CookieGetter`. `next` is an optional peer dependency — the package works in
  plain React apps that adopt the same cookie convention.

- Updated dependencies [01246b3]
- Updated dependencies [01246b3]
  - @ship-it-ui/ui@0.0.4
