import type { Meta, StoryObj } from '@storybook/react';

import { SuggestionChip } from './SuggestionChip';

const meta: Meta<typeof SuggestionChip> = {
  title: 'ShipIt/AI/SuggestionChip',
  component: SuggestionChip,
  tags: ['autodocs'],
  args: { children: 'What depends on ledger-core?' },
};
export default meta;

type Story = StoryObj<typeof SuggestionChip>;

export const Default: Story = {};

export const Stack: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[6px]">
      {[
        'What depends on ledger-core?',
        'Who is on-call tonight?',
        'Recent rollbacks',
        'Services without runbooks',
      ].map((label) => (
        <SuggestionChip key={label}>{label}</SuggestionChip>
      ))}
    </div>
  ),
};
