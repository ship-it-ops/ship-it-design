import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
  it('renders the placeholder when empty', () => {
    render(<DateRangePicker aria-label="Trip dates" />);
    expect(screen.getByRole('button', { name: 'Trip dates' })).toHaveTextContent('Pickup → Return');
  });

  it('opens the calendar popover on click', async () => {
    render(<DateRangePicker aria-label="Trip dates" />);
    await userEvent.click(screen.getByRole('button', { name: 'Trip dates' }));
    expect(screen.getAllByRole('grid').length).toBeGreaterThan(0);
  });

  it('selects a from/to range', async () => {
    const handle = vi.fn();
    const may = new Date(2026, 4, 1);
    render(
      <DateRangePicker
        aria-label="Trip dates"
        onValueChange={handle}
        defaultValue={{ from: may }}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Trip dates' }));
    // Click May 10, 2026 → completes the range
    const may10 = screen.getAllByLabelText('Sun May 10 2026')[0]!;
    await userEvent.click(may10);
    expect(handle).toHaveBeenLastCalledWith({ from: may, to: expect.any(Date) });
  });

  it('has no a11y violations', async () => {
    const { container } = render(<DateRangePicker aria-label="Trip dates" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
