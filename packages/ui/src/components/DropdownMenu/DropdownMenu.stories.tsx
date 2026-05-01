import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MenuItem,
  MenuSeparator,
} from './DropdownMenu';

const meta: Meta = { title: 'Components/Overlays/DropdownMenu' };
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" trailing="▾">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <MenuItem trailing="↵">Open in graph</MenuItem>
        <MenuItem trailing="⌘C">Copy entity ID</MenuItem>
        <MenuItem trailing="⌘O">View source</MenuItem>
        <MenuSeparator />
        <MenuItem trailing="R">Re-extract</MenuItem>
        <MenuSeparator />
        <MenuItem destructive trailing="⌫">
          Delete
        </MenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
