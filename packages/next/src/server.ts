/**
 * @ship-it-ui/next/server — server-safe subset of `@ship-it-ui/next`.
 *
 * Re-exports only the helpers that have no React dependency, so they can be
 * imported from a server `layout.tsx`/`page.tsx` without `tsup`'s preserved
 * `'use client'` directive (hoisted from `ThemeToggle.tsx` in the root entry)
 * tagging the whole module as a client reference.
 *
 * `buildMetadata` belongs here: its only use is a Server Component's
 * `export const metadata`, but the root barrel carries `'use client'`, so
 * importing it from `@ship-it-ui/next` throws "not a function" at runtime.
 * It is a pure function (`metadata.ts` has no client deps), so it is safe to
 * expose from this server entry. It remains exported from the root barrel for
 * back-compat, but server code should import it from here.
 */

export {
  getThemeFromCookies,
  parseThemeCookie,
  THEME_COOKIE_NAME,
  THEME_COOKIE_MAX_AGE,
  type CookieGetter,
} from './theme-cookie';
export { buildMetadata, type BuildMetadataInput } from './metadata';
