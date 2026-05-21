---
'@ship-it-ui/ui': patch
---

Close the consumer-marketplace component gaps. The design system can now
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
