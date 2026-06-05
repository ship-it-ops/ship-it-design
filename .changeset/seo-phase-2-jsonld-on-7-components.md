---
'@ship-it-ui/ui': patch
'@ship-it-ui/shipit': patch
---

Emit schema.org JSON-LD from 7 high-value components — consumers get
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
