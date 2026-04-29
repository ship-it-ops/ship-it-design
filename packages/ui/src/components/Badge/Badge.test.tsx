import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Badge variant="ok" dot>synced</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
