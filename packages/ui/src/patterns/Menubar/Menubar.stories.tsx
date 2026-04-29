import type { Meta, StoryObj } from '@storybook/react';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from './Menubar';

const meta: Meta<typeof Menubar> = {
  title: 'Patterns/Layout/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem trailing="⌘N">New workspace</MenubarItem>
          <MenubarItem trailing="⌘O">Open…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem trailing="⌘S">Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem trailing="⌘Z">Undo</MenubarItem>
          <MenubarItem trailing="⇧⌘Z">Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Graph</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Reset layout</MenubarItem>
          <MenubarItem>Pin selection</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Compact density</MenubarItem>
          <MenubarItem>Cozy density</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem trailing="⌘/">Keyboard shortcuts</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
