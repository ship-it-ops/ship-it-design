'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils/cn';

/**
 * SwatchGroup — a curated, selectable grid of color tiles (e.g. an
 * accent-color picker). NOT a freeform color input: the consumer supplies a
 * fixed list of `swatches` and the group emits the `value` of the chosen one.
 *
 * Implements the WAI-ARIA radiogroup pattern: the container is a
 * `role="radiogroup"`, each tile a `role="radio"` button with roving tabIndex.
 * Arrow keys move selection (and DOM focus) with wrap; Home/End jump to the
 * first/last tile. Mirrors the keyboard + focus model used by `Rating`.
 */

export interface SwatchItem {
  /** Stable identifier emitted via `onValueChange`. */
  value: string;
  /** CSS color shown on the tile (any CSS color; rendered via inline style). */
  color: string;
  /** Accessible name for the tile. Defaults to `value`. */
  label?: string;
}

const tileStyles = cva(
  cn(
    'relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md',
    'border-border border',
    'outline-none focus-visible:ring-accent-dim focus-visible:ring-[3px]',
    'transition-[box-shadow,transform] duration-(--duration-micro)',
    // Selection ring follows the tile's own border-radius (selection-ring pattern).
    'data-[checked]:ring-accent data-[checked]:ring-2 data-[checked]:ring-offset-1 data-[checked]:ring-offset-panel',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ),
  {
    variants: {
      size: {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const checkSizeMap = {
  sm: 12,
  md: 16,
  lg: 20,
} as const;

export interface SwatchGroupProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'role'>,
    VariantProps<typeof tileStyles> {
  /** The curated set of color tiles to render. */
  swatches: ReadonlyArray<SwatchItem>;
  /** Selected swatch value (controlled). */
  value?: string;
  /** Default selected value (uncontrolled). */
  defaultValue?: string;
  /** Fires with the new value on click / keyboard select. */
  onValueChange?: (value: string) => void;
  /** Visible label rendered above the group, also used as the accessible name. */
  label?: string;
  /** Accessible name for the group when no visible `label` is provided. */
  'aria-label'?: string;
}

/**
 * Perceived luminance of a CSS color string, 0 (black) … 1 (white). Parses
 * `#rgb` / `#rgba` / `#rrggbb` / `#rrggbbaa` hex and `rgb()/rgba()` functional
 * notation. Returns `null` for anything it can't parse so the caller can fall
 * back to a safe default check color.
 */
function relativeLuminance(color: string): number | null {
  const c = color.trim().toLowerCase();
  let r: number;
  let g: number;
  let b: number;

  const hexMatch = /^#([0-9a-f]{3,8})$/.exec(c);
  if (hexMatch?.[1]) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }
    if (hex.length !== 6 && hex.length !== 8) return null;
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    const rgbMatch = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(c);
    if (!rgbMatch) return null;
    r = Number(rgbMatch[1]);
    g = Number(rgbMatch[2]);
    b = Number(rgbMatch[3]);
  }

  if ([r, g, b].some((v) => Number.isNaN(v))) return null;

  // Standard luminance approximation (sRGB coefficients), normalized to 0…1.
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Pick a check-mark color that contrasts against the swatch. Light swatches get
 * a dark check, dark swatches a light check. Unparseable colors default to a
 * dark check on the assumption of a light-ish surface.
 */
function contrastingCheckColor(color: string): string {
  const lum = relativeLuminance(color);
  if (lum === null) return '#000000';
  return lum > 0.5 ? '#000000' : '#ffffff';
}

export const SwatchGroup = forwardRef<HTMLDivElement, SwatchGroupProps>(function SwatchGroup(
  {
    swatches,
    value,
    defaultValue,
    onValueChange,
    size: sizeProp,
    label,
    'aria-label': ariaLabel,
    className,
    ...props
  },
  ref,
) {
  const size = sizeProp ?? 'md';
  const [current, setCurrent] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
  });

  const reactId = useId();
  const labelId = `${reactId}-label`;

  // Imperative focus on keyboard nav — the WAI-ARIA radiogroup pattern requires
  // arrow keys to move `document.activeElement`, not just `aria-checked`.
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const focusIndexRef = useRef<number | null>(null);

  const selectedIndex = swatches.findIndex((s) => s.value === current);

  useEffect(() => {
    if (focusIndexRef.current === null) return;
    const i = focusIndexRef.current;
    focusIndexRef.current = null;
    buttonsRef.current[i]?.focus();
  });

  const selectAt = (index: number, viaKeyboard = false) => {
    const swatch = swatches[index];
    if (!swatch) return;
    if (viaKeyboard) focusIndexRef.current = index;
    setCurrent(swatch.value);
  };

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (swatches.length === 0) return;
    const count = swatches.length;
    // Base navigation off the current selection, or the first tile if none.
    const base = selectedIndex >= 0 ? selectedIndex : 0;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        selectAt((base + 1) % count, true);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        selectAt((base - 1 + count) % count, true);
        break;
      case 'Home':
        e.preventDefault();
        selectAt(0, true);
        break;
      case 'End':
        e.preventDefault();
        selectAt(count - 1, true);
        break;
      default:
        break;
    }
  };

  const groupName = label ?? ariaLabel;

  return (
    <div className={cn('inline-flex flex-col gap-1.5', className)}>
      {label && (
        <span id={labelId} className="text-text-dim text-[12px] font-medium">
          {label}
        </span>
      )}
      <div
        ref={ref}
        role="radiogroup"
        tabIndex={-1}
        aria-label={!label ? (groupName ?? 'Color') : undefined}
        aria-labelledby={label ? labelId : undefined}
        onKeyDown={handleKey}
        // Padding so the selection ring + offset isn't clipped by the inline-flex box.
        className="inline-flex flex-wrap items-center gap-2 p-0.5"
        {...props}
      >
        {swatches.map((swatch, i) => {
          const selected = swatch.value === current;
          const tabbable = selected || (selectedIndex < 0 && i === 0);
          const name = swatch.label ?? swatch.value;
          return (
            <button
              key={swatch.value}
              ref={(el) => {
                buttonsRef.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={name}
              data-checked={selected ? '' : undefined}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => selectAt(i)}
              className={tileStyles({ size })}
              style={{ background: swatch.color }}
            >
              {selected && (
                <svg
                  width={checkSizeMap[size]}
                  height={checkSizeMap[size]}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={contrastingCheckColor(swatch.color)}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  data-swatch-check
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

SwatchGroup.displayName = 'SwatchGroup';
