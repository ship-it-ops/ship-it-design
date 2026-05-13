'use client';

import { useState } from 'react';
import { Avatar, Card, LargeTitle, TabBar, type TabBarItem } from '@ship-it-ui/ui';
import { AskBar } from '@ship-it-ui/shipit';

import { IOSDevice } from '../../components/IOSDevice';

const tabs: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: <span>⌂</span> },
  { id: 'graph', label: 'Graph', icon: <span>◇</span>, badge: '3' },
  { id: 'ask', label: 'Ask', elevated: true, icon: <span>✦</span> },
  { id: 'inbox', label: 'Inbox', icon: <span>✉</span> },
  { id: 'more', label: 'More', icon: <span>⋯</span> },
];

export default function Example() {
  const [active, setActive] = useState('home');
  return (
    <IOSDevice label="Home">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 56 }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          <LargeTitle
            title="Morning, Mo."
            eyebrow="Tuesday · May 12"
            trailing={<Avatar name="MO" size="sm" />}
          />
          <div style={{ padding: '0 16px' }}>
            <AskBar density="touch" placeholder="What's blocking checkout-svc?" submitLabel="Ask" />
          </div>
          <div
            style={{
              padding: '20px 16px 0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}
          >
            <Card density="touch">
              <div
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 11,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}
              >
                Services
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  fontFamily: 'var(--font-family-mono)',
                  marginTop: 6,
                }}
              >
                247
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-ok)', marginTop: 4 }}>
                +12 this week
              </div>
            </Card>
            <Card density="touch">
              <div
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 11,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}
              >
                Health
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  fontFamily: 'var(--font-family-mono)',
                  marginTop: 6,
                }}
              >
                94%
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                3 gaps
              </div>
            </Card>
          </div>
        </div>
        <TabBar items={tabs} value={active} onValueChange={setActive} />
      </div>
    </IOSDevice>
  );
}
