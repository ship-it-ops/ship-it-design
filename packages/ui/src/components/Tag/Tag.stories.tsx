import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'backend' },
};
export default meta;

type Story = StoryObj<typeof Tag>;
export const Default: Story = {};
export const WithIcon: Story = { args: { icon: '#', children: 'payments' } };
export const Removable: Story = { args: { children: 'on-call', onRemove: () => {} } };
