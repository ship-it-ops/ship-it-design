import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@ship-it/ui';

import { EntityCard } from './EntityCard';

const meta: Meta<typeof EntityCard> = {
  title: 'ShipIt/Entity/EntityCard',
  component: EntityCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EntityCard>;

export const Service: Story = {
  args: {
    type: 'service',
    title: 'payment-webhook-v2',
    subtitle: 'ent_0x7a2f',
    description: 'Handles incoming Stripe webhook events, dedupes, forwards to ledger-core.',
    stats: [
      { label: 'owner', value: 'Payments', tone: 'accent' },
      { label: 'on-call', value: 'Priya K.', tone: 'accent' },
      { label: 'runtime', value: 'node 20' },
      { label: 'sla', value: '99.9%' },
      { label: 'p99', value: '94ms' },
    ],
    actions: (
      <Button size="sm" variant="primary">
        Ask about this ✦
      </Button>
    ),
  },
};

export const Incident: Story = {
  args: {
    type: 'incident',
    title: 'inc-4812 · checkout 5xx spike',
    subtitle: 'started 14m ago',
    description: 'Elevated 5xx rate on payment-webhook-v2; ledger-core dependency timing out.',
    stats: [
      { label: 'severity', value: 'SEV-2', tone: 'err' },
      { label: 'owner', value: 'Payments', tone: 'accent' },
      { label: 'duration', value: '14m', tone: 'warn' },
    ],
  },
};
