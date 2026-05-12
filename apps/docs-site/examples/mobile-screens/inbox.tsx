'use client';

import { useState } from 'react';
import {
  IconButton,
  Tab,
  TabBar,
  Tabs,
  TabsContent,
  TabsList,
  Topbar,
  type TabBarItem,
} from '@ship-it-ui/ui';
import { NotifRow } from '@ship-it-ui/shipit';

import { IOSDevice } from '../../components/IOSDevice';

const tabs: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: <span>⌂</span> },
  { id: 'graph', label: 'Graph', icon: <span>◇</span> },
  { id: 'ask', label: 'Ask', elevated: true, icon: <span>✦</span> },
  { id: 'inbox', label: 'Inbox', icon: <span>✉</span>, badge: '4' },
  { id: 'more', label: 'More', icon: <span>⋯</span> },
];

export default function Example() {
  const [active, setActive] = useState('inbox');
  return (
    <IOSDevice label="Inbox">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 56 }}>
        <Topbar
          density="touch"
          title="Inbox"
          eyebrow="4 unread"
          actions={
            <>
              <IconButton density="touch" size="sm" variant="ghost" icon="⎍" aria-label="Filter" />
              <IconButton density="touch" size="sm" variant="ghost" icon="⋯" aria-label="More" />
            </>
          }
        />
        <div style={{ padding: '8px 16px 0' }}>
          <Tabs defaultValue="all" variant="pill">
            <TabsList>
              <Tab value="all">All</Tab>
              <Tab value="mentions">Mentions</Tab>
              <Tab value="owned">Owned</Tab>
            </TabsList>
            <TabsContent value="all" />
          </Tabs>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
          <div
            style={{
              marginBottom: 8,
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            Today
          </div>
          <div>
            <NotifRow
              tone="err"
              title="Monitor firing on cart-svc"
              body="latency-p95 has exceeded 800ms for 14 minutes."
              time="9:32"
              unread
              isFirst
            />
            <NotifRow
              tone="warn"
              title="Ownership gap"
              body="ledger-worker has no owner. Suggest: payments team."
              time="8:14"
              unread
            />
            <NotifRow
              tone="ok"
              title="Deploy succeeded"
              body="payments-api v3.1.4 → production."
              time="7:01"
              isLast
            />
          </div>
          <div
            style={{
              margin: '20px 0 8px',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            Yesterday
          </div>
          <div>
            <NotifRow
              tone="neutral"
              title="Sarah mentioned you"
              body="@mo can you double-check the checkout dep graph?"
              time="Mon"
              unread
              isFirst
            />
            <NotifRow
              tone="ok"
              title="New connector synced"
              body="PagerDuty connector imported 24 schedules."
              time="Mon"
              isLast
            />
          </div>
        </div>
        <TabBar items={tabs} value={active} onValueChange={setActive} />
      </div>
    </IOSDevice>
  );
}
