import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { THEME_COOKIE_NAME } from './theme-cookie';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  // Reset the theme attribute + cookie before each test. We deliberately do
  // not also reset in afterEach: testing-library's auto-cleanup unmounts the
  // component (and disconnects the MutationObserver in useTheme) only AFTER
  // the test file's afterEach runs, so mutating `data-theme` here would fire
  // the still-attached observer and trip an act() warning for the resulting
  // setState. beforeEach runs before render, when no observer exists yet.
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0`;
  });

  it('renders an accessible switch', () => {
    render(<ThemeToggle label="Theme" />);
    expect(screen.getByRole('switch', { name: 'Theme' })).toBeInTheDocument();
  });

  it('falls back to a default aria-label when no label is given', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('switch', { name: 'Toggle theme' })).toBeInTheDocument();
  });

  it('flips the theme attribute and persists the cookie on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ThemeToggle label="Theme" onThemeChange={onChange} />);
    await user.click(screen.getByRole('switch', { name: 'Theme' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.cookie).toContain(`${THEME_COOKIE_NAME}=light`);
    expect(onChange).toHaveBeenCalledWith('light');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<ThemeToggle label="Theme" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
