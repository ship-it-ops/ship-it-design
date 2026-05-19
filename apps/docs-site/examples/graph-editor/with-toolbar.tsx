'use client';

import '@ship-it-ui/graph-editor/styles.css';

import { GraphEditorCanvas, type GraphElement } from '@ship-it-ui/graph-editor';
import { Button } from '@ship-it-ui/ui';
import { useCallback, useState } from 'react';

const INITIAL: GraphElement[] = [
  { data: { id: 'n1', label: 'Source', entityType: 'service' }, position: { x: 40, y: 80 } },
  { data: { id: 'n2', label: 'Transform', entityType: 'pipeline' }, position: { x: 240, y: 80 } },
  { data: { id: 'n3', label: 'Sink', entityType: 'deployment' }, position: { x: 440, y: 80 } },
  { data: { id: 'e-1-2', source: 'n1', target: 'n2' } },
  { data: { id: 'e-2-3', source: 'n2', target: 'n3' } },
];

function Inner() {
  const [elements, setElements] = useState<GraphElement[]>(INITIAL);
  const [counter, setCounter] = useState(4);

  const addNode = useCallback(
    (entityType: string, label: string) => {
      const id = `n${counter}`;
      setElements((prev) => [
        ...prev,
        {
          data: { id, label, entityType },
          position: { x: 100 + (counter % 5) * 120, y: 220 + Math.floor(counter / 5) * 100 },
        },
      ]);
      setCounter((c) => c + 1);
    },
    [counter],
  );

  return (
    <div className="h-[480px] w-full">
      <GraphEditorCanvas
        elements={elements}
        onNodeMove={(id, position) =>
          setElements((prev) => prev.map((el) => (el.data.id === id ? { ...el, position } : el)))
        }
        onConnect={({ source, target }) =>
          setElements((prev) => [
            ...prev,
            { data: { id: `e-${source}-${target}`, source, target } },
          ])
        }
        onNodeDelete={(id) =>
          setElements((prev) =>
            prev.filter(
              (el) => el.data.id !== id && el.data.source !== id && el.data.target !== id,
            ),
          )
        }
        onEdgeDelete={(id) => setElements((prev) => prev.filter((el) => el.data.id !== id))}
        toolbar={
          <div className="bg-panel border-border flex items-center gap-1 rounded-md border p-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addNode('service', `svc-${counter}`)}
            >
              + Service
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addNode('pipeline', `pipe-${counter}`)}
            >
              + Pipeline
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addNode('deployment', `deploy-${counter}`)}
            >
              + Deployment
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
