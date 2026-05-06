import { Card, CardLink, StatCard } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <CardLink
            href="https://example.com/payments"
            title="Payments service"
            description="The whole card is a single link — no nested-interactive violation."
            footer="updated 2m ago"
        >
            <div className="text-text-muted text-[12px]">Use CardLink when the card is the link.</div>
        </CardLink>
    );
}

