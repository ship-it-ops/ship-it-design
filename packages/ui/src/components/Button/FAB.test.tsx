import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { FAB } from './FAB';

describe('FAB', () => {
  it('exposes its aria-label', () => {
    render(<FAB aria-label="Ask anything" />);
    expect(screen.getByRole('button', { name: 'Ask anything' })).toBeInTheDocument();
  });

  it('renders the default ✦ icon when none is provided', () => {
    render(<FAB aria-label="default" />);
    expect(screen.getByRole('button', { name: 'default' })).toHaveTextContent('✦');
  });

  it('renders a custom icon when given', () => {
    render(<FAB aria-label="add" icon="+" />);
    expect(screen.getByRole('button', { name: 'add' })).toHaveTextContent('+');
  });

  it('defaults to type="button" but allows overrides', () => {
    render(
      <>
        <FAB aria-label="default-type" />
        <FAB aria-label="submit-type" type="submit" />
      </>,
    );
    expect(screen.getByRole('button', { name: 'default-type' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'submit-type' })).toHaveAttribute('type', 'submit');
  });

  it('fires onClick', async () => {
    const handle = vi.fn();
    render(<FAB aria-label="go" onClick={handle} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handle).toHaveBeenCalledOnce();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<FAB aria-label="Compose" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
