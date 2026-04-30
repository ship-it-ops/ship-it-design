import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { GraphNode } from './GraphNode';

describe('GraphNode', () => {
  it('renders the canonical glyph for the type', () => {
    render(<GraphNode type="service" label="payment-webhook" />);
    expect(screen.getByText('payment-webhook')).toBeInTheDocument();
  });

  it('reflects state as a data attribute', () => {
    const { container } = render(<GraphNode type="service" state="selected" label="x" />);
    expect(container.firstChild).toHaveAttribute('data-state', 'selected');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<GraphNode type="service" label="payment-webhook" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
