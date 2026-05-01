import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const handle = vi.fn();
    render(<Checkbox label="x" onCheckedChange={handle} />);
    await userEvent.click(screen.getByLabelText('x'));
    expect(handle).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const handle = vi.fn();
    render(<Checkbox label="x" disabled onCheckedChange={handle} />);
    await userEvent.click(screen.getByLabelText('x'));
    expect(handle).not.toHaveBeenCalled();
  });

  it('renders the indeterminate dash when checked="indeterminate"', () => {
    render(<Checkbox label="x" checked="indeterminate" />);
    expect(screen.getByText('−')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Checkbox label="Accept" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
