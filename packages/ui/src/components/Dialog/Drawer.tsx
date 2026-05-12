'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

import { DialogOverlay, DialogPortal, DialogRoot } from './Dialog';

export type DrawerSide = 'left' | 'right' | 'bottom';

export interface DrawerProps extends RadixDialog.DialogProps {
  /** Side the drawer slides in from. */
  side?: DrawerSide;
  /** Title rendered in the drawer header (with built-in close button). */
  title?: ReactNode;
  /**
   * Width override. Defaults to 420 for left/right sides; ignored for `bottom`
   * (a bottom sheet always spans the full viewport width).
   */
  width?: number | string;
  /**
   * Height override for the `bottom` side. Pass a number (px) or any CSS length
   * (e.g. `'85vh'`). Defaults to `'85vh'` — leaves a 15vh peek of the underlying
   * surface, matching iOS bottom-sheet conventions.
   */
  height?: number | string;
  /**
   * Show the drag-handle pill at the top of the sheet. Defaults to `true` for
   * `side="bottom"`, ignored for left/right. The handle is visual only — full
   * gesture-driven dismissal is left to consumer code (Radix Dialog already
   * handles ESC, overlay click, and focus trap).
   */
  handle?: boolean;
  children?: ReactNode;
}

const sideClasses: Record<DrawerSide, string> = {
  left: 'top-0 bottom-0 left-0 border-r border-border-strong data-[state=open]:animate-[ship-slide-in-left_220ms_var(--easing-out)]',
  right:
    'top-0 bottom-0 right-0 border-l border-border-strong data-[state=open]:animate-[ship-slide-in-right_220ms_var(--easing-out)]',
  bottom:
    'bottom-0 left-0 right-0 border-t border-border-strong rounded-t-m-sheet data-[state=open]:animate-[ship-slide-in-bottom_240ms_var(--easing-out)]',
};

const DrawerHeader = ({ title, onClose }: { title: ReactNode; onClose?: () => void }) => (
  <div className="border-border flex items-center justify-between border-b p-[16px] px-5">
    <RadixDialog.Title className="text-[14px] font-medium">{title}</RadixDialog.Title>
    <RadixDialog.Close
      onClick={onClose}
      aria-label="Close"
      className="text-text-dim hover:text-text p-1 text-[18px] leading-none"
    >
      ×
    </RadixDialog.Close>
  </div>
);

const SheetHeader = ({ title }: { title: ReactNode }) => (
  <div className="px-5 pb-3">
    <RadixDialog.Title className="text-m-body-lg font-semibold tracking-tight">
      {title}
    </RadixDialog.Title>
  </div>
);

const DragHandle = () => (
  <div className="flex justify-center pt-3 pb-2" aria-hidden>
    <span className="bg-border-strong h-1 w-9 rounded-full" />
  </div>
);

/**
 * Side-panel overlay. Same focus-trap + ESC + backdrop semantics as Dialog,
 * just slid in from the side.
 *
 * `side="bottom"` produces a mobile bottom sheet: full-width, rounded top
 * corners (`--radius-m-sheet`), slide-up animation, and an optional drag
 * handle (`handle`, defaults to `true`).
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { side = 'right', title, width = 420, height = '85vh', handle, children, ...rootProps },
  ref,
) {
  const isBottom = side === 'bottom';
  const showHandle = isBottom && (handle ?? true);
  const dimensionStyle = isBottom ? { height } : { width };

  return (
    <DialogRoot {...rootProps}>
      <DialogPortal>
        <DialogOverlay />
        <RadixDialog.Content
          ref={ref}
          aria-describedby={undefined}
          className={cn(
            'bg-panel z-modal fixed flex flex-col shadow-lg outline-none',
            sideClasses[side],
          )}
          style={dimensionStyle}
        >
          {showHandle && <DragHandle />}
          {title ? (
            isBottom ? (
              <SheetHeader title={title} />
            ) : (
              <DrawerHeader title={title} />
            )
          ) : (
            <RadixDialog.Title className="sr-only">
              {isBottom ? 'Sheet' : 'Drawer'}
            </RadixDialog.Title>
          )}
          <div className={cn('flex-1 overflow-auto', isBottom ? 'px-5 pb-6' : 'p-5')}>
            {children}
          </div>
        </RadixDialog.Content>
      </DialogPortal>
    </DialogRoot>
  );
});

Drawer.displayName = 'Drawer';
