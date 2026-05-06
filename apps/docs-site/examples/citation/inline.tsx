import { Citation } from "@ship-it-ui/shipit";

export default function Example() {
    return (
        <p className="text-text text-[13px]">
            Priya owns{' '}
            <code className="bg-panel-2 rounded-xs px-[4px] py-px font-mono text-[11px]">
                payment-webhook-v2
            </code>
            <Citation inline index={1} source="team-roster.md" />, currently on-call through Friday
            <Citation inline index={2} source="pagerduty.schedules" />.
        </p>
    );
}

