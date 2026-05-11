---
'@ship-it-ui/ui': patch
'@ship-it-ui/shipit': patch
---

**`ActivityTimeline` variant alongside `Timeline`.** Typed-event timeline
with `icon`, `actor` (name + avatar slot), `title`, `at` timestamp, and an
optional collapsed `payload` preview. Renders relative timestamps via the new
exported `formatRelative(date, now?)` helper. Pass `relativeNow` for
deterministic SSR / test output. Reuses the shared marker tones from
`Timeline`.

**`ConnectorCard` composite for integration hubs (shipit).** Logo (sourced
from `@ship-it-ui/icons` connector glyphs) + name + status dot + relative
last-synced timestamp + summary + actions slot. Status drives the dot tone
(`connected` → ok, `syncing` → sync + pulse, `error` → err,
`disconnected` → off). When `onClick` is provided the entire card becomes
keyboard-focusable (`role="button"`, Enter/Space activate); the card's
own click and key handlers ignore events that originate inside the
actions slot (matched via a `data-connector-actions` marker), so nested
action buttons fire on their own without double-triggering the card.

The package now lists `@ship-it-ui/icons` as a peer dependency.
