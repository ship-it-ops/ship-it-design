import { Button, EmptyState } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="w-[280px]">
            <EmptyState
                tone="err"
                icon="!"
                title="Sync failed"
                description="GitHub returned a 401. Your token may have expired."
                action={
                    <Button size="sm" variant="destructive">
                        Re-authorize
                    </Button>
                }
            />
        </div>
    );
}

