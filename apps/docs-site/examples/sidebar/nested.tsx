import { useState } from 'react';

import { NavItem, NavSection, Sidebar } from '@ship-it-ui/ui';

const tree = [
  {
    label: 'Foundations',
    icon: '◆',
    groups: [
      { label: 'Tokens', items: ['Color', 'Typography', 'Spacing'] },
      { label: 'Guidelines', items: ['Principles', 'Layout', 'Accessibility'] },
    ],
  },
  {
    label: 'Components',
    icon: '◇',
    groups: [
      { label: 'Inputs', items: ['Button', 'Checkbox', 'Input'] },
      { label: 'Display', items: ['Avatar', 'Badge', 'Card'] },
    ],
  },
];

export default function Example() {
  const [active, setActive] = useState('Color');
  return (
    <div className="flex" style={{ height: 520 }}>
      <Sidebar>
        {tree.map((section, i) => (
          <NavSection
            key={section.label}
            label={section.label}
            icon={<span aria-hidden>{section.icon}</span>}
            collapsible
            defaultOpen={i === 0}
            indent={10}
          >
            {section.groups.map((group) => (
              <NavSection key={group.label} label={group.label} indent={8}>
                {group.items.map((label) => (
                  <NavItem
                    key={label}
                    label={label}
                    active={label === active}
                    onClick={() => setActive(label)}
                  />
                ))}
              </NavSection>
            ))}
          </NavSection>
        ))}
      </Sidebar>
    </div>
  );
}
