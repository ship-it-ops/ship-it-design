import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { EntityBadge } from './EntityBadge';

describe('EntityBadge', () => {
  it('renders the canonical label by default', () => {
    render(<EntityBadge type="service" />);
    expect(screen.getByText('Service')).toBeInTheDocument();
  });

  it('honours a label override', () => {
    render(<EntityBadge type="incident" label="P0 incident" />);
    expect(screen.getByText('P0 incident')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<EntityBadge type="document" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('forwards `size` to the underlying Badge', () => {
    render(<EntityBadge type="service" size="sm" data-testid="badge" />);
    // Small-size class from badgeStyles (`h-[18px]`) lands on the rendered span.
    expect(screen.getByTestId('badge').className).toMatch(/h-\[18px\]/);
  });
});
