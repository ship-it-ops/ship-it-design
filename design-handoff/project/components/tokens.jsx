// Shared token map — read from CSS custom properties defined in colors_and_type.css.
// Keeping a JS mirror avoids repeating var(--...) calls in inline styles.

const tokens = {
  bg: 'var(--bg)',
  panel: 'var(--panel)',
  panel2: 'var(--panel-2)',
  border: 'var(--border)',
  borderStrong: 'var(--border-strong)',
  text: 'var(--text)',
  textMuted: 'var(--text-muted)',
  textDim: 'var(--text-dim)',
  accent: 'var(--accent)',
  accentDim: 'var(--accent-dim)',
  accentGlow: 'var(--accent-glow)',
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  err: 'var(--err)',
  purple: 'var(--purple)',
  pink: 'var(--pink)',
  shadow: 'var(--shadow)',
  shadowLg: 'var(--shadow-lg)',
  fontSans: 'var(--font-sans)',
  fontMono: 'var(--font-mono)',
};

Object.assign(window, { tokens });
