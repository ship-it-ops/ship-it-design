'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { formatRelative } from './formatRelative';
import type { TimelineEventTone } from './Timeline';

/**
 * ActivityTimeline — typed-event variant of `Timeline`. Each event carries
 * an optional `icon`, an `actor` (name + avatar slot), a `title`, an `at`
 * timestamp formatted relative to `relativeNow`, and an optional `payload`
 * preview. Tone drives the marker color.
 *
 * The component is presentation-only — supply your own data adapter to map
 * domain events to `ActivityEvent`s.
 */

export interface ActivityActor {
  name: ReactNode;
  /** Typically an `<Avatar>` or `<IconGlyph>`. */
  avatar?: ReactNode;
}

export interface ActivityEvent {
  id: string;
  /** Leading icon next to the marker. Often an `<IconGlyph>`. */
  icon?: ReactNode;
  actor?: ActivityActor;
  title: ReactNode;
  /** Event time. Renders relative to `relativeNow`. */
  at: Date | string | number;
  /** Optional inline preview (e.g. a diff snippet or a payload summary). */
  payload?: ReactNode;
  /** Marker color tone. Default `accent`. */
  tone?: TimelineEventTone;
}

export interface ActivityTimelineProps extends HTMLAttributes<HTMLOListElement> {
  events: ReadonlyArray<ActivityEvent>;
  /** Reference time for relative formatting. Injectable for tests/SSR. */
  relativeNow?: Date;
}

const ringClass: Record<TimelineEventTone, string> = {
  accent: 'border-accent',
  ok: 'border-ok',
  warn: 'border-warn',
  err: 'border-err',
  muted: 'border-text-dim',
};

export const ActivityTimeline = forwardRef<HTMLOListElement, ActivityTimelineProps>(
  function ActivityTimeline({ events, relativeNow, className, ...props }, ref) {
    const now = relativeNow ?? new Date();
    return (
      <ol
        ref={ref}
        className={cn(
          'relative m-0 list-none p-0 pl-6',
          'before:bg-border before:absolute before:top-[6px] before:bottom-[6px] before:left-[7px] before:w-px',
          className,
        )}
        {...props}
      >
        {events.map((event) => {
          const tone = event.tone ?? 'accent';
          const time = formatRelative(event.at, now);
          return (
            <li key={event.id} className="relative mb-4 last:mb-0">
              <span
                aria-hidden
                className={cn(
                  'bg-bg absolute top-[4px] -left-6 h-[14px] w-[14px] rounded-full border-2',
                  ringClass[tone],
                )}
              />
              <div className="flex items-baseline gap-2">
                {event.icon && (
                  <span aria-hidden className="text-text-muted font-mono text-[12px]">
                    {event.icon}
                  </span>
                )}
                <div className="text-[13px] font-medium">{event.title}</div>
                {time && (
                  <time className="text-text-dim ml-auto font-mono text-[10px]">{time}</time>
                )}
              </div>
              {event.actor && (
                <div className="text-text-muted mt-[2px] flex items-center gap-[6px] text-[12px]">
                  {event.actor.avatar && (
                    <span aria-hidden className="inline-flex">
                      {event.actor.avatar}
                    </span>
                  )}
                  <span>{event.actor.name}</span>
                </div>
              )}
              {event.payload && (
                <div className="border-border bg-panel-2 mt-2 rounded-md border px-3 py-2 font-mono text-[11px] leading-[1.5]">
                  {event.payload}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);

ActivityTimeline.displayName = 'ActivityTimeline';

// Re-export the underlying tone type so consumers don't need a separate import.
export type { TimelineEventTone };

// Re-export the helper since it's useful outside the timeline (e.g. ConnectorCard).
export { formatRelative };
