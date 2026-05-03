import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { OTP } from './OTP';

describe('OTP', () => {
  it('renders the requested number of slots', () => {
    render(<OTP length={4} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
  });

  it('auto-advances after typing a digit', async () => {
    render(<OTP length={4} />);
    const slots = screen.getAllByRole('textbox');
    await userEvent.click(slots[0]!);
    await userEvent.keyboard('1');
    expect(slots[1]).toHaveFocus();
  });

  it('rejects non-digit input', async () => {
    render(<OTP length={4} />);
    const slots = screen.getAllByRole('textbox');
    await userEvent.click(slots[0]!);
    await userEvent.keyboard('a');
    expect(slots[0]).toHaveValue('');
  });

  it('calls onComplete when all slots filled', async () => {
    const handle = vi.fn();
    render(<OTP length={3} onComplete={handle} />);
    const slots = screen.getAllByRole('textbox');
    await userEvent.click(slots[0]!);
    await userEvent.keyboard('123');
    expect(handle).toHaveBeenCalledWith('123');
  });

  it('announces "Code complete" via a polite live region when filled', async () => {
    const { container } = render(<OTP length={3} />);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveTextContent('');
    const slots = screen.getAllByRole('textbox');
    await userEvent.click(slots[0]!);
    await userEvent.keyboard('123');
    expect(liveRegion).toHaveTextContent('Code complete');
  });

  it('clears the completion announcement when the code becomes incomplete', async () => {
    const { container } = render(<OTP length={3} />);
    const liveRegion = container.querySelector('[aria-live="polite"]')!;
    const slots = screen.getAllByRole('textbox');
    await userEvent.click(slots[0]!);
    await userEvent.keyboard('123');
    expect(liveRegion).toHaveTextContent('Code complete');
    // Clear the last slot — focus + select (via onFocus) means Backspace deletes the digit.
    await userEvent.click(slots[2]!);
    await userEvent.keyboard('{Backspace}');
    expect(liveRegion).toHaveTextContent('');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<OTP length={3} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
