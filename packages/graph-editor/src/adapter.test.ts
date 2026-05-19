import { describe, expect, it } from 'vitest';

import { toCytoscapeElements, toFlowElements, type GraphElement } from './adapter';

const FIXTURE: GraphElement[] = [
  // Six nodes with positions.
  {
    data: { id: 'svc-gateway', label: 'api-gateway', entityType: 'service' },
    position: { x: 0, y: 0 },
  },
  {
    data: { id: 'svc-payments', label: 'payments', entityType: 'service' },
    position: { x: 120, y: 80 },
  },
  {
    data: { id: 'svc-ledger', label: 'ledger', entityType: 'service' },
    position: { x: 240, y: 160 },
  },
  {
    data: { id: 'mon-p99', label: 'p99 payments', entityType: 'monitor' },
    position: { x: 360, y: 0 },
  },
  {
    data: { id: 'inc-1', label: 'stripe-timeout', entityType: 'incident' },
    position: { x: 480, y: 80 },
  },
  {
    data: { id: 'doc-runbook', label: 'runbook.md', entityType: 'document' },
    position: { x: 600, y: 160 },
  },
  // Edges — one with explicit id, one synthesized, one with class.
  { data: { id: 'e-gateway-payments', source: 'svc-gateway', target: 'svc-payments' } },
  { data: { source: 'svc-payments', target: 'svc-ledger' } },
  {
    data: { id: 'e-mon-incident', source: 'mon-p99', target: 'inc-1' },
    classes: 'graph-canvas:path',
  },
  { data: { id: 'e-incident-runbook', source: 'inc-1', target: 'doc-runbook' } },
];

describe('toFlowElements', () => {
  it('partitions nodes and edges by presence of source/target', () => {
    const { nodes, edges } = toFlowElements(FIXTURE);
    expect(nodes).toHaveLength(6);
    expect(edges).toHaveLength(4);
  });

  it('lifts node id and position to the RF node fields', () => {
    const { nodes } = toFlowElements(FIXTURE);
    const payments = nodes.find((n) => n.id === 'svc-payments');
    expect(payments?.position).toEqual({ x: 120, y: 80 });
    expect((payments?.data as { label: string }).label).toBe('payments');
  });

  it('synthesizes an edge id when data.id is missing', () => {
    const { edges } = toFlowElements(FIXTURE);
    const synthesized = edges.find((e) => e.source === 'svc-payments' && e.target === 'svc-ledger');
    expect(synthesized?.id).toBe('svc-payments->svc-ledger');
  });

  it('maps cytoscape classes to RF className', () => {
    const { edges } = toFlowElements(FIXTURE);
    const path = edges.find((e) => e.id === 'e-mon-incident');
    expect(path?.className).toBe('graph-canvas:path');
  });

  it('defaults position to (0,0) when missing', () => {
    const { nodes } = toFlowElements([{ data: { id: 'n1' } }]);
    expect(nodes[0]?.position).toEqual({ x: 0, y: 0 });
  });
});

describe('toCytoscapeElements', () => {
  it('emits nodes before edges so cytoscape sees endpoints first', () => {
    const split = toFlowElements(FIXTURE);
    const out = toCytoscapeElements(split);
    const firstEdgeIdx = out.findIndex((el) => 'source' in el.data);
    const lastNodeIdx = (() => {
      for (let i = out.length - 1; i >= 0; i--) {
        if (!('source' in (out[i]?.data ?? {}))) return i;
      }
      return -1;
    })();
    expect(lastNodeIdx).toBeLessThan(firstEdgeIdx);
  });
});

describe('round-trip', () => {
  it('preserves positions byte-identical', () => {
    const out = toCytoscapeElements(toFlowElements(FIXTURE));
    const inputById = new Map(FIXTURE.map((el) => [el.data.id, el]));
    for (const el of out) {
      if (el.position && el.data.id) {
        const before = inputById.get(el.data.id);
        expect(el.position).toEqual(before?.position ?? { x: 0, y: 0 });
      }
    }
  });

  it('preserves `data` passthrough keys on nodes', () => {
    const out = toCytoscapeElements(toFlowElements(FIXTURE));
    const payments = out.find((el) => el.data.id === 'svc-payments');
    expect(payments?.data.label).toBe('payments');
    expect(payments?.data.entityType).toBe('service');
  });

  it('preserves edge source/target/id', () => {
    const out = toCytoscapeElements(toFlowElements(FIXTURE));
    const e = out.find((el) => el.data.id === 'e-mon-incident');
    expect(e?.data.source).toBe('mon-p99');
    expect(e?.data.target).toBe('inc-1');
    expect(e?.classes).toBe('graph-canvas:path');
  });

  it('preserves synthesized edge ids on second round-trip', () => {
    const once = toCytoscapeElements(toFlowElements(FIXTURE));
    const twice = toCytoscapeElements(toFlowElements(once));
    const e1 = once.find(
      (el) => el.data.source === 'svc-payments' && el.data.target === 'svc-ledger',
    );
    const e2 = twice.find(
      (el) => el.data.source === 'svc-payments' && el.data.target === 'svc-ledger',
    );
    expect(e1?.data.id).toBe('svc-payments->svc-ledger');
    expect(e2?.data.id).toBe(e1?.data.id);
  });

  it('deep-equals the fixture on full round-trip (modulo missing positions)', () => {
    const out = toCytoscapeElements(toFlowElements(FIXTURE));
    // Normalize: input edges have no `position`; round-tripped edges also
    // shouldn't gain one. Input nodes have positions on every entry.
    const normalize = (el: GraphElement) => ({
      data: el.data,
      ...(el.position ? { position: el.position } : {}),
      ...(el.classes ? { classes: el.classes } : {}),
    });
    const expected = FIXTURE.map(normalize).sort((a, b) =>
      String(a.data.id ?? `${a.data.source}->${a.data.target}`).localeCompare(
        String(b.data.id ?? `${b.data.source}->${b.data.target}`),
      ),
    );
    const actual = out
      .map(normalize)
      .sort((a, b) =>
        String(a.data.id ?? `${a.data.source}->${a.data.target}`).localeCompare(
          String(b.data.id ?? `${b.data.source}->${b.data.target}`),
        ),
      );
    // The synthesized edge gains an `id` on the way through — patch the
    // expected entry so the deep-equal succeeds.
    const synth = expected.find(
      (el) => el.data.source === 'svc-payments' && el.data.target === 'svc-ledger',
    );
    if (synth) synth.data = { ...synth.data, id: 'svc-payments->svc-ledger' };
    expect(actual).toEqual(expected);
  });
});
