import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Display/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { width: '70%' } };
export const Layout: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <Skeleton width="70%" height={14} />
      <Skeleton width="90%" height={10} />
      <Skeleton width="60%" height={10} />
      <div className="flex items-center gap-3 mt-2">
        <Skeleton shape="circle" height={40} />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton width="40%" height={12} />
          <Skeleton width="70%" height={10} />
        </div>
      </div>
      <Skeleton shape="block" height={80} />
    </div>
  ),
};
