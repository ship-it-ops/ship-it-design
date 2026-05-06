import { Button } from '@ship-it-ui/ui';
import { EntityCard } from "@ship-it-ui/shipit";

export default function Example() {
    return <EntityCard type='incident' title='inc-4812 · checkout 5xx spike' subtitle='started 14m ago' description='Elevated 5xx rate on payment-webhook-v2; ledger-core dependency timing out.' stats={[
        { label: 'severity', value: 'SEV-2', tone: 'err' },
        { label: 'owner', value: 'Payments', tone: 'accent' },
        { label: 'duration', value: '14m', tone: 'warn' },
    ]} />;
}

