import { useState } from 'react';

import { NavBar, type NavBarItem } from '@ship-it-ui/ui';

const items: NavBarItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview' },
  { id: 'graph', label: 'Graph', badge: '3', href: '#graph' },
  { id: 'incidents', label: 'Incidents', href: '#incidents' },
  { id: 'ask', label: 'Ask', href: '#ask' },
];

export default function Example() {
  const [active, setActive] = useState('graph');
  return (
    <NavBar
      orientation="horizontal"
      items={items}
      brand={<span className="text-accent">◆ Ship-It</span>}
      actions={
        <button type="button" className="text-text-muted hover:text-text text-[13px]">
          Account
        </button>
      }
      value={active}
      onValueChange={setActive}
    />
  );
}
