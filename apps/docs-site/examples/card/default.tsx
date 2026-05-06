import { Card, CardLink, StatCard } from "@ship-it-ui/ui";

export default function Example() {
    return <Card title='Service overview' description='A quick summary of the payment-webhook service.' footer='updated 4m ago'>{<div className="text-text-muted text-[12px]">Service body content goes here.</div>}</Card>;
}

