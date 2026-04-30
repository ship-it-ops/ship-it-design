import type { Meta, StoryObj } from '@storybook/react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './ContextMenu';

const meta: Meta = { title: 'Components/Overlays/ContextMenu' };
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="bg-panel border-border rounded-base text-text-muted grid h-[90px] w-[320px] cursor-context-menu place-items-center border border-dashed p-4 text-[12px]">
          Right-click anywhere in this card
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open in graph</ContextMenuItem>
        <ContextMenuItem trailing="⌘C">Copy</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive trailing="⌫">
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
