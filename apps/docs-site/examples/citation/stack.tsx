import { Citation } from '@ship-it-ui/shipit';

export default function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Citation index={1} source="team-roster.md" meta="notion · 2d ago" />
      <Citation index={2} source="runbook-oncall.md:L42" meta="github · 3h ago" />
      <Citation index={3} source="#payments-oncall" meta="slack · 4h ago" />
    </div>
  );
}
