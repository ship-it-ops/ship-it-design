import { GraphInspector } from "@ship-it-ui/shipit";

export default function Example() {
    return <GraphInspector type='service' entityId='ent_0x7a2f' title='payment-webhook-v2' description='Handles incoming Stripe webhook events, dedupes, forwards to ledger-core.' properties={[
        { key: 'owner', value: 'Payments' },
        { key: 'runtime', value: 'node 20.8' },
        { key: 'runs', value: 'k8s://prod-us-east' },
        { key: 'sla', value: '99.9%' },
    ]} relations={[
        { relation: '→ depends on', entity: 'ledger-core' },
        { relation: '← called by', entity: 'api-gateway' },
        { relation: 'owned by', entity: 'Priya K.' },
        { relation: 'documented in', entity: 'runbook-oncall.md' },
    ]} relationCount={142} />;
}

