import type { Meta, StoryObj } from '@storybook/react-vite';

import { GraphLegend } from './GraphLegend';

const meta: Meta<typeof GraphLegend> = {
  title: 'ShipIt/Graph/GraphLegend',
  component: GraphLegend,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof GraphLegend>;

export const Default: Story = {};

export const FullEntityList: Story = {
  args: {
    entries: [
      { type: 'service', label: 'service' },
      { type: 'person', label: 'person' },
      { type: 'document', label: 'document' },
      { type: 'deployment', label: 'deployment' },
      { type: 'incident', label: 'incident' },
      { type: 'ticket', label: 'ticket' },
    ],
  },
};
