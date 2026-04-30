import type { Meta, StoryObj } from '@storybook/react';

import { Citation } from './Citation';
import { CopilotMessage } from './CopilotMessage';

const meta: Meta<typeof CopilotMessage> = {
  title: 'ShipIt/AI/CopilotMessage',
  component: CopilotMessage,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof CopilotMessage>;

export const User: Story = {
  args: { role: 'user', avatar: 'MT', children: "Who owns payment-webhook and what's the rollback plan?" },
};

export const Assistant: Story = {
  args: {
    role: 'assistant',
    children: 'Priya Khanna owns payment-webhook-v2, currently on-call through Friday.',
  },
};

export const Streaming: Story = {
  args: {
    role: 'assistant',
    streaming: true,
    children:
      'Rollback is automated — the rollback.yml runbook reverts to the previous tag and re-queues the last 50 events',
  },
};

export const Conversation: Story = {
  render: () => (
    <div className="flex w-full max-w-[620px] flex-col gap-3">
      <CopilotMessage role="user" avatar="MT">
        Who owns payment-webhook and what&apos;s the rollback plan?
      </CopilotMessage>
      <CopilotMessage role="assistant">
        <p className="m-0">
          <strong className="font-medium">Priya Khanna</strong> owns
          {' '}
          <code className="rounded-xs bg-panel-2 px-[4px] py-px font-mono text-[11px]">payment-webhook-v2</code>,
          currently on-call through Friday.
          <Citation inline index={1} source="team-roster.md" />
        </p>
        <p className="mt-2 m-0">
          Rollback is automated — the
          {' '}
          <code className="rounded-xs bg-panel-2 px-[4px] py-px font-mono text-[11px]">rollback.yml</code>
          {' '}runbook reverts to the previous tag and re-queues the last 50 events.
          <Citation inline index={2} source="runbook-oncall.md:L42" />
        </p>
      </CopilotMessage>
    </div>
  ),
};
