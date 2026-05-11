import { renderHook } from '@testing-library/react';
import type cytoscape from 'cytoscape';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useShipItStylesheet } from './useShipItStylesheet';

function createMockCy() {
  const updates: unknown[] = [];
  const updateFn = vi.fn();
  const styleFn = vi.fn((next) => {
    updates.push(next);
    return { update: updateFn };
  });
  const cy = { style: styleFn, update: updateFn } as unknown as cytoscape.Core;
  return { cy, styleFn, updateFn, updates };
}

describe('useShipItStylesheet', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('applies the stylesheet on mount', () => {
    const mock = createMockCy();
    const ref = { current: mock.cy };
    renderHook(() => useShipItStylesheet(ref));
    expect(mock.styleFn).toHaveBeenCalledTimes(1);
    expect(mock.updateFn).toHaveBeenCalled();
  });

  it('re-applies when [data-theme] flips', () => {
    const mock = createMockCy();
    const ref = { current: mock.cy };
    renderHook(() => useShipItStylesheet(ref));
    document.documentElement.setAttribute('data-theme', 'light');
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mock.styleFn.mock.calls.length).toBeGreaterThan(1);
        resolve(undefined);
      }, 20);
    });
  });

  it('respects observe=false', () => {
    const mock = createMockCy();
    const ref = { current: mock.cy };
    renderHook(() => useShipItStylesheet(ref, { observe: false }));
    const baseline = mock.styleFn.mock.calls.length;
    document.documentElement.setAttribute('data-theme', 'light');
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mock.styleFn.mock.calls.length).toBe(baseline);
        resolve(undefined);
      }, 20);
    });
  });

  it('refresh() re-applies the stylesheet', () => {
    const mock = createMockCy();
    const ref = { current: mock.cy };
    const { result } = renderHook(() => useShipItStylesheet(ref, { observe: false }));
    const before = mock.styleFn.mock.calls.length;
    result.current.refresh();
    expect(mock.styleFn.mock.calls.length).toBeGreaterThan(before);
  });
});
