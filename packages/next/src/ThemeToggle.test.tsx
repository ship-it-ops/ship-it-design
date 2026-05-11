import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ThemeToggle } from './ThemeToggle';
import { THEME_COOKIE_NAME } from './theme-cookie';

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0`;
  });

  afterEach(() => {
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
    const onChange = vi.fn();
    render(<ThemeToggle label="Theme" onThemeChange={onChange} />);
    await userEvent.click(screen.getByRole('switch', { name: 'Theme' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.cookie).toContain(`${THEME_COOKIE_NAME}=light`);
    expect(onChange).toHaveBeenCalledWith('light');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<ThemeToggle label="Theme" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
