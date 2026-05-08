'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import { NavItem, NavSection, Sidebar } from '@ship-it-ui/ui';
import { useRouter, usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';

import { navigation } from '@/content/navigation';

/**
 * Driven entirely by `content/navigation.ts`. Each top-level section is a
 * collapsible `NavSection` that defaults open when the current route falls
 * inside it; inner groups stay as static-eyebrow `NavSection`s. Leaves
 * become `NavItem`s. NavItem renders a real `<a>` when `href` is set, so we
 * pass `href` directly and intercept the click for client-side navigation.
 */
export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname() ?? '/';

  return (
    <Sidebar width={260} className="overflow-y-auto">
      {navigation.map((section) => {
        const isCurrentSection = pathname.startsWith(`/${section.id}`);
        return (
          <NavSection
            key={section.id}
            label={section.label}
            collapsible
            defaultOpen={isCurrentSection}
            indent={10}
            icon={section.icon ? <IconGlyph name={section.icon} size={12} /> : undefined}
          >
            {section.groups.map((group, gi) => (
              <NavSection key={`${section.id}-${gi}`} label={group.label} indent={8}>
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
                        if (
                          e.button === 0 &&
                          !e.metaKey &&
                          !e.ctrlKey &&
                          !e.shiftKey &&
                          !e.altKey
                        ) {
                          e.preventDefault();
                          router.push(href);
                        }
                      }}
                    />
                  );
                })}
              </NavSection>
            ))}
          </NavSection>
        );
      })}
    </Sidebar>
  );
}
