import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { GraphInspector } from './GraphInspector';

describe('GraphInspector', () => {
  it('renders title, description, and properties', () => {
    render(
      <GraphInspector
        type="service"
        entityId="ent_0x7a2f"
        title="payment-webhook-v2"
        description="Stripe webhook handler"
        properties={[
          { key: 'owner', value: 'Payments' },
          { key: 'sla', value: '99.9%' },
        ]}
      />,
    );
    expect(screen.getByText('payment-webhook-v2')).toBeInTheDocument();
    expect(screen.getByText('Stripe webhook handler')).toBeInTheDocument();
    expect(screen.getByText('owner')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });

  it('renders relations with the count', () => {
    render(
      <GraphInspector
        type="service"
        title="x"
        relations={[{ relation: '→ depends on', entity: 'ledger-core' }]}
        relationCount={142}
      />,
    );
    expect(screen.getByText(/Relations · 142/)).toBeInTheDocument();
    expect(screen.getByText('ledger-core')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<GraphInspector type="service" title="x" description="desc" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
