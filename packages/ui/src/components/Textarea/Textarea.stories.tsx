import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Knowledge graph for our backend services.',
    defaultValue: '',
    rows: 4,
  },
};
export default meta;

type Story = StoryObj<typeof Textarea>;
export const Default: Story = {};
export const Error: Story = { args: { error: true, defaultValue: 'too short' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'read only' } };
