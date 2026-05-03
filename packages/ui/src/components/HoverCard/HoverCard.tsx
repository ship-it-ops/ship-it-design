'use client';

import * as RadixHoverCard from '@radix-ui/react-hover-card';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export const HoverCardRoot = RadixHoverCard.Root;
export const HoverCardTrigger = RadixHoverCard.Trigger;
export const HoverCardPortal = RadixHoverCard.Portal;

export const HoverCardContent = forwardRef<HTMLDivElement, RadixHoverCard.HoverCardContentProps>(
  function HoverCardContent({ className, sideOffset = 4, ...props }, ref) {
    return (
      <RadixHoverCard.Portal>
        <RadixHoverCard.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'rounded-base bg-panel border-border-strong z-popover border p-[14px] shadow-lg outline-none',
            'data-[state=open]:animate-[ship-pop-in_140ms_var(--easing-out)]',
            className,
          )}
          {...props}
        />
      </RadixHoverCard.Portal>
    );
  },
);

HoverCardContent.displayName = 'HoverCardContent';

export interface HoverCardProps extends RadixHoverCard.HoverCardProps {
  trigger: ReactNode;
  content: ReactNode;
}

/** Convenience wrapper — pass `trigger` and `content` as props. */
export function HoverCard({ trigger, content, ...rootProps }: HoverCardProps) {
  return (
    <RadixHoverCard.Root openDelay={200} closeDelay={120} {...rootProps}>
      <RadixHoverCard.Trigger asChild>{trigger}</RadixHoverCard.Trigger>
      <HoverCardContent>{content}</HoverCardContent>
    </RadixHoverCard.Root>
  );
}
