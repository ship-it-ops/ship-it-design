import type { Meta, StoryObj } from '@storybook/react-vite';

import { SplitButton } from './SplitButton';

const meta: Meta<typeof SplitButton> = {
  title: 'Components/Inputs/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onClick: { action: 'main clicked' },
    onMenu: { action: 'menu clicked' },
  },
  args: { children: 'Deploy', variant: 'primary' },
};
export default meta;

type Story = StoryObj<typeof SplitButton>;
export const Default: Story = {};
