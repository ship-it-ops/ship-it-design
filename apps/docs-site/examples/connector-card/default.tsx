import { Button } from '@ship-it-ui/ui';
import { ConnectorCard } from '@ship-it-ui/shipit';

const NOW = new Date('2026-05-10T12:00:00Z');

export default function Example() {
  return (
    <div className="flex w-[420px] flex-col gap-3">
      <ConnectorCard
        connector="github"
        name="GitHub"
        status="connected"
        summary="1,243 repos · 18 orgs"
        lastSyncedAt={new Date('2026-05-10T11:30:00Z')}
        relativeNow={NOW}
        actions={
          <Button size="sm" variant="ghost">
            Manage
          </Button>
        }
      />
      <ConnectorCard
        connector="notion"
        name="Notion"
        status="syncing"
        summary="42% of 8,200 pages"
        lastSyncedAt={new Date('2026-05-10T11:50:00Z')}
        relativeNow={NOW}
      />
      <ConnectorCard
        connector="pagerduty"
        name="PagerDuty"
        status="error"
        summary="auth token revoked"
        lastSyncedAt={new Date('2026-05-09T03:00:00Z')}
        relativeNow={NOW}
        actions={
          <Button size="sm" variant="primary">
            Reconnect
          </Button>
        }
      />
    </div>
  );
}
