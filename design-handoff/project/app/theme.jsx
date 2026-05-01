// Theme tokens for ShipIt. Dark-first with light toggle applied via data-theme.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  accentHue: 200,
  density: 'comfortable',
  showCopilot: true,
  graphLayout: 'radial',
}; /*EDITMODE-END*/

function makeTheme(mode, accentHue) {
  const h = accentHue ?? 200;
  if (mode === 'light') {
    return {
      bg: '#fbfbfa',
      panel: '#ffffff',
      panel2: '#f5f5f3',
      border: '#e8e8e4',
      borderStrong: '#d6d6d0',
      text: '#0e0e10',
      textMuted: '#5a5a63',
      textDim: '#8e8e96',
      accent: `oklch(0.72 0.13 ${h})`,
      accentText: `oklch(0.38 0.13 ${h})`,
      accentDim: `oklch(0.72 0.13 ${h} / 0.10)`,
      accentGlow: `oklch(0.72 0.13 ${h} / 0.25)`,
      ok: 'oklch(0.72 0.14 150)',
      warn: 'oklch(0.78 0.15 75)',
      err: 'oklch(0.64 0.20 25)',
      purple: 'oklch(0.7 0.15 300)',
      pink: 'oklch(0.72 0.15 0)',
      shadow: '0 1px 3px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.03)',
      nodeFill: '#ffffff',
      glowFill: `oklch(0.72 0.13 ${h} / 0.15)`,
    };
  }
  return {
    bg: '#0a0a0b',
    panel: '#111113',
    panel2: '#16161a',
    border: '#1f1f24',
    borderStrong: '#2a2a31',
    text: '#ededef',
    textMuted: '#8a8a94',
    textDim: '#55555d',
    accent: `oklch(0.82 0.12 ${h})`,
    accentText: `oklch(0.9 0.1 ${h})`,
    accentDim: `oklch(0.82 0.12 ${h} / 0.12)`,
    accentGlow: `oklch(0.82 0.12 ${h} / 0.4)`,
    ok: 'oklch(0.82 0.17 150)',
    warn: 'oklch(0.82 0.16 75)',
    err: 'oklch(0.72 0.19 25)',
    purple: 'oklch(0.78 0.14 300)',
    pink: 'oklch(0.78 0.15 0)',
    shadow: '0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
    nodeFill: '#16161a',
    glowFill: `oklch(0.82 0.12 ${h} / 0.3)`,
  };
}

const FONT = '"Geist", "Inter", system-ui, sans-serif';
const MONO = '"Geist Mono", "JetBrains Mono", monospace';

const ThemeCtx = React.createContext(null);
const useTheme = () => React.useContext(ThemeCtx);

Object.assign(window, { TWEAK_DEFAULTS, makeTheme, FONT, MONO, ThemeCtx, useTheme });
