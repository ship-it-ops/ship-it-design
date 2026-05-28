import { IconGlyph } from '@ship-it-ui/icons';
import { NavBar, type NavBarItem } from '@ship-it-ui/ui';
import { useState } from 'react';

const items: NavBarItem[] = [
  { id: 'home', label: 'Home', icon: '⌂', href: '#home' },
  { id: 'graph', label: 'Graph', icon: '◇', badge: '3', href: '#graph' },
  { id: 'ask', label: 'Ask', icon: '✦', href: '#ask' },
  { id: 'incidents', label: 'Incidents', icon: '!', href: '#incidents' },
];

export default function Example() {
  const [active, setActive] = useState('graph');
  return (
    <div className="flex" style={{ height: 420 }}>
      <NavBar
        orientation="vertical"
        items={items}
        brand={
          <span className="text-accent inline-flex items-center gap-1.5">
            <IconGlyph name="brand" size={14} />
            Ship-It
          </span>
        }
        actions={
          <button type="button" className="text-text-muted hover:text-text px-2 text-[13px]">
            Sign out
          </button>
        }
        value={active}
        onValueChange={setActive}
      />
    </div>
  );
}
