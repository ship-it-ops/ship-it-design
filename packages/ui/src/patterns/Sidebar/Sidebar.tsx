'use client';

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../utils/cn';

/**
 * Sidebar — primary app navigation column. A simple flex column with the
 * panel background and a right border. Compose with `<NavItem>` and
 * `<NavSection>` for the standard ShipIt sidebar shape.
 */

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Width in pixels. Default 240. */
  width?: number;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { width = 240, className, style, ...props },
  ref,
) {
  return (
    <aside
      ref={ref}
      style={{ width, ...style }}
      className={cn(
        'border-border bg-panel flex h-full flex-col gap-2 border-r p-[14px]',
        className,
      )}
      {...props}
    />
  );
});

Sidebar.displayName = 'Sidebar';

type NavItemBaseProps = {
  /** Left-side glyph or icon node. */
  icon?: ReactNode;
  /** Visible label. */
  label: ReactNode;
  /** Highlights the row in the accent palette. */
  active?: boolean;
  /** Optional trailing badge text. */
  badge?: ReactNode;
  /** Disabled / read-only display. */
  disabled?: boolean;
};

export type NavItemProps = NavItemBaseProps &
  (
    | ({ href: string } & Omit<HTMLAttributes<HTMLAnchorElement>, keyof NavItemBaseProps>)
    | ({ href?: undefined } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        keyof NavItemBaseProps
      >)
  );

export const NavItem = forwardRef<HTMLAnchorElement | HTMLButtonElement, NavItemProps>(
  function NavItem({ icon, label, active, badge, href, disabled, className, ...props }, ref) {
    const inner = (
      <>
        {icon && (
          <span aria-hidden className="w-[14px] text-center opacity-80">
            {icon}
          </span>
        )}
        <span className="flex-1 truncate">{label}</span>
        {badge != null && (
          <span
            className={cn(
              'rounded-xs px-[6px] py-px font-mono text-[10px]',
              active ? 'bg-accent text-on-accent' : 'bg-panel-2 text-text-muted',
            )}
          >
            {badge}
          </span>
        )}
      </>
    );
    const baseClass = cn(
      'flex cursor-pointer items-center gap-[10px] rounded-xs px-2 py-[6px] text-[13px] outline-none',
      'transition-colors duration-(--duration-micro)',
      'focus-visible:ring-[3px] focus-visible:ring-accent-dim',
      active ? 'bg-accent-dim text-accent' : 'text-text hover:bg-panel-2',
      disabled && 'opacity-50 pointer-events-none',
      className,
    );
    if (href) {
      const anchorProps = props as HTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          className={baseClass}
          {...anchorProps}
        >
          {inner}
        </a>
      );
    }
    // No href — render a real <button> so Enter/Space activation, focus
    // semantics, and disabled handling come from the platform.
    const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-current={active ? 'page' : undefined}
        disabled={disabled}
        className={cn(baseClass, 'w-full text-left')}
        {...buttonProps}
      >
        {inner}
      </button>
    );
  },
);

NavItem.displayName = 'NavItem';

export interface NavSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Eyebrow heading. Rendered uppercase, mono, dim. */
  label: ReactNode;
  /** Optional trailing element next to the heading (e.g., a `+` add affordance). */
  action?: ReactNode;
}

export const NavSection = forwardRef<HTMLDivElement, NavSectionProps>(function NavSection(
  { label, action, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
      <div className="text-text-dim flex items-center px-2 pt-2 font-mono text-[9px] tracking-[1.4px] uppercase">
        <span className="flex-1">{label}</span>
        {action}
      </div>
      <div className="flex flex-col gap-[2px]">{children}</div>
    </div>
  );
});

NavSection.displayName = 'NavSection';
