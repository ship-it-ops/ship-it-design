import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NotifRow } from './NotifRow';

describe('NotifRow', () => {
  it('renders title and body', () => {
    render(<NotifRow title="Deploy succeeded" body="payments-api v3.1.4 → production." />);
    expect(screen.getByText('Deploy succeeded')).toBeInTheDocument();
    expect(screen.getByText('payments-api v3.1.4 → production.')).toBeInTheDocument();
  });

  it('renders relative time when supplied', () => {
    render(<NotifRow title="Hi" time="9:32" />);
    expect(screen.getByText('9:32')).toBeInTheDocument();
  });

  it('renders as a link when href is set', () => {
    render(<NotifRow title="Link row" href="/inbox/123" />);
    expect(screen.getByRole('link', { name: 'Link row' })).toHaveAttribute('href', '/inbox/123');
  });

  it('renders as a button when onClick is set, and fires the handler on click', async () => {
    const handler = vi.fn();
    render(<NotifRow title="Tappable" onClick={handler} />);
    await userEvent.click(screen.getByRole('button', { name: 'Tappable' }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('activates the button branch with the keyboard (Enter / Space)', async () => {
    // The whole reason the tappable branch renders as a `<button>` rather than
    // `<div onClick>` is that buttons get keyboard activation for free. Lock
    // that behavior down so a future refactor can't silently regress it.
    const handler = vi.fn();
    render(<NotifRow title="Tappable" onClick={handler} />);
    const button = screen.getByRole('button', { name: 'Tappable' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('forwards `id` and `data-*` attributes onto the polymorphic root', () => {
    // Regression: the `<a>` and `<button>` branches previously dropped
    // `{...props}`, silently discarding `id`, `data-testid`, `aria-*`, etc.
    const { container } = render(
      <>
        <NotifRow title="Link" href="/x" id="link-row" data-testid="link" />
        <NotifRow title="Btn" onClick={() => {}} id="btn-row" data-testid="btn" />
      </>,
    );
    expect(container.querySelector('a#link-row')).toHaveAttribute('data-testid', 'link');
    expect(container.querySelector('button#btn-row')).toHaveAttribute('data-testid', 'btn');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <NotifRow title="First" body="Body" time="9:32" unread tone="err" isFirst />
        <NotifRow title="Second" body="Body" time="8:14" />
        <NotifRow title="Last" body="Body" time="7:01" isLast />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations in the button (onClick) variant', async () => {
    const { container } = render(
      <NotifRow title="Tappable" body="Body" time="9:32" onClick={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
