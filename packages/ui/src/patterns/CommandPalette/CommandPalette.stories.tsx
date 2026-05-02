import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../../components/Button/Button';

import { CommandPalette, filterCommandItems, type CommandPaletteGroup } from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
  title: 'Patterns/Navigation/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof CommandPalette>;

const groups: CommandPaletteGroup[] = [
  {
    label: 'Entities',
    items: [
      {
        id: 'a',
        label: 'payment-webhook-v2',
        description: 'service · owned by Payments',
        glyph: '◇',
      },
      { id: 'b', label: 'payment-webhook-legacy', description: 'service · deprecated', glyph: '◇' },
      { id: 'c', label: 'webhook.ts', description: 'file · 312 LOC', glyph: '▢' },
      { id: 'd', label: 'billing-service', description: 'service · owned by Finance', glyph: '◎' },
    ],
  },
  {
    label: 'Actions',
    items: [
      {
        id: 'open-graph',
        label: 'Open Graph',
        description: 'Jump to graph view',
        glyph: '◇',
        trailing: '⌘G',
      },
      {
        id: 'new-incident',
        label: 'Create incident',
        description: 'Triage a new incident',
        glyph: '!',
        trailing: '⌘I',
      },
    ],
  },
];

function CommandPaletteDemo() {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('payment');
  return (
    <div className="p-10">
      <Button onClick={() => setOpen(true)}>Open palette ⌘K</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        groups={filterCommandItems(query, groups)}
        onSelect={(id) => {
          console.log('selected', id);
          setOpen(false);
        }}
        placeholder="Search entities, docs, actions…"
        footer={
          <>
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>⌘↵ ask about</span>
          </>
        }
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <CommandPaletteDemo />,
};
