import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No services yet" description="Connect a code source to start." />);
    expect(screen.getByText('No services yet')).toBeInTheDocument();
    expect(screen.getByText('Connect a code source to start.')).toBeInTheDocument();
  });

  it('renders chips and fires their handlers', async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="Ask anything"
        chips={[{ label: 'Who owns checkout?', onClick }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Who owns checkout?' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <EmptyState
        title="No results"
        description="Try a broader search."
        icon="⌕"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
