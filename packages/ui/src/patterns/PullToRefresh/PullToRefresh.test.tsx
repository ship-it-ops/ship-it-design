import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PullToRefresh } from './PullToRefresh';

describe('PullToRefresh', () => {
  it('renders the default pulling label', () => {
    render(<PullToRefresh state="pulling" />);
    expect(screen.getByText('Pull to refresh')).toBeInTheDocument();
  });

  it('switches label to "Release to refresh" in ready state', () => {
    render(<PullToRefresh state="ready" />);
    expect(screen.getByText('Release to refresh')).toBeInTheDocument();
  });

  it('marks aria-busy when loading', () => {
    render(<PullToRefresh state="loading" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('clears aria-busy when transitioning back to idle', () => {
    // The component uses `aria-busy={isLoading || undefined}` — absent vs.
    // present is what assistive tech keys off, so re-rendering to a non-
    // loading state must remove the attribute, not flip it to "false".
    const { rerender } = render(<PullToRefresh state="loading" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    rerender(<PullToRefresh state="idle" />);
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-busy');
  });

  it('allows a custom label override', () => {
    render(<PullToRefresh state="loading" label="Syncing graph…" />);
    expect(screen.getByText('Syncing graph…')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PullToRefresh state="loading" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
