# @ship-it-ui/next

## 0.0.3

### Patch Changes

- 40c58e6: Add a `@ship-it-ui/next/server` subpath export for App Router server
  imports.

  The root entry (`@ship-it-ui/next`) bundles `<ThemeBootstrap>` +
  `<ThemeToggle>` alongside the cookie helpers. Because `<ThemeToggle>`
  carries a `'use client'` directive and `tsup`'s
  `preserveDirectivesPlugin` hoists it to the bundle root, importing
  `getThemeFromCookies` from a server `layout.tsx` returned a client
  reference proxy — calling it threw `getThemeFromCookies is not a
function`.

  The new `/server` entry re-exports only `getThemeFromCookies`,
  `parseThemeCookie`, `THEME_COOKIE_NAME`, `THEME_COOKIE_MAX_AGE`, and the
  `CookieGetter` type. It has no `'use client'`, so server layouts can
  import it directly:

  ```ts
  import { ThemeBootstrap } from '@ship-it-ui/next';
  import { getThemeFromCookies } from '@ship-it-ui/next/server';
  ```

  The root entry still re-exports the cookie helpers for backwards
  compatibility with non-Next consumers; only App Router server code needs
  the new subpath. Docs example updated.

- Updated dependencies [40c58e6]
  - @ship-it-ui/ui@0.0.5

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
