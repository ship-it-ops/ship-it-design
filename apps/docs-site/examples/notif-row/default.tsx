import { NotifRow } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div style={{ maxWidth: 390, margin: '0 auto', padding: 16 }}>
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
  );
}
