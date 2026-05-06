import { GraphNode, type EntityType } from "@ship-it-ui/shipit";

export default function Example() {
    return (
        <div className="flex flex-wrap items-center gap-5">
            {(['service', 'person', 'document', 'deployment', 'incident', 'ticket'] as EntityType[]).map(
                (t) => (
                    <GraphNode key={t} type={t} label={t} />
                ),
            )}
        </div>
    );
}

