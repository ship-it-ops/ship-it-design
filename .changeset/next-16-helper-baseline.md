---
'@ship-it-ui/next': patch
---

Next.js 16 baseline for the App Router helper.

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
