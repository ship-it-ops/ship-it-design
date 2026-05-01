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

  it('emits onSelect when a node is activated', async () => {
    const onSelect = vi.fn();
    render(<Tree items={items} defaultExpanded={['src']} onSelect={onSelect} />);
    await userEvent.click(screen.getByText('index.ts'));
    expect(onSelect).toHaveBeenCalledWith('src/index.ts');
  });

  it('expands with ArrowRight, collapses with ArrowLeft', async () => {
    render(<Tree items={items} defaultSelected="src" />);
    const node = screen.getByRole('treeitem', { name: /src/ });
    node.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByText('index.ts')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Tree items={items} defaultExpanded={['src']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
