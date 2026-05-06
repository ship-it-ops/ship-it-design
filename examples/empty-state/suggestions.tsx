import { Button, EmptyState } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="w-[280px]">
            <EmptyState
                icon="✦"
                title="Ask anything"
                description="Try one of these to start, or write your own question above."
                chips={[
                    { label: 'Who owns checkout?' },
                    { label: 'Recent rollbacks' },
                    { label: 'On-call this week' },
                ]}
            />
        </div>
    );
}

