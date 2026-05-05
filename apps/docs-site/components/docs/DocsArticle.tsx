'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { Breadcrumbs, Crumb } from '@ship-it-ui/ui';

import { findLeaf, navigation } from '@/content/navigation';
import { Pager } from './Pager';
import { TableOfContents } from './TableOfContents';

/**
 * Wraps every MDX page rendered under the `(docs)` route group with the
 * shared chrome: breadcrumbs, prose article (so TOC can scrape headings),
 * right-rail TOC, prev/next pager.
 *
 * Slug is derived from the URL — there's no need for each MDX file to know
 * its own slug.
 */
export function DocsArticle({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
  const leaf = findLeaf(slug);
  const section = navigation.find((s) => slug.startsWith(`${s.id}/`));

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-8 py-10">
      <div className="min-w-0 flex-1">
        <Breadcrumbs aria-label="Breadcrumbs" className="mb-6">
          <Crumb href="/">Docs</Crumb>
          {section && <Crumb>{section.label}</Crumb>}
          {leaf && <Crumb current>{leaf.title}</Crumb>}
        </Breadcrumbs>
        <article className="docs-prose">{children}</article>
        <Pager slug={slug} />
      </div>
      <TableOfContents />
    </div>
  );
}
