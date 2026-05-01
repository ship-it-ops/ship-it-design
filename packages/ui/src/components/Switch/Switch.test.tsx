import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles on click', async () => {
    const handle = vi.fn();
    render(<Switch label="Auto-refresh" onCheckedChange={handle} />);
    await userEvent.click(screen.getByLabelText('Auto-refresh'));
    expect(handle).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const handle = vi.fn();
    render(<Switch label="Auto-refresh" disabled onCheckedChange={handle} />);
    await userEvent.click(screen.getByLabelText('Auto-refresh'));
    expect(handle).not.toHaveBeenCalled();
  });

  it('renders without a label', () => {
    render(<Switch aria-label="solo" />);
    expect(screen.getByRole('switch', { name: 'solo' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Switch label="Auto-refresh" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
