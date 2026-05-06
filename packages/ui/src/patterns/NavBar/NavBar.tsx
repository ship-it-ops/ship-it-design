'use client';

import * as RadixNav from '@radix-ui/react-navigation-menu';
import {
  forwardRef,
  useCallback,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Drawer } from '../../components/Dialog/Drawer';
import { cn } from '../../utils/cn';
import { NavItem } from '../Sidebar/Sidebar';

/**
 * NavBar — primary app navigation. The same component renders either as a
 * horizontal top bar (`orientation="horizontal"`) or as a vertical side rail
 * (`orientation="vertical"`); both layouts are driven by the same `items`
 * tree. Items can carry nested `children` to produce dropdowns on
 * horizontal and expand-collapse groups on vertical. Below `md` the bar
 * collapses to a hamburger that opens a Drawer rendering the items
 * vertically (set `responsive={false}` to opt out).
 *
 * Active state can be controlled (`value` + `onValueChange`) or uncontrolled
 * (`defaultValue`). Items with an `href` render as anchors; otherwise as
 * buttons that fire `onValueChange`.
 */

export interface NavBarItem {
  /** Stable identifier — what `value` / `onValueChange` reference. */
  id: string;
  label: ReactNode;
  /** Optional left-of-label icon node. */
  icon?: ReactNode;
  /** When set, item renders as an `<a>`; otherwise as a `<button>`. */
  href?: string;
  /** Trailing badge text. */
  badge?: ReactNode;
  disabled?: boolean;
  /** Nested items — dropdowns on horizontal, expand-groups on vertical. */
  children?: NavBarItem[];
}

export type NavBarOrientation = 'horizontal' | 'vertical';

export interface NavBarProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'title'> {
  /** Layout direction. Default `'horizontal'`. */
  orientation?: NavBarOrientation;
  /** Item tree driving the bar. */
  items: NavBarItem[];
  /** Brand / logo slot rendered at the start. */
  brand?: ReactNode;
  /** Trailing slot for secondary actions (avatar, settings, theme toggle, …). */
  actions?: ReactNode;
  /** Controlled active item id. */
  value?: string;
  /** Uncontrolled initial active item id. */
  defaultValue?: string;
  /** Fired when an item is activated. */
  onValueChange?: (id: string) => void;
  /** Pixel width of the vertical rail. Default 240. */
  width?: number;
  /** Collapse to a hamburger drawer below `md`. Default `true`. */
  responsive?: boolean;
}

/** Walks the tree to find whether `activeId` is `item` or any descendant. */
function isActiveTree(item: NavBarItem, activeId: string | undefined): boolean {
  if (item.id === activeId) return true;
  return item.children?.some((c) => isActiveTree(c, activeId)) ?? false;
}

export const NavBar = forwardRef<HTMLElement, NavBarProps>(function NavBar(
  {
    orientation = 'horizontal',
    items,
    brand,
    actions,
    value,
    defaultValue,
    onValueChange,
    width = 240,
    responsive = true,
    className,
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const activeId = isControlled ? value : internalValue;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const select = useCallback(
    (id: string) => {
      if (!isControlled) setInternalValue(id);
      onValueChange?.(id);
    },
    [isControlled, onValueChange],
  );

  const handleItemActivate = useCallback(
    (id: string) => {
      select(id);
      setDrawerOpen(false);
    },
    [select],
  );

  const drawerBody = (
    <nav aria-label="Navigation" className="flex flex-col gap-1">
      {items.map((item) => (
        <VerticalItem
          key={item.id}
          item={item}
          activeId={activeId}
          onActivate={handleItemActivate}
        />
      ))}
    </nav>
  );

  // The mobile fallback is intentionally a <div>, not a <header>. The
  // desktop layout (rendered alongside, hidden via media query) already
  // owns the `banner` landmark — two co-existing <header>s in the DOM
  // would trip axe's `landmark-no-duplicate-banner` rule even though only
  // one is visible at a time.
  const mobileBar = responsive ? (
    <div
      className={cn(
        'border-border bg-panel z-overlay sticky top-0 flex h-[52px] items-center gap-4 border-b px-5 md:hidden',
      )}
    >
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open navigation"
        className="text-text-muted hover:text-text focus-visible:ring-accent-dim rounded-xs px-2 py-1 text-[18px] outline-none focus-visible:ring-[3px]"
      >
        ☰
      </button>
      {brand && <div className="flex flex-1 items-center text-[13px] font-medium">{brand}</div>}
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  ) : null;

  if (orientation === 'horizontal') {
    return (
      <>
        {mobileBar}
        <header
          ref={ref as React.Ref<HTMLElement>}
          className={cn(
            'border-border bg-panel flex h-[52px] items-center gap-4 border-b px-5',
            responsive && 'hidden md:flex',
            className,
          )}
          {...props}
        >
          {brand && <div className="text-[13px] font-medium">{brand}</div>}
          <RadixNav.Root className="relative flex-1" delayDuration={120}>
            <RadixNav.List className="flex items-center gap-1">
              {items.map((item) =>
                item.children?.length ? (
                  <HorizontalDropdown
                    key={item.id}
                    item={item}
                    active={isActiveTree(item, activeId)}
                    activeId={activeId}
                    onActivate={handleItemActivate}
                  />
                ) : (
                  <RadixNav.Item key={item.id}>
                    <HorizontalLink
                      item={item}
                      active={item.id === activeId}
                      onActivate={handleItemActivate}
                    />
                  </RadixNav.Item>
                ),
              )}
            </RadixNav.List>
            <div className="z-popover absolute top-full left-0 flex justify-start">
              <RadixNav.Viewport className="origin-top-left data-[state=open]:animate-[ship-fade-in_120ms_var(--easing-out)]" />
            </div>
          </RadixNav.Root>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>
        {responsive && (
          <Drawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            side="left"
            title={brand ?? 'Navigation'}
            width={300}
          >
            {drawerBody}
          </Drawer>
        )}
      </>
    );
  }

  return (
    <>
      {mobileBar}
      <aside
        ref={ref as React.Ref<HTMLElement>}
        style={{ width }}
        className={cn(
          'border-border bg-panel flex h-full flex-col gap-2 border-r p-[14px]',
          responsive && 'hidden md:flex',
          className,
        )}
        {...props}
      >
        {brand && <div className="px-2 py-1 text-[13px] font-medium">{brand}</div>}
        <nav aria-label="Navigation" className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {items.map((item) => (
            <VerticalItem
              key={item.id}
              item={item}
              activeId={activeId}
              onActivate={handleItemActivate}
            />
          ))}
        </nav>
        {actions && (
          <div className="border-border mt-auto flex flex-col gap-2 border-t pt-3">{actions}</div>
        )}
      </aside>
      {responsive && (
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          side="left"
          title={brand ?? 'Navigation'}
          width={300}
        >
          {drawerBody}
        </Drawer>
      )}
    </>
  );
});

NavBar.displayName = 'NavBar';

// ---------- Internal sub-components ----------

interface HorizontalLinkProps {
  item: NavBarItem;
  active: boolean;
  onActivate: (id: string) => void;
}

function HorizontalLink({ item, active, onActivate }: HorizontalLinkProps) {
  const baseClass = cn(
    'flex items-center gap-[6px] rounded-xs px-3 py-[6px] text-[13px] outline-none',
    'transition-colors duration-(--duration-micro)',
    'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
    active ? 'bg-accent-dim text-accent' : 'text-text hover:bg-panel-2',
    item.disabled && 'pointer-events-none opacity-50',
  );
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    onActivate(item.id);
  };
  const inner = (
    <>
      {item.icon != null && (
        <span aria-hidden className="opacity-80">
          {item.icon}
        </span>
      )}
      <span>{item.label}</span>
      {item.badge != null && <ItemBadge active={active}>{item.badge}</ItemBadge>}
    </>
  );

  if (item.href) {
    return (
      <RadixNav.Link asChild active={active}>
        <a
          href={item.href}
          aria-current={active ? 'page' : undefined}
          aria-disabled={item.disabled || undefined}
          className={baseClass}
          onClick={handleClick}
        >
          {inner}
        </a>
      </RadixNav.Link>
    );
  }
  return (
    <RadixNav.Link asChild active={active}>
      <button
        type="button"
        aria-current={active ? 'page' : undefined}
        disabled={item.disabled}
        className={baseClass}
        onClick={handleClick}
      >
        {inner}
      </button>
    </RadixNav.Link>
  );
}

interface HorizontalDropdownProps {
  item: NavBarItem;
  active: boolean;
  activeId: string | undefined;
  onActivate: (id: string) => void;
}

function HorizontalDropdown({ item, active, activeId, onActivate }: HorizontalDropdownProps) {
  return (
    <RadixNav.Item>
      <RadixNav.Trigger
        className={cn(
          'flex items-center gap-1 rounded-xs px-3 py-[6px] text-[13px] outline-none',
          'transition-colors duration-(--duration-micro)',
          'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
          active ? 'bg-accent-dim text-accent' : 'text-text hover:bg-panel-2',
          'data-[state=open]:bg-panel-2',
        )}
        disabled={item.disabled}
      >
        {item.icon != null && (
          <span aria-hidden className="opacity-80">
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
        <span
          aria-hidden
          className="ml-1 text-[10px] opacity-70 transition-transform data-[state=open]:rotate-180"
        >
          ▾
        </span>
      </RadixNav.Trigger>
      <RadixNav.Content className="border-border bg-panel min-w-[220px] rounded-xs border p-2 shadow-lg">
        <ul className="flex flex-col gap-[2px]">
          {item.children!.map((child) => (
            <li key={child.id}>
              <DropdownLink item={child} active={child.id === activeId} onActivate={onActivate} />
            </li>
          ))}
        </ul>
      </RadixNav.Content>
    </RadixNav.Item>
  );
}

function DropdownLink({ item, active, onActivate }: HorizontalLinkProps) {
  const baseClass = cn(
    'flex w-full items-center gap-2 rounded-xs px-2 py-[6px] text-left text-[13px] outline-none',
    'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
    active ? 'bg-accent-dim text-accent' : 'text-text hover:bg-panel-2',
    item.disabled && 'pointer-events-none opacity-50',
  );
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    onActivate(item.id);
  };
  const inner = (
    <>
      {item.icon != null && (
        <span aria-hidden className="opacity-80">
          {item.icon}
        </span>
      )}
      <span className="flex-1">{item.label}</span>
      {item.badge != null && <ItemBadge active={active}>{item.badge}</ItemBadge>}
    </>
  );
  if (item.href) {
    return (
      <RadixNav.Link asChild active={active}>
        <a
          href={item.href}
          aria-current={active ? 'page' : undefined}
          aria-disabled={item.disabled || undefined}
          className={baseClass}
          onClick={handleClick}
        >
          {inner}
        </a>
      </RadixNav.Link>
    );
  }
  return (
    <RadixNav.Link asChild active={active}>
      <button
        type="button"
        aria-current={active ? 'page' : undefined}
        disabled={item.disabled}
        className={baseClass}
        onClick={handleClick}
      >
        {inner}
      </button>
    </RadixNav.Link>
  );
}

interface VerticalItemProps {
  item: NavBarItem;
  activeId: string | undefined;
  onActivate: (id: string) => void;
}

function VerticalItem({ item, activeId, onActivate }: VerticalItemProps) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const treeActive = isActiveTree(item, activeId);
  // Default the group to expanded when a descendant is active; otherwise
  // collapsed. Consumers who want different behavior can rebuild the tree.
  const [open, setOpen] = useState(treeActive);

  if (!hasChildren) {
    const handleClick = (e: MouseEvent<HTMLElement>) => {
      // Always notify; let the link navigate naturally when href is set.
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      onActivate(item.id);
    };
    return (
      <NavItem
        icon={item.icon}
        label={item.label}
        active={item.id === activeId}
        badge={item.badge}
        disabled={item.disabled}
        href={item.href}
        onClick={handleClick}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        disabled={item.disabled}
        className={cn(
          'flex w-full items-center gap-[10px] rounded-xs px-2 py-[6px] text-left text-[13px] outline-none',
          'transition-colors duration-(--duration-micro)',
          'focus-visible:ring-accent-dim focus-visible:ring-[3px]',
          treeActive ? 'text-text' : 'text-text-muted',
          'hover:bg-panel-2',
          item.disabled && 'pointer-events-none opacity-50',
        )}
      >
        {item.icon != null && (
          <span aria-hidden className="w-[14px] text-center opacity-80">
            {item.icon}
          </span>
        )}
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge != null && <ItemBadge active={treeActive}>{item.badge}</ItemBadge>}
        <span aria-hidden className="text-[10px] opacity-60">
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <div className="border-border mt-1 ml-[18px] flex flex-col gap-[2px] border-l pl-3">
          {item.children!.map((child) => (
            <VerticalItem key={child.id} item={child} activeId={activeId} onActivate={onActivate} />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemBadge({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        'rounded-xs px-[6px] py-px font-mono text-[10px]',
        active ? 'bg-accent text-on-accent' : 'bg-panel-2 text-text-muted',
      )}
    >
      {children}
    </span>
  );
}
