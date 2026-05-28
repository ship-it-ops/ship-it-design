import { IconGlyph } from '@ship-it-ui/icons';
import { NavBar, type NavBarItem } from '@ship-it-ui/ui';
import { useState } from 'react';

const items: NavBarItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview' },
  { id: 'graph', label: 'Graph', badge: '3', href: '#graph' },
  { id: 'incidents', label: 'Incidents', href: '#incidents' },
  { id: 'ask', label: 'Ask', href: '#ask' },
];

export default function Example() {
  const [active, setActive] = useState('graph');
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
        actions={
          <button type="button" className="text-text-muted hover:text-text text-[13px]">
            Account
          </button>
        }
        value={active}
        onValueChange={setActive}
      />
    </div>
  );
}
