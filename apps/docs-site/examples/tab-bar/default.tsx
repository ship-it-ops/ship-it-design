import { useState } from 'react';
import { TabBar, type TabBarItem } from '@ship-it-ui/ui';

const items: TabBarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 12 12 3l9 9M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    id: 'graph',
    label: 'Graph',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="m7.5 7.5 3 9M16.5 7.5l-3 9M8 6h8" />
      </svg>
    ),
    badge: '3',
  },
  {
    id: 'ask',
    label: 'Ask',
    elevated: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2 13.7 9.3 21 11l-7.3 1.7L12 20l-1.7-7.3L3 11l7.3-1.7L12 2Z" />
      </svg>
    ),
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3.5 7v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Z" />
      </svg>
    ),
  },
  {
    id: 'more',
    label: 'More',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="6" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="18" r="1.5" />
      </svg>
    ),
  },
];

export default function Example() {
  const [active, setActive] = useState('home');
  return (
    <div
      style={{
        maxWidth: 390,
        margin: '0 auto',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
      }}
    >
      <div
        style={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 13,
        }}
      >
        Active: <code style={{ marginLeft: 6 }}>{active}</code>
      </div>
      <TabBar items={items} value={active} onValueChange={setActive} />
    </div>
  );
}
