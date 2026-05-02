import * as RadixPopover from '@radix-ui/react-popover';
import { forwardRef } from 'react';

import { cn } from '../../utils/cn';

export const PopoverRoot = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;
export const PopoverPortal = RadixPopover.Portal;
export const PopoverClose = RadixPopover.Close;
export const PopoverArrow = RadixPopover.Arrow;

export const PopoverContent = forwardRef<HTMLDivElement, RadixPopover.PopoverContentProps>(
  function PopoverContent({ className, align = 'start', sideOffset = 6, ...props }, ref) {
    return (
      <RadixPopover.Portal>
        <RadixPopover.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'bg-panel border-border-strong z-40 rounded-md border p-[6px] shadow-lg outline-none',
            'data-[state=open]:animate-[ship-pop-in_140ms_var(--easing-out)]',
            className,
          )}
          {...props}
        />
      </RadixPopover.Portal>
    );
  },
);

PopoverContent.displayName = 'PopoverContent';

/**
 * Convenience export — the Radix Root with our default styles applied to Content.
 *
 *   <Popover>
 *     <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
 *     <PopoverContent>…</PopoverContent>
 *   </Popover>
 */
export const Popover = RadixPopover.Root;
