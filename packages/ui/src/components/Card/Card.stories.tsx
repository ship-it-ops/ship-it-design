import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';
import { StatCard } from './StatCard';

const meta: Meta<typeof Card> = {
  title: 'Components/Display/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Service overview',
    description: 'A quick summary of the payment-webhook service.',
    children: <div className="text-text-muted text-[12px]">Service body content goes here.</div>,
    footer: 'updated 4m ago',
  },
};

export const Interactive: Story = {
  args: {
    title: 'Click me',
    description: 'Cards become interactive when an onClick handler is set.',
    onClick: () => {},
  },
};

export const Stats: Story = {
  render: () => (
    <div className="grid max-w-[860px] grid-cols-4 gap-3">
      <StatCard label="Entities" value="12,408" delta="+284 today" trend="up" />
      <StatCard label="Relations" value="28,104" delta="+812 today" trend="up" />
      <StatCard label="Sources live" value="4 / 6" delta="2 pending" trend="flat" />
      <StatCard label="Avg confidence" value="92.4%" delta="−0.3%" trend="down" />
    </div>
  ),
};
