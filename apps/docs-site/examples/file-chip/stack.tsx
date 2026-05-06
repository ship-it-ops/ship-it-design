import { FileChip } from "@ship-it-ui/ui";

export default function Example() {
    return (
        <div className="flex flex-col gap-2">
            <FileChip name="runbook-oncall.pdf" size="2.4 MB" progress={100} onRemove={() => { }} />
            <FileChip name="architecture-v2.md" size="18 KB · uploading" progress={62} />
            <FileChip name="diagram.xlsx" size="failed" failed onRemove={() => { }} />
        </div>
    );
}

