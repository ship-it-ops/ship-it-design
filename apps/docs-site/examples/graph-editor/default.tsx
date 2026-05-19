'use client';

import '@ship-it-ui/graph-editor/styles.css';

import { GraphEditorCanvas, type GraphElement } from '@ship-it-ui/graph-editor';
import { registerEntityTypes } from '@ship-it-ui/shipit';
import { useCallback, useState } from 'react';

// Same custom types the cytoscape `interactive-graph` demo registers, so the
// editor and viewer pages tell the same story.
registerEntityTypes({
  repository: {
    iconName: 'graph',
    label: 'Repository',
    toneClass: 'text-pink',
    toneBg: 'bg-[color-mix(in_oklab,var(--color-pink),transparent_85%)]',
    colorVar: 'var(--color-pink)',
    badgeVariant: 'pink',
  },
});

const INITIAL: GraphElement[] = [
  {
    data: { id: 'svc-gateway', label: 'api-gateway', entityType: 'service' },
    position: { x: 40, y: 60 },
  },
  {
    data: { id: 'svc-payments', label: 'payments', entityType: 'service' },
    position: { x: 240, y: 60 },
  },
  {
    data: { id: 'svc-ledger', label: 'ledger', entityType: 'service' },
    position: { x: 440, y: 60 },
  },
  {
    data: { id: 'repo-payments', label: 'payments-svc', entityType: 'repository' },
    position: { x: 240, y: 220 },
  },
  { data: { id: 'e-gw-pay', source: 'svc-gateway', target: 'svc-payments' } },
  { data: { id: 'e-pay-ldg', source: 'svc-payments', target: 'svc-ledger' } },
  { data: { id: 'e-repo-pay', source: 'repo-payments', target: 'svc-payments' } },
];

function Inner() {
  const [elements, setElements] = useState<GraphElement[]>(INITIAL);

  const handleNodeMove = useCallback((id: string, position: { x: number; y: number }) => {
    setElements((prev) => prev.map((el) => (el.data.id === id ? { ...el, position } : el)));
  }, []);

  const handleConnect = useCallback(({ source, target }: { source: string; target: string }) => {
    const id = `e-${source}-${target}`;
    setElements((prev) => [...prev, { data: { id, source, target } }]);
  }, []);

  const handleNodeAdd = useCallback((position: { x: number; y: number }) => {
    const id = `svc-${Math.random().toString(36).slice(2, 7)}`;
    setElements((prev) => [...prev, { data: { id, label: id, entityType: 'service' }, position }]);
  }, []);

  const handleNodeDelete = useCallback((id: string) => {
    setElements((prev) =>
      prev.filter((el) => el.data.id !== id && el.data.source !== id && el.data.target !== id),
    );
  }, []);

  const handleEdgeDelete = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.data.id !== id));
  }, []);

  return (
    <div className="h-[460px] w-full">
      <GraphEditorCanvas
        elements={elements}
        onNodeMove={handleNodeMove}
        onConnect={handleConnect}
        onNodeAdd={handleNodeAdd}
        onNodeDelete={handleNodeDelete}
        onEdgeDelete={handleEdgeDelete}
      />
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
