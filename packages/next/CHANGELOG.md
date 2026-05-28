# @ship-it-ui/next

## 0.0.8

### Patch Changes

- 1ba01f1: Next.js 16 baseline for the App Router helper.
  - Peer range tightened: `next ^15.0.0 || ^16.0.0` (was `^14.0.0 || ^15.0.0`)
    and `react ^19.0.0` (was `^18.0.0 || ^19.0.0`). Drops Next 14 and React 18
    from the supported matrix.
  - No runtime API changes. `<ThemeBootstrap />`, `<ThemeToggle />`, and
    `getThemeFromCookies` keep their existing signatures. The framework-
    agnostic `CookieGetter` is satisfied by an awaited `cookies()` call in
    Next 16, same as in 15:

    ```ts
    import { cookies } from 'next/headers';
    import { getThemeFromCookies } from '@ship-it-ui/next/server';
    const theme = getThemeFromCookies(await cookies());
    ```

  - Docs refreshed in `apps/docs-site/app/(docs)/get-started/next/page.mdx`
    with a "Cache Components opt-in" recipe for runtime consumers (wrap the
    cookie lookup in `'use cache'` + `cacheTag('theme')` and invalidate from
    the toggle's server action). Static-export consumers — including the docs
    site itself — keep the existing dual cookie + `localStorage` bootstrap
    and ignore the recipe.

- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
  - @ship-it-ui/ui@0.0.10

## 0.0.7

### Patch Changes

- 66be20b: Fix several long-standing act() warnings and Radix a11y dev-mode warnings
  surfaced by tests:
  - `Dialog` / `AlertDialog` / `WizardDialog` now explicitly pass
    `aria-describedby={undefined}` when no `description` is supplied, so
    Radix's dev-mode check sees the intentional opt-out instead of warning.
    `WizardDialog` additionally renders a visually-hidden fallback `<Title>`
    when no `title` prop is given, so the Dialog contract is always met.
  - `useTheme` now flags self-initiated `data-theme` mutations so the
    internal `MutationObserver` skips the change instead of firing a
    redundant `setState` outside `act()` after the click handler returns.
  - `Tree`'s active-item move now uses `flushSync` to commit the state
    update before focusing the new tab stop, replacing a `queueMicrotask`
    that resolved outside `act()` in tests.
  - Test setup: `@ship-it-ui/next` now polyfills `ResizeObserver` for
    jsdom (Radix `useSize` needs it), and `@ship-it-ui/ui` filters the
    upstream `ToastAnnounce` act warning that fires from Radix's own
    1-second setTimeout.

- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
  - @ship-it-ui/ui@0.0.9

## 0.0.6

### Patch Changes

- Updated dependencies [e2b569e]
  - @ship-it-ui/ui@0.0.8

## 0.0.5

### Patch Changes

- Updated dependencies [9da43f1]
  - @ship-it-ui/ui@0.0.7

## 0.0.4

### Patch Changes

- Updated dependencies [0318497]
  - @ship-it-ui/ui@0.0.6

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
