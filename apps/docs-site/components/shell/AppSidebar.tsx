'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';

import { NavItem, NavSection, Sidebar } from '@ship-it-ui/ui';

import { navigation } from '@/content/navigation';

/**
 * Driven entirely by `content/navigation.ts`. Each leaf becomes a `NavItem`;
 * each section becomes a stack of `NavSection` blocks. Active state matches
 * the slug against the current pathname.
 *
 * NavItem renders a real `<a>` when `href` is set (`Sidebar.tsx:86`), so we
 * pass `href` directly and intercept the click for client-side navigation.
 */
export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname() ?? '/';

  return (
    <Sidebar width={260} className="overflow-y-auto">
      {navigation.map((section) => (
        <div key={section.id} className="mb-2">
          <div className="text-text px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wider uppercase">
            {section.label}
          </div>
          {section.groups.map((group, gi) => (
            <NavSection key={`${section.id}-${gi}`} label={group.label}>
              {group.items.map((leaf) => {
                const href = `/${leaf.slug}`;
                const active = pathname === href || pathname === `${href}/`;
                return (
                  <NavItem
                    key={leaf.slug}
                    label={leaf.title}
                    active={active}
                    badge={leaf.badge}
                    href={href}
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Plain left-click → SPA navigation. Modifier keys and
                      // middle-click fall through to the browser's default.
                      if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                        e.preventDefault();
                        router.push(href);
                      }
                    }}
                  />
                );
              })}
            </NavSection>
          ))}
        </div>
      ))}
    </Sidebar>
  );
}
