import { useState } from 'react';

import { NavItem, NavSection, Sidebar } from '@ship-it-ui/ui';

const sections = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: '⌂',
    items: [
      { label: 'Home', icon: '⌂' },
      { label: 'Graph', icon: '◇', badge: '3' },
      { label: 'Ask', icon: '✦' },
    ],
  },
  {
    id: 'sources',
    label: 'Sources',
    icon: '⌁',
    items: [
      { label: 'GitHub', icon: '⌨' },
      { label: 'Notion', icon: '▤' },
      { label: 'Linear', icon: '◇' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: '⚙',
    items: [
      { label: 'Members', icon: '○' },
      { label: 'Billing', icon: '§' },
      { label: 'Settings', icon: '⚙' },
    ],
  },
];

export default function Example() {
  const [active, setActive] = useState('Graph');
  return (
    <div className="flex" style={{ height: 480 }}>
      <Sidebar>
        {sections.map((s, i) => (
          <NavSection
            key={s.id}
            label={s.label}
            icon={<span aria-hidden>{s.icon}</span>}
            collapsible
            defaultOpen={i === 0}
          >
            {s.items.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                active={item.label === active}
                onClick={() => setActive(item.label)}
              />
            ))}
          </NavSection>
        ))}
      </Sidebar>
    </div>
  );
}
