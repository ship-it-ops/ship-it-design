'use client';

import { useCallback, useState, type KeyboardEvent } from 'react';

/**
 * Keyboard navigation for arrow-key selectable lists (Combobox, CommandPalette,
 * filtered dropdown bodies). Tracks the highlighted cursor and exposes a
 * `getKeyDownHandler` you can spread on the input/list element.
 *
 * Supports ↑/↓, Home/End, optional Enter, and a `loop` option that wraps from
 * end → start. The `count` arg drives bounds; pass `0` and the hook becomes a
 * no-op until you hydrate it.
 */

export interface UseKeyboardListOptions {
  /** Total number of items currently in the list. */
  count: number;
  /** Wrap around at the ends. Default true. */
  loop?: boolean;
  /** Initial cursor. Default 0. */
  defaultCursor?: number;
  /** Called with the current cursor index when Enter is pressed. */
  onSelect?: (index: number) => void;
}

export interface UseKeyboardListResult {
  cursor: number;
  setCursor: (index: number) => void;
  /** Handler for `onKeyDown` — does NOT call `preventDefault` for unhandled keys. */
  onKeyDown: (event: KeyboardEvent) => void;
}

export function useKeyboardList({
  count,
  loop = true,
  defaultCursor = 0,
  onSelect,
}: UseKeyboardListOptions): UseKeyboardListResult {
  const [cursor, setCursor] = useState(defaultCursor);

  const move = useCallback(
    (delta: number) => {
      if (count <= 0) return;
      setCursor((c) => {
        const next = c + delta;
        if (loop) return ((next % count) + count) % count;
        return Math.max(0, Math.min(count - 1, next));
      });
    },
    [count, loop],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (count <= 0) return;
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          move(1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          move(-1);
          break;
        case 'Home':
          event.preventDefault();
          setCursor(0);
          break;
        case 'End':
          event.preventDefault();
          setCursor(count - 1);
          break;
        case 'Enter':
          if (onSelect) {
            event.preventDefault();
            onSelect(cursor);
          }
          break;
        default:
          break;
      }
    },
    [count, cursor, move, onSelect],
  );

  const safeCursor = count > 0 ? Math.min(cursor, count - 1) : 0;

  return { cursor: safeCursor, setCursor, onKeyDown };
}
