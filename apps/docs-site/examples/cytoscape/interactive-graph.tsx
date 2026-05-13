'use client';

import cytoscape from 'cytoscape';
import { GraphCanvas } from '@ship-it-ui/cytoscape';
import { GraphInspector } from '@ship-it-ui/shipit';
import { useState } from 'react';

/**
 * End-to-end reference: 12 nodes across six entity types, 14 edges (a mix of
 * solid, on-path, and dimmed), `cose` force-directed layout, click to inspect.
 * The point is to show what a real explorer looks like — not to demo any one
 * API in isolation.
 */
const ELEMENTS: cytoscape.ElementDefinition[] = [
  // Nodes — `data.entityType` drives the per-type border + glyph from the
  // entity-type registry. `data.label` shows below the node.
  { data: { id: 'svc-payments', label: 'payments', entityType: 'service' } },
  { data: { id: 'svc-ledger', label: 'ledger-core', entityType: 'service' } },
  { data: { id: 'svc-gateway', label: 'api-gateway', entityType: 'service' } },
  { data: { id: 'deploy-payments-v42', label: 'payments v42', entityType: 'deployment' } },
  { data: { id: 'deploy-ledger-v8', label: 'ledger v8', entityType: 'deployment' } },
  { data: { id: 'inc-stripe-timeout', label: 'stripe-timeout', entityType: 'incident' } },
  { data: { id: 'doc-runbook', label: 'runbook.md', entityType: 'document' } },
  { data: { id: 'doc-adr-014', label: 'adr-014.md', entityType: 'document' } },
  { data: { id: 'person-priya', label: 'Priya K.', entityType: 'person' } },
  { data: { id: 'person-alex', label: 'Alex M.', entityType: 'person' } },
  { data: { id: 'ticket-jira-1247', label: 'JIRA-1247', entityType: 'ticket' } },
  { data: { id: 'ticket-jira-1248', label: 'JIRA-1248', entityType: 'ticket' } },

  // Edges — `classes: 'graph-canvas:path'` paints purple-on-path; `:dim`
  // fades to 0.25 opacity. Mixing all three shows the visual states.
  { data: { id: 'e1', source: 'svc-gateway', target: 'svc-payments' } },
  {
    data: { id: 'e2', source: 'svc-payments', target: 'svc-ledger' },
    classes: 'graph-canvas:path',
  },
  { data: { id: 'e3', source: 'svc-payments', target: 'deploy-payments-v42' } },
  { data: { id: 'e4', source: 'svc-ledger', target: 'deploy-ledger-v8' } },
  {
    data: { id: 'e5', source: 'deploy-payments-v42', target: 'inc-stripe-timeout' },
    classes: 'graph-canvas:path',
  },
  {
    data: { id: 'e6', source: 'inc-stripe-timeout', target: 'doc-runbook' },
    classes: 'graph-canvas:path',
  },
  { data: { id: 'e7', source: 'inc-stripe-timeout', target: 'person-priya' } },
  { data: { id: 'e8', source: 'doc-runbook', target: 'person-priya' } },
  { data: { id: 'e9', source: 'svc-ledger', target: 'doc-adr-014' }, classes: 'graph-canvas:dim' },
  {
    data: { id: 'e10', source: 'doc-adr-014', target: 'person-alex' },
    classes: 'graph-canvas:dim',
  },
  {
    data: { id: 'e11', source: 'svc-gateway', target: 'person-alex' },
    classes: 'graph-canvas:dim',
  },
  { data: { id: 'e12', source: 'inc-stripe-timeout', target: 'ticket-jira-1247' } },
  { data: { id: 'e13', source: 'ticket-jira-1247', target: 'person-priya' } },
  { data: { id: 'e14', source: 'ticket-jira-1248', target: 'svc-payments' } },
];

const LAYOUT: cytoscape.LayoutOptions = {
  name: 'cose',
  // Tighter than the default — the LivePreview frame is ~520×420.
  idealEdgeLength: 80,
  nodeRepulsion: 8000,
  fit: true,
  padding: 24,
  animate: false,
} as cytoscape.LayoutOptions;

export default function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = ELEMENTS.find((el) => el.data.id === selectedId)?.data;

  return (
    <div className="h-[420px] w-full">
      <GraphCanvas
        engine={cytoscape}
        elements={ELEMENTS}
        layout={LAYOUT}
        onSelect={(node) => setSelectedId(node.id())}
        onClearSelection={() => setSelectedId(null)}
        inspector={
          selected ? (
            <GraphInspector
              type={selected.entityType as never}
              entityId={selected.id ?? ''}
              title={selected.label ?? selected.id ?? ''}
              description="Selected via the cytoscape canvas — wire this to your domain API."
              properties={[
                { key: 'id', value: selected.id ?? '' },
                { key: 'type', value: String(selected.entityType ?? '') },
              ]}
            />
          ) : null
        }
      />
    </div>
  );
}
