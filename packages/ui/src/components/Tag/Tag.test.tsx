import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Tag } from './Tag';

describe('Tag', () => {
  it('renders text', () => {
    render(<Tag>backend</Tag>);
    expect(screen.getByText('backend')).toBeInTheDocument();
  });

  it('renders the leading icon slot', () => {
    render(<Tag icon={<span data-testid="ticon">#</span>}>backend</Tag>);
    expect(screen.getByTestId('ticon')).toBeInTheDocument();
  });

  it('calls onRemove when × is clicked', async () => {
    const handle = vi.fn();
    render(<Tag onRemove={handle}>x</Tag>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(handle).toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Tag onRemove={() => {}}>tag</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
