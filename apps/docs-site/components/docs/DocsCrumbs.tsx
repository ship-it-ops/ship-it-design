'use client';

import { usePathname } from 'next/navigation';

import { Breadcrumbs, Crumb } from '@ship-it-ui/ui';

import { findLeaf, navigation } from '@/content/navigation';

/**
 * Top-of-page breadcrumb. Lives as a tiny client island so the surrounding
 * `DocsArticle` and the MDX content underneath can stay server-rendered;
 * only the trail itself needs `usePathname`.
 */
export function DocsCrumbs() {
  const pathname = usePathname() ?? '/';
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
  const leaf = findLeaf(slug);
  const section = navigation.find((s) => slug.startsWith(`${s.id}/`));

  return (
    <Breadcrumbs aria-label="Breadcrumbs" className="mb-6">
      <Crumb href="/">Docs</Crumb>
      {section && <Crumb>{section.label}</Crumb>}
      {leaf && <Crumb current>{leaf.title}</Crumb>}
    </Breadcrumbs>
  );
}
