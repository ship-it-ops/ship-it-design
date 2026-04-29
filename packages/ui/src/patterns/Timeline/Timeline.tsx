import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';

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
      className={cn('relative pl-6', 'before:absolute before:left-[7px] before:top-[6px] before:bottom-[6px] before:w-px before:bg-border', className)}
      {...props}
    >
      {events
        ? events.map((e, i) => (
            <TimelineItem
              key={i}
              tone={e.tone}
              time={e.time}
              description={e.description}
            >
              {e.title}
            </TimelineItem>
          ))
        : children}
    </ol>
  );
});

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
  tone?: TimelineEventTone;
  description?: ReactNode;
  time?: ReactNode;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { tone = 'accent', description, time, className, children, ...props },
  ref,
) {
  return (
    <li ref={ref} className={cn('relative mb-[18px] last:mb-0', className)} {...props}>
      <span
        aria-hidden
        className={cn(
          'absolute -left-6 top-[4px] h-[14px] w-[14px] rounded-full bg-bg border-2',
          ringClass[tone],
        )}
      />
      <div className="text-[13px] font-medium">{children}</div>
      {description && <div className="text-[12px] text-text-muted">{description}</div>}
      {time && <div className="mt-[2px] font-mono text-[10px] text-text-dim">{time}</div>}
    </li>
  );
});
