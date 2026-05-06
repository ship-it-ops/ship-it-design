import { ToolCallCard } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div className="flex w-full max-w-[620px] flex-col gap-2">
      <ToolCallCard name="graph.query" status="94ms · 142 rows">
        {`match (s:Service {name: "payment-webhook-v2"})
  return s.owner, s.runbook`}
      </ToolCallCard>
      <ToolCallCard name="docs.search" running />
    </div>
  );
}
