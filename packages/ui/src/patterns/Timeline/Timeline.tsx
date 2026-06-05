'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { DateTime } from '../../utils/DateTime';

/**
 * Timeline — vertical event list with a connecting rule between markers.
 * Pass `events` (preferred) for the simple shape, or compose with
 * `<TimelineItem>` children for custom layouts.
 */

export type TimelineEventTone = 'accent' | 'ok' | 'warn' | 'err' | 'muted';

export interface TimelineEvent {
  title: ReactNode;
  description?: ReactNode;
  /** Time label rendered in mono. */
  time?: ReactNode;
  /**
   * Machine-readable ISO 8601 string or `Date` for the event. When set, the
   * visible `time` is wrapped in `<time dateTime="…">` so crawlers and AI
   * agents get a timestamp without parsing the label.
   */
  dateTime?: string | Date;
  /** Marker color tone. Defaults to `accent`. */
  tone?: TimelineEventTone;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** Convenience prop — when provided, renders `<TimelineItem>` for each event. */
  events?: ReadonlyArray<TimelineEvent>;
}

const ringClass: Record<TimelineEventTone, string> = {
  accent: 'border-accent',
  ok: 'border-ok',
  warn: 'border-warn',
  err: 'border-err',
  muted: 'border-text-dim',
};

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { events, className, children, ...props },
  ref,
) {
  return (
    <ol
      ref={ref}
      className={cn(
        'relative pl-6',
        'before:bg-border before:absolute before:top-[6px] before:bottom-[6px] before:left-[7px] before:w-px',
        className,
      )}
      {...props}
    >
      {events
        ? events.map((e, i) => (
            <TimelineItem
              key={i}
              tone={e.tone}
              time={e.time}
              dateTime={e.dateTime}
              description={e.description}
            >
              {e.title}
            </TimelineItem>
          ))
        : children}
    </ol>
  );
});

Timeline.displayName = 'Timeline';

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
  tone?: TimelineEventTone;
  description?: ReactNode;
  time?: ReactNode;
  /**
   * Machine-readable ISO 8601 string or `Date`. When set, the visible `time`
   * is wrapped in `<time dateTime="…">`.
   */
  dateTime?: string | Date;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { tone = 'accent', description, time, dateTime, className, children, ...props },
  ref,
) {
  return (
    <li ref={ref} className={cn('relative mb-[18px] last:mb-0', className)} {...props}>
      <span
        aria-hidden
        className={cn(
          'bg-bg absolute top-[4px] -left-6 h-[14px] w-[14px] rounded-full border-2',
          ringClass[tone],
        )}
      />
      <div className="text-[13px] font-medium">{children}</div>
      {description && <div className="text-text-muted text-[12px]">{description}</div>}
      {time &&
        (dateTime !== undefined ? (
          <DateTime iso={dateTime} className="text-text-dim mt-[2px] block font-mono text-[10px]">
            {time}
          </DateTime>
        ) : (
          <div className="text-text-dim mt-[2px] font-mono text-[10px]">{time}</div>
        ))}
    </li>
  );
});

TimelineItem.displayName = 'TimelineItem';
