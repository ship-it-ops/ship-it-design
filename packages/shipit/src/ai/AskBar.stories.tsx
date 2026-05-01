import { Chip } from '@ship-it/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { AskBar, type AskBarProps } from './AskBar';

const meta: Meta<typeof AskBar> = {
  title: 'ShipIt/AI/AskBar',
  component: AskBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { placeholder: 'Ask anything…' },
};
export default meta;

type Story = StoryObj<typeof AskBar>;

function AskBarDemo(args: AskBarProps) {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-[620px] flex-col gap-3">
      <AskBar {...args} onSubmit={setLast} />
      {last && <div className="text-text-dim text-[12px]">submitted: {last}</div>}
    </div>
  );
}

export const Default: Story = {
  render: (args) => <AskBarDemo {...args} />,
};

export const Streaming: Story = {
  args: {
    streaming: true,
    defaultValue: "Who owns payment-webhook and what's the rollback plan?",
  },
};

export const ScopedWithChips: Story = {
  render: (args) => (
    <AskBar {...args} defaultValue="Who is on call this week?">
      <Chip>scoped: Payments</Chip>
      <Chip removable>service:payment-webhook-v2</Chip>
    </AskBar>
  ),
};
