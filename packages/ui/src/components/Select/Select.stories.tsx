import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    options: ['Production', 'Staging', 'Development', 'Local'],
    placeholder: 'Choose environment',
  },
};
export default meta;

type Story = StoryObj<typeof Select>;
export const Default: Story = {};
export const Preselected: Story = { args: { defaultValue: 'Staging' } };
export const Sizes: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-2">
      <Select size="sm" options={['Small', 'Medium', 'Large']} />
      <Select size="md" options={['Small', 'Medium', 'Large']} />
      <Select size="lg" options={['Small', 'Medium', 'Large']} />
    </div>
  ),
};
