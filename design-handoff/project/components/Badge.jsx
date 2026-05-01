// Badge, Tag, Chip. Full variant matrix.

function Badge({ variant = 'neutral', size = 'md', dot, icon, children, style = {} }) {
  const sizes = {
    sm: { fs: 10, px: 6, py: 1, h: 18, iconSize: 10, dotSize: 5, gap: 4 },
    md: { fs: 11, px: 8, py: 2, h: 22, iconSize: 11, dotSize: 6, gap: 5 },
    lg: { fs: 12, px: 10, py: 3, h: 26, iconSize: 12, dotSize: 7, gap: 6 },
  };
  const variants = {
    neutral: {
      bg: tokens.panel2,
      color: tokens.textMuted,
      border: tokens.border,
      dot: tokens.textDim,
    },
    accent: {
      bg: tokens.accentDim,
      color: tokens.accent,
      border: 'transparent',
      dot: tokens.accent,
    },
    success: {
      bg: 'color-mix(in oklab, var(--ok), transparent 85%)',
      color: tokens.ok,
      border: 'transparent',
      dot: tokens.ok,
    },
    warn: {
      bg: 'color-mix(in oklab, var(--warn), transparent 85%)',
      color: tokens.warn,
      border: 'transparent',
      dot: tokens.warn,
    },
    error: {
      bg: 'color-mix(in oklab, var(--err), transparent 85%)',
      color: tokens.err,
      border: 'transparent',
      dot: tokens.err,
    },
    purple: {
      bg: 'color-mix(in oklab, var(--purple), transparent 85%)',
      color: tokens.purple,
      border: 'transparent',
      dot: tokens.purple,
    },
    pink: {
      bg: 'color-mix(in oklab, var(--pink), transparent 85%)',
      color: tokens.pink,
      border: 'transparent',
      dot: tokens.pink,
    },
    outline: {
      bg: 'transparent',
      color: tokens.text,
      border: tokens.borderStrong,
      dot: tokens.textMuted,
    },
    solid: { bg: tokens.text, color: tokens.bg, border: tokens.text, dot: tokens.bg },
  };
  const s = sizes[size];
  const v = variants[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        padding: `${s.py}px ${s.px}px`,
        height: s.h,
        fontSize: s.fs,
        fontWeight: 500,
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: 999,
        fontFamily: tokens.fontSans,
        lineHeight: 1,
        ...style,
      }}
    >
      {dot && (
        <span
          style={{ width: s.dotSize, height: s.dotSize, borderRadius: 999, background: v.dot }}
        />
      )}
      {icon && <span style={{ fontSize: s.iconSize }}>{icon}</span>}
      {children}
    </span>
  );
}

function Tag({ children, onRemove, variant = 'neutral' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 4px 3px 8px',
        fontSize: 11,
        background: tokens.panel2,
        border: `1px solid ${tokens.border}`,
        color: tokens.text,
        borderRadius: 4,
        fontFamily: tokens.fontSans,
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: 'transparent',
            border: 'none',
            color: tokens.textDim,
            cursor: 'pointer',
            fontSize: 12,
            padding: '0 2px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

Object.assign(window, { Badge, Tag });
