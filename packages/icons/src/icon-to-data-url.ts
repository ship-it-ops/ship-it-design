import { iconData } from './icon-data';

/**
 * Build a `data:image/svg+xml;…` URL from a registered icon (or any literal
 * string, which falls back to a centered `<text>` glyph). Intended for
 * consumers that paint icons into non-DOM surfaces — cytoscape's
 * `background-image`, canvas `drawImage`, Mermaid's image nodes, etc. —
 * where React rendering isn't an option.
 *
 * The emitted SVG carries explicit `width` and `height` attributes
 * (cytoscape rasterises canvas backgrounds through `<img>`, which treats a
 * `viewBox`-only `<svg>` as 0×0 intrinsic dimensions and paints nothing).
 *
 * @param name   Icon name (`'service'`, `'github'`, …) or a literal glyph
 *               character (`'◇'`) to render as text. Brand logos are
 *               addressed as `logo:<name>` (e.g. `'logo:github'`) since they
 *               share a namespace with semantic glyphs. The legacy
 *               `connector:<name>` prefix is still accepted as a deprecated
 *               alias and resolves to the same icon.
 * @param options.color  CSS color for stroke/fill. Defaults to `#000`. Note
 *               that `currentColor` does not resolve inside an `<img>` — pass
 *               the resolved sRGB value when calling from a stylesheet.
 * @param options.size   Pixel size for both width and height. Defaults to 52
 *               (matches the cytoscape adapter's node dimensions).
 */
export function iconToSvgDataUrl(
  name: string,
  options: { color?: string; size?: number } = {},
): string {
  const color = options.color ?? '#000';
  const size = options.size ?? 52;
  const svg = renderSvg(name, color, size);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const LEGACY_LOGO_PREFIX = 'connector:';

/**
 * Resolve a name against the icon data, accepting three spellings:
 *   - a direct key (`'service'`, `'logo:github'`),
 *   - a bare logo name (`'github'` → `logo:github`),
 *   - the deprecated `connector:<name>` prefix (→ `logo:<name>`).
 */
function lookupIconData(name: string) {
  const legacy = name.startsWith(LEGACY_LOGO_PREFIX)
    ? `logo:${name.slice(LEGACY_LOGO_PREFIX.length)}`
    : undefined;
  return iconData[name] ?? (legacy ? iconData[legacy] : undefined) ?? iconData[`logo:${name}`];
}

function renderSvg(name: string, color: string, size: number): string {
  const data = lookupIconData(name);
  if (data) {
    // Lucide bodies use `stroke="currentColor"` (most icons) and `fill="none"`,
    // so the wrapper has to set BOTH:
    //   - `style="color:X"` so `currentColor` references in the body resolve
    //     to the requested color. This is the load-bearing piece — without
    //     it `currentColor` inside an `<img src="data:image/svg+xml">`
    //     resolves to the user-agent default (black), making the icon
    //     invisible against dark-themed node backgrounds.
    //   - `fill="X"` for the small subset of icons whose body uses
    //     `fill="currentColor"` instead of stroke.
    // Browsers honor inline `style` on inline-document SVGs even when
    // referenced via `<img>`, so this works for cytoscape, canvas
    // `drawImage`, and Mermaid image nodes alike.
    const c = escapeAttr(color);
    return (
      `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' ` +
      `viewBox='${data.viewBox}' fill='${c}' style='color:${c}'>` +
      data.body +
      `</svg>`
    );
  }

  // Fallback: render the literal `name` as centered SVG <text>. Handles both
  // the legacy `EntityTypeMeta.glyph` unicode chars and arbitrary strings.
  const safeGlyph = escapeXml(name);
  return (
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' ` +
    `viewBox='0 0 ${size} ${size}'>` +
    `<text x='${size / 2}' y='${size * 0.65}' text-anchor='middle' ` +
    `font-family='ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace' ` +
    `font-size='${Math.round(size * 0.5)}' fill='${escapeAttr(color)}'>${safeGlyph}</text>` +
    `</svg>`
  );
}

const XML_ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
};

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (c) => XML_ESCAPES[c] ?? c);
}

function escapeAttr(value: string): string {
  return value.replace(/['"<>&]/g, (c) => XML_ESCAPES[c] ?? c);
}
