---
'@ship-it-ui/tokens': patch
'@ship-it-ui/ui': patch
'@ship-it-ui/shipit': patch
---

Mobile support — first cut. Brings the Claude Design "Mobile Library" into the
published packages so apps can build touch-targeted surfaces without forking.

**Tokens** (`@ship-it-ui/tokens`): adds touch sizing (`--touch-min`, `--row-h`,
`--tabbar-h`, `--navbar-h`, `--screen-pad`, …), mobile-bumped type scale
(`--font-size-m-body: 15px`, h1 30px, etc.), and mobile radii
(`--radius-m-card`, `--radius-m-sheet`, `--radius-m-tab`). All additive — no
desktop variables changed. Bridged into Tailwind as `h-touch`, `text-m-body`,
`rounded-m-card`, etc.

**Primitives** (`@ship-it-ui/ui`): new `density="touch"` prop on Button,
IconButton, Input, SearchInput, Switch, Checkbox, Card, Chip. Swaps the
component to 44pt-min dimensions consuming mobile tokens; default remains
`'comfortable'` so no caller breaks.

**Patterns** (`@ship-it-ui/ui`): new mobile-only patterns — `TabBar` (5-slot
bottom nav with optional elevated center action), `LargeTitle` (iOS large
headline + eyebrow), `PullToRefresh` (controlled visual indicator).
`Topbar` extended with `back`, `eyebrow`, and `density="touch"` for the
mobile page-header use case. `Drawer` extended with `side="bottom"` + `handle`
prop to cover bottom-sheet visuals.

**Domain** (`@ship-it-ui/shipit`): `density="touch"` on AskBar and
CopilotMessage. New `NotifRow` composite under
`packages/shipit/src/notifications/` for the mobile Inbox list (no desktop
sibling).

Density on the remaining primitives (FAB, SplitButton, Textarea, Select,
Radio, OTP, Slider, Toast, Tag, StatusDot, Avatar) and the remaining shipit
composites (GraphNode, EntityListRow, HealthScore) is deferred to a follow-up.
