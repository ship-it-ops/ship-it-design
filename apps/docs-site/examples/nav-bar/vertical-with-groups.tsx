import { IconGlyph } from '@ship-it-ui/icons';
import { NavBar, type NavBarItem } from '@ship-it-ui/ui';
import { useState } from 'react';

const items: NavBarItem[] = [
  { id: 'home', label: 'Home', icon: '⌂', href: '#home' },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: '⊞',
    children: [
      { id: 'projects', label: 'Projects', href: '#projects', badge: '12' },
      { id: 'sources', label: 'Sources', href: '#sources' },
      { id: 'integrations', label: 'Integrations', href: '#integrations' },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    icon: '✦',
    children: [
      { id: 'ask', label: 'Ask', href: '#ask' },
      { id: 'evals', label: 'Evals', href: '#evals' },
    ],
  },
  { id: 'settings', label: 'Settings', icon: '⚙', href: '#settings' },
];

export default function Example() {
  const [active, setActive] = useState('projects');
  return (
    <div className="flex" style={{ height: 460 }}>
      <NavBar
        orientation="vertical"
        items={items}
        brand={
          <span className="text-accent inline-flex items-center gap-1.5">
            <IconGlyph name="brand" size={14} />
            Ship-It
          </span>
        }
        value={active}
        onValueChange={setActive}
      />
    </div>
  );
}
