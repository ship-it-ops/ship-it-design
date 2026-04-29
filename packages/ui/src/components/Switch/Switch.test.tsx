import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles on click', async () => {
    const handle = vi.fn();
    render(<Switch label="Auto-refresh" onCheckedChange={handle} />);
    await userEvent.click(screen.getByLabelText('Auto-refresh'));
    expect(handle).toHaveBeenCalledWith(true);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Switch label="Auto-refresh" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
