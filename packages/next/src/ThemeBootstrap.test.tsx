import { describe, expect, it } from 'vitest';

import { buildBootstrapScript } from './ThemeBootstrap';
import { THEME_COOKIE_NAME } from './theme-cookie';

describe('ThemeBootstrap', () => {
  it('the script references the canonical cookie name', () => {
    const script = buildBootstrapScript();
    expect(script).toContain(THEME_COOKIE_NAME);
  });

  it('the script sets data-theme="light" when the cookie is light', () => {
    document.documentElement.removeAttribute('data-theme');
    document.cookie = `${THEME_COOKIE_NAME}=light; path=/`;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function(buildBootstrapScript())();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0`;
  });

  it('the script clears data-theme when the cookie is dark', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.cookie = `${THEME_COOKIE_NAME}=dark; path=/`;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function(buildBootstrapScript())();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0`;
  });

  it('the script is a no-op when no cookie is present', () => {
    document.documentElement.removeAttribute('data-theme');
    document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0`;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function(buildBootstrapScript())();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});
