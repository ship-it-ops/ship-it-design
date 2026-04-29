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
        <div className="grid place-items-center w-[320px] h-[90px] p-4 bg-panel border border-dashed border-border rounded-base text-[12px] text-text-muted cursor-context-menu">
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
