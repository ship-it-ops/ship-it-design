---
type: pattern
status: active
created: 2026-06-04
updated: 2026-06-04
author: claude-opus-4-7
tags: [seo, semantic-html, time, dates, components, conventions]
---

# `<time dateTime>` opt-in via `dateTime?: string | Date`

## When to Use

Any time a component renders a date or timestamp. Phase 3 of the SEO upgrade
introduced this pattern to make the timestamp surface AI-readable without
breaking backwards compatibility on existing visible-label props (`time`,
`date`, `at`, etc.).

## Implementation

`packages/ui/src/utils/DateTime.tsx` exports a small `<DateTime iso>`
helper:

```tsx
<DateTime iso="2026-05-03">May 3, 2026</DateTime>
// → <time datetime="2026-05-03">May 3, 2026</time>

<DateTime iso={new Date()}>{formatRelative(date)}</DateTime>
// → <time datetime="…iso…">2 days ago</time>
```

Components surfacing a timestamp follow this shape:

1. Keep the existing visible-label prop (`time` / `date`) unchanged —
   ReactNode in, rendered as-is. Backwards-compatible.
2. Add a new `dateTime?: string | Date` prop.
3. **Conditional render**:
   - When `dateTime` is supplied, wrap the label in
     `<DateTime iso={dateTime} className="…">{label}</DateTime>`.
   - Otherwise, render the label in a `<span>`/`<div>` with the same
     class — the prior shape.
4. Document the new prop's purpose in JSDoc: "Machine-readable ISO 8601
   string or `Date`. When set, the visible label is wrapped in
   `<time dateTime="…">` so the row is crawlable / AI-readable."

For components whose existing prop is already a machine-readable date
(`ActivityTimeline.events[i].at`), wrap the rendered `<time>` directly
without introducing a new prop — there's nothing for the consumer to
opt into.

## Examples

- `packages/ui/src/utils/DateTime.tsx` — the helper.
- `packages/ui/src/patterns/Timeline/Timeline.tsx` —
  `TimelineEvent.dateTime?` + `TimelineItem.dateTime?`. Conditional wrap.
- `packages/ui/src/patterns/Timeline/ActivityTimeline.tsx` — emits
  `<time dateTime>` directly from the existing `at` prop (no new
  consumer-facing prop needed).
- `packages/ui/src/patterns/ReviewCard/ReviewCard.tsx` — `dateTime?` prop;
  threaded into JSON-LD `datePublished` as well.
- `packages/shipit/src/notifications/NotifRow.tsx` — `dateTime?` prop;
  conditional `<DateTime>` wrap.

## Gotchas

- **Backwards-compat is the whole point.** Don't replace the existing
  visible-label prop with a Date — consumers pass strings like
  `"2 days ago"` or `formatRelative(...)`. The visible side stays
  ReactNode; the machine-readable side is the new opt-in prop.
- **Don't double-emit `<time>`**: if a parent already wraps a child in
  `<time>` (e.g. some custom row layouts), the inner component should
  detect and skip. Currently no component pair triggers this — keep an
  eye on it.
- **For SSR**, `new Date()` differs server vs client. Pass a stable
  `dateTime` value (string or pre-constructed Date) rather than computing
  fresh in the render path.

## Related

- [[heading-level-configurability]]
- [[structured-data-injection-pattern]]
- [[component-authoring-shape]]
