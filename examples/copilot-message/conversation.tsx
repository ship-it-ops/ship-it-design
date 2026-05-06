import { Citation, CopilotMessage } from "@ship-it-ui/shipit";

// `role` is a React prop on CopilotMessage (the chat speaker), not an ARIA role.
/* eslint-disable jsx-a11y/aria-role */

export default function Example() {
    return (
        <div className="flex w-full max-w-[620px] flex-col gap-3">
            <CopilotMessage role="user" avatar="MT">
                Who owns payment-webhook and what&apos;s the rollback plan?
            </CopilotMessage>
            <CopilotMessage role="assistant">
                <p className="m-0">
                    <strong className="font-medium">Priya Khanna</strong> owns{' '}
                    <code className="bg-panel-2 rounded-xs px-[4px] py-px font-mono text-[11px]">
                        payment-webhook-v2
                    </code>
                    , currently on-call through Friday.
                    <Citation inline index={1} source="team-roster.md" />
                </p>
                <p className="m-0 mt-2">
                    Rollback is automated — the{' '}
                    <code className="bg-panel-2 rounded-xs px-[4px] py-px font-mono text-[11px]">
                        rollback.yml
                    </code>{' '}
                    runbook reverts to the previous tag and re-queues the last 50 events.
                    <Citation inline index={2} source="runbook-oncall.md:L42" />
                </p>
            </CopilotMessage>
        </div>
    );
}

