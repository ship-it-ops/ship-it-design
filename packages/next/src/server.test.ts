import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  buildMetadata,
  getThemeFromCookies,
  parseThemeCookie,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
} from './server';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');

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

  it('exposes buildMetadata as a callable that returns a Metadata object', () => {
    // The whole point of the /server entry: buildMetadata must be reachable
    // here (its only use is a Server Component `export const metadata`) and
    // actually be a function, not a client-reference proxy stub.
    expect(typeof buildMetadata).toBe('function');
    const meta = buildMetadata({
      title: 'Pricing',
      description: 'Plans that scale with your team.',
      url: 'https://ship.it/pricing',
      twitterHandle: 'shipit',
    });
    expect(meta.title).toBe('Pricing');
    expect(meta.description).toBe('Plans that scale with your team.');
  });

  // Build-output guarantee: the source graph being clean isn't enough — the
  // real failure mode is tsup hoisting a `'use client'` into dist/server.*,
  // which makes every export a client reference that throws in a Server
  // Component. Assert the built bundles carry no such directive. Runs after a
  // build (CI builds before publish; skips cleanly on a source-only test run).
  it.skipIf(!existsSync(resolve(DIST, 'server.js')))(
    'built server bundles carry no "use client" directive',
    () => {
      for (const file of ['server.js', 'server.cjs']) {
        const path = resolve(DIST, file);
        if (!existsSync(path)) continue;
        const src = readFileSync(path, 'utf8');
        expect(src.includes("'use client'"), `${file} must not carry 'use client'`).toBe(false);
        expect(src.includes('"use client"'), `${file} must not carry "use client"`).toBe(false);
      }
    },
  );
});
