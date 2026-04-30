import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { EntityCard } from './EntityCard';

describe('EntityCard', () => {
  it('renders the title and subtitle', () => {
    render(<EntityCard type="service" title="payment-webhook-v2" subtitle="owned by Payments" />);
    expect(screen.getByText('payment-webhook-v2')).toBeInTheDocument();
    expect(screen.getByText('owned by Payments')).toBeInTheDocument();
  });

  it('renders the stats grid', () => {
    render(
      <EntityCard
        type="service"
        title="ledger-core"
        stats={[
          { label: 'owner', value: 'Priya K' },
          { label: 'sla', value: '99.9%' },
        ]}
      />,
    );
    expect(screen.getByText('owner')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <EntityCard
        type="service"
        title="payment-webhook-v2"
        description="critical-path service for checkout"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
