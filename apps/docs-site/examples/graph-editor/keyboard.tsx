'use client';

import '@ship-it-ui/graph-editor/styles.css';

import { GraphEditorCanvas, type GraphElement } from '@ship-it-ui/graph-editor';
import { Kbd } from '@ship-it-ui/ui';
import { useCallback, useState } from 'react';

const INITIAL: GraphElement[] = [
  { data: { id: 'a', label: 'Alpha', entityType: 'service' }, position: { x: 60, y: 80 } },
  { data: { id: 'b', label: 'Beta', entityType: 'service' }, position: { x: 260, y: 80 } },
  { data: { id: 'c', label: 'Gamma', entityType: 'service' }, position: { x: 460, y: 80 } },
  { data: { id: 'e-a-b', source: 'a', target: 'b' } },
  { data: { id: 'e-b-c', source: 'b', target: 'c' } },
];

function Inner() {
  const [elements, setElements] = useState<GraphElement[]>(INITIAL);

  const onNodeMove = useCallback((id: string, position: { x: number; y: number }) => {
    setElements((prev) => prev.map((el) => (el.data.id === id ? { ...el, position } : el)));
  }, []);

  const onNodeDelete = useCallback((id: string) => {
    setElements((prev) =>
      prev.filter((el) => el.data.id !== id && el.data.source !== id && el.data.target !== id),
    );
  }, []);

  const onEdgeDelete = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.data.id !== id));
  }, []);

  return (
    <div className="flex h-[480px] w-full flex-col gap-3">
      <div className="text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
        <span>
          <Kbd>Click</Kbd> to select
        </span>
        <span>
          <Kbd>Delete</Kbd> to remove
        </span>
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd> to nudge
        </span>
        <span>
          <Kbd>Shift</Kbd>+arrow for 32px
        </span>
        <span>
          <Kbd>Esc</Kbd> to clear
        </span>
        <span>
          <Kbd>⌘</Kbd>
          <Kbd>Z</Kbd> undo / <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>Z</Kbd> redo
        </span>
      </div>
      <div className="flex-1">
        <GraphEditorCanvas
          elements={elements}
          onNodeMove={onNodeMove}
          onNodeDelete={onNodeDelete}
          onEdgeDelete={onEdgeDelete}
          onConnect={({ id, source, target }) =>
            setElements((prev) => [...prev, { data: { id, source, target } }])
          }
        />
      </div>
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
