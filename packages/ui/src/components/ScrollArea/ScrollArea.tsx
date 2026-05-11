'use client';

import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';

import { cn } from '../../utils/cn';

/**
 * ScrollArea — token-styled scrollbar primitive built on
 * `@radix-ui/react-scroll-area`. Wraps a viewport with custom scrollbars that
 * match the design tokens (`--color-text-muted` thumb on `--color-panel-2`
 * track) and behave consistently across platforms.
 *
 * Defaults to `type="hover"` so scrollbars fade in only when the pointer is
 * over the area, matching the system feel without the OS-default chrome.
 */

export type ScrollAreaType = 'auto' | 'always' | 'scroll' | 'hover';

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onScroll' | 'dir'> {
  /** Scrollbar visibility behavior. Default `'hover'`. */
  type?: ScrollAreaType;
  /** Which scrollbars to render. Default `'vertical'`. */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Time in ms before scrollbar hides after the last interaction (auto/scroll/hover). */
  scrollHideDelay?: number;
  /** Class applied to the inner viewport rather than the outer root. */
  viewportClassName?: string;
  /**
   * Ref to the inner viewport (the scrollable element). Useful when a consumer
   * wants to drive scroll position imperatively without losing the outer-root
   * ref forwarded as `ref`.
   */
  viewportRef?: Ref<HTMLDivElement>;
  /** Document direction for RTL handling. */
  dir?: 'ltr' | 'rtl';
  children?: ReactNode;
}

const scrollbarBase =
  'flex touch-none select-none p-[2px] transition-colors duration-(--duration-micro)';
const thumbBase =
  'relative flex-1 rounded-full bg-text-muted/40 hover:bg-text-muted/60 before:absolute before:inset-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-[""]';

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  {
    type = 'hover',
    orientation = 'vertical',
    scrollHideDelay = 600,
    className,
    viewportClassName,
    viewportRef,
    children,
    ...props
  },
  ref,
) {
  const showVertical = orientation === 'vertical' || orientation === 'both';
  const showHorizontal = orientation === 'horizontal' || orientation === 'both';

  return (
    <RadixScrollArea.Root
      ref={ref}
      type={type}
      scrollHideDelay={scrollHideDelay}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <RadixScrollArea.Viewport
        ref={viewportRef}
        className={cn('h-full w-full rounded-[inherit]', viewportClassName)}
      >
        {children}
      </RadixScrollArea.Viewport>
      {showVertical && (
        <RadixScrollArea.Scrollbar
          orientation="vertical"
          className={cn(scrollbarBase, 'bg-panel-2/40 hover:bg-panel-2/80 h-full w-[10px]')}
        >
          <RadixScrollArea.Thumb className={thumbBase} />
        </RadixScrollArea.Scrollbar>
      )}
      {showHorizontal && (
        <RadixScrollArea.Scrollbar
          orientation="horizontal"
          className={cn(
            scrollbarBase,
            'bg-panel-2/40 hover:bg-panel-2/80 h-[10px] w-full flex-col',
          )}
        >
          <RadixScrollArea.Thumb className={thumbBase} />
        </RadixScrollArea.Scrollbar>
      )}
      {orientation === 'both' && <RadixScrollArea.Corner className="bg-panel-2/60" />}
    </RadixScrollArea.Root>
  );
});

ScrollArea.displayName = 'ScrollArea';
