---
'@ship-it-ui/ui': patch
'@ship-it-ui/next': patch
---

Add shared structured-data + Next.js metadata infrastructure to unblock
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
