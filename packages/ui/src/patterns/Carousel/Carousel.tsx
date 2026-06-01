'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * Carousel — a horizontal scroll-snap container with prev/next controls,
 * dot indicators, and an optional thumbnail strip. Native CSS scroll
 * behavior; no library.
 *
 * Pass an array of `items` and a `renderItem` function — the carousel
 * handles snapping, active-index tracking, and keyboard nav. Set
 * `loop` to make arrows / dots / native swipe wrap continuously.
 */

export interface CarouselProps<T = unknown> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Slide data. */
  items: ReadonlyArray<T>;
  /** Renderer for each slide. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Optional renderer for a thumbnail strip below the viewport. */
  renderThumbnail?: (item: T, index: number) => ReactNode;
  /** Active slide index (controlled). */
  index?: number;
  /** Default index (uncontrolled). Default `0`. */
  defaultIndex?: number;
  /** Fires when the active index changes. */
  onIndexChange?: (index: number) => void;
  /** Aspect ratio of each slide. Default `16/10`. */
  aspectRatio?: string | number;
  /** When false, hides the dot indicators. Default `true`. */
  showDots?: boolean;
  /** When false, hides the prev/next arrows. Default `true`. */
  showArrows?: boolean;
  /**
   * Wrap arrows / dots / native swipe past the boundaries. Default `false`.
   * When `true`, hidden clones of the first / last slide bracket the real
   * items so swipe past the end jumps invisibly to the other side.
   * `onIndexChange` still only emits real indices in `0..items.length - 1`.
   */
  loop?: boolean;
  /** Accessible label for the carousel region. */
  'aria-label'?: string;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps<unknown>>(function Carousel(
  {
    items,
    renderItem,
    renderThumbnail,
    index: indexProp,
    defaultIndex,
    onIndexChange,
    aspectRatio = 16 / 10,
    showDots = true,
    showArrows = true,
    loop = false,
    className,
    'aria-label': ariaLabel = 'Carousel',
    ...props
  },
  ref,
) {
  const N = items.length;
  const isLooping = loop && N > 1;

  const [active, setActive] = useControllableState<number>({
    value: indexProp,
    defaultValue: defaultIndex ?? 0,
    onChange: onIndexChange,
  });
  const viewportRef = useRef<HTMLDivElement | null>(null);
  // Set true immediately before any internal scrollIntoView call so the
  // controlled-sync effect below doesn't fight an animation that just
  // started — goTo's smooth scroll and the clone-jump's instant scroll
  // both claim ownership of the next scroll with this ref.
  const internalScrollRef = useRef(false);

  const activeIdx = active ?? 0;
  // Real slide index → DOM child index. Identity unless looping (a clone
  // of `last` sits at DOM 0 and a clone of `first` sits at DOM N+1).
  const domIndexFor = useCallback((real: number) => (isLooping ? real + 1 : real), [isLooping]);

  const goTo = useCallback(
    (i: number) => {
      const next = isLooping ? ((i % N) + N) % N : Math.max(0, Math.min(N - 1, i));
      setActive(next);
      const node = viewportRef.current;
      if (node) {
        const slide = node.children[domIndexFor(next)] as HTMLElement | undefined;
        if (slide) {
          internalScrollRef.current = true;
          slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      }
    },
    [N, isLooping, domIndexFor, setActive],
  );

  // Track the active index from native scroll position. When looping,
  // detect when scroll-snap stopped on a clone and jump invisibly to
  // its real twin.
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const onScroll = () => {
      const width = node.clientWidth;
      if (width === 0) return;
      const domIdx = Math.round(node.scrollLeft / width);
      if (!isLooping) {
        if (domIdx !== activeIdx) setActive(domIdx);
        return;
      }
      // Clones live at DOM 0 (mirror of last) and DOM N+1 (mirror of first).
      // `behavior: 'instant'` (not 'auto') because the viewport has
      // `scroll-smooth` CSS; per CSSOM-View, `'auto'` would inherit that
      // and animate the jump, defeating the invisible-loop illusion.
      if (domIdx === 0) {
        const realTwin = node.children[N] as HTMLElement | undefined;
        if (realTwin) {
          internalScrollRef.current = true;
          realTwin.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' });
        }
        if (activeIdx !== N - 1) setActive(N - 1);
        return;
      }
      if (domIdx === N + 1) {
        const realTwin = node.children[1] as HTMLElement | undefined;
        if (realTwin) {
          internalScrollRef.current = true;
          realTwin.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' });
        }
        if (activeIdx !== 0) setActive(0);
        return;
      }
      const realIdx = domIdx - 1;
      if (realIdx !== activeIdx) setActive(realIdx);
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => node.removeEventListener('scroll', onScroll);
  }, [activeIdx, isLooping, N, setActive]);

  // Sync the viewport's scroll position when `active` changes from
  // outside (controlled `index` prop update — e.g. Lightbox close in
  // ListingDetail pushes back the index it left on). Skipped when the
  // change came from goTo / a clone-jump; those set internalScrollRef
  // first so their own scroll calls own the animation. `behavior:
  // 'instant'` (not 'auto') because `scroll-smooth` on the viewport
  // would otherwise animate the sync and make lightbox-close look laggy.
  useEffect(() => {
    if (internalScrollRef.current) {
      internalScrollRef.current = false;
      return;
    }
    const node = viewportRef.current;
    if (!node) return;
    const width = node.clientWidth;
    if (width === 0) return;
    const targetDom = domIndexFor(activeIdx);
    const currentDom = Math.round(node.scrollLeft / width);
    if (currentDom === targetDom) return;
    const slide = node.children[targetDom] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' });
  }, [activeIdx, domIndexFor]);

  // On mount with loop, scroll past the leading clone so the user starts
  // on the real `activeIdx`, not the clone-of-last. Layout effect (not
  // useEffect) so the user never sees the wrong frame before paint.
  // `behavior: 'instant'` is required because `'auto'` would inherit
  // the viewport's `scroll-smooth` CSS and animate the mount position.
  useLayoutEffect(() => {
    if (!isLooping) return;
    const node = viewportRef.current;
    if (!node) return;
    const slide = node.children[domIndexFor(activeIdx)] as HTMLElement | undefined;
    if (!slide) return;
    internalScrollRef.current = true;
    slide.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' });
    // Mount-only; the controlled-sync effect above handles activeIdx
    // changes after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLooping]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className={cn('relative w-full', className)}
      {...props}
    >
      <div className="relative overflow-hidden rounded-md">
        <div
          ref={viewportRef}
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-live="polite"
        >
          {isLooping && (
            <div
              key="clone-start"
              aria-hidden="true"
              tabIndex={-1}
              className="w-full shrink-0 snap-start"
              style={{ aspectRatio: String(aspectRatio) }}
            >
              {renderItem(items[N - 1], N - 1)}
            </div>
          )}
          {items.map((item, i) => (
            <div
              key={i}
              className="w-full shrink-0 snap-start"
              style={{ aspectRatio: String(aspectRatio) }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${N}`}
            >
              {renderItem(item, i)}
            </div>
          ))}
          {isLooping && (
            <div
              key="clone-end"
              aria-hidden="true"
              tabIndex={-1}
              className="w-full shrink-0 snap-start"
              style={{ aspectRatio: String(aspectRatio) }}
            >
              {renderItem(items[0], 0)}
            </div>
          )}
        </div>

        {showArrows && N > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(activeIdx - 1)}
              disabled={!isLooping && activeIdx === 0}
              className="bg-panel/85 border-border text-text hover:bg-panel absolute top-1/2 left-2 inline-grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border shadow-md backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconGlyph name="caretLeft" size={16} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(activeIdx + 1)}
              disabled={!isLooping && activeIdx === N - 1}
              className="bg-panel/85 border-border text-text hover:bg-panel absolute top-1/2 right-2 inline-grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border shadow-md backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconGlyph name="caretRight" size={16} />
            </button>
          </>
        )}

        {showDots && N > 1 && (
          /*
           * Plain `<button>` + `aria-current` rather than the tabs pattern
           * (`role="tablist" / "tab"`). The APG carousel pattern recommends
           * this lighter semantic; the viewport's `aria-live="polite"`
           * already announces slide changes, so the tabs relationship is
           * unnecessary — and incomplete here (slides aren't tabpanels and
           * there's no `aria-controls`).
           */
          <div
            role="group"
            aria-label="Choose slide"
            className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2 py-1.5 backdrop-blur"
          >
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-current={i === activeIdx ? 'true' : undefined}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  'h-1.5 w-1.5 cursor-pointer rounded-full transition-all',
                  i === activeIdx ? 'w-4 bg-white' : 'bg-white/50 hover:bg-white/75',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {renderThumbnail && (
        <div className="mt-2 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                'shrink-0 cursor-pointer overflow-hidden rounded transition-opacity',
                i === activeIdx ? 'ring-accent opacity-100 ring-2' : 'opacity-60 hover:opacity-100',
              )}
            >
              {renderThumbnail(item, i)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}) as <T>(p: CarouselProps<T> & { ref?: React.Ref<HTMLDivElement> }) => ReactNode;

// @ts-expect-error displayName on generic forwardRef
Carousel.displayName = 'Carousel';
