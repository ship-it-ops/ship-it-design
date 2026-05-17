'use client';

import { DynamicIconGlyph, type ConnectorName } from '@ship-it-ui/icons';
import { cn, formatRelative, StatusDot, type StatusState } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

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
  /**
   * Accessible name override. Required when `onClick` is set *and* `name` is
   * not a string — without it the button has no accessible name (axe
   * `button-name`). Optional otherwise.
   */
  accessibleName?: string;
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
    accessibleName,
    className,
    ...props
  },
  ref,
) {
  const interactive = typeof onClick === 'function';
  const time = lastSyncedAt ? formatRelative(lastSyncedAt, relativeNow ?? new Date()) : '';

  // The clickable label region (logo + name + status + sync time) is rendered
  // as a button when interactive; the `actions` slot sits beside it as a
  // sibling so any nested button stays a peer of the row button instead of a
  // descendant (avoiding axe `nested-interactive`).
  const labelBlock = (
    <>
      <span
        aria-hidden
        className="bg-panel-2 grid h-10 w-10 shrink-0 place-items-center rounded-md font-mono text-[16px]"
      >
        <DynamicIconGlyph name={connector} kind="connector" />
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
    </>
  );

  const labelRegionClass = cn(
    'flex flex-1 items-start gap-3 rounded-md p-1 text-left transition-colors duration-(--duration-micro)',
    interactive &&
      'hover:bg-panel-2 focus-visible:ring-accent-dim cursor-pointer outline-none focus-visible:ring-[3px]',
  );

  const labelRegion = interactive ? (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        accessibleName ?? (typeof name === 'string' ? `${name} connector` : statusLabel[status])
      }
      className={labelRegionClass}
    >
      {labelBlock}
    </button>
  ) : (
    <div className={labelRegionClass}>{labelBlock}</div>
  );

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-base border-border bg-panel flex items-start gap-2 border p-3',
        className,
      )}
      {...props}
    >
      {labelRegion}
      {actions && <div className="shrink-0 self-center pr-1">{actions}</div>}
    </div>
  );
});

ConnectorCard.displayName = 'ConnectorCard';
