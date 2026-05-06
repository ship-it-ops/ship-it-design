import { Chip } from '@ship-it-ui/ui';
import { useState } from 'react';
import { AskBar, type AskBarProps } from "@ship-it-ui/shipit";

function AskBarDemo(args: AskBarProps) {
    const [last, setLast] = useState<string | null>(null);
    return (
        <div className="flex w-full max-w-[620px] flex-col gap-3">
            <AskBar {...args} onSubmit={setLast} />
            {last && <div className="text-text-dim text-[12px]">submitted: {last}</div>}
        </div>
    );
}

export default function Example() {
    return <AskBar placeholder='Ask anything…' streaming defaultValue="Who owns payment-webhook and what's the rollback plan?" />;
}

