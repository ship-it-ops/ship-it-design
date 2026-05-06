'use client';

import { usePathname } from 'next/navigation';

import { Pager } from './Pager';

/**
 * Auto-slug variant of `Pager` for the docs layout. Derives the current
 * slug from the URL so the layout doesn't need server-side route info.
 *
 * The static `Pager` (which takes an explicit `slug` prop) stays available
 * for MDX authors who want to drop a pager mid-page.
 */
export function DocsPager() {
  const pathname = usePathname() ?? '/';
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
  return <Pager slug={slug} />;
}
