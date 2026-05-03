import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NavItem, NavSection, Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders nav items', () => {
    render(
      <Sidebar>
        <NavSection label="Workspace">
          <NavItem icon="⌂" label="Home" active />
          <NavItem icon="◇" label="Graph" badge="3" />
        </NavSection>
      </Sidebar>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Graph')).toBeInTheDocument();
  });

  it('marks the active item with aria-current', () => {
    render(
      <Sidebar>
        <NavItem label="Home" active />
      </Sidebar>,
    );
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(
      <Sidebar>
        <NavItem label="Graph" onClick={onClick} />
      </Sidebar>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Graph' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Sidebar>
        <NavSection label="Workspace">
          <NavItem icon="⌂" label="Home" active />
          <NavItem icon="◇" label="Graph" badge="3" />
        </NavSection>
      </Sidebar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
