'use client';

import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

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
    children,
    ...props
  },
  ref,
) {
  const showVertical = orientation === 'vertical' || orientation === 'both';
  const showHorizontal = orientation === 'horizontal' || orientation === 'both';

  return (
    <RadixScrollArea.Root
      type={type}
      scrollHideDelay={scrollHideDelay}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <RadixScrollArea.Viewport
        ref={ref}
        className={cn('h-full w-full rounded-[inherit]', viewportClassName)}
      >
        {children}
      </RadixScrollArea.Viewport>
      {showVertical && (
        <RadixScrollArea.Scrollbar
          orientation="vertical"
          className={cn(scrollbarBase, 'h-full w-[10px] bg-panel-2/40 hover:bg-panel-2/80')}
        >
          <RadixScrollArea.Thumb className={thumbBase} />
        </RadixScrollArea.Scrollbar>
      )}
      {showHorizontal && (
        <RadixScrollArea.Scrollbar
          orientation="horizontal"
          className={cn(scrollbarBase, 'h-[10px] w-full flex-col bg-panel-2/40 hover:bg-panel-2/80')}
        >
          <RadixScrollArea.Thumb className={thumbBase} />
        </RadixScrollArea.Scrollbar>
      )}
      {orientation === 'both' && (
        <RadixScrollArea.Corner className="bg-panel-2/60" />
      )}
    </RadixScrollArea.Root>
  );
});

ScrollArea.displayName = 'ScrollArea';
