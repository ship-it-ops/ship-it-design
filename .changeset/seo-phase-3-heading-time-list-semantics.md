---
'@ship-it-ui/ui': patch
'@ship-it-ui/shipit': patch
---

Semantic-HTML hygiene pass to recover SEO value from components whose
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
