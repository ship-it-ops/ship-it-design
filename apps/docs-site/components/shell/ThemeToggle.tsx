'use client';

import { useTheme } from '@ship-it-ui/ui';
import { useEffect, useState } from 'react';


/**
 * Reuses `useTheme` from `@ship-it-ui/ui` (toggles `[data-theme]` on `<html>`)
 * and persists the choice to `localStorage`. The root layout runs an inline
 * bootstrap script that reads the same key before first paint to avoid a
 * theme flash.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => {
        toggle();
        const next = theme === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem('theme', next);
        } catch {
          // Ignore storage errors (private mode, quota, etc.).
        }
      }}
      aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="text-text-muted hover:text-text focus-visible:ring-accent-dim rounded-xs px-2 py-1 text-[14px] outline-none focus-visible:ring-[3px]"
    >
      {/* The icon mirrors the *current* theme; render a stable placeholder
          on the server to avoid a hydration mismatch. */}
      <span aria-hidden>{mounted ? (theme === 'dark' ? '☾' : '☀') : '☾'}</span>
    </button>
  );
}
