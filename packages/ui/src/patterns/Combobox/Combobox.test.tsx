import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Combobox } from './Combobox';

const repos = [
  'repo:shipit-api',
  'repo:shipit-web',
  'repo:shipit-ingest',
  'repo:shipit-graph',
];

describe('Combobox', () => {
  it('opens the listbox on focus and shows all options', async () => {
    render(<Combobox options={repos} aria-label="Repos" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(repos.length);
  });

  it('filters as the user types', async () => {
    render(<Combobox options={repos} aria-label="Repos" />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, 'graph');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('repo:shipit-graph');
  });

  it('selects on click and reflects the choice in the input', async () => {
    const onValueChange = vi.fn();
    render(<Combobox options={repos} aria-label="Repos" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: /shipit-web/ }));
    expect(onValueChange).toHaveBeenCalledWith('repo:shipit-web');
    expect(input).toHaveValue('repo:shipit-web');
  });

  it('selects via keyboard ArrowDown + Enter', async () => {
    const onValueChange = vi.fn();
    render(<Combobox options={repos} aria-label="Repos" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, '{ArrowDown}{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('repo:shipit-ingest');
  });

  it('shows the empty state when nothing matches', async () => {
    render(<Combobox options={repos} aria-label="Repos" />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.type(input, 'zzz');
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('Escape closes the listbox', async () => {
    render(<Combobox options={repos} aria-label="Repos" />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Combobox options={repos} aria-label="Repos" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
