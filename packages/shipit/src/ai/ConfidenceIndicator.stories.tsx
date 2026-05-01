import type { Meta, StoryObj } from '@storybook/react';

import { ConfidenceIndicator } from './ConfidenceIndicator';

const meta: Meta<typeof ConfidenceIndicator> = {
  title: 'ShipIt/AI/ConfidenceIndicator',
  component: ConfidenceIndicator,
  tags: ['autodocs'],
  args: { value: 88.2 },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 0.1 } },
    tier: { control: 'inline-radio', options: ['high', 'medium', 'low', 'unverified'] },
  },
};
export default meta;

type Story = StoryObj<typeof ConfidenceIndicator>;

export const Default: Story = {};

export const AllTiers: Story = {
  render: () => (
    <div className="flex flex-col gap-[10px]">
      <ConfidenceIndicator value={99.4} />
      <ConfidenceIndicator value={88.2} />
      <ConfidenceIndicator value={62.1} />
      <ConfidenceIndicator value={28.4} />
    </div>
  ),
};
