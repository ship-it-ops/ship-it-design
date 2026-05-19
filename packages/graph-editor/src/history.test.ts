import { renderHook, act } from '@testing-library/react';
import type { Edge, Node } from '@xyflow/react';
import { describe, expect, it } from 'vitest';

import { inverseOf, useHistory, type Command } from './history';

const nodeA: Node = { id: 'a', position: { x: 10, y: 20 }, data: {} };
const edgeAB: Edge = { id: 'e-ab', source: 'a', target: 'b' };

describe('inverseOf', () => {
  it('inverts add-node ↔ delete-node', () => {
    const cmd: Command = { kind: 'add-node', node: nodeA };
    const inv = inverseOf(cmd);
    expect(inv).toEqual({ kind: 'delete-node', node: nodeA, incidentEdges: [] });
  });

  it('inverts add-edge ↔ delete-edge', () => {
    expect(inverseOf({ kind: 'add-edge', edge: edgeAB })).toEqual({
      kind: 'delete-edge',
      edge: edgeAB,
    });
    expect(inverseOf({ kind: 'delete-edge', edge: edgeAB })).toEqual({
      kind: 'add-edge',
      edge: edgeAB,
    });
  });

  it('inverts move-node by swapping from / to', () => {
    const cmd: Command = {
      kind: 'move-node',
      id: 'a',
      from: { x: 0, y: 0 },
      to: { x: 100, y: 100 },
    };
    expect(inverseOf(cmd)).toEqual({
      kind: 'move-node',
      id: 'a',
      from: { x: 100, y: 100 },
      to: { x: 0, y: 0 },
    });
  });

  it('inverts delete-node into a batch that re-adds node + incident edges', () => {
    const cmd: Command = {
      kind: 'delete-node',
      node: nodeA,
      incidentEdges: [edgeAB],
    };
    const inv = inverseOf(cmd);
    expect(inv).toEqual({
      kind: 'batch',
      commands: [
        { kind: 'add-node', node: nodeA },
        { kind: 'add-edge', edge: edgeAB },
      ],
    });
  });

  it('reverses + inverts each child of a batch', () => {
    const cmd: Command = {
      kind: 'batch',
      commands: [
        { kind: 'add-edge', edge: edgeAB },
        { kind: 'add-node', node: nodeA },
      ],
    };
    const inv = inverseOf(cmd);
    expect(inv).toEqual({
      kind: 'batch',
      commands: [
        { kind: 'delete-node', node: nodeA, incidentEdges: [] },
        { kind: 'delete-edge', edge: edgeAB },
      ],
    });
  });
});

describe('useHistory', () => {
  it('returns the inverse of the most recent push from undo()', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.push({ kind: 'add-edge', edge: edgeAB }));
    const inv = result.current.undo();
    expect(inv).toEqual({ kind: 'delete-edge', edge: edgeAB });
  });

  it('returns null when the undo stack is empty', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.undo()).toBeNull();
  });

  it('redo replays the previously-undone command in original direction', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.push({ kind: 'add-edge', edge: edgeAB }));
    act(() => {
      result.current.undo();
    });
    const next = result.current.redo();
    expect(next).toEqual({ kind: 'add-edge', edge: edgeAB });
  });

  it('clears the redo stack on a fresh push', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.push({ kind: 'add-edge', edge: edgeAB }));
    act(() => {
      result.current.undo();
    });
    act(() => result.current.push({ kind: 'delete-edge', edge: edgeAB }));
    expect(result.current.redo()).toBeNull();
  });

  it('drops the oldest entry when maxSize is reached', () => {
    const { result } = renderHook(() => useHistory({ maxSize: 2 }));
    act(() => result.current.push({ kind: 'add-edge', edge: { ...edgeAB, id: 'e1' } }));
    act(() => result.current.push({ kind: 'add-edge', edge: { ...edgeAB, id: 'e2' } }));
    act(() => result.current.push({ kind: 'add-edge', edge: { ...edgeAB, id: 'e3' } }));
    // Three undos worth shouldn't be possible — only two remembered.
    expect(result.current.size().undo).toBe(2);
    const inv1 = result.current.undo();
    const inv2 = result.current.undo();
    const inv3 = result.current.undo();
    expect((inv1 as { edge: { id: string } }).edge.id).toBe('e3');
    expect((inv2 as { edge: { id: string } }).edge.id).toBe('e2');
    expect(inv3).toBeNull();
  });

  it('maxSize=0 disables history', () => {
    const { result } = renderHook(() => useHistory({ maxSize: 0 }));
    act(() => result.current.push({ kind: 'add-edge', edge: edgeAB }));
    expect(result.current.undo()).toBeNull();
    expect(result.current.size()).toEqual({ undo: 0, redo: 0 });
  });

  it('reset clears both stacks', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.push({ kind: 'add-edge', edge: edgeAB }));
    act(() => {
      result.current.undo();
    });
    act(() => result.current.reset());
    expect(result.current.size()).toEqual({ undo: 0, redo: 0 });
  });
});
