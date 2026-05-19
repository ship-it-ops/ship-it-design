'use client';

import '@ship-it-ui/graph-editor/styles.css';

import {
  GraphEditorCanvas,
  GraphNodeShell,
  type GraphElement,
  type NodeRenderProps,
} from '@ship-it-ui/graph-editor';
import { InlineEdit } from '@ship-it-ui/ui';
import { useCallback, useState } from 'react';

const INITIAL: GraphElement[] = [
  { data: { id: 'users', label: 'users', entityType: 'service' }, position: { x: 40, y: 60 } },
  { data: { id: 'orders', label: 'orders', entityType: 'service' }, position: { x: 240, y: 60 } },
  { data: { id: 'e-users-orders', source: 'users', target: 'orders' } },
];

function Inner() {
  const [elements, setElements] = useState<GraphElement[]>(INITIAL);

  const renameNode = useCallback((id: string, label: string) => {
    setElements((prev) =>
      prev.map((el) => (el.data.id === id ? { ...el, data: { ...el.data, label } } : el)),
    );
  }, []);

  const renderNode = useCallback(
    (node: NodeRenderProps) => {
      const data = node.data as { label?: string; entityType?: string };
      const type = (data.entityType ?? 'service') as Parameters<typeof GraphNodeShell>[0]['type'];
      return (
        <GraphNodeShell
          type={type}
          state={node.selected ? 'selected' : 'default'}
          label={
            <InlineEdit
              value={data.label ?? ''}
              onValueChange={(next) => renameNode(node.id, next)}
              size="sm"
            />
          }
        />
      );
    },
    [renameNode],
  );

  return (
    <div className="h-[420px] w-full">
      <GraphEditorCanvas
        elements={elements}
        renderNode={renderNode}
        onNodeMove={(id, position) =>
          setElements((prev) => prev.map((el) => (el.data.id === id ? { ...el, position } : el)))
        }
        onConnect={({ source, target }) =>
          setElements((prev) => [
            ...prev,
            { data: { id: `e-${source}-${target}`, source, target } },
          ])
        }
        miniMap={false}
      />
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
