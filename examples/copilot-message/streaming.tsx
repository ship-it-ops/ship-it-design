import { Citation, CopilotMessage } from "@ship-it-ui/shipit";

// `role` is a React prop on CopilotMessage (the chat speaker), not an ARIA role.
/* eslint-disable jsx-a11y/aria-role */

export default function Example() {
    return <CopilotMessage role='assistant' streaming>Rollback is automated — the rollback.yml runbook reverts to the previous tag and re-queues the last 50 events</CopilotMessage>;
}

