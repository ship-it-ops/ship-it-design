import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getThemeFromCookies,
  parseThemeCookie,
  readThemeCookie,
  THEME_COOKIE_NAME,
  writeThemeCookie,
} from './theme-cookie';

describe('parseThemeCookie', () => {
  it('returns the literal theme for known values', () => {
    expect(parseThemeCookie('dark')).toBe('dark');
    expect(parseThemeCookie('light')).toBe('light');
  });

  it('returns undefined for unknown or missing values', () => {
    expect(parseThemeCookie(undefined)).toBeUndefined();
    expect(parseThemeCookie('blue')).toBeUndefined();
    expect(parseThemeCookie('')).toBeUndefined();
  });
});

describe('getThemeFromCookies', () => {
  it('reads the value via the App Router cookies() shape', () => {
    const store = { get: vi.fn().mockReturnValue({ value: 'light' }) };
    expect(getThemeFromCookies(store)).toBe('light');
    expect(store.get).toHaveBeenCalledWith(THEME_COOKIE_NAME);
  });

  it('returns undefined when the cookie is missing', () => {
    expect(getThemeFromCookies({ get: () => undefined })).toBeUndefined();
  });
});

describe('writeThemeCookie / readThemeCookie', () => {
  afterEach(() => {
    document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0`;
  });

  it('writes and reads the cookie in the browser', () => {
    writeThemeCookie('light');
    expect(document.cookie).toContain(`${THEME_COOKIE_NAME}=light`);
    expect(readThemeCookie()).toBe('light');
  });
});
