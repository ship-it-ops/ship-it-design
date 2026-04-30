import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: 'org.shipit.com' },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithIcon: Story = { args: { icon: '⌕', placeholder: 'Search repos' } };
export const WithTrailing: Story = { args: { placeholder: '0', trailing: 'USD' } };
export const Error: Story = { args: { error: true, defaultValue: 'acme' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Read-only value' } };
export const Sizes: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};
