/**
 * Single source of truth for the docs sidebar.
 *
 * Filesystem order is meaningless — the order here is the order users see.
 * The MDX router (`app/[[...slug]]/page.tsx`) and the Sidebar component
 * (`components/shell/AppSidebar.tsx`) both read from this file, so a page
 * unreachable from the sidebar is also unreachable by URL.
 *
 * To add a page: drop the MDX into `content/<section>/`, add an entry here.
 */

export interface NavLeaf {
  title: string;
  /** Slug relative to site root, no leading slash. */
  slug: string;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavLeaf[];
}

export interface NavSection {
  /** Top-level section, becomes the first slug segment. */
  id: string;
  label: string;
  groups: NavGroup[];
}

export const navigation: NavSection[] = [
  {
    id: 'get-started',
    label: 'Get Started',
    groups: [
      {
        label: 'Overview',
        items: [
          { title: 'Introduction', slug: 'get-started/introduction' },
          { title: 'Installation', slug: 'get-started/installation' },
          { title: 'Theming', slug: 'get-started/theming' },
        ],
      },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    groups: [
      {
        label: 'Tokens',
        items: [
          { title: 'Color', slug: 'foundations/color' },
          { title: 'Typography', slug: 'foundations/typography' },
          { title: 'Spacing', slug: 'foundations/spacing' },
          { title: 'Motion', slug: 'foundations/motion' },
        ],
      },
      {
        label: 'Foundations',
        items: [
          { title: 'Design Principles', slug: 'foundations/principles' },
          { title: 'Iconography', slug: 'foundations/iconography' },
          { title: 'Layout', slug: 'foundations/layout' },
          { title: 'Accessibility', slug: 'foundations/accessibility' },
          { title: 'Voice & Content', slug: 'foundations/voice-and-content' },
        ],
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    groups: [
      {
        label: 'Inputs',
        items: [
          { title: 'Button', slug: 'components/button' },
          // TODO: rest of components migrated in a follow-up PR (see plan).
        ],
      },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    groups: [
      {
        label: 'Coming soon',
        items: [],
      },
    ],
  },
  {
    id: 'shipit',
    label: 'ShipIt',
    groups: [
      {
        label: 'Coming soon',
        items: [],
      },
    ],
  },
];

/** Flatten to an ordered list of leafs (used by Pager and Search). */
export function flatNav(): NavLeaf[] {
  return navigation.flatMap((s) => s.groups.flatMap((g) => g.items));
}

/** Resolve a slug to its leaf entry, or undefined. */
export function findLeaf(slug: string): NavLeaf | undefined {
  return flatNav().find((l) => l.slug === slug);
}

/** Find prev/next neighbors for the Pager. */
export function neighbors(slug: string): { prev?: NavLeaf; next?: NavLeaf } {
  const flat = flatNav();
  const i = flat.findIndex((l) => l.slug === slug);
  if (i === -1) return {};
  return { prev: flat[i - 1], next: flat[i + 1] };
}
