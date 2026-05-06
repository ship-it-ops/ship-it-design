/**
 * @ship-it-ui/shipit — ShipIt-AI domain composites built on @ship-it-ui/ui.
 *
 * AI surfaces, knowledge-graph chrome, entity displays, and marketing
 * sections. Add new composites here as they're built. Keep exports
 * alphabetical within each category.
 */

// Utilities — re-exported from @ship-it-ui/ui to keep the canonical implementation
// in one place (clsx + tailwind-merge live there).
export { cn } from '@ship-it-ui/ui';

// AI surfaces
export * from './ai';

// Entity displays
export * from './entity';

// Graph chrome
export * from './graph';

// Marketing
export * from './marketing';

// Data composites
export * from './data';
