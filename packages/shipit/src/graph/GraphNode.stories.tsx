import type { Meta, StoryObj } from '@storybook/react';

import { GraphNode } from './GraphNode';
import { type EntityType } from '../entity/types';

const meta: Meta<typeof GraphNode> = {
  title: 'ShipIt/Graph/GraphNode',
  component: GraphNode,
  tags: ['autodocs'],
  args: { type: 'service', label: 'payment-webhook' },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['service', 'person', 'document', 'deployment', 'incident', 'ticket'],
    },
    state: {
      control: 'inline-radio',
      options: ['default', 'hover', 'selected', 'path', 'dim'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof GraphNode>;

export const Default: Story = {};

export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      {(['service', 'person', 'document', 'deployment', 'incident', 'ticket'] as EntityType[]).map(
        (t) => (
          <GraphNode key={t} type={t} label={t} />
        ),
      )}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-5">
      {(['default', 'hover', 'selected', 'path', 'dim'] as const).map((s) => (
        <GraphNode key={s} type="service" state={s} label={s} />
      ))}
    </div>
  ),
};
