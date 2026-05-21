'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import {
  forwardRef,
  useCallback,
  useEffect,
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
 * handles snapping, active-index tracking, and keyboard nav.
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
    className,
    'aria-label': ariaLabel = 'Carousel',
    ...props
  },
  ref,
) {
  const [active, setActive] = useControllableState<number>({
    value: indexProp,
    defaultValue: defaultIndex ?? 0,
    onChange: onIndexChange,
  });
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, i));
      setActive(clamped);
      const node = viewportRef.current;
      if (node) {
        const slide = node.children[clamped] as HTMLElement | undefined;
        slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    },
    [items.length, setActive],
  );

  // Update active index from native scroll position.
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const onScroll = () => {
      const width = node.clientWidth;
      if (width === 0) return;
      const i = Math.round(node.scrollLeft / width);
      if (i !== active) setActive(i);
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => node.removeEventListener('scroll', onScroll);
  }, [active, setActive]);

  const activeIdx = active ?? 0;

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
          {items.map((item, i) => (
            <div
              key={i}
              className="w-full shrink-0 snap-start"
              style={{ aspectRatio: String(aspectRatio) }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>

        {showArrows && items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(activeIdx - 1)}
              disabled={activeIdx === 0}
              className="bg-panel/85 border-border text-text hover:bg-panel absolute top-1/2 left-2 inline-grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border shadow-md backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconGlyph name="caretLeft" size={16} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(activeIdx + 1)}
              disabled={activeIdx === items.length - 1}
              className="bg-panel/85 border-border text-text hover:bg-panel absolute top-1/2 right-2 inline-grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border shadow-md backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconGlyph name="caretRight" size={16} />
            </button>
          </>
        )}

        {showDots && items.length > 1 && (
          <div
            role="tablist"
            aria-label="Choose slide"
            className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2 py-1.5 backdrop-blur"
          >
            {items.map((_, i) => (
              <button
                key={i}
                role="tab"
                type="button"
                aria-selected={i === activeIdx}
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
