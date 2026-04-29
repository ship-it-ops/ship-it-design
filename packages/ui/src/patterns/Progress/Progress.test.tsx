import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Progress } from './Progress';

describe('Progress', () => {
  it('renders aria-valuenow for determinate progress', () => {
    render(<Progress value={42} label="Loading" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate label="Loading" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('clamps value above max', () => {
    render(<Progress value={150} label="Done" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Progress value={60} label="Indexing" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
