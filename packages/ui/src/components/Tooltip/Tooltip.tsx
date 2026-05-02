import * as RadixTooltip from '@radix-ui/react-tooltip';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Tooltip — small, transient label that appears on hover/focus.
 *
 * Wrap your app once in `<TooltipProvider>` (Radix's provider) for shared delay
 * configuration; a single tooltip can be used standalone via `<Tooltip>` shorthand.
 */

export const TooltipProvider = RadixTooltip.Provider;
export const TooltipRoot = RadixTooltip.Root;
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
            'pointer-events-none z-[60] rounded-sm px-2 py-[5px] text-[11px] whitespace-nowrap',
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

export interface TooltipProps {
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
 * One-liner tooltip wrapper. Wraps a trigger child with the full Radix stack.
 * For composition (multiple triggers in a list), use the lower-level exports.
 */
export function Tooltip({ content, children, side = 'top', delayDuration = 400 }: TooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
