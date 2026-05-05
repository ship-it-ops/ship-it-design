import type { ReactNode } from 'react';

import { DocsCrumbs } from './DocsCrumbs';
import { DocsPager } from './DocsPager';
import { TableOfContents } from './TableOfContents';

/**
 * Server-rendered shell around every MDX page in the `(docs)` route group.
 * The wrapper itself, the prose container, and the MDX `children` all
 * render on the server (so the static export ships real HTML for SEO and
 * first paint). The pieces that must read the pathname — breadcrumbs,
 * prev/next pager — are isolated client islands. The table of contents
 * also stays client-side because it observes the live DOM.
 */
export function DocsArticle({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-8 py-10">
      <div className="min-w-0 flex-1">
        <DocsCrumbs />
        <article className="docs-prose">{children}</article>
        <DocsPager />
      </div>
      <TableOfContents />
    </div>
  );
}
