---
type: scar
status: active
created: 2026-05-27
updated: 2026-05-27
author: claude-opus-4-7
tags: [next-js, turbopack, mdx, build]
incident-date: 2026-05-27
tripwire: 'if you see `loader @next/mdx/mdx-js-loader.js does not have serializable options`, the rehype/remark plugins are being passed as imported function refs — swap them to string module names'
---

# Turbopack MDX loader needs plugin _names_, not plugin _imports_

## What Happened

During the Next 15 → 16 upgrade, `next build` (Turbopack default in 16)
failed with:

```
Error: loader /…/@next/mdx/mdx-js-loader.js for match "{*,next-mdx-rule}"
does not have serializable options. Ensure that options passed are plain
JavaScript objects and values.
```

The `apps/docs-site/next.config.mjs` was passing rehype/remark plugins as
imported function references (`rehypeAutolinkHeadings`, `rehypePrettyCode`,
`rehypeSlug`, `remarkGfm`). Webpack handled this fine; Turbopack can't,
because it has to serialize loader options across its worker boundary.

## Tripwire

If `next build` (or `next dev`) errors with **"does not have serializable
options"** on the `@next/mdx` loader, the plugin imports in
`next.config.mjs` are the culprit.

## Why It Hurt

Build went from green (Next 15 / webpack) to red the moment the upgrade
landed. The error message points at the loader, not the plugins, so the
first instinct is to dig into `@next/mdx` internals. Fix is in the config.

## Don't Do This

```js
// ❌ Function-reference plugins — work on Next 15/webpack, break on Next 16/Turbopack
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
createMDX({
  options: {
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: '…' }]],
  },
});
```

## Do This

```js
// ✅ String-name plugins — Turbopack resolves them at compile time
createMDX({
  options: {
    rehypePlugins: [['rehype-slug'], ['rehype-pretty-code', { theme: '…' }]],
  },
});
```

Options objects must still be plain serializable JSON (no functions).
`test: ['h2', 'h3', 'h4']` is fine; `test: (node) => …` is not.

## Related

- [[next-16-react-19-baseline]] — the decision that drove this incident.
- [[ssr-rsc-support-strategy]] — the broader build-tooling story.
