import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { NavItem, NavSection, Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Patterns/Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

const items = [
  { label: 'Home', icon: '⌂' },
  { label: 'Graph', icon: '◇', badge: '3' },
  { label: 'Ask', icon: '✦' },
  { label: 'Incidents', icon: '!' },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('Graph');
    return (
      <div className="flex" style={{ height: 420 }}>
        <Sidebar>
          <NavSection label="Workspace">
            {items.map((i) => (
              <NavItem
                key={i.label}
                icon={i.icon}
                label={i.label}
                badge={i.badge}
                active={i.label === active}
                onClick={() => setActive(i.label)}
              />
            ))}
          </NavSection>
          <NavSection label="Sources" action={<span className="cursor-pointer">+</span>}>
            {['github · 4 repos', 'notion · 182 docs', 'linear · 34 issues'].map((s) => (
              <div key={s} className="flex items-center gap-2 px-2 py-[6px] text-[12px] text-text-muted">
                <span className="h-[6px] w-[6px] rounded-full bg-ok" />
                {s}
              </div>
            ))}
          </NavSection>
        </Sidebar>
      </div>
    );
  },
};
