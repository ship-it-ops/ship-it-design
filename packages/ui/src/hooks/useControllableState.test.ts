import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  it('manages internal state when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 'a' }));
    expect(result.current[0]).toBe('a');
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
  });

  it('mirrors controlled value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, onChange: () => {} }),
      { initialProps: { value: 'a' } },
    );
    expect(result.current[0]).toBe('a');
    rerender({ value: 'c' });
    expect(result.current[0]).toBe('c');
  });

  it('calls onChange in controlled mode without mutating the value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ value: 'a', onChange }));
    act(() => result.current[1]('b'));
    expect(onChange).toHaveBeenCalledWith('b');
    // controlled — value stays the same until parent updates
    expect(result.current[0]).toBe('a');
  });

  it('accepts an updater function', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 1 }));
    act(() => result.current[1]((prev) => (prev ?? 0) + 1));
    expect(result.current[0]).toBe(2);
  });
});
