# @ship-it-ui/ui

## 0.0.15

### Patch Changes

- 61b814b: Add `ComparisonTable` pattern — row-headed option-vs-option matrix for
  product, plan, and spec comparisons. Booleans render as check / cross with
  sr-only "Yes" / "No"; strings, numbers, and `{ value, note }` objects are
  also supported. One column can be marked `featured` for an accent-tinted
  column with an auto "recommended" badge; options with an `action` collapse
  into a `<tfoot>` CTA row; rows can be clustered with `group`.

  The component is built for AI/SEO consumption. It emits a
  `<script type="application/ld+json">` next to the table by default — one
  schema.org entity per option (`@type` defaults to `Product`; also supports
  `Service`, `SoftwareApplication`, or any custom type), with each row
  contributing a `PropertyValue` under `additionalProperty`. The escape recipe
  prevents `</script>` injection from user-supplied feature names. Pass
  `noStructuredData` to suppress the script. The rendered HTML mirrors the
  same goal: `<caption>`, `<th scope="col">` on options, `<th scope="row">`
  on features, plus `data-featured` / `data-cell-type` / `data-cell-value`
  attributes for crawlers that don't execute JS.

- 61b814b: Add shared structured-data + Next.js metadata infrastructure to unblock
  SEO/AI-readability work across the design system.
  - `@ship-it-ui/ui` now exports a `<JsonLd>` component that wraps the
    `JSON.stringify(...).replace(/</g, '\\u003c')` + `dangerouslySetInnerHTML`
    recipe used by `ComparisonTable`. Refactored `ComparisonTable` to use it
    (output is byte-identical). Future components emitting schema.org JSON-LD
    should use `<JsonLd data={…} />` instead of re-implementing the escape.
  - `@ship-it-ui/next` now exports a `buildMetadata({ title, description, url,
ogImage, twitterHandle, siteName, locale, noIndex })` helper that returns
    a Next.js `Metadata` object with title/description/openGraph/twitter/
    alternates.canonical/robots populated. Drop-in for `page.tsx` / `layout.tsx`.

- 61b814b: Emit schema.org JSON-LD from 7 high-value components — consumers get
  crawlable / AI-readable structured data for free, with a consistent opt-out
  and security posture across the system.

  Each component grows a `noStructuredData?` prop (suppress emission entirely)
  plus type-specific fields. JSON-LD is skipped automatically when a required
  string field is JSX without a string fallback (rather than rendering JSX into
  JSON). All emitters route through `<JsonLd>` so `</script>` escape is
  load-bearing and unified.
  - **Breadcrumbs** → `BreadcrumbList` (auto-derived from `Crumb` `href` + label).
  - **ReviewCard** → `Review` with author `Person`, rating, body, and optional
    `dateTime` / `itemReviewedName` / `url`. Also renders `<time dateTime>` when
    `dateTime` is supplied.
  - **Testimonial** → `Review` with author `Person`, jobTitle, optional `rating`
    - `itemReviewedName` + `url`.
  - **PricingCard** → `Offer`. Requires `priceCurrency`; parses `priceAmount`
    from the visible `price` string or accepts an explicit number. Cards where
    the price isn't machine-readable (e.g. `"Talk to us"`) skip emission
    unless `priceAmount` is supplied.
  - **ListingCard** / **ListingDetail** → `Accommodation` (default variant) or
    `Product` (spec variant), with `image[]`, `aggregateRating`, optional
    `offers`, and `additionalProperty` from `specs`. Override via `schema?`.
  - **ConnectorCard** → `SoftwareApplication` with `name`, optional
    `applicationCategory` / `url` / `softwareVersion`, and `dateModified` from
    `lastSyncedAt`.

- 61b814b: Semantic-HTML hygiene pass to recover SEO value from components whose
  heading levels, dates, and list structures were hard-coded.
  - New `<Heading as>` helper in `@ship-it-ui/ui` renders the configured
    `h1`–`h6`. Applied as `titleAs?` to **Hero** (default `h1`), **LargeTitle**
    (`h1`), **CTAStrip** (`h2`), **EmptyState** (`h3`), **FeatureGrid**
    (`featureTitleAs`, `h3`), **PricingCard** (`tierAs`, `h3`), and **Topbar**
    (`h1` touch / `h2` desktop). Defaults match the prior visual shape so no
    consumer breaks.
  - New `<DateTime iso>` helper in `@ship-it-ui/ui` wraps a label in
    `<time dateTime="…">`. Applied as `dateTime?: string | Date` to **Timeline**
    events, **TimelineItem**, and **NotifRow**. **ActivityTimeline** auto-emits
    `<time dateTime>` from its existing `at` prop. **ReviewCard** already
    threads `dateTime` from the JSON-LD work in this release.
  - **Footer** column links now render as `<ul role="list"><li>` (was sibling
    divs). New optional `address?` slot renders inside `<address>` for org
    contact info.
  - **Pagination** page buttons now render inside `<ol role="list"><li>` (was
    button siblings). Outer `<nav aria-label="Pagination">` and per-button
    `aria-current="page"` unchanged.

- 61b814b: Set `color-scheme: dark` on `<html>` (with a `[data-theme='light']` override) in
  the package globals so the browser's native scrollbar, form-control chrome, and
  other UA surfaces follow the active theme. Previously the UA defaulted to the
  light scrollbar even when the app was rendering in dark mode.

## 0.0.14

### Patch Changes

- 19b6dbd: Fix `Carousel` `loop="circular"` desync after spam-clicking past the
  end (10+ rapid Next clicks). Symptom: the carousel got stuck oscillating
  between slide N and slide 1 — every subsequent Next either wrapped from
  N→1 or got misread as a wrap-toward landing and snapped to N again, even
  on normal-paced clicks long after the spam stopped.

  Cause: the wrap-consolidation rebase shipped in 0.0.13 jumps scrollLeft
  to the opposite clone via `scrollIntoView({behavior:'instant'})` so the
  new smooth scroll runs forward from a real-strip-adjacent source. That
  instant jump fires a synthetic scroll event whose scrollLeft sits at the
  clone edge — and onScroll's edge branch treated it as the tail of a
  wrap-toward animation, snapping activeIdx to the wrong twin. The
  `scrollLeft > 1` tolerance check couldn't distinguish "smooth scroll
  just settled here" from "we deliberately rebased here to start a forward
  scroll", so any scroll event with scrollLeft ≤ 1 at the rebase domIdx
  flipped activeIdx by N - 1.

  Fix: track the rebase target in a new `rebaseConsumeRef`. While set,
  onScroll's looping branch suppresses any work at that domIdx — both the
  synthetic instant-scroll event and the smooth scroll's early frames that
  still round to the rebase slot. Cleared automatically when scrollLeft
  progresses into a different domIdx, and on viewport pointerdown (user
  takes over). Symmetric across next-wrap (rebase to clone-start = DOM 0)
  and prev-wrap (rebase to clone-end = DOM N + 1). Natural wrap-end snaps
  on a single arrow click are unchanged — the guard is null in that path.

- 19b6dbd: Widen `ListingCard.loop` and `ListingDetail.loop` from `boolean` to
  `boolean | 'circular' | 'sweep'` so consumers can pick the underlying
  `Carousel` loop variant explicitly without a cast.

  Both wrappers already forward the prop straight through to the gallery
  `Carousel` (and `ListingDetail` additionally to its `Lightbox`), and
  `Carousel.loop` has accepted the string forms since the loop-variant
  work — the wrapper type was just narrower than the runtime. The
  `Lightbox` forwarding call coerces with `Boolean(loop)` because
  `Lightbox` is a standalone implementation that only treats `loop` as a
  boolean toggle; the `'circular'` / `'sweep'` distinctions are
  gallery-only and don't apply there.

  No runtime behavior change. Removes the need for a
  `loop={'circular' as unknown as boolean}` cast on `ListingDetail` /
  `ListingCard`.

- Updated dependencies [19b6dbd]
  - @ship-it-ui/icons@0.0.12

## 0.0.13

### Patch Changes

- a8ebcce: Fix `Carousel` `loop="circular"` direction on consecutive wrap clicks.
  Double-clicking the next arrow at the last slide previously circled to
  slide 1 (correct), then immediately swept backward across the entire
  strip to land on slide 2 (wrong direction). Same symmetric bug on the
  prev arrow at slide 0.

  Cause: the first click's smooth scroll lands on a clone (`scrollLeft`
  sits beyond the real-slide range, between `N*width` and `(N+1)*width`).
  A second `goTo` arriving before that scroll settled would start its
  smooth scroll from clone territory toward a real mid-strip target,
  forcing the browser to traverse every intermediate slide backward.

  Fix: when a `goTo` starts a wrap, capture the wrap direction in a ref.
  The next `goTo` reads this ref at entry and, if non-null, jumps the
  viewport to the _opposite_ clone via `scrollIntoView({behavior:
'instant'})` (clone-start for an in-flight next-wrap, clone-end for an
  in-flight prev-wrap). The jump is invisible because clones render
  the same content as their twins, and the new smooth scroll then runs
  forward from a real-strip-adjacent source. `scrollIntoView({instant})`
  is used rather than `node.scrollLeft = X` so the viewport's CSS
  `scroll-behavior: smooth` doesn't silently turn the rebase into yet
  another animated scroll. Direction-based detection (rather than a
  `scrollLeft` threshold) fires even on an ultra-fast double-click that
  beats the first animation frame. Single-click behavior and native
  swipe paths are unchanged.

  The viewport's `pointerdown` listener also clears the wrap-direction
  ref alongside the goTo-in-progress guard, so a swipe that interrupts
  a wrap and settles on a real (non-clone) slide doesn't leave the ref
  pointing at a stale clone — without this clear the next arrow click
  would instant-jump to the opposite clone before its smooth scroll,
  visible as a flash.

- a8ebcce: Fix active-index flicker during `Carousel` arrow / dot clicks. Each
  `goTo` call commits the destination as `activeIdx` optimistically, then
  starts a smooth scroll — but intermediate scroll events would briefly
  overwrite the optimistic value as `scrollLeft` crossed the round
  threshold of the next slide (e.g. `setActive(0)` momentarily during a
  `goTo(1)` smooth scroll). Dot indicators absorbed this via CSS
  transition; consumer-rendered counters (notably the X/Y pill on
  `ListingCard`'s spec variant) showed the flicker as
  "2/5 → 1/5 → 2/5" within ~150ms.

  The wrap-in-progress guard already shipped for circular loop wraps is
  now generalized to suppress non-edge `setActive` during any in-flight
  `goTo` smooth scroll, regardless of variant or wrap status. The guard
  releases automatically once the scroll lands on the optimistic target
  (realIdx catches up to activeIdx), and a `pointerdown` listener on the
  viewport releases it on any direct user interaction so a swipe
  interrupting the animation tracks the user's chosen position
  immediately. Native swipe paths are unchanged — the guard is only set
  by `goTo`.

- a8ebcce: Fix `Carousel` thumbnail-strip active-state ring so it traces the
  shape of the rendered thumbnail rather than a fixed `rounded` box on
  the wrapper. The previous implementation hard-coded a 4px-radius ring
  on the click target, which mismatched any thumbnail with a different
  radius (e.g. `DemoTile`'s `rounded-lg`) and made the first / last
  selected thumb's ring appear clipped against the strip's overflow
  edge.

  The ring is now applied to the wrapper's direct child via a
  `[&[data-active]>*]:ring-*` variant on a `data-active` attribute.
  Because `ring-*` compiles to `box-shadow`, the highlight inherits the
  child's own `border-radius` automatically — works for square, pill,
  and circular thumbnails with no Carousel-side configuration. The
  scroll container also picks up `p-0.5 -mx-0.5` so the ring has room
  to render against the edge without shifting the strip's outer width.

## 0.0.12

### Patch Changes

- 206fa53: Add named loop variants to `Carousel`. `loop` now accepts
  `boolean | "circular" | "sweep"`:
  - `loop="circular"` (or `loop={true}`, the default alias) — boundary
    arrow clicks smooth-scroll one slide width through a hidden clone of
    the opposite end, then invisibly snap to the real twin. The motion is
    always one slide regardless of strip length — an endless-reel feel.
    This is the behavior shipped in the previous patch and remains the
    default for `loop={true}`.
  - `loop="sweep"` — boundary arrow clicks smooth-scroll the full
    distance across the strip back to the real first / last slide. The
    transition reads as a wide arc across every item between, useful when
    you want users to re-perceive intermediate slides on each wrap.

  Native swipe past the edge uses the clone-snap in both variants. No
  breaking change: existing `loop={true}` / `loop={false}` call sites keep
  their current behavior.

- 206fa53: Fix `Carousel` `loop` mode so prev/next arrow clicks at the boundaries
  smooth-scroll a single slide through the adjacent clone instead of
  rewinding across the whole strip. Previously, clicking "next" on the
  last real slide would `scrollIntoView` the real first slide and animate
  backwards through every slide between them (and the symmetric
  "fast-forward" on prev from the first slide). Now the wrap step targets
  the clone-twin one slide width away and the existing onScroll edge
  branch performs the invisible clone→real snap once the animation
  settles — matching the native-swipe path's "one-slide-and-snap"
  behavior.

  Also fix a related dot-indicator flicker: while the wrap smooth-scroll
  traverses intermediate DOM indices, `onScroll`'s non-edge branch no
  longer overwrites the optimistic active index back to the previous
  slide.

  Mid-strip jumps (dot clicks across the strip, multi-step `goTo` calls)
  keep their current behavior — they target the real twin directly so
  direction-of-travel matches user intent. No API change.

## 0.0.11

### Patch Changes

- a793daa: Add `loop` prop to `Carousel` and `Lightbox` (default `false` on both
  primitives). When `true`, prev/next wraps — clicking "next" on the last
  slide goes to the first, and vice versa. `Carousel` also wraps native
  swipe via an invisible clone-twin jump on either edge. `onIndexChange`
  always emits real indices in `0..items.length - 1`.

  `ListingCard` and `ListingDetail` opt in by default (new
  `loop?: boolean` prop, default `true`). Marketplace photo browsing now
  loops; pass `loop={false}` to restore stop-at-end behavior. On
  `ListingDetail`, one prop drives both the inline gallery and the
  fullscreen lightbox.

  Also fix: when `Carousel`'s controlled `index` prop changes from
  outside (e.g. `Lightbox` close in `ListingDetail` pushes back the
  index it left on), the viewport now scrolls to the new slide instead
  of leaving stale content on screen.

- Updated dependencies [a793daa]
  - @ship-it-ui/icons@0.0.11

## 0.0.10

### Patch Changes

- 1ba01f1: `ListingCard` — two new props:
  - `onClick` makes the whole card surface clickable via an invisible
    stretched `<button>` underneath the inner actions. Favorite, CTA, and
    links keep their own click semantics (no nested-interactive). Pair with
    a Dialog/Drawer trigger to wire "click card → open detail" without
    navigating away.
  - `hoverEffect` picks the visual treatment: `'lift'` (translate + shadow),
    `'glow'` (accent ring), or `'none'`. Defaults to `'lift'` when the card
    is interactive (has `onClick` or `href`), otherwise `'none'`.

  In the spec variant, the footer CTA bar is now elevated to `relative z-10`
  so the inline CTA stays above the stretched click target.

  The card's outer surface gets `isolation: isolate` so child `z-10` elements
  (flag pill, photo counter, footer CTA, consumer-supplied editable cells)
  stay scoped to the card and can't bleed over a portaled modal opened from
  the same page.

  Every section slot still accepts arbitrary `ReactNode`, so consumers can
  drop `<InlineEdit>` directly into `title`, `meta`, `specs[].value`,
  `price`, etc. for editable listings.

- 1ba01f1: `ListingCard` and `ListingDetail` now accept a `classNames` slot map for
  per-section className overrides. Every internal element (root, photos,
  flag, photoCounter, body, header, title, category, meta, specs grid,
  each spec cell + label + value, footer, price, priceUnit, cta, favorite,
  host, features, description, close, overlay, content) is independently
  styleable without forking. Values are merged with the component's own
  utilities via `cn()`, so consumers can override, extend, or replace any
  styling and still inherit the rest.

  Content overrides remain via ReactNode props on every text slot; the
  slot map is purely for styling.

- 1ba01f1: Add `ListingDetail` pattern — the full marketplace listing popup. Photos
  on the left (`Carousel`, click to enter fullscreen `Lightbox`), info on
  the right (title, rating, host, feature chips, description, primary /
  secondary CTAs). Stacks on narrow viewports.

  Pairs with `ListingCard`: card → detail popup. Replaces the manual
  Dialog + Carousel + Lightbox + info-layout assembly with a single typed
  component.

- 1ba01f1: Add `renderPhoto` to `ListingCard` and `ListingDetail`. Lets consumers
  override the default decorative `<img src>` wrapper with arbitrary
  ReactNodes — inline SVG that follows `currentColor`, custom video
  players, masked photos, etc.

  On `ListingDetail`, the override receives a `mode` flag (`'gallery'` |
  `'lightbox'`) so the same callback can render `object-cover` inline and
  `object-contain` fullscreen.

  Default behavior unchanged when `renderPhoto` is omitted.

- 1ba01f1: Add `variant="spec"` to `ListingCard` and `ListingDetail` — a
  product-spec layout for premium / spec-driven inventory. Photo counter,
  top-left flag pill, three-up stats grid (e.g. `0-60` / `power` / `drive`),
  and an inline CTA button on a dark footer strip on the card. The detail
  modal mirrors the same vocabulary at modal scale with a wider spec grid
  and a single primary action in the bottom CTA bar.

  New shared types: `ListingCardFlag`, `ListingCardSpec`, `ListingCardCta`,
  `ListingCardVariant`, `ListingDetailVariant`. Default-variant behavior
  and prop set unchanged.

- 1ba01f1: React 19 baseline. Peer range tightened to `react ^19.0.0` /
  `react-dom ^19.0.0` (was `^18.0.0 || ^19.0.0`) and dev installs bumped to
  React 19.2. Drops React 18 from the supported matrix — consumers must be on
  React 19 to install.

  `@ship-it-ui/ui` also refreshes every `@radix-ui/react-*` dependency to the
  latest 1.x. Each one now declares explicit React 19 peer support and ships
  the strict-mode / `forwardRef` compat fixes from the Radix 1.x line. No
  Radix v2 migration in this release; only patch-level moves within 1.x.

- Updated dependencies [1ba01f1]
- Updated dependencies [1ba01f1]
  - @ship-it-ui/icons@0.0.10

## 0.0.9

### Patch Changes

- 66be20b: Fix DataTable's screen-reader caption escaping its containing block. The
  `sr-only` Tailwind utility uses `position: absolute` without `top/left`,
  so without a positioned ancestor the caption resolved against `<html>`
  and inflated the document scroll height — visible on docs pages as a
  second, ghostly scrollbar that scrolled into empty space. Marking the
  table `position: relative` makes it the caption's containing block.
- 66be20b: Fix several long-standing act() warnings and Radix a11y dev-mode warnings
  surfaced by tests:
  - `Dialog` / `AlertDialog` / `WizardDialog` now explicitly pass
    `aria-describedby={undefined}` when no `description` is supplied, so
    Radix's dev-mode check sees the intentional opt-out instead of warning.
    `WizardDialog` additionally renders a visually-hidden fallback `<Title>`
    when no `title` prop is given, so the Dialog contract is always met.
  - `useTheme` now flags self-initiated `data-theme` mutations so the
    internal `MutationObserver` skips the change instead of firing a
    redundant `setState` outside `act()` after the click handler returns.
  - `Tree`'s active-item move now uses `flushSync` to commit the state
    update before focusing the new tab stop, replacing a `queueMicrotask`
    that resolved outside `act()` in tests.
  - Test setup: `@ship-it-ui/next` now polyfills `ResizeObserver` for
    jsdom (Radix `useSize` needs it), and `@ship-it-ui/ui` filters the
    upstream `ToastAnnounce` act warning that fires from Radix's own
    1-second setTimeout.

- 66be20b: Add a `color` prop to Badge, Tag, Chip, StatusDot, Rating, and Avatar for one-off color overrides outside the semantic-token surface. The prop is optional and passes through cleanly when used alongside `variant` / `state` — when both are set, `color` takes precedence at runtime. Invalid colors fall back to the default variant; in dev, a console.warn names the offending value. Existing usage is unaffected — `variant` and `state` continue to work exactly as before.
- Updated dependencies [66be20b]
- Updated dependencies [66be20b]
  - @ship-it-ui/icons@0.0.9
  - @ship-it-ui/tokens@0.0.7

## 0.0.8

### Patch Changes

- e2b569e: Close the consumer-marketplace component gaps. The design system can now
  shape a Turo-style car-rental app (and any travel/hospitality consumer
  product) without leaning on per-app primitives.

  **New primitives**:
  - `Rating` — stars 0–5 with `precision='half'` for read-only averages and
    whole-step interactive mode. Uses the new `rating` / `ratingDim` tokens.
  - `Accordion` — Radix-Accordion wrapper, `type='single' | 'multiple'`,
    optional `leadingIcon` per trigger.
  - `SegmentedControl` — pill-styled `role='radiogroup'` for filtering the
    current view (Daily/Weekly/Monthly, List/Map). Distinct from `Tabs`.
  - `NumberInput` — text input with `−` / `+` stepper, long-press-to-repeat,
    arrow-key support, `role='spinbutton'`.

  **New patterns**:
  - `DateRangePicker` — popover wrapper around the existing `Calendar`,
    which now accepts `mode='range'`. Single- and two-month variants.
    Critical for booking flows.
  - `Carousel` — CSS scroll-snap container with prev/next, dot indicators,
    and an optional thumbnail strip. No library.
  - `Lightbox` — fullscreen photo viewer built on `Dialog`. Keyboard ←/→
    navigation, counter overlay.
  - `PhoneInput` — country-code `Select` + national-number `Input`. Emits
    E.164. Ships a 37-country curated subset; pass `countries` to extend.
  - `ListingCard` — marketplace card composing `Card` + `Carousel` +
    `Rating` + `Badge`. Includes verified badge, favorite toggle, sale
    strike-through. Distinct from `EntityCard`.
  - `PriceBreakdown` — line-item list + totals row, with `discount` /
    `originalAmount` support via the `sale` token.
  - `ReviewCard` — review-feed item composing `Avatar` + `Rating` + verified
    badge + photo strip. Distinct from `Testimonial` (marketing).

  **Extended**:
  - `Calendar` gains `mode`, `range`, `defaultRange`, `onRangeChange`. Single
    mode is unchanged.

  **Sheet/Drawer**: already shipped under `Dialog` — documented elsewhere.

- Updated dependencies [e2b569e]
- Updated dependencies [e2b569e]
  - @ship-it-ui/icons@0.0.8
  - @ship-it-ui/tokens@0.0.6

## 0.0.7

### Patch Changes

- 9da43f1: Add `<InlineEdit>` — a display-to-input rename primitive. Double-click (or Enter on the focused display) opens the editor; Enter commits, Escape cancels, blur commits when `commitOnBlur` (default `true`). Supports `validate(next) => string | null` for rejecting commits, controlled `editing` state, and an imperative `edit()` / `cancel()` handle. Renders headings via `as="h1" | "h2" | "h3"` with proper heading semantics + `aria-roledescription="editable"`. Useful for table cells, sidebar names, schema editors, and any other in-place rename surface.

## 0.0.6

### Patch Changes

- 0318497: **Tooltip rename** — `Tooltip` is now the Radix composition root and the
  one-liner convenience helper renames to `SimpleTooltip`. The previous
  `Tooltip` (with required `content` prop) and `TooltipRoot` (Radix Root
  re-export) had names that were trivial to mix up — typecheck errors using
  `<Tooltip>` for composition were a recurring papercut.

  This matches the rest of the library: `Dialog`, `Popover`, etc. all use the
  unqualified component name for the compositional root.

  **Breaking renames:**
  - `Tooltip` (the convenience wrapper that bundles its own `TooltipProvider`
    and takes a `content` prop) → `SimpleTooltip`.
  - `TooltipRoot` (the Radix Root re-export) → `Tooltip`.
  - `TooltipProps` → `SimpleTooltipProps`.

  The other exports (`TooltipProvider`, `TooltipTrigger`, `TooltipContent`,
  `TooltipPortal`, `TooltipArrow`) are unchanged. Per the v0 patch-only
  convention this ships as a patch; migration is a single import rename per
  call site.

## 0.0.5

### Patch Changes

- 40c58e6: Mobile support — first cut. Brings the Claude Design "Mobile Library" into the
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

- Updated dependencies [40c58e6]
  - @ship-it-ui/tokens@0.0.5

## 0.0.4

### Patch Changes

- 01246b3: **`ActivityTimeline` variant alongside `Timeline`.** Typed-event timeline
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

- 01246b3: **Five new primitives + patterns** surfaced by ShipIt-AI's first consumer pass:
  - **`ScrollArea` component** — Radix-backed scroll viewport with token-styled
    scrollbars. Defaults to `type="hover"` (scrollbars fade in on hover) and
    `orientation="vertical"`; pass `"horizontal"` or `"both"` to enable axis
    scrollbars. Includes a `viewportClassName` escape hatch for the inner
    viewport.
  - **`FilterPanel` pattern** — Multi-facet checkbox filter panel. Pass
    `facets: FilterFacet[]` and the panel renders a header with a reset action
    plus a labelled checkbox group per facet. Each facet is collapsible by
    default. Selections are a `Record<facetId, string[]>` supported in both
    controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`)
    modes. Per-option `counts` render as trailing tabular numbers.
  - **`WizardDialog` pattern** — Dialog + Stepper + Next/Back footer driven by
    a `steps` array. Each step's `content` may be a node or a render function
    receiving the wizard context (`goNext`, `goBack`, `goTo`, `isFirst`,
    `isLast`). A `canAdvance` predicate gates the Next button per step. The
    last step's Next becomes `Done` and fires `onComplete`.
  - **`HealthScore` pattern** — RadialProgress + delta indicator + optional
    breakdown tooltip. Signed `delta` drives the arrow direction and tone;
    positive flows to `ok`, negative to `err`. When a `breakdown` array is
    supplied the score wraps in a HoverCard revealing per-bucket
    contributions.
  - **`OnboardingChecklist` pattern** — Getting-started task list keyed to
    remote progress. Each item carries a `status` (`pending` /
    `in-progress` / `done`) plus an optional `action` slot. The header shows
    aggregate progress as a token-styled bar; `progressLabel` overrides the
    default "N of M complete" text.

- Updated dependencies [01246b3]
  - @ship-it-ui/tokens@0.0.4

## 0.0.3

### Patch Changes

- 597a705: **`NavBar` pattern (new).** Renders primary app navigation as either a
  horizontal top bar (`orientation="horizontal"`) or a vertical side rail
  (`orientation="vertical"`), driven by a flat `items: NavBarItem[]` tree.
  Items can carry nested `children` to produce dropdowns on horizontal and
  expand-collapse groups on vertical. Below `md` the bar collapses to a
  hamburger that opens a Drawer with the items rendered vertically (set
  `responsive={false}` to opt out). Active state can be controlled
  (`value` + `onValueChange`) or uncontrolled (`defaultValue`); items with
  `href` render as anchors, others as buttons. New exports: `NavBar`,
  `NavBarItem`, `NavBarOrientation`, `NavBarProps`.

  **`Sidebar.NavSection` is now collapsible.** Six new optional props on
  `NavSection`, all backwards-compatible (existing consumers keep the static
  eyebrow):
  - `collapsible` — turns the eyebrow into a button that toggles the body.
  - `open` / `defaultOpen` / `onOpenChange` — controlled and uncontrolled open
    state, mirroring our other disclosure components.
  - `icon` — leading glyph next to the eyebrow.
  - `indent` — pixel indent for nested sections, with a subtle left rail.

  **`Slider` `showValue` follows the thumb when uncontrolled.** Previously the
  displayed number was computed once from `defaultValue` and never updated, so
  only fully-controlled sliders (`value` + `onValueChange`) showed live values.
  The fix tracks the live value internally when uncontrolled and forwards every
  change through `onValueChange`, preserving scalar-vs-array shape.

- Updated dependencies [597a705]
  - @ship-it-ui/tokens@0.0.3

## 0.0.2

### Patch Changes

- 3b7a79a: A repo-wide audit identified ~17 P0 blockers, ~50 P1 high-priority issues, and additional P2/P3 cleanup. This branch resolves all of them.
- Updated dependencies [3b7a79a]
  - @ship-it-ui/tokens@0.0.2

## 0.0.1

### Patch Changes

- 1035968: v0 launch
