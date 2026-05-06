import { StatusDot } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="flex flex-col gap-2">
            <StatusDot state="ok" label="Synced · 2m ago" />
            <StatusDot state="sync" label="Syncing 182 / 1,204" pulse />
            <StatusDot state="warn" label="Stale · last sync 4h ago" />
            <StatusDot state="err" label="Failed · token expired" />
            <StatusDot state="off" label="Paused" />
        </div>
    );
}

