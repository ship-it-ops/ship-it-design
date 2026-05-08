import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NavBar, type NavBarItem } from './NavBar';

const items: NavBarItem[] = [
  { id: 'home', label: 'Home', icon: '⌂', href: '#home' },
  { id: 'graph', label: 'Graph', icon: '◇', badge: '3' },
  {
    id: 'settings',
    label: 'Settings',
    children: [
      { id: 'profile', label: 'Profile', href: '#profile' },
      { id: 'team', label: 'Team' },
    ],
  },
];

describe('NavBar', () => {
  describe('horizontal', () => {
    it('renders all top-level items', () => {
      render(<NavBar items={items} />);
      // Mobile and desktop trees both render — assert on the desktop one.
      expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Graph').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
    });

    it('marks the controlled active item with aria-current', () => {
      render(<NavBar items={items} value="graph" />);
      const graph = screen.getAllByRole('button', { name: /Graph/ })[0]!;
      expect(graph).toHaveAttribute('aria-current', 'page');
    });

    it('fires onValueChange when an item is clicked (uncontrolled)', async () => {
      const onValueChange = vi.fn();
      render(<NavBar items={items} onValueChange={onValueChange} />);
      const graph = screen.getAllByRole('button', { name: /Graph/ })[0]!;
      await userEvent.click(graph);
      expect(onValueChange).toHaveBeenCalledWith('graph');
    });

    it('opens the drawer when the hamburger is clicked', async () => {
      render(<NavBar items={items} brand="Ship-It" />);
      const hamburger = screen.getByRole('button', { name: 'Open navigation' });
      await userEvent.click(hamburger);
      // Drawer renders as a Radix dialog. Look for its role + accessible name.
      expect(await screen.findByRole('dialog', { name: 'Ship-It' })).toBeInTheDocument();
    });

    it('renders a brand slot and an actions slot', () => {
      render(
        <NavBar
          items={items}
          brand={<span>BrandX</span>}
          actions={<button type="button">Account</button>}
        />,
      );
      expect(screen.getAllByText('BrandX').length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: 'Account' }).length).toBeGreaterThan(0);
    });

    it('moves focus between top-level items with arrow keys', async () => {
      render(<NavBar items={items} responsive={false} />);
      // Radix NavigationMenu owns roving tabindex on its top-level items;
      // ArrowRight from a focused item moves focus to the next sibling.
      const home = screen.getByRole('link', { name: /Home/ });
      home.focus();
      expect(home).toHaveFocus();
      await userEvent.keyboard('{ArrowRight}');
      expect(screen.getByRole('button', { name: /Graph/ })).toHaveFocus();
    });

    it('has no a11y violations', async () => {
      const { container } = render(
        <NavBar items={items} brand="Ship-It" actions={<button type="button">A</button>} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('vertical', () => {
    it('renders an aside landmark', () => {
      const { container } = render(<NavBar orientation="vertical" items={items} />);
      // <aside> is the desktop layout; mobile-fallback <header> is also present.
      expect(container.querySelector('aside')).not.toBeNull();
    });

    it('expands a group when its trigger is clicked', async () => {
      render(<NavBar orientation="vertical" items={items} />);
      const settingsGroup = screen.getAllByRole('button', { name: /Settings/ })[0]!;
      expect(settingsGroup).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(settingsGroup);
      expect(settingsGroup).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('auto-expands a group when a descendant is the active item', () => {
      render(<NavBar orientation="vertical" items={items} value="profile" />);
      // Settings group should have aria-expanded=true on first paint.
      const settingsTriggers = screen.getAllByRole('button', { name: /Settings/ });
      const desktopTrigger = settingsTriggers.find(
        (el) => el.getAttribute('aria-expanded') !== null,
      );
      expect(desktopTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('respects controlled value and surfaces aria-current on the active leaf', () => {
      render(<NavBar orientation="vertical" items={items} value="graph" />);
      const graph = screen.getAllByRole('button', { name: /Graph/ })[0]!;
      expect(graph).toHaveAttribute('aria-current', 'page');
    });

    it('skips activation for disabled items', async () => {
      const onValueChange = vi.fn();
      const disabledItems: NavBarItem[] = [
        { id: 'a', label: 'Active' },
        { id: 'b', label: 'Disabled', disabled: true },
      ];
      render(<NavBar orientation="vertical" items={disabledItems} onValueChange={onValueChange} />);
      const disabled = screen.getAllByRole('button', { name: 'Disabled' })[0]!;
      expect(disabled).toBeDisabled();
      await userEvent.click(disabled);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('has no a11y violations', async () => {
      const { container } = render(
        <NavBar
          orientation="vertical"
          items={items}
          brand="Ship-It"
          actions={<button type="button">A</button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it('renders an anchor for href items and a button otherwise', () => {
    render(<NavBar items={items} responsive={false} />);
    const home = screen.getByRole('link', { name: /Home/ });
    expect(home).toHaveAttribute('href', '#home');
    const graph = screen.getByRole('button', { name: /Graph/ });
    expect(graph.tagName).toBe('BUTTON');
  });

  it('omits the mobile fallback when responsive is false', () => {
    render(<NavBar items={items} responsive={false} />);
    expect(screen.queryByRole('button', { name: 'Open navigation' })).not.toBeInTheDocument();
  });

  it('renders dropdown children as anchors with aria-current on the active one', async () => {
    render(<NavBar items={items} responsive={false} value="profile" />);
    const settingsTrigger = screen.getByRole('button', { name: /Settings/ });
    await userEvent.click(settingsTrigger);
    const profile = await screen.findByRole('link', { name: 'Profile' });
    expect(profile).toHaveAttribute('href', '#profile');
    expect(profile).toHaveAttribute('aria-current', 'page');
  });
});
