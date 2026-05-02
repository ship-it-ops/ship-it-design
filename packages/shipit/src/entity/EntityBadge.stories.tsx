import type { Meta, StoryObj } from '@storybook/react-vite';

import { EntityBadge } from './EntityBadge';
import { type EntityType } from './types';

const meta: Meta<typeof EntityBadge> = {
  title: 'ShipIt/Entity/EntityBadge',
  component: EntityBadge,
  tags: ['autodocs'],
  args: { type: 'service' },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['service', 'person', 'document', 'deployment', 'incident', 'ticket'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof EntityBadge>;

export const Default: Story = {};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['service', 'person', 'document', 'deployment', 'incident', 'ticket'] as EntityType[]).map(
        (t) => (
          <EntityBadge key={t} type={t} />
        ),
      )}
    </div>
  ),
};
