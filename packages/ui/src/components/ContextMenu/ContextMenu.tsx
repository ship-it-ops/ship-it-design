import * as RadixContext from '@radix-ui/react-context-menu';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export const ContextMenuRoot = RadixContext.Root;
export const ContextMenuTrigger = RadixContext.Trigger;
export const ContextMenuPortal = RadixContext.Portal;

export const ContextMenuContent = forwardRef<HTMLDivElement, RadixContext.ContextMenuContentProps>(
  function ContextMenuContent({ className, ...props }, ref) {
    return (
      <RadixContext.Portal>
        <RadixContext.Content
          ref={ref}
          className={cn(
            'bg-panel border-border-strong z-40 min-w-[180px] rounded-md border p-1 shadow-lg outline-none',
            'data-[state=open]:animate-[ship-pop-in_140ms_var(--easing-out)]',
            className,
          )}
          {...props}
        />
      </RadixContext.Portal>
    );
  },
);

const itemBase = cn(
  'flex items-center gap-2 px-[10px] py-[6px] rounded-sm text-[12px] cursor-pointer outline-none',
  'data-[highlighted]:bg-panel-2',
  'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
);

export interface ContextMenuItemProps extends RadixContext.ContextMenuItemProps {
  icon?: ReactNode;
  trailing?: ReactNode;
  destructive?: boolean;
}

export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  function ContextMenuItem({ icon, trailing, destructive, className, children, ...props }, ref) {
    return (
      <RadixContext.Item
        ref={ref}
        className={cn(itemBase, destructive ? 'text-err' : 'text-text', className)}
        {...props}
      >
        {icon && <span className="w-[14px] text-[12px] opacity-70">{icon}</span>}
        <span className="flex-1">{children}</span>
        {trailing && <span className="text-text-dim font-mono text-[10px]">{trailing}</span>}
      </RadixContext.Item>
    );
  },
);

export const ContextMenuSeparator = forwardRef<
  HTMLDivElement,
  RadixContext.ContextMenuSeparatorProps
>(function ContextMenuSeparator({ className, ...props }, ref) {
  return (
    <RadixContext.Separator
      ref={ref}
      className={cn('bg-border my-1 h-[1px]', className)}
      {...props}
    />
  );
});

export const ContextMenu = RadixContext.Root;
