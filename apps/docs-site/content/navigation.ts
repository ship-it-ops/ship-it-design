/**
 * Single source of truth for the docs sidebar.
 *
 * Filesystem order is meaningless — the order here is the order users see.
 * Pages are served directly as `app/(docs)/<slug>/page.mdx` via Next's
 * `pageExtensions: ['ts','tsx','mdx']`, so a route only becomes reachable
 * once an entry is added here AND a matching `page.mdx` exists.
 *
 * To add a page: drop the MDX at `app/(docs)/<section>/<slug>/page.mdx`
 * and add an entry to the matching section below.
 */

import type { GlyphName } from '@ship-it-ui/icons';

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
  /** Glyph rendered next to the section header in the sidebar. */
  icon?: GlyphName;
  groups: NavGroup[];
}

export const navigation: NavSection[] = [
  {
    id: 'get-started',
    label: 'Get Started',
    icon: 'home',
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
    icon: 'brand',
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
        label: 'Guidelines',
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
    icon: 'service',
    groups: [
      {
        label: 'Inputs',
        items: [
          { title: 'Button', slug: 'components/button' },
          { title: 'ButtonGroup', slug: 'components/button-group' },
          { title: 'Checkbox', slug: 'components/checkbox' },
          { title: 'FAB', slug: 'components/fab' },
          { title: 'Field', slug: 'components/field' },
          { title: 'IconButton', slug: 'components/icon-button' },
          { title: 'Input', slug: 'components/input' },
          { title: 'OTP', slug: 'components/otp' },
          { title: 'Radio', slug: 'components/radio' },
          { title: 'SearchInput', slug: 'components/search-input' },
          { title: 'Select', slug: 'components/select' },
          { title: 'Slider', slug: 'components/slider' },
          { title: 'SplitButton', slug: 'components/split-button' },
          { title: 'Switch', slug: 'components/switch' },
          { title: 'Textarea', slug: 'components/textarea' },
        ],
      },
      {
        label: 'Display',
        items: [
          { title: 'Avatar', slug: 'components/avatar' },
          { title: 'Badge', slug: 'components/badge' },
          { title: 'Card', slug: 'components/card' },
          { title: 'Chip', slug: 'components/chip' },
          { title: 'Kbd', slug: 'components/kbd' },
          { title: 'Skeleton', slug: 'components/skeleton' },
          { title: 'StatusDot', slug: 'components/status-dot' },
          { title: 'Tag', slug: 'components/tag' },
        ],
      },
      {
        label: 'Overlays',
        items: [
          { title: 'ContextMenu', slug: 'components/context-menu' },
          { title: 'Dialog', slug: 'components/dialog' },
          { title: 'DropdownMenu', slug: 'components/dropdown-menu' },
          { title: 'HoverCard', slug: 'components/hover-card' },
          { title: 'Popover', slug: 'components/popover' },
          { title: 'Toast', slug: 'components/toast' },
          { title: 'Tooltip', slug: 'components/tooltip' },
        ],
      },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    icon: 'graph',
    groups: [
      {
        label: 'Navigation',
        items: [
          { title: 'Breadcrumbs', slug: 'patterns/breadcrumbs' },
          { title: 'CommandPalette', slug: 'patterns/command-palette' },
          { title: 'Dots', slug: 'patterns/dots' },
          { title: 'Pagination', slug: 'patterns/pagination' },
          { title: 'Stepper', slug: 'patterns/stepper' },
          { title: 'Tabs', slug: 'patterns/tabs' },
        ],
      },
      {
        label: 'Forms',
        items: [
          { title: 'Combobox', slug: 'patterns/combobox' },
          { title: 'DatePicker', slug: 'patterns/date-picker' },
          { title: 'Dropzone', slug: 'patterns/dropzone' },
          { title: 'FileChip', slug: 'patterns/file-chip' },
        ],
      },
      {
        label: 'Feedback',
        items: [
          { title: 'Alert', slug: 'patterns/alert' },
          { title: 'Banner', slug: 'patterns/banner' },
          { title: 'EmptyState', slug: 'patterns/empty-state' },
          { title: 'Progress', slug: 'patterns/progress' },
          { title: 'RadialProgress', slug: 'patterns/radial-progress' },
          { title: 'Spinner', slug: 'patterns/spinner' },
        ],
      },
      {
        label: 'Data',
        items: [
          { title: 'DataTable', slug: 'patterns/data-table' },
          { title: 'Timeline', slug: 'patterns/timeline' },
          { title: 'Tree', slug: 'patterns/tree' },
        ],
      },
      {
        label: 'Layout',
        items: [
          { title: 'Menubar', slug: 'patterns/menubar' },
          { title: 'NavBar', slug: 'patterns/nav-bar' },
          { title: 'Sidebar', slug: 'patterns/sidebar' },
          { title: 'Topbar', slug: 'patterns/topbar' },
        ],
      },
      {
        label: 'Charts',
        items: [{ title: 'Sparkline', slug: 'patterns/sparkline' }],
      },
    ],
  },
  {
    id: 'shipit',
    label: 'ShipIt',
    icon: 'sparkle',
    groups: [
      {
        label: 'AI',
        items: [
          { title: 'AskBar', slug: 'shipit/ask-bar' },
          { title: 'Citation', slug: 'shipit/citation' },
          { title: 'ConfidenceIndicator', slug: 'shipit/confidence-indicator' },
          { title: 'CopilotMessage', slug: 'shipit/copilot-message' },
          { title: 'ReasoningBlock', slug: 'shipit/reasoning-block' },
          { title: 'SuggestionChip', slug: 'shipit/suggestion-chip' },
          { title: 'ToolCallCard', slug: 'shipit/tool-call-card' },
        ],
      },
      {
        label: 'Entity',
        items: [
          { title: 'EntityBadge', slug: 'shipit/entity-badge' },
          { title: 'EntityCard', slug: 'shipit/entity-card' },
          { title: 'EntityListRow', slug: 'shipit/entity-list-row' },
        ],
      },
      {
        label: 'Graph',
        items: [
          { title: 'GraphEdge', slug: 'shipit/graph-edge' },
          { title: 'GraphInspector', slug: 'shipit/graph-inspector' },
          { title: 'GraphLegend', slug: 'shipit/graph-legend' },
          { title: 'GraphMinimap', slug: 'shipit/graph-minimap' },
          { title: 'GraphNode', slug: 'shipit/graph-node' },
          { title: 'PathOverlay', slug: 'shipit/path-overlay' },
        ],
      },
      {
        label: 'Marketing',
        items: [
          { title: 'CTAStrip', slug: 'shipit/ctastrip' },
          { title: 'FeatureGrid', slug: 'shipit/feature-grid' },
          { title: 'Footer', slug: 'shipit/footer' },
          { title: 'Hero', slug: 'shipit/hero' },
          { title: 'PricingCard', slug: 'shipit/pricing-card' },
          { title: 'Testimonial', slug: 'shipit/testimonial' },
        ],
      },
      {
        label: 'Data',
        items: [{ title: 'EntityTable', slug: 'shipit/entity-table' }],
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
