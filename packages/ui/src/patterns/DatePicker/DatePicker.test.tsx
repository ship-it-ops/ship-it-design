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
    const onValueChange = vi.fn();
    render(<Calendar defaultMonth={3} defaultYear={2026} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Apr 15 2026/ }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    const arg = onValueChange.mock.calls[0]![0] as Date;
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

  it('supports arrow-key navigation with roving tabindex', async () => {
    render(
      <Calendar
        defaultMonth={3}
        defaultYear={2026}
        defaultValue={new Date(2026, 3, 15)}
      />,
    );
    // Selected day starts as the focused/tabbable cell.
    const apr15 = screen.getByRole('button', { name: /Apr 15 2026/ });
    expect(apr15).toHaveAttribute('tabindex', '0');
    apr15.focus();
    expect(apr15).toHaveFocus();

    // ArrowRight moves focus to the next day.
    await userEvent.keyboard('{ArrowRight}');
    const apr16 = screen.getByRole('button', { name: /Apr 16 2026/ });
    expect(apr16).toHaveFocus();
    expect(apr16).toHaveAttribute('tabindex', '0');
    expect(apr15).toHaveAttribute('tabindex', '-1');

    // ArrowDown moves a week forward.
    await userEvent.keyboard('{ArrowDown}');
    const apr23 = screen.getByRole('button', { name: /Apr 23 2026/ });
    expect(apr23).toHaveFocus();

    // PageDown moves to the next month and focuses the equivalent day.
    await userEvent.keyboard('{PageDown}');
    expect(screen.getByText('May 2026')).toBeInTheDocument();
    const may23 = screen.getByRole('button', { name: /May 23 2026/ });
    expect(may23).toHaveFocus();
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
    expect(onValueChange).toHaveBeenCalledTimes(1);
    const arg = onValueChange.mock.calls[0]![0] as Date;
    expect(arg.getDate()).toBe(15);
  });

  it('has no a11y violations (closed)', async () => {
    const { container } = render(<DatePicker placeholder="Pick a date" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (open)', async () => {
    const { container } = render(<DatePicker defaultValue={new Date(2026, 3, 1)} />);
    await userEvent.click(screen.getByRole('button'));
    // Wait until the calendar grid has rendered before scanning.
    await screen.findByRole('button', { name: /Apr 15 2026/ });
    expect(await axe(container)).toHaveNoViolations();
  });
});
