import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('exposes a status role with aria-busy', () => {
    render(<Skeleton width="50%" />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Skeleton width="50%" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
