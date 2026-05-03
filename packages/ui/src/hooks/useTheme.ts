'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

/**
 * Read and toggle the active theme (`[data-theme]` on `<html>`).
 *
 * `dark` is the default — when the attribute is absent, dark theme applies.
 * `light` is the opt-in: setting it adds `data-theme="light"` to the document root.
 *
 * Usage:
 *   const { theme, setTheme, toggle } = useTheme();
 *   <Switch on={theme === 'light'} onChange={toggle} />
 */
export function useTheme(): {
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggle: () => void;
} {
  // Initialize to 'dark' on both server and client to avoid SSR hydration mismatch.
  // The real DOM value is read post-mount in the effect below.
  const [theme, setThemeState] = useState<Theme>('dark');

  const setTheme = useCallback((next: Theme) => {
    if (typeof document === 'undefined') {
      setThemeState(next);
      return;
    }
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Sync state with the actual DOM attribute on mount, then keep it in sync if
  // something else flips the attribute (e.g., a test, a parent app).
  useEffect(() => {
    const initial = document.documentElement.getAttribute('data-theme');
    setThemeState(initial === 'light' ? 'light' : 'dark');
    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      setThemeState(attr === 'light' ? 'light' : 'dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return { theme, setTheme, toggle };
}
