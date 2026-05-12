import { describe, expect, it } from 'vitest';

import {
  getThemeFromCookies,
  parseThemeCookie,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
} from './server';

/**
 * Regression test for the server-entry split. Importing from `./server` (the
 * source of `dist/server.{js,cjs}`) must NOT pull in React or any module that
 * carries a `'use client'` directive — otherwise the App Router treats it as
 * a client reference and the helpers throw "not a function" when called from
 * a server `layout.tsx`. The shape assertions below are cheap; the real
 * guarantee is the build-time bundle, but importing here at least proves the
 * source graph is clean.
 */
describe('@ship-it-ui/next/server entry', () => {
  it('re-exports cookie helpers without pulling in client components', () => {
    expect(typeof getThemeFromCookies).toBe('function');
    expect(typeof parseThemeCookie).toBe('function');
    expect(THEME_COOKIE_NAME).toBe('ship-it-theme');
    expect(THEME_COOKIE_MAX_AGE).toBeGreaterThan(0);
  });

  it('parses a value through the App Router cookie shape', () => {
    expect(parseThemeCookie('dark')).toBe('dark');
    expect(getThemeFromCookies({ get: () => ({ value: 'light' }) })).toBe('light');
    expect(getThemeFromCookies({ get: () => undefined })).toBeUndefined();
  });
});
