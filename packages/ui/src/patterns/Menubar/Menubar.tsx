import * as RadixMenubar from '@radix-ui/react-menubar';
import { forwardRef, type FC, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

/**
 * Menubar — desktop-style horizontal menu strip (File, Edit, View, …) built on
 * Radix Menubar. Owns ARIA + keyboard semantics; ShipIt owns styling.
 *
 * Compose with `<MenubarMenu>` per top-level entry. Inside each menu use
 * `<MenubarTrigger>` (the visible button), `<MenubarContent>` (the dropdown),
 * and `<MenuItem>` / `<MenuSeparator>` from the existing primitive surface.
 */

export const Menubar = forwardRef<HTMLDivElement, RadixMenubar.MenubarProps>(function Menubar(
  { className, ...props },
  ref,
) {
  return (
    <RadixMenubar.Root
      ref={ref}
      className={cn(
        'border-border bg-panel flex h-[30px] items-center gap-[2px] border-b px-3',
        className,
      )}
      {...props}
    />
  );
});

Menubar.displayName = 'Menubar';

export const MenubarMenu: FC<RadixMenubar.MenubarMenuProps> = RadixMenubar.Menu;

export const MenubarTrigger = forwardRef<HTMLButtonElement, RadixMenubar.MenubarTriggerProps>(
  function MenubarTrigger({ className, ...props }, ref) {
    return (
      <RadixMenubar.Trigger
        ref={ref}
        className={cn(
          'text-text cursor-pointer rounded-xs border-0 bg-transparent px-[10px] py-1 text-[12px] outline-none',
          'transition-colors duration-(--duration-micro)',
          'data-[state=open]:bg-panel-2 hover:bg-panel-2',
          'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
          className,
        )}
        {...props}
      />
    );
  },
);

MenubarTrigger.displayName = 'MenubarTrigger';

export const MenubarContent = forwardRef<HTMLDivElement, RadixMenubar.MenubarContentProps>(
  function MenubarContent({ className, sideOffset = 6, align = 'start', ...props }, ref) {
    return (
      <RadixMenubar.Portal>
        <RadixMenubar.Content
          ref={ref}
          sideOffset={sideOffset}
          align={align}
          className={cn(
            'border-border-strong bg-panel z-40 min-w-[180px] rounded-md border p-1 shadow-lg outline-none',
            'data-[state=open]:animate-[ship-pop-in_140ms_var(--easing-out)]',
            className,
          )}
          {...props}
        />
      </RadixMenubar.Portal>
    );
  },
);

MenubarContent.displayName = 'MenubarContent';

const itemBase = cn(
  'flex items-center gap-2 rounded-sm px-[10px] py-[6px] text-[12px] cursor-pointer outline-none',
  'data-[highlighted]:bg-panel-2',
  'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
);

export interface MenubarItemProps extends RadixMenubar.MenubarItemProps {
  /** Trailing hint — typically a kbd shortcut. */
  trailing?: ReactNode;
  /** Style as destructive (red). */
  destructive?: boolean;
}

export const MenubarItem = forwardRef<HTMLDivElement, MenubarItemProps>(function MenubarItem(
  { trailing, destructive, className, children, ...props },
  ref,
) {
  return (
    <RadixMenubar.Item
      ref={ref}
      className={cn(itemBase, destructive ? 'text-err' : 'text-text', className)}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {trailing && <span className="text-text-dim font-mono text-[10px]">{trailing}</span>}
    </RadixMenubar.Item>
  );
});

MenubarItem.displayName = 'MenubarItem';

export const MenubarSeparator = forwardRef<HTMLDivElement, RadixMenubar.MenubarSeparatorProps>(
  function MenubarSeparator({ className, ...props }, ref) {
    return (
      <RadixMenubar.Separator
        ref={ref}
        className={cn('bg-border my-1 h-px', className)}
        {...props}
      />
    );
  },
);

MenubarSeparator.displayName = 'MenubarSeparator';
