import { useEffect } from 'react';

/**
 * Calls `handler` when Escape is pressed while `enabled` is true.
 * Most overlay components (Dialog, Popover, Drawer) get this for free via Radix,
 * but custom popovers and inline editors need it.
 */
export function useEscape(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, enabled]);
}
