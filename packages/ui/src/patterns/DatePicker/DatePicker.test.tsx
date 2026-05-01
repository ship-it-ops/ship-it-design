import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Calendar } from './Calendar';
import { DatePicker } from './DatePicker';

describe('Calendar', () => {
  it('renders the visible month', () => {
    render(<Calendar defaultMonth={3} defaultYear={2026} />);
    expect(screen.getByText('April 2026')).toBeInTheDocument();
  });

  it('selects on day click', async () => {
    const onSelect = vi.fn();
    render(<Calendar defaultMonth={3} defaultYear={2026} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Apr 15 2026/ }));
    expect(onSelect).toHaveBeenCalled();
    const arg = onSelect.mock.calls[0]?.[0] as Date;
    expect(arg.getDate()).toBe(15);
    expect(arg.getMonth()).toBe(3);
    expect(arg.getFullYear()).toBe(2026);
  });

  it('navigates months', async () => {
    render(<Calendar defaultMonth={3} defaultYear={2026} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('May 2026')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Calendar defaultMonth={3} defaultYear={2026} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('DatePicker', () => {
  it('shows the placeholder when empty', () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(screen.getByRole('button')).toHaveTextContent('Pick a date');
  });

  it('opens the calendar and lets you select a date', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 3, 1)} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByRole('button', { name: /Apr 15 2026/ }));
    expect(onValueChange).toHaveBeenCalled();
    const arg = onValueChange.mock.calls[0]?.[0] as Date;
    expect(arg.getDate()).toBe(15);
  });

  it('has no a11y violations (closed)', async () => {
    const { container } = render(<DatePicker placeholder="Pick a date" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
