import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('exposes its label to assistive tech', () => {
    render(<IconButton aria-label="Open settings" icon="⚙" />);
    expect(screen.getByRole('button', { name: 'Open settings' })).toBeInTheDocument();
  });

  it('fires onClick', async () => {
    const handle = vi.fn();
    render(<IconButton aria-label="Add" icon="+" onClick={handle} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handle).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<IconButton aria-label="Search" icon="⌕" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
