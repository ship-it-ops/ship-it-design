import * as RadixAlert from '@radix-ui/react-alert-dialog';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Confirmation dialog. Stricter than Dialog: cannot be closed by clicking the
 * backdrop, requires an explicit cancel/confirm action.
 */

export const AlertDialogRoot = RadixAlert.Root;
export const AlertDialogTrigger = RadixAlert.Trigger;
export const AlertDialogAction = RadixAlert.Action;
export const AlertDialogCancel = RadixAlert.Cancel;

export interface AlertDialogProps extends RadixAlert.AlertDialogProps {
  title: ReactNode;
  description?: ReactNode;
  /** Confirm + cancel buttons or any custom footer slot. */
  footer?: ReactNode;
  width?: number | string;
}

export const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(function AlertDialog(
  { title, description, footer, width = 460, children, ...rootProps },
  ref,
) {
  return (
    <AlertDialogRoot {...rootProps}>
      <RadixAlert.Portal>
        <RadixAlert.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/55 backdrop-blur-[4px]',
            'data-[state=open]:animate-[ship-fade-in_150ms_ease]',
          )}
        />
        <RadixAlert.Content
          ref={ref}
          style={{ maxWidth: width }}
          className={cn(
            'fixed left-1/2 top-1/2 z-[51] -translate-x-1/2 -translate-y-1/2 w-[calc(100%-40px)] p-6',
            'bg-panel border border-border-strong rounded-lg shadow-lg outline-none',
            'data-[state=open]:animate-[ship-dialog-in_180ms_var(--easing-out)]',
          )}
        >
          <RadixAlert.Title
            className={cn('text-[16px] font-medium', description ? 'mb-[6px]' : 'mb-4')}
          >
            {title}
          </RadixAlert.Title>
          {description && (
            <RadixAlert.Description className="text-[13px] text-text-muted leading-[1.55] mb-[18px]">
              {description}
            </RadixAlert.Description>
          )}
          {children}
          {footer && <div className="mt-5 flex gap-2 justify-end">{footer}</div>}
        </RadixAlert.Content>
      </RadixAlert.Portal>
    </AlertDialogRoot>
  );
});
