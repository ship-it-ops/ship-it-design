import type { AvatarSize } from './Avatar';

/**
 * Pixel dimensions for each avatar size token. Shared by `Avatar` and
 * `AvatarGroup` so the visual scale stays in lockstep.
 */
export const sizePx: Record<AvatarSize, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
};
