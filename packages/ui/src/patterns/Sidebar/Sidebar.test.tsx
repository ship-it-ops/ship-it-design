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

  describe('NavSection collapsible', () => {
    it('renders the eyebrow as a button when collapsible', () => {
      render(
        <NavSection label="Workspace" collapsible>
          <NavItem label="Home" />
        </NavSection>,
      );
      expect(screen.getByRole('button', { name: /Workspace/ })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('toggles open state on click (uncontrolled)', async () => {
      render(
        <NavSection label="Workspace" collapsible>
          <NavItem label="Home" />
        </NavSection>,
      );
      const trigger = screen.getByRole('button', { name: /Workspace/ });
      expect(screen.getByText('Home')).toBeInTheDocument();
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('honors defaultOpen={false}', () => {
      render(
        <NavSection label="Workspace" collapsible defaultOpen={false}>
          <NavItem label="Home" />
        </NavSection>,
      );
      expect(screen.getByRole('button', { name: /Workspace/ })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('supports controlled open state', async () => {
      const onOpenChange = vi.fn();
      render(
        <NavSection label="Workspace" collapsible open={false} onOpenChange={onOpenChange}>
          <NavItem label="Home" />
        </NavSection>,
      );
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: /Workspace/ }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
      // Body stays hidden because the parent is the source of truth.
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('renders a static eyebrow when not collapsible (default)', () => {
      render(
        <NavSection label="Workspace">
          <NavItem label="Home" />
        </NavSection>,
      );
      expect(screen.queryByRole('button', { name: /Workspace/ })).not.toBeInTheDocument();
      expect(screen.getByText('Workspace')).toBeInTheDocument();
    });

    it('renders the leading icon', () => {
      render(
        <NavSection label="Workspace" icon={<span data-testid="glyph">⌂</span>}>
          <NavItem label="Home" />
        </NavSection>,
      );
      expect(screen.getByTestId('glyph')).toBeInTheDocument();
    });

    it('applies indent padding and rail when indent > 0', () => {
      render(
        <NavSection label="Workspace" indent={12}>
          <NavItem label="Home" />
        </NavSection>,
      );
      const home = screen.getByText('Home');
      // The body is the parent of the NavItem.
      const body = home.closest('button')?.parentElement;
      expect(body).toHaveStyle({ paddingLeft: '12px' });
      expect(body?.className).toContain('border-l');
    });

    it('does not indent or draw a rail when indent is 0', () => {
      render(
        <NavSection label="Workspace">
          <NavItem label="Home" />
        </NavSection>,
      );
      const home = screen.getByText('Home');
      const body = home.closest('button')?.parentElement;
      expect(body).not.toHaveStyle({ paddingLeft: '0px' });
      expect(body?.className).not.toContain('border-l');
    });

    it('has no a11y violations when collapsible', async () => {
      const { container } = render(
        <Sidebar>
          <NavSection label="Workspace" collapsible icon={<span aria-hidden>⌂</span>}>
            <NavItem label="Home" active />
          </NavSection>
        </Sidebar>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
