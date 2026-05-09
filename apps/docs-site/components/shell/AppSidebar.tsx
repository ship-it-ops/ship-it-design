'use client';

import { IconGlyph } from '@ship-it-ui/icons';
import { NavItem, NavSection, Sidebar } from '@ship-it-ui/ui';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

import { navigation } from '@/content/navigation';

/**
 * Driven entirely by `content/navigation.ts`. Each top-level section is a
 * collapsible `NavSection` that defaults open when the current route falls
 * inside it; inner groups stay as static-eyebrow `NavSection`s. Leaves
 * become `NavItem`s. NavItem renders a real `<a>` when `href` is set, so we
 * pass `href` directly and intercept the click for client-side navigation.
 *
 * Section-open state is tracked here (not via `defaultOpen`) so that SPA
 * navigations between top-level sections re-open the new current section —
 * `AppSidebar` is a persistent client component in App Router and would
 * otherwise hold the first-mount state forever. The user's manual collapses
 * are preserved across renders; only a route change into a different
 * section flips that section back open.
 */
export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const currentSectionId = navigation.find((s) => pathname.startsWith(`/${s.id}`))?.id;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    currentSectionId ? { [currentSectionId]: true } : {},
  );
  // Sections the user has explicitly collapsed. Tracked in a ref (not state)
  // so the auto-open effect doesn't re-fire on every section toggle — the
  // only thing the effect needs is to read `has(currentSectionId)` at the
  // moment a new route lands, which a ref provides without a dep entry.
  // Mutated synchronously in onOpenChange below; reads in the effect see the
  // latest value because route changes always run after click handlers commit.
  const userClosedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentSectionId || userClosedRef.current.has(currentSectionId)) return;
    setOpenSections((prev) =>
      prev[currentSectionId] ? prev : { ...prev, [currentSectionId]: true },
    );
  }, [currentSectionId]);

  return (
    <Sidebar width={260} className="overflow-y-auto">
      {navigation.map((section) => {
        const isCurrentSection = section.id === currentSectionId;
        const isOpen = openSections[section.id] ?? isCurrentSection;
        return (
          <NavSection
            key={section.id}
            label={section.label}
            collapsible
            open={isOpen}
            onOpenChange={(o) => {
              setOpenSections((prev) => ({ ...prev, [section.id]: o }));
              if (o) userClosedRef.current.delete(section.id);
              else userClosedRef.current.add(section.id);
            }}
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
