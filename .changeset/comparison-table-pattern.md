---
'@ship-it-ui/ui': patch
---

Add `ComparisonTable` pattern — row-headed option-vs-option matrix for
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
