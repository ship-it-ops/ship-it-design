'use client';

import { Badge, SimpleTooltip } from '@ship-it-ui/ui';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

/**
 * StalenessChip — pairs with `ConfidenceIndicator` in the "data trust"
 * component family. Renders a tier-coloured chip with a humanised age
 * ("Updated 3h ago") so consumers can answer "when was this last seen?" at
 * a glance.
 *
 * Tier derivation:
 *   ageSeconds ≤ thresholds[0]  →  `ok`   (fresh)
 *   ageSeconds ≤ thresholds[1]  →  `warn` (stale)
 *   otherwise                    →  `err`  (very stale)
 *
 * Default thresholds: `[3600, 86400]` (1 hour / 24 hours) — knowledge-graph
 * payloads usually fall on those breakpoints. Override per-surface with the
 * `thresholds` prop.
 */

export type StalenessTier = 'ok' | 'warn' | 'err';

export interface StalenessChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'prefix'> {
  /** Age in seconds since the data was last refreshed. Must be non-negative. */
  ageSeconds: number;
  /** `[okMaxSeconds, warnMaxSeconds]`. Defaults to `[3600, 86400]`. */
  thresholds?: readonly [number, number];
  /** Optional leading label, e.g. `"Updated"` → "Updated 3h ago". */
  prefix?: ReactNode;
  /**
   * Optional tooltip body. Rendered via the `SimpleTooltip` convenience —
   * the chip becomes its trigger.
   */
  tooltip?: ReactNode;
}

const DEFAULT_THRESHOLDS: readonly [number, number] = [3600, 86400];

/**
 * Pure age-to-string formatter. Exported so consumers (and tests) can compose
 * it without rendering the chip. Returns "just now" / "Xm" / "Xh" / "Xd"
 * depending on magnitude. Negative inputs are clamped to 0.
 */
export function formatAge(ageSeconds: number): string {
  const age = Math.max(0, Math.floor(ageSeconds));
  if (age < 60) return 'just now';
  if (age < 3600) return `${Math.floor(age / 60)}m`;
  if (age < 86400) return `${Math.floor(age / 3600)}h`;
  return `${Math.floor(age / 86400)}d`;
}

function deriveTier(
  ageSeconds: number,
  [okMax, warnMax]: readonly [number, number],
): StalenessTier {
  if (ageSeconds <= okMax) return 'ok';
  if (ageSeconds <= warnMax) return 'warn';
  return 'err';
}

export const StalenessChip = forwardRef<HTMLSpanElement, StalenessChipProps>(function StalenessChip(
  { ageSeconds, thresholds = DEFAULT_THRESHOLDS, prefix, tooltip, ...props },
  ref,
) {
  const tier = deriveTier(ageSeconds, thresholds);
  const humanised = formatAge(ageSeconds);
  const isInstant = humanised === 'just now';

  const chip = (
    <Badge ref={ref} variant={tier} size="sm" dot {...props}>
      {prefix && <span>{prefix}</span>}
      <span className="font-mono tabular-nums">{isInstant ? humanised : `${humanised} ago`}</span>
    </Badge>
  );

  if (tooltip) {
    return <SimpleTooltip content={tooltip}>{chip}</SimpleTooltip>;
  }
  return chip;
});

StalenessChip.displayName = 'StalenessChip';
