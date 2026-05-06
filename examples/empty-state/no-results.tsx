import { Button, EmptyState } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="w-[280px]">
            <EmptyState
                icon="⌕"
                title="No results"
                description="Try a broader search. We looked across services, people, and docs."
                action={
                    <Button size="sm" variant="ghost">
                        Clear filters
                    </Button>
                }
            />
        </div>
    );
}

