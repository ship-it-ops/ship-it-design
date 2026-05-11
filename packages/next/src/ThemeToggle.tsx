'use client';

import { Switch, useTheme, type Theme } from '@ship-it-ui/ui';
import { useCallback, type ReactNode } from 'react';

import { writeThemeCookie } from './theme-cookie';

/**
 * ThemeToggle — token-styled `Switch` bound to the active theme. Reuses the
 * shared `useTheme` hook from `@ship-it-ui/ui` for in-page state and writes
 * a year-long cookie so the next request's `ThemeBootstrap` can render the
 * correct theme synchronously.
 *
 * Pass `label` for a visible labelled control, or supply your own wrapper if
 * you want a chip / menu-item layout.
 */

export interface ThemeToggleProps {
  /** Visible label rendered next to the switch. */
  label?: ReactNode;
  /** Override the accessible name. Falls back to `label` when it is a string. */
  'aria-label'?: string;
  /** Fires after the theme has been persisted. Useful for analytics. */
  onThemeChange?: (next: Theme) => void;
}

export function ThemeToggle({
  label,
  'aria-label': ariaLabel,
  onThemeChange,
}: ThemeToggleProps): JSX.Element {
  const { theme, setTheme } = useTheme();

  const handleChange = useCallback(
    (next: boolean) => {
      const target: Theme = next ? 'light' : 'dark';
      setTheme(target);
      writeThemeCookie(target);
      onThemeChange?.(target);
    },
    [setTheme, onThemeChange],
  );

  const accessibleName = ariaLabel ?? (typeof label === 'string' ? label : 'Toggle theme');

  return (
    <span className="inline-flex items-center gap-2">
      <Switch
        checked={theme === 'light'}
        onCheckedChange={handleChange}
        aria-label={accessibleName}
      />
      {label && <span className="text-text-muted text-[12px]">{label}</span>}
    </span>
  );
}

ThemeToggle.displayName = 'ThemeToggle';
