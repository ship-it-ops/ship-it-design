import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { TabBar, type TabBarItem } from './TabBar';

const items: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: <span>⌂</span> },
  { id: 'graph', label: 'Graph', icon: <span>◇</span>, badge: '3' },
  { id: 'ask', label: 'Ask', icon: <span>✦</span>, elevated: true },
  { id: 'inbox', label: 'Inbox', icon: <span>✉</span> },
  { id: 'more', label: 'More', icon: <span>⋯</span> },
];

describe('TabBar', () => {
  it('renders all items as navigation buttons', () => {
    render(<TabBar items={items} defaultValue="home" />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('marks the active button with aria-current="page"', () => {
    render(<TabBar items={items} value="graph" />);
    const graph = screen.getByRole('button', { name: /graph/i });
    expect(graph).toHaveAttribute('aria-current', 'page');
  });

  it('fires onValueChange when an item is clicked', async () => {
    const onChange = vi.fn();
    render(<TabBar items={items} defaultValue="home" onValueChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /inbox/i }));
    expect(onChange).toHaveBeenCalledWith('inbox');
  });

  it('does not fire onValueChange when a disabled item is clicked', async () => {
    const onChange = vi.fn();
    const disabledItems = items.map((i) => (i.id === 'inbox' ? { ...i, disabled: true } : i));
    render(<TabBar items={disabledItems} defaultValue="home" onValueChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /inbox/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders the elevated item without a label fallthrough', () => {
    render(<TabBar items={items} defaultValue="home" />);
    const ask = screen.getByRole('button', { name: 'Ask' });
    expect(ask).toBeInTheDocument();
  });

  it('gives the elevated item an accessible name even when the label is JSX', () => {
    // Regression: an earlier version conditioned `aria-label` on
    // `typeof label === 'string'`, so a ReactNode label silently produced a
    // nameless button (icon was `aria-hidden`, no visible text). Switching to
    // an inner `sr-only` span fixes both cases.
    const jsxItems: TabBarItem[] = [
      { id: 'home', label: 'Home', icon: <span>⌂</span> },
      {
        id: 'ask',
        label: (
          <>
            Ask <span>✦</span>
          </>
        ),
        icon: <span>✦</span>,
        elevated: true,
      },
    ];
    render(<TabBar items={jsxItems} defaultValue="home" />);
    expect(screen.getByRole('button', { name: /Ask/ })).toBeInTheDocument();
  });

  it('renders inside a nav landmark', () => {
    render(<TabBar items={items} defaultValue="home" />);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TabBar items={items} defaultValue="home" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
