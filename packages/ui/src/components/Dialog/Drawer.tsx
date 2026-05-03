'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

import { DialogOverlay, DialogPortal, DialogRoot } from './Dialog';

export type DrawerSide = 'left' | 'right';

export interface DrawerProps extends RadixDialog.DialogProps {
  /** Side the drawer slides in from. */
  side?: DrawerSide;
  /** Title rendered in the drawer header (with built-in close button). */
  title?: ReactNode;
  /** Width override. Defaults to 420. */
  width?: number | string;
  children?: ReactNode;
}

const sideClasses: Record<DrawerSide, string> = {
  left: 'left-0 border-r border-border-strong data-[state=open]:animate-[ship-slide-in-left_220ms_var(--easing-out)]',
  right:
    'right-0 border-l border-border-strong data-[state=open]:animate-[ship-slide-in-right_220ms_var(--easing-out)]',
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

/**
 * Side-panel overlay. Same focus-trap + ESC + backdrop semantics as Dialog,
 * just slid in from the side.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { side = 'right', title, width = 420, children, ...rootProps },
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
            'bg-panel z-modal fixed top-0 bottom-0 flex flex-col shadow-lg outline-none',
            sideClasses[side],
          )}
          style={{ width }}
        >
          {title ? (
            <DrawerHeader title={title} />
          ) : (
            <RadixDialog.Title className="sr-only">Drawer</RadixDialog.Title>
          )}
          <div className="flex-1 overflow-auto p-5">{children}</div>
        </RadixDialog.Content>
      </DialogPortal>
    </DialogRoot>
  );
});

Drawer.displayName = 'Drawer';
