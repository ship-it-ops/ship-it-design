'use client';

import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

export const DropdownMenuRoot = RadixMenu.Root;
export const DropdownMenuTrigger = RadixMenu.Trigger;
export const DropdownMenuPortal = RadixMenu.Portal;
export const DropdownMenuGroup = RadixMenu.Group;
export const DropdownMenuLabel = RadixMenu.Label;
export const DropdownMenuRadioGroup = RadixMenu.RadioGroup;

export const DropdownMenuContent = forwardRef<HTMLDivElement, RadixMenu.DropdownMenuContentProps>(
  function DropdownMenuContent({ className, sideOffset = 6, align = 'start', ...props }, ref) {
    return (
      <RadixMenu.Portal>
        <RadixMenu.Content
          ref={ref}
          sideOffset={sideOffset}
          align={align}
          className={cn(
            'bg-panel border-border-strong z-popover min-w-[180px] rounded-md border p-1 shadow-lg outline-none',
            'data-[state=open]:animate-[ship-pop-in_140ms_var(--easing-out)]',
            className,
          )}
          {...props}
        />
      </RadixMenu.Portal>
    );
  },
);

DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface MenuItemProps extends RadixMenu.DropdownMenuItemProps {
  /** Icon rendered to the left of the label. */
  icon?: ReactNode;
  /** Trailing hint — typically a kbd shortcut. */
  trailing?: ReactNode;
  /** Style as destructive (red). Doesn't change behavior. */
  destructive?: boolean;
}

const itemBase = cn(
  'flex items-center gap-2 px-[10px] py-[6px] rounded-sm text-[12px] cursor-pointer outline-none',
  'data-[highlighted]:bg-panel-2',
  'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed',
);

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
  { icon, trailing, destructive, className, children, ...props },
  ref,
) {
  return (
    <RadixMenu.Item
      ref={ref}
      className={cn(itemBase, destructive ? 'text-err' : 'text-text', className)}
      {...props}
    >
      {icon && <span className="w-[14px] text-[12px] opacity-70">{icon}</span>}
      <span className="flex-1">{children}</span>
      {trailing && <span className="text-text-dim font-mono text-[10px]">{trailing}</span>}
    </RadixMenu.Item>
  );
});

MenuItem.displayName = 'MenuItem';

export const MenuCheckboxItem = forwardRef<HTMLDivElement, RadixMenu.DropdownMenuCheckboxItemProps>(
  function MenuCheckboxItem({ className, children, ...props }, ref) {
    return (
      <RadixMenu.CheckboxItem
        ref={ref}
        className={cn(itemBase, 'text-text relative pl-[26px]', className)}
        {...props}
      >
        <RadixMenu.ItemIndicator className="text-accent absolute top-1/2 left-2 -translate-y-1/2 text-[10px]">
          ✓
        </RadixMenu.ItemIndicator>
        {children}
      </RadixMenu.CheckboxItem>
    );
  },
);

MenuCheckboxItem.displayName = 'MenuCheckboxItem';

export const MenuSeparator = forwardRef<HTMLDivElement, RadixMenu.DropdownMenuSeparatorProps>(
  function MenuSeparator({ className, ...props }, ref) {
    return (
      <RadixMenu.Separator
        ref={ref}
        className={cn('bg-border my-1 h-[1px]', className)}
        {...props}
      />
    );
  },
);

MenuSeparator.displayName = 'MenuSeparator';

/** Convenience export so consumers can `<DropdownMenu>...</DropdownMenu>`. */
export const DropdownMenu = RadixMenu.Root;
