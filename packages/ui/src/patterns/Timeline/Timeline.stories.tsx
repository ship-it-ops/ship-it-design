import type { Meta, StoryObj } from '@storybook/react';

import { Timeline } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Patterns/Data/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => (
    <Timeline
      events={[
        { title: 'Connector added', description: 'github · 4 repos', time: 'just now', tone: 'accent' },
        { title: 'Schema extracted', description: '142 entity types · 38 relations', time: '4m ago', tone: 'ok' },
        { title: 'First query answered', description: 'Who owns the payment webhook?', time: '6m ago', tone: 'ok' },
        { title: 'Teammate joined', description: 'priya@acme.com', time: '12m ago', tone: 'muted' },
      ]}
    />
  ),
};
