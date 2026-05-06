# apps/docs-site

Next.js 15 docs site for `@ship-it-ui/*`. App Router, MDX, static export to
GitHub Pages.

The chrome (Topbar / Sidebar / ⌘K palette / theme toggle) is built entirely
from `@ship-it-ui/ui` — the docs eat their own dog food.

## Local

```bash
pnpm dev    # http://localhost:3000
```

## Build

```bash
pnpm --filter docs-site build   # static export to apps/docs-site/out/
```

## Layout

```
app/
  page.tsx               Landing page
  layout.tsx             Root layout (Topbar + Sidebar + ToastProvider)
  (docs)/                Route group: every MDX page lives under here
    layout.tsx           DocsArticle wrapper (breadcrumbs + TOC + Pager)
    foundations/         Foundations MDX
    components/          Per-component MDX (Button piloted)
content/
  navigation.ts          Single source of truth for sidebar IA
components/
  shell/                 AppTopbar, AppSidebar, ThemeToggle, AppShell
  docs/                  CodeBlock, Callout, LivePreview, PropsTable, TOC, …
examples/
  <kebab>/<example>.tsx  One file per example, default-exports a component
scripts/
  build-examples-registry.ts  Walks examples/, emits .generated/examples.ts
  build-docgen.ts             Runs react-docgen-typescript over packages/*
  build-search-index.ts       Builds public/search-index.json from MDX headings
```

## How an MDX page references an example

```mdx
<LivePreview example="button/primary" />
```

The slug maps to `apps/docs-site/examples/button/primary.tsx`. The `predev` /
`prebuild` script writes `.generated/examples.ts` mapping each slug to
`{ Component, source }`. `LivePreview` renders the component on the Preview tab
and the raw source (highlighted by Shiki) on the Code tab.

## Migrating more components

The Button page (`app/(docs)/components/button/page.mdx`) is the pilot. To add
another component:

1. Create `examples/<kebab>/<example>.tsx` files (each default-exports a single
   React component).
2. Add a `app/(docs)/components/<kebab>/page.mdx` modeled on
   `components/button/page.mdx`.
3. Add the entry to `content/navigation.ts`.
