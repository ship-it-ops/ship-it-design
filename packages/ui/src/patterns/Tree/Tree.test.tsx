import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Tree, type TreeItem } from './Tree';

const items: TreeItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'src/index.ts', label: 'index.ts' },
      {
        id: 'src/components',
        label: 'components',
        children: [{ id: 'src/components/Button.tsx', label: 'Button.tsx' }],
      },
    ],
  },
  { id: 'README.md', label: 'README.md' },
];

describe('Tree', () => {
  it('renders top-level nodes', () => {
    render(<Tree items={items} />);
    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('README.md')).toBeInTheDocument();
  });

  it('expands nodes via the defaultExpanded prop', () => {
    render(<Tree items={items} defaultExpanded={['src']} />);
    expect(screen.getByText('index.ts')).toBeInTheDocument();
  });

  it('toggles expansion on click', async () => {
    render(<Tree items={items} />);
    expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('src'));
    expect(screen.getByText('index.ts')).toBeInTheDocument();
  });

  it('emits onValueChange when a node is activated', async () => {
    const onValueChange = vi.fn();
    render(<Tree items={items} defaultExpanded={['src']} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText('index.ts'));
    expect(onValueChange).toHaveBeenCalledWith('src/index.ts');
  });

  it('makes the first treeitem reachable by Tab when nothing is selected', async () => {
    render(<Tree items={items} />);
    const treeitems = screen.getAllByRole('treeitem');
    // First visible treeitem is the roving tab stop.
    expect(treeitems[0]).toHaveAttribute('tabindex', '0');
    expect(treeitems[1]).toHaveAttribute('tabindex', '-1');
    await userEvent.tab();
    expect(treeitems[0]).toHaveFocus();
  });

  it('expands with ArrowRight, collapses with ArrowLeft', async () => {
    render(<Tree items={items} defaultValue="src" />);
    const node = screen.getByRole('treeitem', { name: /src/ });
    node.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByText('index.ts')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
  });

  it('moves focus down and up the visible flat list with Arrow keys', async () => {
    render(<Tree items={items} defaultExpanded={['src']} />);
    // Visible order: src, src/index.ts, src/components, README.md
    const src = screen.getByRole('treeitem', { name: /^src/ });
    src.focus();

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('treeitem', { name: /index\.ts/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('treeitem', { name: /components/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('treeitem', { name: /README\.md/ })).toHaveFocus();

    // Stops at the last item.
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('treeitem', { name: /README\.md/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('treeitem', { name: /components/ })).toHaveFocus();
  });

  it('ArrowRight on an expanded parent moves focus to the first child', async () => {
    render(<Tree items={items} defaultExpanded={['src']} />);
    const src = screen.getByRole('treeitem', { name: /^src/ });
    src.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('treeitem', { name: /index\.ts/ })).toHaveFocus();
  });

  it('ArrowLeft on a leaf moves focus to its parent', async () => {
    render(<Tree items={items} defaultExpanded={['src']} />);
    const child = screen.getByRole('treeitem', { name: /index\.ts/ });
    child.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('treeitem', { name: /^src/ })).toHaveFocus();
  });

  it('Home / End jump to first / last visible item', async () => {
    render(<Tree items={items} defaultExpanded={['src']} />);
    const src = screen.getByRole('treeitem', { name: /^src/ });
    src.focus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('treeitem', { name: /README\.md/ })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('treeitem', { name: /^src/ })).toHaveFocus();
  });

  it('Enter selects the active treeitem', async () => {
    const onValueChange = vi.fn();
    render(
      <Tree items={items} defaultExpanded={['src']} onValueChange={onValueChange} />,
    );
    const child = screen.getByRole('treeitem', { name: /index\.ts/ });
    child.focus();
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('src/index.ts');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Tree items={items} defaultExpanded={['src']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
