import { useEffect, type RefObject } from 'react';

/**
 * Calls `handler` when a mousedown occurs outside the element referenced by `ref`.
 *
 * Pass `enabled=false` to detach (typically while the popover is closed). Listens on
 * `mousedown` rather than `click` so the trigger sees the close before its own click
 * fires — matches the behavior of most popover libraries.
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const onDown = (e: MouseEvent) => {
      const el = ref.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) handler();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [ref, handler, enabled]);
}
