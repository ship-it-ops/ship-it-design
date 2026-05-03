'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

import { DialogOverlay, DialogPortal, DialogRoot } from './Dialog';

export interface SheetProps extends RadixDialog.DialogProps {
  /** Optional title rendered above the body. */
  title?: ReactNode;
  /** Width override. Defaults to `min(640px, 90vw)`. */
  width?: number | string;
  children?: ReactNode;
}

/**
 * Bottom sheet overlay. Slides up from the bottom edge of the viewport. Useful
 * for quick actions on mobile-leaning surfaces.
 */
export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  { title, width = 'min(640px, 90vw)', children, ...rootProps },
  ref,
) {
  return (
    <DialogRoot {...rootProps}>
      <DialogPortal>
        <DialogOverlay />
        <RadixDialog.Content
          ref={ref}
          aria-describedby={undefined}
          className={cn(
            'fixed bottom-0 left-1/2 z-modal -translate-x-1/2 p-5',
            'bg-panel border-border-strong rounded-tl-lg rounded-tr-lg border-t shadow-lg outline-none',
            'data-[state=open]:animate-[ship-slide-in-bottom_220ms_var(--easing-out)]',
          )}
          style={{ width }}
        >
          {title ? (
            <RadixDialog.Title className="mb-1 text-[15px] font-medium">{title}</RadixDialog.Title>
          ) : (
            <RadixDialog.Title className="sr-only">Sheet</RadixDialog.Title>
          )}
          {children}
        </RadixDialog.Content>
      </DialogPortal>
    </DialogRoot>
  );
});

Sheet.displayName = 'Sheet';
