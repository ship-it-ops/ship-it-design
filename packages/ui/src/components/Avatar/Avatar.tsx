import * as RadixAvatar from '@radix-ui/react-avatar';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'ok' | 'warn' | 'err' | 'off';

const sizePx: Record<AvatarSize, number> = { xs: 20, sm: 24, md: 32, lg: 40, xl: 56 };

const statusBg: Record<AvatarStatus, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  err: 'bg-err',
  off: 'bg-text-dim',
};

function initialsFor(name: string): string {
  return (name || '?')
    .split(/\s+/)
    .map((p) => p[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function hashHue(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Display name. Used to derive initials and a deterministic background color. */
  name?: string;
  /** Image source. Falls back to initials if loading fails. */
  src?: string;
  /** Predefined size: xs (20) / sm (24) / md (32) / lg (40) / xl (56). */
  size?: AvatarSize;
  /** Optional presence indicator. */
  status?: AvatarStatus;
  /** Override the auto-generated initials (e.g., for non-Latin scripts). */
  initials?: string;
}

/**
 * Person/entity avatar. Auto-generates initials and a stable background color from
 * `name`. When `src` is provided, it's the primary; initials show during load and
 * after a load failure.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name = '?', src, size = 'md', status, initials, className, style, ...props },
  ref,
) {
  const dim = sizePx[size];
  const hue = hashHue(name);
  const computedInitials = initials ?? initialsFor(name);

  return (
    <span
      ref={ref}
      className={cn('relative inline-block', className)}
      style={{ width: dim, height: dim, ...style }}
      {...props}
    >
      <RadixAvatar.Root
        className="border-border relative inline-flex h-full w-full shrink-0 overflow-hidden rounded-full border"
        style={{ background: src ? undefined : `oklch(0.4 0.1 ${hue})` }}
      >
        {src && <RadixAvatar.Image src={src} alt={name} className="h-full w-full object-cover" />}
        <RadixAvatar.Fallback
          className="flex h-full w-full items-center justify-center font-sans font-semibold text-white"
          style={{ fontSize: dim * 0.38 }}
        >
          {computedInitials}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>
      {status && (
        <span
          role="img"
          aria-label={`status: ${status}`}
          className={cn(
            'border-bg absolute right-0 bottom-0 rounded-full border-[2px]',
            statusBg[status],
          )}
          style={{ width: dim * 0.3, height: dim * 0.3 }}
        />
      )}
    </span>
  );
});

Avatar.displayName = 'Avatar';
