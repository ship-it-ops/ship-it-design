import { EntityListRow } from "@ship-it-ui/shipit";

export default function Example() {
    return (
        <div className="rounded-base border-border bg-panel w-[360px] border">
            <EntityListRow type="service" name="ledger-core" relation="DEPENDS_ON" onClick={() => { }} />
            <EntityListRow type="service" name="api-gateway" relation="CALLED_BY" onClick={() => { }} />
            <EntityListRow type="person" name="Priya K." relation="OWNED_BY" onClick={() => { }} />
            <EntityListRow
                type="document"
                name="runbook-oncall.md"
                relation="DOCUMENTED_IN"
                onClick={() => { }}
            />
        </div>
    );
}

