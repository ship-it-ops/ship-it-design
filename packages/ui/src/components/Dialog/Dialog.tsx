import * as RadixDialog from '@radix-ui/react-dialog';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Modal dialog. Built on Radix Dialog so focus trap, ESC, and ARIA come for free.
 *
 * Two APIs:
 *   1. Composition: `<Dialog open={…}><DialogContent>…</DialogContent></Dialog>`
 *   2. Convenience: `<Dialog open={…} title="…" description="…" footer={…}>body</Dialog>`
 */

export const DialogRoot = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;
export const DialogPortal = RadixDialog.Portal;

export const DialogOverlay = forwardRef<HTMLDivElement, RadixDialog.DialogOverlayProps>(
  function DialogOverlay({ className, ...props }, ref) {
    return (
      <RadixDialog.Overlay
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 bg-black/55 backdrop-blur-[4px]',
          'data-[state=open]:animate-[ship-fade-in_150ms_ease]',
          className,
        )}
        {...props}
      />
    );
  },
);

export interface DialogContentProps extends RadixDialog.DialogContentProps {
  /** Pixel max-width of the panel. Defaults to 460. */
  width?: number | string;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { className, width = 460, style, children, ...props },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialog.Content
        ref={ref}
        className={cn(
          'fixed top-1/2 left-1/2 z-[51] w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 p-6',
          'bg-panel border-border-strong rounded-lg border shadow-lg',
          'data-[state=open]:animate-[ship-dialog-in_180ms_var(--easing-out)]',
          'outline-none',
          className,
        )}
        style={{ maxWidth: width, ...style }}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </DialogPortal>
  );
});

export interface DialogProps extends RadixDialog.DialogProps {
  /** Convenience: title rendered with proper heading semantics. */
  title?: ReactNode;
  /** Convenience: description rendered with proper a11y description. */
  description?: ReactNode;
  /** Footer slot — typically buttons. */
  footer?: ReactNode;
  /** Pixel max-width of the panel. */
  width?: number | string;
  /** When set, content is wrapped in a content frame; omit for full custom layout. */
  children?: ReactNode;
}

export function Dialog({ title, description, footer, width, children, ...rootProps }: DialogProps) {
  // If consumer passed only children, render in convenience mode.
  return (
    <DialogRoot {...rootProps}>
      <DialogContent width={width}>
        {title && (
          <RadixDialog.Title
            className={cn('text-[16px] font-medium', description ? 'mb-[6px]' : 'mb-4')}
          >
            {title}
          </RadixDialog.Title>
        )}
        {description && (
          <RadixDialog.Description className="text-text-muted mb-[18px] text-[13px] leading-[1.55]">
            {description}
          </RadixDialog.Description>
        )}
        {children}
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </DialogContent>
    </DialogRoot>
  );
}
