import type { Meta, StoryObj } from '@storybook/react';

import { ToolCallCard } from './ToolCallCard';

const meta: Meta<typeof ToolCallCard> = {
  title: 'ShipIt/AI/ToolCallCard',
  component: ToolCallCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof ToolCallCard>;

export const Completed: Story = {
  render: () => (
    <ToolCallCard name="graph.query" status="94ms · 142 rows">
      {`match (s:Service {name: "payment-webhook-v2"})
return s.owner, s.runbook`}
    </ToolCallCard>
  ),
};

export const Running: Story = {
  args: { name: 'docs.search', running: true },
};

export const Stack: Story = {
  render: () => (
    <div className="flex w-full max-w-[620px] flex-col gap-2">
      <ToolCallCard name="graph.query" status="94ms · 142 rows">
        {`match (s:Service {name: "payment-webhook-v2"})
return s.owner, s.runbook`}
      </ToolCallCard>
      <ToolCallCard name="docs.search" running />
    </div>
  ),
};
