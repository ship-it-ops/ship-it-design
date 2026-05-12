'use client';

import { cn } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * NotifRow — single row in the mobile Inbox / notification list. Shows an
 * unread dot (tone-colored), a tight title + body block, and a right-aligned
 * relative time. Pair with `isFirst` / `isLast` props from a parent list
 * wrapper to round the corners of the group like an iOS grouped list.
 *
 * No desktop sibling — desktop uses the standard `Notifications` flyout
 * inside CommandPalette. This composite is mobile-only and lives under
 * `packages/shipit/src/notifications/`.
 */

export type NotifTone = 'ok' | 'warn' | 'err' | 'neutral';

export interface NotifRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Bold first-line summary. */
  title: ReactNode;
  /** One-line body underneath. Truncates to a single line for now. */
  body?: ReactNode;
  /** Right-aligned relative time string (e.g. `9:32`, `Mon`). */
  time?: ReactNode;
  /** Coloring of the unread dot. */
  tone?: NotifTone;
  /** When true, render the unread dot. */
  unread?: boolean;
  /** Round the top corners — set when this is the first row in a group. */
  isFirst?: boolean;
  /** Round the bottom corners — set when this is the last row in a group. */
  isLast?: boolean;
  /** Make the whole row tappable; pair with `onClick`. */
  href?: string;
}

const toneClass: Record<NotifTone, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  err: 'bg-err',
  neutral: 'bg-accent-text',
};

export const NotifRow = forwardRef<HTMLDivElement, NotifRowProps>(function NotifRow(
  {
    title,
    body,
    time,
    tone = 'neutral',
    unread,
    isFirst,
    isLast,
    href,
    className,
    onClick,
    ...props
  },
  ref,
) {
  // Padding/border arrangement mirrors the iOS grouped list aesthetic from the
  // Mobile Library: every row has full-width borders, the first/last rows
  // round their leading/trailing corners so the group reads as a single card.
  const content = (
    <>
      <div className="pt-1" aria-hidden>
        <div
          className={cn('h-2 w-2 rounded-full', unread ? toneClass[tone] : 'bg-border-strong')}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="truncate text-[14px] font-medium tracking-tight">{title}</div>
          {time != null && (
            <span className="text-text-muted shrink-0 font-mono text-[11px] whitespace-nowrap">
              {time}
            </span>
          )}
        </div>
        {body && <div className="text-text-muted mt-[3px] text-[13px] leading-tight">{body}</div>}
      </div>
    </>
  );

  const baseClass = cn(
    'flex gap-3 p-[14px] bg-panel border-border border-l border-r',
    isFirst ? 'border-t rounded-t-m-card' : '',
    'border-b',
    isLast ? 'rounded-b-m-card' : '',
    href || onClick ? 'cursor-pointer hover:bg-panel-2' : '',
    className,
  );

  if (href) {
    return (
      <a
        // Same cast pattern as the `<button>` branch below: `forwardRef` types
        // this component for `HTMLDivElement` (the default-render case), but
        // when we swap to `<a>` the ref slot expects `HTMLAnchorElement`. The
        // `{...props}` spread carries forwarded HTML attributes — `id`,
        // `data-*`, `aria-*`, `onFocus`, etc. — that consumers pass to the
        // polymorphic root.
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(
          baseClass,
          'text-text focus-visible:ring-accent-dim no-underline outline-none focus-visible:ring-[3px]',
        )}
        {...(props as React.HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  // When the row is tappable but not a link, render as a <button> so keyboard
  // (Enter/Space) activation comes for free — otherwise a non-link, non-button
  // <div onClick> trips axe's `click-events-have-key-events` rule.
  if (onClick) {
    return (
      <button
        type="button"
        // `forwardRef` types this component for `HTMLDivElement` (the default
        // rendering); when we swap to `<button>` for the tappable variant the
        // ref slot expects `HTMLButtonElement`. Cast through `unknown` because
        // these two element types don't overlap. `{...props}` carries
        // forwarded HTML attributes — `id`, `data-*`, `aria-*`, etc.
        ref={ref as unknown as React.Ref<HTMLButtonElement>}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
        className={cn(
          baseClass,
          'focus-visible:ring-accent-dim text-left outline-none focus-visible:ring-[3px]',
        )}
        {...(props as React.HTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <div ref={ref} className={baseClass} {...props}>
      {content}
    </div>
  );
});

NotifRow.displayName = 'NotifRow';
