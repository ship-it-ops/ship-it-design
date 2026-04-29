import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Priya Khanna' },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Mohamed Tariq" size="xs" />
      <Avatar name="Priya Khanna" size="sm" />
      <Avatar name="John Adams" size="md" />
      <Avatar name="Esme Sandberg" size="lg" />
      <Avatar name="Anya Brown" size="xl" />
    </div>
  ),
};
export const Status: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Priya" status="ok" />
      <Avatar name="Esme" status="warn" />
      <Avatar name="Mohamed" status="err" />
      <Avatar name="Anya" status="off" />
    </div>
  ),
};
export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AvatarGroup names={['Mohamed Tariq', 'Priya Khanna', 'John Adams', 'Esme S']} />
      <AvatarGroup
        names={['Mohamed', 'Priya', 'John', 'Esme', 'Rai', 'Dan', 'Alex', 'Yara']}
        size="md"
        max={5}
      />
      <AvatarGroup names={['Mohamed', 'Priya', 'John']} size="lg" max={3} />
    </div>
  ),
};
