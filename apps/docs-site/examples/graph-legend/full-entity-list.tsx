import { GraphLegend } from "@ship-it-ui/shipit";

export default function Example() {
    return <GraphLegend entries={[
        { type: 'service', label: 'service' },
        { type: 'person', label: 'person' },
        { type: 'document', label: 'document' },
        { type: 'deployment', label: 'deployment' },
        { type: 'incident', label: 'incident' },
        { type: 'ticket', label: 'ticket' },
    ]} />;
}

