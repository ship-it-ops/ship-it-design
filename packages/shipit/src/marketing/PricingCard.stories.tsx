import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@ship-it/ui';

import { PricingCard } from './PricingCard';

const meta: Meta<typeof PricingCard> = {
  title: 'ShipIt/Marketing/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof PricingCard>;

export const Single: Story = {
  args: {
    tier: 'Pro',
    price: (
      <>
        $29 <span className="text-text-dim text-[14px] font-normal">/ user / mo</span>
      </>
    ),
    description: 'For growing teams that need to graph their stack.',
    features: ['Unlimited repos', 'SSO + SCIM', 'Audit log', '7-day query history'],
    action: (
      <Button variant="primary" fullWidth>
        Start free
      </Button>
    ),
    featured: true,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3" style={{ width: 720 }}>
      <PricingCard
        tier="Free"
        price="$0"
        description="For small teams kicking the tires."
        features={['1 repo', '14-day history', 'Community support']}
        action={
          <Button variant="secondary" fullWidth>
            Get started
          </Button>
        }
      />
      <PricingCard
        tier="Pro"
        price={
          <>
            $29 <span className="text-text-dim text-[14px] font-normal">/ user / mo</span>
          </>
        }
        description="For growing teams."
        features={['Unlimited repos', 'SSO + SCIM', 'Audit log']}
        action={
          <Button variant="primary" fullWidth>
            Start free
          </Button>
        }
        featured
      />
      <PricingCard
        tier="Enterprise"
        price="Talk to us"
        description="VPC, custom retention, on-call SLO."
        features={['VPC deploy', 'Custom retention', 'On-call SLO']}
        action={
          <Button variant="secondary" fullWidth>
            Book a call
          </Button>
        }
      />
    </div>
  ),
};
