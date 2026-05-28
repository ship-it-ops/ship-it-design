import { IconGlyph } from '@ship-it-ui/icons';
import { NavBar, type NavBarItem } from '@ship-it-ui/ui';
import { useState } from 'react';

const items: NavBarItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  {
    id: 'workspace',
    label: 'Workspace',
    children: [
      { id: 'projects', label: 'Projects', href: '#projects', badge: '12' },
      { id: 'sources', label: 'Sources', href: '#sources' },
      { id: 'integrations', label: 'Integrations', href: '#integrations' },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    children: [
      { id: 'ask', label: 'Ask', href: '#ask' },
      { id: 'evals', label: 'Evals', href: '#evals' },
      { id: 'models', label: 'Models', href: '#models', disabled: true },
    ],
  },
  { id: 'settings', label: 'Settings', href: '#settings' },
];

export default function Example() {
  const [active, setActive] = useState('projects');
  return (
    <div className="w-full">
      <NavBar
        orientation="horizontal"
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
