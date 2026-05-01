import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('exposes a status role with aria-busy', () => {
    render(<Skeleton width="50%" />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('uses height for both dimensions in circle shape', () => {
    render(<Skeleton shape="circle" height={48} />);
    const el = screen.getByRole('status');
    expect(el).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('renders the block shape with default height', () => {
    render(<Skeleton shape="block" />);
    expect(screen.getByRole('status')).toHaveStyle({ height: '80px' });
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Skeleton width="50%" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
