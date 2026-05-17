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
 *               character (`'◇'`) to render as text. Connector logos are
 *               addressed as `connector:<name>` (e.g. `'connector:github'`)
 *               since they share a namespace with semantic glyphs.
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

function renderSvg(name: string, color: string, size: number): string {
  const data = iconData[name] ?? iconData[`connector:${name}`];
  if (data) {
    // Inject a `fill` on the wrapper so monochrome SVGs (most of Lucide) pick
    // up the requested color. Iconify bodies use `currentColor` or `none`
    // internally, both of which resolve against the wrapper's `fill`.
    return (
      `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' ` +
      `viewBox='${data.viewBox}' fill='${escapeAttr(color)}'>` +
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
