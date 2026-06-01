'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { IconGlyph } from '@ship-it-ui/icons';
import { forwardRef, useCallback, useEffect, type KeyboardEvent, type ReactNode } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * Lightbox — fullscreen photo viewer. Built on Radix Dialog (reuses the
 * focus trap, portal, and escape-to-close). Adds keyboard ←/→ navigation
 * between items and a counter overlay. Set `loop` to wrap navigation
 * past the boundaries.
 */

export interface LightboxProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Items to view — usually image URLs but anything renderable is fine. */
  items: ReadonlyArray<unknown>;
  /** Renderer for the active item. */
  renderItem: (item: unknown, index: number) => ReactNode;
  /** Current index (controlled). */
  index?: number;
  /** Default index (uncontrolled). */
  defaultIndex?: number;
  /** Fires when the index changes. */
  onIndexChange?: (index: number) => void;
  /**
   * Wrap prev / next (buttons and ←/→ keys) past the boundaries. Default
   * `false`. When `true`, "next" on the last item goes to the first and
   * vice versa, and the arrow buttons never disable while there's more
   * than one item.
   */
  loop?: boolean;
  /** Accessible title (visually hidden). */
  title?: ReactNode;
}

export const Lightbox = forwardRef<HTMLDivElement, LightboxProps>(function Lightbox(
  {
    open,
    defaultOpen,
    onOpenChange,
    items,
    renderItem,
    index,
    defaultIndex,
    onIndexChange,
    loop = false,
    title = 'Photo viewer',
  },
  ref,
) {
  const N = items.length;
  const isLooping = loop && N > 1;
  const [active, setActive] = useControllableState<number>({
    value: index,
    defaultValue: defaultIndex ?? 0,
    onChange: onIndexChange,
  });

  const goPrev = useCallback(() => {
    setActive((prev) => {
      const p = prev ?? 0;
      return isLooping ? (p - 1 + N) % N : Math.max(0, p - 1);
    });
  }, [setActive, isLooping, N]);
  const goNext = useCallback(() => {
    setActive((prev) => {
      const p = prev ?? 0;
      return isLooping ? (p + 1) % N : Math.min(N - 1, p + 1);
    });
  }, [setActive, isLooping, N]);

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext],
  );

  // Reset to first item when the lightbox closes.
  useEffect(() => {
    if (!open && index === undefined) setActive(defaultIndex ?? 0);
  }, [open, defaultIndex, index, setActive]);

  const activeIdx = active ?? 0;

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm data-[state=open]:animate-[ship-fade-in_180ms_var(--easing-out)]" />
        <RadixDialog.Content
          ref={ref}
          onKeyDown={onKey}
          aria-describedby={undefined}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center outline-none',
            'data-[state=open]:animate-[ship-fade-in_180ms_var(--easing-out)]',
          )}
        >
          <RadixDialog.Title className="sr-only">{title}</RadixDialog.Title>

          <div className="relative flex h-full w-full items-center justify-center p-8">
            <div className="max-h-full max-w-full">{renderItem(items[activeIdx], activeIdx)}</div>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={goPrev}
                  disabled={!isLooping && activeIdx === 0}
                  className="absolute top-1/2 left-4 inline-grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <IconGlyph name="caretLeft" size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={goNext}
                  disabled={!isLooping && activeIdx === N - 1}
                  className="absolute top-1/2 right-4 inline-grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <IconGlyph name="caretRight" size={20} />
                </button>
              </>
            )}

            <RadixDialog.Close asChild>
              <button
                type="button"
                aria-label="Close photo viewer"
                className="absolute top-4 right-4 inline-grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <IconGlyph name="close" size={18} />
              </button>
            </RadixDialog.Close>

            {items.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1.5 font-mono text-[12px] text-white">
                {activeIdx + 1} / {items.length}
              </div>
            )}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
});

Lightbox.displayName = 'Lightbox';
