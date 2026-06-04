---
type: decision
status: active
created: 2026-06-04
updated: 2026-06-04
author: claude-opus-4-7
tags: [seo, structured-data, comparison-table, jsonld, schema-org]
importance: standard
---

# JSON-LD (not microdata) for design-system structured data

## Context

`ComparisonTable` (`packages/ui/src/patterns/ComparisonTable/`) is the first
component in the design system that emits schema.org structured data — a grep
for `application/ld+json`, `itemScope`, `itemProp`, and `schema.org` across
the repo before this change returned zero matches. Adding structured data is
high-leverage for AI/SEO ingestion of marketing pages and docs, but the
"which mechanism" choice locks in a posture the rest of the system will
inherit.

## Decision

**Use JSON-LD via `<script type="application/ld+json">`, escaped with the
`JSON.stringify(...).replace(/</g, '\\u003c')` recipe and emitted via
`dangerouslySetInnerHTML`. Do not add microdata (`itemScope`, `itemProp`,
`itemType`) attributes inline on the rendered DOM.**

For `ComparisonTable`, each comparison renders as an array of schema.org
entities — one per option — with each row contributing a `PropertyValue`
under `additionalProperty`. The `@type` is configurable (`schema` prop) with
sensible defaults (`Product`) and explicit support for `Service` and
`SoftwareApplication`.

In parallel, the rendered HTML carries cheap, framework-agnostic hints for
crawlers that don't execute JS: `<caption>`, `<th scope="col">` on options,
`<th scope="row">` on features, plus `data-featured`, `data-cell-type`, and
`data-cell-value` attributes on every cell.

## Alternatives Considered

- **Microdata (`itemScope` / `itemProp` / `itemType`)**: rejected. Google's
  structured-data guidance explicitly prefers JSON-LD; microdata clutters the
  rendered DOM with attributes that have no visual effect, fights against
  Tailwind-utility-heavy class lists in code review, and is harder to
  generate from a typed config (every row needs its own attribute set
  threaded through cell renderers).
- **RDFa**: rejected for the same reasons as microdata plus less mature
  tooling support.
- **JSON-LD AND microdata (belt-and-suspenders)**: rejected. Modern crawlers
  prefer JSON-LD and ignore microdata when both are present, so the
  microdata is dead weight in production HTML.
- **Plain semantic HTML only**: rejected. The whole point of adding
  `ComparisonTable` as a first-class pattern was AI/SEO consumability, and
  leaving structured data on the floor surrenders the largest part of that
  upside.

## Consequences

- Future agents adding structured data to other components
  (e.g. `PricingCard`, `FeatureGrid`, `Testimonial`, `ListingCard`,
  `ReviewCard`) should follow the same shape: a single
  `<script type="application/ld+json">` injected via
  `dangerouslySetInnerHTML` with the `</` → `</` escape, and a
  configurable `@type` / `schema` prop with a documented default.
- The escape is **load-bearing for security**: without it, a user-provided
  feature name like `</script><img onerror=alert(1)>` would break out of the
  script tag. `ComparisonTable.test.tsx` has a regression test that asserts
  the escape survives. Replicate that test in any future structured-data
  component.
- The design system does _not_ take on a peer dependency on a
  schema-validation library (e.g. `schema-dts`) — the JSON shapes are small
  and stable, and adding a runtime/type-only dep for every component is
  more cost than payoff at this stage. Revisit if the JSON shapes grow
  beyond a couple hundred lines per component.
- Consumers can opt out per-instance via `noStructuredData` if they're
  emitting their own JSON-LD at the page level and don't want duplication.

## Revisit Triggers

- If a future Google or schema.org guideline changes to prefer microdata
  for tabular data.
- If consumers consistently report duplicate-entity warnings in Google's
  Rich Results Test (suggests we need a global toggle or per-page
  coordination layer).
- If the JSON shapes per component cross ~150 lines and start to drift
  from the spec — at that point a typed validation layer (`schema-dts` or
  similar) earns its keep.

## Related

- [[component-authoring-shape]] — `ComparisonTable` follows the same
  three-file folder shape; structured-data emission is one of the cell
  renderers' responsibilities, not a sub-component.
- [[htmlattributes-omit-pattern]] — `ComparisonTableProps` doesn't extend
  `HTMLAttributes` (matches `DataTable`), so no Omit collisions to manage.
