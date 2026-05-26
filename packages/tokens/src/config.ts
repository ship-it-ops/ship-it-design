import type { ColorSemanticToken } from './color.js';
import type {
  FontSizeToken,
  FontWeightToken,
  LineHeightToken,
  TrackingToken,
} from './typography.js';

export type ShipItConfig = {
  /** Master OKLCH hue for the accent ramp. Mirrors `--accent-h`. */
  accentH?: number;
  /** Re-skin existing semantic color roles. Closed key set. */
  color?: {
    dark?: Partial<Record<ColorSemanticToken, string>>;
    light?: Partial<Record<ColorSemanticToken, string>>;
  };
  /** Re-skin typography tokens. Closed key set. */
  typography?: {
    fontFamily?: { sans?: string; mono?: string };
    fontSize?: Partial<Record<FontSizeToken, string>>;
    fontWeight?: Partial<Record<FontWeightToken, number>>;
    lineHeight?: Partial<Record<LineHeightToken, number>>;
    tracking?: Partial<Record<TrackingToken, string>>;
  };
  /** Where to write the sparse override CSS. Default: `.ship-it/tokens.css` at the project root. */
  output?: string;
};

/**
 * Identity function that brands the value as a `ShipItConfig`. Consumers call
 * this from `ship-it.config.ts` so they get autocomplete on the schema and
 * compile-time errors for unknown keys.
 */
export const defineConfig = (config: ShipItConfig): ShipItConfig => config;
