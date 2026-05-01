import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { CommandPalette, filterCommandItems, type CommandPaletteGroup } from './CommandPalette';

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
];

function Harness({ onSelect }: { onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  return (
    <CommandPalette
      open={open}
      onOpenChange={setOpen}
      query={query}
      onQueryChange={setQuery}
      groups={filterCommandItems(query, groups)}
      onSelect={(id) => {
        onSelect(id);
        setOpen(false);
      }}
    />
  );
}

describe('CommandPalette', () => {
  it('renders all items when query is empty', () => {
    render(<Harness onSelect={() => {}} />);
    expect(screen.getByText('payment-webhook-v2')).toBeInTheDocument();
    expect(screen.getByText('billing-service')).toBeInTheDocument();
  });

  it('filters as the user types', async () => {
    render(<Harness onSelect={() => {}} />);
    await userEvent.type(screen.getByRole('textbox'), 'billing');
    expect(screen.getByText('billing-service')).toBeInTheDocument();
    expect(screen.queryByText('payment-webhook-v2')).not.toBeInTheDocument();
  });

  it('shows empty state when nothing matches', async () => {
    render(<Harness onSelect={() => {}} />);
    await userEvent.type(screen.getByRole('textbox'), 'zzznopezzz');
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('selects the highlighted item on Enter', async () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('c');
  });

  it('selects on click', async () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('option', { name: /billing-service/ }));
    expect(onSelect).toHaveBeenCalledWith('d');
  });

  it('has no a11y violations', async () => {
    const { baseElement } = render(<Harness onSelect={() => {}} />);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});

describe('filterCommandItems', () => {
  it('drops empty groups', () => {
    const result = filterCommandItems('billing', groups);
    expect(result).toHaveLength(1);
    expect(result[0]?.items).toHaveLength(1);
  });

  it('returns all groups for empty query', () => {
    const result = filterCommandItems('', groups);
    expect(result[0]?.items).toHaveLength(4);
  });
});
