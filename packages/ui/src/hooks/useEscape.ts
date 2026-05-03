'use client';

import { useEffect, useRef } from 'react';

/**
 * Calls `handler` when Escape is pressed while `enabled` is true.
 * Most overlay components (Dialog, Popover, Drawer) get this for free via Radix,
 * but custom popovers and inline editors need it.
 *
 * Implementation note: the handler is stored in a ref so an inline
 * `() => doThing()` passed by the consumer doesn't detach/reattach the
 * `keydown` listener every render.
 */
export function useEscape(handler: () => void, enabled = true) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handlerRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [enabled]);
}
