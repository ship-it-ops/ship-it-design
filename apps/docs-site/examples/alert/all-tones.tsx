import { Alert, Button } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="flex w-full max-w-[640px] flex-col gap-2">
            <Alert tone="accent" title="Schema preview ready" description="Review before committing." />
            <Alert
                tone="ok"
                title="GitHub connected"
                description="4 repos imported · 12,841 files indexed."
            />
            <Alert
                tone="warn"
                title="GitHub token expires in 3 days"
                description="Generate a new token to avoid sync interruption."
                action={
                    <Button size="sm" variant="ghost">
                        Dismiss
                    </Button>
                }
            />
            <Alert
                tone="err"
                title="Notion sync failed"
                description="Token rejected. Re-authorize the connector to continue."
            />
        </div>
    );
}

