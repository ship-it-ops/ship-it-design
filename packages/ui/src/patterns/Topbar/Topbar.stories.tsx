import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../../components/Avatar';
import { IconButton } from '../../components/Button/IconButton';
import { SearchInput } from '../../components/Input';

import { Topbar } from './Topbar';

const meta: Meta<typeof Topbar> = {
  title: 'Patterns/Layout/Topbar',
  component: Topbar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Topbar>;

export const Default: Story = {
  render: () => (
    <Topbar
      title="Graph Explorer"
      actions={
        <>
          <SearchInput placeholder="Search…" style={{ width: 280 }} />
          <IconButton variant="ghost" icon="⌕" aria-label="Search" />
          <IconButton variant="ghost" icon="⚙" aria-label="Settings" />
          <Avatar name="Mohamed T" size="sm" />
        </>
      }
    />
  ),
};
