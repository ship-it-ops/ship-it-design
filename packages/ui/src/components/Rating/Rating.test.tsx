import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Rating } from './Rating';

describe('Rating', () => {
  it('renders read-only with an aria-label describing the value', () => {
    render(<Rating value={4.5} readOnly precision="half" />);
    expect(screen.getByRole('img', { name: '4.5 out of 5 stars' })).toBeInTheDocument();
  });

  it('selects a star on click in interactive mode', async () => {
    const handle = vi.fn();
    render(<Rating onValueChange={handle} aria-label="My rating" />);
    await userEvent.click(screen.getByRole('radio', { name: '4 stars' }));
    expect(handle).toHaveBeenCalledWith(4);
  });

  it('moves selection with arrow keys', async () => {
    const handle = vi.fn();
    render(<Rating defaultValue={2} onValueChange={handle} aria-label="My rating" />);
    const second = screen.getByRole('radio', { name: '2 stars' });
    second.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(handle).toHaveBeenLastCalledWith(3);
    await userEvent.keyboard('{ArrowLeft}');
    expect(handle).toHaveBeenLastCalledWith(2);
  });

  it('jumps to first/last with Home/End', async () => {
    const handle = vi.fn();
    render(<Rating defaultValue={3} onValueChange={handle} aria-label="My rating" />);
    screen.getByRole('radio', { name: '3 stars' }).focus();
    await userEvent.keyboard('{End}');
    expect(handle).toHaveBeenLastCalledWith(5);
    await userEvent.keyboard('{Home}');
    expect(handle).toHaveBeenLastCalledWith(1);
  });

  it('does not mutate when read-only', async () => {
    const handle = vi.fn();
    render(<Rating value={3} readOnly onValueChange={handle} />);
    expect(screen.queryByRole('radio')).toBeNull();
    expect(handle).not.toHaveBeenCalled();
  });

  it('respects a custom max', () => {
    render(<Rating value={7} max={10} readOnly />);
    expect(screen.getByRole('img', { name: '7 out of 10 stars' })).toBeInTheDocument();
  });

  it('has no a11y violations (interactive)', async () => {
    const { container } = render(<Rating defaultValue={3} aria-label="Rate the host" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (read-only)', async () => {
    const { container } = render(<Rating value={4.7} readOnly precision="half" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
