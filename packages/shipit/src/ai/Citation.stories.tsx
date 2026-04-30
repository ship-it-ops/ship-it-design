import type { Meta, StoryObj } from '@storybook/react';

import { Citation } from './Citation';

const meta: Meta<typeof Citation> = {
  title: 'ShipIt/AI/Citation',
  component: Citation,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Citation>;

export const Block: Story = {
  args: { index: 1, source: 'team-roster.md', meta: 'notion · 2d ago' },
};

export const Stack: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Citation index={1} source="team-roster.md" meta="notion · 2d ago" />
      <Citation index={2} source="runbook-oncall.md:L42" meta="github · 3h ago" />
      <Citation index={3} source="#payments-oncall" meta="slack · 4h ago" />
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <p className="text-text text-[13px]">
      Priya owns{' '}
      <code className="bg-panel-2 rounded-xs px-[4px] py-px font-mono text-[11px]">
        payment-webhook-v2
      </code>
      <Citation inline index={1} source="team-roster.md" />, currently on-call through Friday
      <Citation inline index={2} source="pagerduty.schedules" />.
    </p>
  ),
};
