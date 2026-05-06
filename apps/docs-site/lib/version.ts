import pkg from '@ship-it-ui/ui/package.json';

/**
 * Single source of truth for the docs-site's headline version badge.
 * Tracks `@ship-it-ui/ui` because that's the package consumers install
 * first; changesets bumps both `ui` and `shipit` together so either
 * works, but `ui` is the canonical anchor.
 */
export const SYSTEM_VERSION = `v${pkg.version}`;
