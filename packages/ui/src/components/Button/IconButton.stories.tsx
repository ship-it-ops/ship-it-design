import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Inputs/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onClick: { action: 'clicked' },
  },
  args: { 'aria-label': 'Settings', icon: '⚙' },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton aria-label="Ask" icon="✦" size="sm" />
      <IconButton aria-label="Ask" icon="✦" size="md" />
      <IconButton aria-label="Ask" icon="✦" size="lg" />
    </div>
  ),
};
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton aria-label="Search" icon="⌕" variant="primary" />
      <IconButton aria-label="Search" icon="⌕" variant="secondary" />
      <IconButton aria-label="Search" icon="⌕" variant="ghost" />
      <IconButton aria-label="Search" icon="⌕" variant="outline" />
    </div>
  ),
};
