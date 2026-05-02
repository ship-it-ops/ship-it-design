import type { Meta, StoryObj } from '@storybook/react-vite';

import { ReasoningBlock, ReasoningStep } from './ReasoningBlock';

const meta: Meta<typeof ReasoningBlock> = {
  title: 'ShipIt/AI/ReasoningBlock',
  component: ReasoningBlock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof ReasoningBlock>;

export const Default: Story = {
  render: () => (
    <ReasoningBlock duration="1.8s">
      <ReasoningStep step={1}>
        Found service payment-webhook-v2 — 1 match, high confidence.
      </ReasoningStep>
      <ReasoningStep step={2}>
        Traversed OWNED_BY edge → Priya K. (person, staff-eng).
      </ReasoningStep>
      <ReasoningStep step={3}>
        Traversed DOCUMENTED_IN → runbook-oncall.md § Rollback.
      </ReasoningStep>
    </ReasoningBlock>
  ),
};

export const Expanded: Story = {
  render: () => (
    <ReasoningBlock defaultOpen duration="1.8s">
      <ReasoningStep step={1}>
        Found service payment-webhook-v2 — 1 match, high confidence.
      </ReasoningStep>
      <ReasoningStep step={2}>
        Traversed OWNED_BY edge → Priya K. (person, staff-eng).
      </ReasoningStep>
      <ReasoningStep step={3}>
        Traversed DOCUMENTED_IN → runbook-oncall.md § Rollback.
      </ReasoningStep>
    </ReasoningBlock>
  ),
};
