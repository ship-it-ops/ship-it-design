'use client';

import cytoscape from 'cytoscape';
import { GraphCanvas } from '@ship-it-ui/cytoscape';
import { GraphInspector, registerEntityTypes } from '@ship-it-ui/shipit';
import { useState } from 'react';

/**
 * End-to-end reference: ~32 nodes across all six built-in entity types plus
 * three custom-registered domain types (`repository`, `pipeline`, `monitor`),
 * ~30 edges (a mix of solid, on-path, and dimmed), `cose` force-directed
 * layout, click to inspect. The shape is what a real internal-platform graph
 * looks like — services backed by repositories, built by pipelines, deployed
 * as releases, observed by monitors that trigger incidents, with documents,
 * tickets, and on-call humans hanging off the incident subgraph.
 *
 * The custom-type registration runs once on module eval (the registry is an
 * in-memory map and no other docs example enumerates the full registry, so
 * this is safe to do at import time).
 */

// Register the three domain types this example references beyond the built-in
// six. Each entry follows the same `EntityTypeMeta` shape the built-ins use.
registerEntityTypes({
  repository: {
    glyph: '⎇',
    label: 'Repository',
    toneClass: 'text-pink',
    toneBg: 'bg-[color-mix(in_oklab,var(--color-pink),transparent_85%)]',
    colorVar: 'var(--color-pink)',
    badgeVariant: 'pink',
  },
  pipeline: {
    glyph: '⌁',
    label: 'Pipeline',
    toneClass: 'text-warn',
    toneBg: 'bg-[color-mix(in_oklab,var(--color-warn),transparent_85%)]',
    colorVar: 'var(--color-warn)',
    badgeVariant: 'warn',
  },
  monitor: {
    glyph: '◷',
    label: 'Monitor',
    toneClass: 'text-accent',
    toneBg: 'bg-[color-mix(in_oklab,var(--color-accent),transparent_85%)]',
    colorVar: 'var(--color-accent)',
    badgeVariant: 'accent',
  },
});

const ELEMENTS: cytoscape.ElementDefinition[] = [
  // Services (5) — the workloads at the centre of the graph.
  { data: { id: 'svc-gateway', label: 'api-gateway', entityType: 'service' } },
  { data: { id: 'svc-payments', label: 'payments', entityType: 'service' } },
  { data: { id: 'svc-ledger', label: 'ledger-core', entityType: 'service' } },
  { data: { id: 'svc-auth', label: 'auth', entityType: 'service' } },
  { data: { id: 'svc-notifications', label: 'notifications', entityType: 'service' } },

  // Repositories (3) — the source-of-truth codebases that back the services.
  { data: { id: 'repo-payments', label: 'payments-svc', entityType: 'repository' } },
  { data: { id: 'repo-ledger', label: 'ledger-svc', entityType: 'repository' } },
  { data: { id: 'repo-infra', label: 'infra', entityType: 'repository' } },

  // Pipelines (3) — CI/CD that turns commits into deployments.
  { data: { id: 'pipe-ci-payments', label: 'ci/payments', entityType: 'pipeline' } },
  { data: { id: 'pipe-ci-ledger', label: 'ci/ledger', entityType: 'pipeline' } },
  { data: { id: 'pipe-deploy-prod', label: 'deploy/prod', entityType: 'pipeline' } },

  // Deployments (4) — releases of each service in prod.
  { data: { id: 'deploy-payments-v42', label: 'payments v42', entityType: 'deployment' } },
  { data: { id: 'deploy-ledger-v8', label: 'ledger v8', entityType: 'deployment' } },
  { data: { id: 'deploy-auth-v23', label: 'auth v23', entityType: 'deployment' } },
  { data: { id: 'deploy-gateway-v17', label: 'gateway v17', entityType: 'deployment' } },

  // Monitors (3) — SLO trackers that page when thresholds break.
  { data: { id: 'mon-p99-payments', label: 'p99 payments', entityType: 'monitor' } },
  { data: { id: 'mon-error-checkout', label: 'errors/checkout', entityType: 'monitor' } },
  { data: { id: 'mon-queue-depth', label: 'queue-depth', entityType: 'monitor' } },

  // Incidents (2) — active and recently-resolved.
  { data: { id: 'inc-stripe-timeout', label: 'stripe-timeout', entityType: 'incident' } },
  { data: { id: 'inc-latency-spike', label: 'latency-spike', entityType: 'incident' } },

  // Documents (4) — runbooks, ADRs, post-mortems, oncall rota.
  { data: { id: 'doc-runbook', label: 'runbook.md', entityType: 'document' } },
  { data: { id: 'doc-adr-014', label: 'adr-014.md', entityType: 'document' } },
  { data: { id: 'doc-postmortem', label: 'pm-09-12.md', entityType: 'document' } },
  { data: { id: 'doc-oncall-rota', label: 'oncall.md', entityType: 'document' } },

  // People (4) — on-call responders and code owners.
  { data: { id: 'person-priya', label: 'Priya K.', entityType: 'person' } },
  { data: { id: 'person-alex', label: 'Alex M.', entityType: 'person' } },
  { data: { id: 'person-sam', label: 'Sam O.', entityType: 'person' } },
  { data: { id: 'person-jordan', label: 'Jordan T.', entityType: 'person' } },

  // Tickets (4) — Jira items linked to the incidents and services.
  { data: { id: 'ticket-jira-1247', label: 'JIRA-1247', entityType: 'ticket' } },
  { data: { id: 'ticket-jira-1248', label: 'JIRA-1248', entityType: 'ticket' } },
  { data: { id: 'ticket-jira-1251', label: 'JIRA-1251', entityType: 'ticket' } },
  { data: { id: 'ticket-jira-1260', label: 'JIRA-1260', entityType: 'ticket' } },

  // Edges — `classes: 'graph-canvas:path'` paints purple-on-path; `:dim` fades
  // to 0.25 opacity. The path subgraph traces the active incident
  // investigation: ci → deploy → service → monitor → incident → runbook →
  // responder + ticket.
  { data: { id: 'e-repo-payments-ci', source: 'repo-payments', target: 'pipe-ci-payments' } },
  { data: { id: 'e-repo-ledger-ci', source: 'repo-ledger', target: 'pipe-ci-ledger' } },
  { data: { id: 'e-repo-infra-deploy', source: 'repo-infra', target: 'pipe-deploy-prod' } },

  {
    data: { id: 'e-ci-payments-deploy', source: 'pipe-ci-payments', target: 'deploy-payments-v42' },
    classes: 'graph-canvas:path',
  },
  { data: { id: 'e-ci-ledger-deploy', source: 'pipe-ci-ledger', target: 'deploy-ledger-v8' } },
  { data: { id: 'e-deploy-prod-auth', source: 'pipe-deploy-prod', target: 'deploy-auth-v23' } },
  {
    data: { id: 'e-deploy-prod-gateway', source: 'pipe-deploy-prod', target: 'deploy-gateway-v17' },
  },

  {
    data: { id: 'e-deploy-payments-svc', source: 'deploy-payments-v42', target: 'svc-payments' },
    classes: 'graph-canvas:path',
  },
  { data: { id: 'e-deploy-ledger-svc', source: 'deploy-ledger-v8', target: 'svc-ledger' } },
  { data: { id: 'e-deploy-auth-svc', source: 'deploy-auth-v23', target: 'svc-auth' } },
  { data: { id: 'e-deploy-gateway-svc', source: 'deploy-gateway-v17', target: 'svc-gateway' } },

  { data: { id: 'e-gateway-payments', source: 'svc-gateway', target: 'svc-payments' } },
  { data: { id: 'e-gateway-auth', source: 'svc-gateway', target: 'svc-auth' } },
  { data: { id: 'e-payments-ledger', source: 'svc-payments', target: 'svc-ledger' } },
  { data: { id: 'e-notifications-gateway', source: 'svc-notifications', target: 'svc-gateway' } },

  {
    data: { id: 'e-mon-payments', source: 'mon-p99-payments', target: 'svc-payments' },
    classes: 'graph-canvas:path',
  },
  { data: { id: 'e-mon-checkout', source: 'mon-error-checkout', target: 'svc-notifications' } },
  { data: { id: 'e-mon-queue', source: 'mon-queue-depth', target: 'svc-notifications' } },

  {
    data: { id: 'e-mon-incident', source: 'mon-p99-payments', target: 'inc-stripe-timeout' },
    classes: 'graph-canvas:path',
  },
  {
    data: { id: 'e-incident-runbook', source: 'inc-stripe-timeout', target: 'doc-runbook' },
    classes: 'graph-canvas:path',
  },
  { data: { id: 'e-incident-responder', source: 'inc-stripe-timeout', target: 'person-priya' } },
  { data: { id: 'e-doc-runbook-priya', source: 'doc-runbook', target: 'person-priya' } },
  { data: { id: 'e-incident-ticket', source: 'inc-stripe-timeout', target: 'ticket-jira-1247' } },
  { data: { id: 'e-ticket-priya', source: 'ticket-jira-1247', target: 'person-priya' } },

  { data: { id: 'e-incident-2-svc', source: 'inc-latency-spike', target: 'svc-ledger' } },
  { data: { id: 'e-incident-2-ticket', source: 'inc-latency-spike', target: 'ticket-jira-1248' } },
  { data: { id: 'e-incident-2-sam', source: 'inc-latency-spike', target: 'person-sam' } },

  { data: { id: 'e-ticket-1251-notif', source: 'ticket-jira-1251', target: 'svc-notifications' } },
  { data: { id: 'e-ticket-1260-infra', source: 'ticket-jira-1260', target: 'repo-infra' } },

  // Dim edges — historical / lower-signal context the renderer should fade.
  {
    data: { id: 'e-ledger-adr', source: 'svc-ledger', target: 'doc-adr-014' },
    classes: 'graph-canvas:dim',
  },
  {
    data: { id: 'e-adr-jordan', source: 'doc-adr-014', target: 'person-jordan' },
    classes: 'graph-canvas:dim',
  },
  {
    data: { id: 'e-auth-sam', source: 'svc-auth', target: 'person-sam' },
    classes: 'graph-canvas:dim',
  },
  {
    data: { id: 'e-postmortem-incident', source: 'doc-postmortem', target: 'inc-stripe-timeout' },
    classes: 'graph-canvas:dim',
  },
  {
    data: { id: 'e-postmortem-alex', source: 'doc-postmortem', target: 'person-alex' },
    classes: 'graph-canvas:dim',
  },
  {
    data: { id: 'e-oncall-jordan', source: 'doc-oncall-rota', target: 'person-jordan' },
    classes: 'graph-canvas:dim',
  },
];

const LAYOUT: cytoscape.LayoutOptions = {
  name: 'cose',
  // Tuned for ~32 nodes in the ~520×420 LivePreview frame: tighter edges and
  // a touch less repulsion than the defaults so the graph still fits without
  // an axis blowing out.
  idealEdgeLength: 60,
  nodeRepulsion: 5500,
  fit: true,
  padding: 16,
  animate: false,
} as cytoscape.LayoutOptions;

export default function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = ELEMENTS.find((el) => el.data.id === selectedId)?.data;

  return (
    <div className="h-[460px] w-full">
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
