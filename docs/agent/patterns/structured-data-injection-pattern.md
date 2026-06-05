---
type: pattern
status: active
created: 2026-06-04
updated: 2026-06-04
author: claude-opus-4-7
tags: [seo, jsonld, schema-org, components, conventions]
---

# Structured-data injection pattern

## When to Use

Any time a component needs to emit a schema.org `<script type="application/ld+json">`
alongside its rendered DOM. Phase 1 of the SEO upgrade extracted the recipe
from `ComparisonTable` into a shared helper so future structured-data
components don't re-implement the `</script>`-escape footgun.

## Implementation

`packages/ui/src/utils/JsonLd.tsx` exports `<JsonLd data={…} />`:

- `data === null | undefined` → renders nothing (so callers can pass the
  payload directly without an outer guard).
- Otherwise: `JSON.stringify(data).replace(/</g, '\\u003c')` + emitted via
  `dangerouslySetInnerHTML`. The `</` → `<` escape is **load-bearing
  for security** — without it a user-supplied feature name like
  `</script><img onerror=alert(1)>` breaks out of the script tag.

Components that emit JSON-LD follow the **ComparisonTable shape** (locked in
by [[comparison-table-jsonld-strategy]]):

1. Add a `schema?` prop with a sensible default `@type`.
2. Add a `noStructuredData?` boolean opt-out — for consumers emitting
   page-level structured data who want to avoid duplicate entities.
3. Build the payload via a pure `buildXxxSchema(props)` helper that returns
   `null` when required string fields are missing (e.g. `name` would be
   JSX without a `schemaName?`/`titleText?` fallback). Skipping is
   preferable to rendering JSX into JSON.
4. Render `{structuredData && <JsonLd data={structuredData} />}` somewhere
   inside the component's root.
5. Add a regression test for `</script>` escape — every JSON-LD component
   gets one. This is non-negotiable; the escape is the only thing standing
   between user-supplied strings and XSS.

## Examples

- `packages/ui/src/utils/JsonLd.tsx` — the helper itself.
- `packages/ui/src/patterns/ComparisonTable/ComparisonTable.tsx` — first
  reuser; output is byte-identical to the inline implementation.
- `packages/ui/src/patterns/Breadcrumbs/Breadcrumbs.tsx` — `BreadcrumbList`.
- `packages/ui/src/patterns/ReviewCard/ReviewCard.tsx` — `Review`.
- `packages/shipit/src/marketing/{Testimonial,PricingCard}.tsx` — `Review`,
  `Offer`.
- `packages/ui/src/patterns/{ListingCard,ListingDetail}/` — `Accommodation` /
  `Product` (variant-driven). Note `ListingDetail` renders `<JsonLd>` as a
  sibling of `RadixDialog.Root` (outside the Portal) so the script lands in
  the SSR'd HTML regardless of `open` state.
- `packages/ui/src/patterns/ListingCard/listingSchema.ts` — example of a
  shared schema-builder file used by two sibling components without
  exporting through the package barrel.
- `packages/shipit/src/data/ConnectorCard.tsx` — `SoftwareApplication`.

## Gotchas

- **Modal/portal components**: emit `<JsonLd>` outside the Radix Portal so
  the script ships in the SSR'd HTML at page load, not lazily on open. See
  `ListingDetail` for the precedent.
- **JSX-only fields**: if a required string field (`name`, `reviewBody`,
  `feature` name) is JSX without a string-fallback prop
  (`schemaName`/`titleText`/`bodyText`/etc.), **skip the JSON-LD for that
  entity entirely**. Do not render JSX into JSON — TypeScript will sometimes
  let you, but the output is `{}` and breaks Rich Results validation.
- **`buildMetadata()` is a separate concern**: that helper lives in
  `@ship-it-ui/next` (`packages/next/src/metadata.ts`) and produces a Next.js
  `Metadata` object for `page.tsx`. It does _not_ emit JSON-LD; OG/Twitter/
  canonical/robots only. Component-level JSON-LD and page-level metadata
  compose; they don't replace each other.

## Related

- [[comparison-table-jsonld-strategy]]
- [[component-authoring-shape]]
