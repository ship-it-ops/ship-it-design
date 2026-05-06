import { Banner } from "@ship-it-ui/ui";

export default function Example() {
    const args = {
        tone: 'accent',
    } as const;
    return (
        <Banner
            {...args}
            action={
                <a href="https://example.com/changelog" className="underline">
                    What&apos;s new →
                </a>
            }
        >
            New: <strong>incident pinning</strong> in the graph.
        </Banner>
    );
}

