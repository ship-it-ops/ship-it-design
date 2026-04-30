// Shared primitives — Button, Card, Pill, Row, Icon, Mono, StatusDot, etc.

function Btn({ children, primary, ghost, small, icon, onClick, style = {} }) {
  const t = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: small ? '5px 10px' : '7px 12px',
        fontSize: small ? 11 : 12,
        fontWeight: 500,
        background: primary ? t.accent : ghost ? 'transparent' : t.panel2,
        color: primary ? '#0a0a0b' : t.text,
        border: `1px solid ${primary ? t.accent : t.border}`,
        borderRadius: 6,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s',
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: small ? 11 : 12, opacity: 0.9 }}>{icon}</span>}
      {children}
    </div>
  );
}

function Card({ children, style = {}, pad = 16 }) {
  const t = useTheme();
  return (
    <div
      style={{
        background: t.panel,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: pad,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color, style = {} }) {
  const t = useTheme();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        fontSize: 10,
        fontWeight: 500,
        background: color ? `${color}22` : t.panel2,
        color: color || t.textMuted,
        border: `1px solid ${color ? `${color}44` : t.border}`,
        borderRadius: 999,
        fontFamily: MONO,
        letterSpacing: 0.3,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Dot({ color, glow }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 6,
        height: 6,
        borderRadius: 999,
        background: color,
        boxShadow: glow ? `0 0 10px ${color}` : 'none',
        flexShrink: 0,
      }}
    />
  );
}

function SectionLabel({ children, right, style = {} }) {
  const t = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 10,
        color: t.textDim,
        fontFamily: MONO,
        textTransform: 'uppercase',
        letterSpacing: 1.3,
        marginBottom: 10,
        ...style,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{children}</span>
      {right && <span>{right}</span>}
    </div>
  );
}

function PropRow({ k, v, accent, dim, last }) {
  const t = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        padding: '5px 0',
        borderBottom: last ? 'none' : `1px solid ${t.border}`,
        fontSize: 11,
        fontFamily: MONO,
      }}
    >
      <span style={{ color: t.textDim, width: 70 }}>{k}</span>
      <span style={{ color: accent ? t.accent : dim ? t.textDim : t.text, flex: 1 }}>{v}</span>
    </div>
  );
}

function TypeBadge({ type }) {
  const t = useTheme();
  const colors = {
    LogicalService: t.accent,
    Repository: t.purple,
    Deployment: t.ok,
    RuntimeService: t.warn,
    Team: t.pink,
    Person: t.textMuted,
    Pipeline: t.purple,
    Monitor: t.accent,
  };
  return <Pill color={colors[type] || t.textMuted}>{type}</Pill>;
}

function StatusDot({ status }) {
  const t = useTheme();
  const map = { healthy: t.ok, degraded: t.warn, error: t.err };
  return <Dot color={map[status] || t.textMuted} glow={status === 'healthy'} />;
}

function MonoText({ children, style = {} }) {
  return <span style={{ fontFamily: MONO, ...style }}>{children}</span>;
}

function IconGlyph({ name, size = 14, color }) {
  // Minimal geometric glyphs to avoid hand-drawn SVG slop
  const map = {
    home: '◱',
    graph: '⋈',
    ask: '✦',
    connectors: '⌁',
    schema: '≡',
    incident: '◎',
    activity: '↗',
    settings: '⚙',
    search: '⌕',
    close: '×',
    chevron: '›',
    arrow: '→',
    check: '✓',
    sparkle: '✦',
    node: '◆',
    ring: '◯',
    grid: '▦',
    pause: '⏸',
    play: '▶',
    tier1: '◆',
    tier2: '◇',
  };
  return (
    <span style={{ fontSize: size, color, lineHeight: 1, display: 'inline-block' }}>
      {map[name] || name}
    </span>
  );
}

function AskHint({ style = {} }) {
  const t = useTheme();
  return (
    <span
      style={{
        padding: '2px 6px',
        fontSize: 10,
        fontFamily: MONO,
        background: t.panel2,
        border: `1px solid ${t.border}`,
        borderRadius: 4,
        color: t.textDim,
        ...style,
      }}
    >
      ⌘K
    </span>
  );
}

Object.assign(window, {
  Btn,
  Card,
  Pill,
  Dot,
  SectionLabel,
  PropRow,
  TypeBadge,
  StatusDot,
  MonoText,
  IconGlyph,
  AskHint,
});
