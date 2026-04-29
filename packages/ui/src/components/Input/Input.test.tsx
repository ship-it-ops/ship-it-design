import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('renders a placeholder', () => {
    render(<Input placeholder="org.example.com" />);
    expect(screen.getByPlaceholderText('org.example.com')).toBeInTheDocument();
  });

  it('fires onChange as the user types', async () => {
    const handle = vi.fn();
    render(<Input placeholder="x" onChange={(e) => handle(e.target.value)} />);
    await userEvent.type(screen.getByPlaceholderText('x'), 'abc');
    expect(handle).toHaveBeenLastCalledWith('abc');
  });

  it('marks aria-invalid when error', () => {
    render(<Input placeholder="x" error />);
    expect(screen.getByPlaceholderText('x')).toHaveAttribute('aria-invalid', 'true');
  });

  it('blocks typing when disabled', async () => {
    render(<Input placeholder="x" disabled />);
    const input = screen.getByPlaceholderText('x');
    await userEvent.type(input, 'abc');
    expect(input).toHaveValue('');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <label>
        Email <Input placeholder="me@org.com" />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
