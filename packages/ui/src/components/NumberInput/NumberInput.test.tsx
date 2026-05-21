import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('increments on +', async () => {
    const handle = vi.fn();
    render(<NumberInput defaultValue={2} onValueChange={handle} aria-label="Drivers" />);
    await userEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(handle).toHaveBeenLastCalledWith(3);
  });

  it('decrements on −', async () => {
    const handle = vi.fn();
    render(<NumberInput defaultValue={2} onValueChange={handle} aria-label="Drivers" />);
    await userEvent.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(handle).toHaveBeenLastCalledWith(1);
  });

  it('clamps at min and max', async () => {
    const handle = vi.fn();
    render(
      <NumberInput defaultValue={1} min={1} max={2} onValueChange={handle} aria-label="Range" />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(handle).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(handle).toHaveBeenLastCalledWith(2);
    await userEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(handle).toHaveBeenCalledTimes(1);
  });

  it('responds to arrow keys', async () => {
    const handle = vi.fn();
    render(<NumberInput defaultValue={3} onValueChange={handle} aria-label="Days" />);
    const input = screen.getByRole('spinbutton');
    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(handle).toHaveBeenLastCalledWith(4);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(handle).toHaveBeenLastCalledWith(2);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<NumberInput defaultValue={1} aria-label="Additional drivers" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
