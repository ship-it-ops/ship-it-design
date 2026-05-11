'use client';

import { IconGlyph, type ConnectorName } from '@ship-it-ui/icons';
import { cn, formatRelative, StatusDot, type StatusState } from '@ship-it-ui/ui';
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

/**
 * ConnectorCard — integration card for "connector hubs". Renders a connector
 * logo (via `@ship-it-ui/icons` connector glyphs), the connector name, a
 * sync-state dot, a relative last-sync timestamp, an optional summary, and a
 * trailing action slot.
 *
 * When `onClick` is provided the whole card becomes a button; otherwise it
 * renders as a plain `<div>`.
 */

export type ConnectorStatus = 'connected' | 'syncing' | 'error' | 'disconnected';

export interface ConnectorCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'onClick'
> {
  /** Connector name keyed into `@ship-it-ui/icons` connectorGlyphs. */
  connector: ConnectorName | (string & {});
  /** Display name shown next to the logo. */
  name: ReactNode;
  /** Sync status. Drives the status dot tone + the default status label. */
  status: ConnectorStatus;
  /** Last successful sync timestamp. Formatted relative to `relativeNow`. */
  lastSyncedAt?: Date | string | number;
  /** Reference time for relative formatting (injectable for tests/SSR). */
  relativeNow?: Date;
  /** Free-text summary (e.g. "1,243 docs · 8 channels"). */
  summary?: ReactNode;
  /** Trailing action slot — typically a `Button` or `DropdownMenu` trigger. */
  actions?: ReactNode;
  /** Click handler. When provided, the card becomes a button. */
  onClick?: () => void;
}

const statusDot: Record<ConnectorStatus, StatusState> = {
  connected: 'ok',
  syncing: 'sync',
  error: 'err',
  disconnected: 'off',
};

const statusLabel: Record<ConnectorStatus, string> = {
  connected: 'Connected',
  syncing: 'Syncing',
  error: 'Error',
  disconnected: 'Disconnected',
};

export const ConnectorCard = forwardRef<HTMLDivElement, ConnectorCardProps>(function ConnectorCard(
  {
    connector,
    name,
    status,
    lastSyncedAt,
    relativeNow,
    summary,
    actions,
    onClick,
    className,
    ...props
  },
  ref,
) {
  const interactive = typeof onClick === 'function';
  const time = lastSyncedAt ? formatRelative(lastSyncedAt, relativeNow ?? new Date()) : '';

  const inner = (
    <>
      <span
        aria-hidden
        className="bg-panel-2 grid h-10 w-10 shrink-0 place-items-center rounded-md font-mono text-[16px]"
      >
        <IconGlyph name={connector} kind="connector" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-medium">{name}</span>
          <StatusDot
            state={statusDot[status]}
            pulse={status === 'syncing'}
            label={statusLabel[status]}
          />
        </div>
        {(summary || time) && (
          <div className="text-text-muted mt-[2px] flex items-center gap-2 text-[12px]">
            {summary && <span className="truncate">{summary}</span>}
            {summary && time && (
              <span aria-hidden className="text-text-dim">
                ·
              </span>
            )}
            {time && (
              <time className="text-text-dim font-mono text-[11px]">last synced {time}</time>
            )}
          </div>
        )}
      </div>
      {actions && (
        <div data-connector-actions="" className="shrink-0">
          {actions}
        </div>
      )}
    </>
  );

  // Skip card-level activation when the event originated inside the actions
  // slot so nested buttons don't double-fire as the card's onClick.
  const isFromActions = (target: EventTarget | null) =>
    target instanceof Element && target.closest('[data-connector-actions]') !== null;

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isFromActions(event.target)) return;
    onClick?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (isFromActions(event.target)) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      ref={ref}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? handleCardClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      aria-label={interactive && typeof name === 'string' ? `${name} connector` : undefined}
      className={cn(
        'rounded-base border-border bg-panel flex items-start gap-3 border p-4 text-left',
        interactive &&
          'hover:bg-panel-2 focus-visible:ring-accent-dim cursor-pointer transition-colors duration-(--duration-micro) outline-none focus-visible:ring-[3px]',
        className,
      )}
      {...props}
    >
      {inner}
    </div>
  );
});

ConnectorCard.displayName = 'ConnectorCard';
