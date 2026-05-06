import { Button } from '@ship-it-ui/ui';
import { EntityCard } from "@ship-it-ui/shipit";

export default function Example() {
    return <EntityCard type='service' title='payment-webhook-v2' subtitle='ent_0x7a2f' description='Handles incoming Stripe webhook events, dedupes, forwards to ledger-core.' stats={[
        { label: 'owner', value: 'Payments', tone: 'accent' },
        { label: 'on-call', value: 'Priya K.', tone: 'accent' },
        { label: 'runtime', value: 'node 20' },
        { label: 'sla', value: '99.9%' },
        { label: 'p99', value: '94ms' },
    ]} actions={(
        <Button size="sm" variant="primary">
            Ask about this ✦
        </Button>
    )} />;
}

