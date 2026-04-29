import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { Avatar, type AvatarSize } from './Avatar';

const sizePx: Record<AvatarSize, number> = { xs: 20, sm: 24, md: 32, lg: 40, xl: 56 };

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Names rendered as stacked avatars. */
  names: string[];
  /** Maximum avatars before collapsing into a `+N` chip. Defaults to 3. */
  max?: number;
  /** Avatar size for the whole group. */
  size?: AvatarSize;
}

/**
 * Stacked avatars with overflow chip. Each avatar's initials and color is
 * deterministic from its name.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { names, max = 3, size = 'md', className, ...props },
  ref,
) {
  const dim = sizePx[size];
  const visible = names.slice(0, max);
  const rest = names.length - visible.length;
  const overlap = -dim * 0.35;

  return (
    <div ref={ref} className={cn('inline-flex', className)} {...props}>
      {visible.map((n, i) => (
        <span key={`${n}-${i}`} style={{ marginLeft: i === 0 ? 0 : overlap }}>
          <Avatar name={n} size={size} />
        </span>
      ))}
      {rest > 0 && (
        <span
          aria-label={`+${rest} more`}
          className="grid place-items-center rounded-full bg-panel-2 border border-border text-text-muted font-mono"
          style={{
            width: dim,
            height: dim,
            marginLeft: overlap,
            fontSize: dim * 0.35,
          }}
        >
          +{rest}
        </span>
      )}
    </div>
  );
});
