'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Calls `handler` when a pointerdown occurs outside the element referenced by `ref`.
 *
 * Pass `enabled=false` to detach (typically while the popover is closed). Listens on
 * `pointerdown` rather than `click` so the trigger sees the close before its own click
 * fires — matches the behavior of most popover libraries. `pointerdown` is the unified
 * mouse + touch + pen event, so this also works on touch devices (where `mousedown`
 * is not synthesized for taps until after the click).
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const onDown = (e: PointerEvent) => {
      const el = ref.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) handler();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [ref, handler, enabled]);
}
