import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ContextMenu';

describe('ContextMenu', () => {
  it('renders the trigger child', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>target</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    expect(screen.getByText('target')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>x</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
