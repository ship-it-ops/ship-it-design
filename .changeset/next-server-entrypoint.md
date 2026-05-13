---
'@ship-it-ui/next': patch
---

Add a `@ship-it-ui/next/server` subpath export for App Router server
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
