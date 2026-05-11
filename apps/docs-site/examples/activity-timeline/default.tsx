import { ActivityTimeline, Avatar } from '@ship-it-ui/ui';

const NOW = new Date('2026-05-10T12:00:00Z');

export default function Example() {
  return (
    <ActivityTimeline
      relativeNow={NOW}
      events={[
        {
          id: 'deploy-1',
          icon: '↑',
          actor: { name: 'maya', avatar: <Avatar name="maya" size="xs" /> },
          title: 'Deployed checkout-api',
          at: new Date('2026-05-10T11:45:00Z'),
          payload: '+ 12 commits · ledger-core, gateway',
          tone: 'ok',
        },
        {
          id: 'incident-1',
          icon: '◎',
          actor: { name: 'liam' },
          title: 'Opened incident INC-204',
          at: new Date('2026-05-10T11:00:00Z'),
          payload: 'p99 latency on /charge exceeds 2s for 4m.',
          tone: 'err',
        },
        {
          id: 'doc-1',
          icon: '▤',
          actor: { name: 'priya' },
          title: 'Updated runbook',
          at: new Date('2026-05-09T18:30:00Z'),
          tone: 'accent',
        },
      ]}
    />
  );
}
