import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders a search input with the default placeholder', () => {
    render(<SearchInput aria-label="search" />);
    expect(screen.getByRole('searchbox', { name: 'search' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument();
  });

  it('overrides the placeholder when provided', () => {
    render(<SearchInput aria-label="search" placeholder="Find anything" />);
    expect(screen.getByPlaceholderText('Find anything')).toBeInTheDocument();
  });

  it('shows the default ⌘K shortcut hint and lets it be customized', () => {
    const { rerender } = render(<SearchInput aria-label="search" />);
    expect(screen.getByText('⌘K')).toBeInTheDocument();

    rerender(<SearchInput aria-label="search" shortcut="/" />);
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('omits the shortcut hint when explicitly disabled', () => {
    render(<SearchInput aria-label="search" shortcut="" />);
    expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
  });

  it('fires onChange as the user types', async () => {
    const handle = vi.fn();
    render(<SearchInput aria-label="search" onChange={(e) => handle(e.target.value)} />);
    await userEvent.type(screen.getByRole('searchbox'), 'abc');
    expect(handle).toHaveBeenLastCalledWith('abc');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<SearchInput aria-label="Search docs" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
