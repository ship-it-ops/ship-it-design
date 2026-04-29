import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useKeyboardList } from './useKeyboardList';

function key(k: string): React.KeyboardEvent {
  return {
    key: k,
    preventDefault: vi.fn(),
  } as unknown as React.KeyboardEvent;
}

describe('useKeyboardList', () => {
  it('moves cursor with ArrowDown / ArrowUp', () => {
    const { result } = renderHook(() => useKeyboardList({ count: 4 }));
    act(() => result.current.onKeyDown(key('ArrowDown')));
    expect(result.current.cursor).toBe(1);
    act(() => result.current.onKeyDown(key('ArrowDown')));
    expect(result.current.cursor).toBe(2);
    act(() => result.current.onKeyDown(key('ArrowUp')));
    expect(result.current.cursor).toBe(1);
  });

  it('Home / End jump to bounds', () => {
    const { result } = renderHook(() => useKeyboardList({ count: 5, defaultCursor: 2 }));
    act(() => result.current.onKeyDown(key('End')));
    expect(result.current.cursor).toBe(4);
    act(() => result.current.onKeyDown(key('Home')));
    expect(result.current.cursor).toBe(0);
  });

  it('loops by default at edges', () => {
    const { result } = renderHook(() => useKeyboardList({ count: 3 }));
    act(() => result.current.onKeyDown(key('ArrowUp')));
    expect(result.current.cursor).toBe(2);
  });

  it('clamps when loop=false', () => {
    const { result } = renderHook(() => useKeyboardList({ count: 3, loop: false }));
    act(() => result.current.onKeyDown(key('ArrowUp')));
    expect(result.current.cursor).toBe(0);
  });

  it('Enter calls onSelect with the current cursor', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardList({ count: 3, defaultCursor: 1, onSelect }));
    act(() => result.current.onKeyDown(key('Enter')));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('clamps cursor when count shrinks below it', () => {
    const { result, rerender } = renderHook(
      ({ count }) => useKeyboardList({ count, defaultCursor: 4 }),
      { initialProps: { count: 5 } },
    );
    expect(result.current.cursor).toBe(4);
    rerender({ count: 2 });
    expect(result.current.cursor).toBe(1);
  });
});
