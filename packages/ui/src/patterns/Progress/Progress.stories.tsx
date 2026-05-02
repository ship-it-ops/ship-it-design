import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Patterns/Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'ok', 'warn', 'err'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  args: { value: 60, label: 'Indexing repos', tone: 'accent', size: 'md' },
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Progress>;

export const Determinate: Story = { args: { value: 60 } };
export const Indeterminate: Story = { args: { indeterminate: true, label: 'Streaming' } };
export const Complete: Story = { args: { value: 100, tone: 'ok', label: 'Done' } };
