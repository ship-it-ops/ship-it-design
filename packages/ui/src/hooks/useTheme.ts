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
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  });

  const setTheme = useCallback((next: Theme) => {
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

  // Keep state in sync if something else flips the attribute (e.g., a test, a parent app).
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      setThemeState(attr === 'light' ? 'light' : 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return { theme, setTheme, toggle };
}
