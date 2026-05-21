import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PriceBreakdown } from './PriceBreakdown';

describe('PriceBreakdown', () => {
  it('renders each item with label and amount', () => {
    render(
      <PriceBreakdown
        items={[
          { label: 'Trip price', amount: '$267' },
          { label: 'Service fee', amount: '$32' },
        ]}
        total="$299"
      />,
    );
    expect(screen.getByText('Trip price')).toBeInTheDocument();
    expect(screen.getByText('$32')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
  });

  it('renders subLabel and original-amount strike-through', () => {
    render(
      <PriceBreakdown
        items={[
          {
            label: 'Daily rate',
            subLabel: '$89 × 3 nights',
            amount: '$240',
            originalAmount: '$267',
            discount: true,
          },
        ]}
      />,
    );
    expect(screen.getByText('$89 × 3 nights')).toBeInTheDocument();
    expect(screen.getByText('$267')).toBeInTheDocument();
  });

  it('renders custom children before the total', () => {
    render(
      <PriceBreakdown total="$10">
        <PriceBreakdown.Line label="Custom" amount="$10" />
      </PriceBreakdown>,
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <PriceBreakdown items={[{ label: 'Rate', amount: '$89' }]} total="$89" currency="USD" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
