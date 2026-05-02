import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Inputs/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  args: { placeholder: 'Search…' },
};
export default meta;

type Story = StoryObj<typeof SearchInput>;
export const Default: Story = {};
export const NoShortcut: Story = { args: { shortcut: undefined } };
