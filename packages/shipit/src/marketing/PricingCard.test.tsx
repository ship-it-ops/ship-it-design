import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PricingCard } from './PricingCard';

describe('PricingCard', () => {
  it('renders tier, price, and features', () => {
    render(
      <PricingCard
        tier="Pro"
        price="$29 / mo"
        description="For growing teams"
        features={['Unlimited repos', 'SSO', 'Priority support']}
      />,
    );
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('$29 / mo')).toBeInTheDocument();
    expect(screen.getByText('SSO')).toBeInTheDocument();
  });

  it('shows the recommended pill when featured', () => {
    render(<PricingCard tier="Pro" price="$29" features={['x']} featured />);
    expect(screen.getByText('recommended')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <PricingCard tier="Pro" price="$29 / mo" features={['Feature one', 'Feature two']} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
