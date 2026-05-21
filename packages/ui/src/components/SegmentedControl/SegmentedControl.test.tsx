import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
] as const;

describe('SegmentedControl', () => {
  it('renders all options as radios', () => {
    render(<SegmentedControl options={[...options]} aria-label="Rate period" />);
    expect(screen.getByRole('radio', { name: 'Daily' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Weekly' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeInTheDocument();
  });

  it('fires onValueChange on click', async () => {
    const handle = vi.fn();
    render(
      <SegmentedControl
        options={[...options]}
        defaultValue="day"
        onValueChange={handle}
        aria-label="Rate period"
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Weekly' }));
    expect(handle).toHaveBeenCalledWith('week');
  });

  it('respects disabled options', async () => {
    const handle = vi.fn();
    render(
      <SegmentedControl
        options={[
          { value: 'day', label: 'Daily' },
          { value: 'week', label: 'Weekly', disabled: true },
        ]}
        onValueChange={handle}
        aria-label="Rate period"
      />,
    );
    const disabled = screen.getByRole('radio', { name: 'Weekly' });
    expect(disabled).toBeDisabled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <SegmentedControl options={[...options]} defaultValue="day" aria-label="Rate period" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
