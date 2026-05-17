'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Tooltip — small, transient label that appears on hover/focus.
 *
 * Two surfaces:
 *
 * - `<SimpleTooltip content="…">` is the one-liner. Pass a `content` prop and a
 *   single trigger child; it bundles its own `TooltipProvider`. Use this for
 *   ad-hoc tooltips on icon buttons and standalone widgets.
 * - `<Tooltip>` is the Radix root for composition. Pair it with
 *   `<TooltipTrigger>` and `<TooltipContent>` and wrap your subtree in a
 *   shared `<TooltipProvider>` when you have many tooltips that should share
 *   delay configuration (lists, toolbars, command palettes).
 *
 * Naming follows the rest of this library (`Dialog`, `Popover`, …): the root
 * component takes the unqualified name; convenience helpers carry a
 * qualifying prefix.
 */

export const TooltipProvider = RadixTooltip.Provider;
export const Tooltip = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;
export const TooltipPortal = RadixTooltip.Portal;
export const TooltipArrow = RadixTooltip.Arrow;

export const TooltipContent = forwardRef<HTMLDivElement, RadixTooltip.TooltipContentProps>(
  function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
    return (
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'z-tooltip pointer-events-none rounded-sm px-2 py-[5px] text-[11px] whitespace-nowrap',
            'bg-text text-bg',
            'data-[state=delayed-open]:animate-[ship-pop-in_120ms_var(--easing-out)]',
            className,
          )}
          {...props}
        />
      </RadixTooltip.Portal>
    );
  },
);

TooltipContent.displayName = 'TooltipContent';

export interface SimpleTooltipProps {
  /** Tooltip text/content. */
  content: ReactNode;
  /** Trigger element — usually a Button or IconButton. */
  children: ReactNode;
  /** Side: top (default) | right | bottom | left. */
  side?: RadixTooltip.TooltipContentProps['side'];
  /** Open/close delay in ms (overrides provider default). */
  delayDuration?: number;
}

/**
 * One-liner tooltip — bundles its own `TooltipProvider`. For composition
 * (multiple triggers in a list, shared delay config), use the lower-level
 * `Tooltip` + `TooltipTrigger` + `TooltipContent` primitives.
 */
export function SimpleTooltip({
  content,
  children,
  side = 'top',
  delayDuration = 400,
}: SimpleTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
