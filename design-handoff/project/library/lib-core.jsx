// Library · shared CSS-in-JS utilities + Specimen wrapper with live + code toggle.
// All components use var(--*) from colors_and_type.css.

const T = {
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
};
const FF = 'var(--font-sans)';
const FM = 'var(--font-mono)';

/* ─────── Specimen scaffolding ─────── */

function Section({ id, title, desc, children, count }) {
  return (
    <section id={id} style={{ marginBottom: 80, scrollMarginTop: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 14,
          marginBottom: 6,
          paddingBottom: 14,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4, margin: 0 }}>{title}</h2>
        <span
          style={{
            fontFamily: FM,
            fontSize: 10,
            color: T.textDim,
            textTransform: 'uppercase',
            letterSpacing: 1.4,
          }}
        >
          #{id}
        </span>
        {count != null && (
          <span style={{ fontFamily: FM, fontSize: 10, color: T.textDim, marginLeft: 'auto' }}>
            {count} specimens
          </span>
        )}
      </div>
      {desc && (
        <p
          style={{
            fontSize: 13,
            color: T.textMuted,
            margin: '10px 0 26px',
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          {desc}
        </p>
      )}
      {children}
    </section>
  );
}

function Subsection({ title, children, desc, note }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
        <div
          style={{
            fontFamily: FM,
            fontSize: 10,
            color: T.textDim,
            textTransform: 'uppercase',
            letterSpacing: 1.6,
          }}
        >
          {title}
        </div>
        {note && (
          <div
            style={{
              fontFamily: FM,
              fontSize: 9,
              color: T.textDim,
              padding: '2px 6px',
              border: `1px solid ${T.border}`,
              borderRadius: 3,
            }}
          >
            {note}
          </div>
        )}
      </div>
      {desc && (
        <div
          style={{
            fontSize: 12,
            color: T.textMuted,
            marginBottom: 14,
            maxWidth: 580,
            lineHeight: 1.55,
          }}
        >
          {desc}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Specimen: displays a live preview with an optional JSX snippet toggle.
 *
 * Usage:
 *   <Specimen code={`<Button>Click</Button>`}>
 *     <Button>Click</Button>
 *   </Specimen>
 */
function Specimen({
  children,
  label,
  pad = 22,
  align = 'flex-start',
  bg,
  wrap = 'wrap',
  gap = 12,
  code,
  height,
}) {
  const [showCode, setShowCode] = React.useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{ fontFamily: FM, fontSize: 10, color: T.textDim, marginBottom: 8 }}>
          {label}
        </div>
      )}
      <div
        style={{
          background: bg || T.panel,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: pad,
            minHeight: height,
            display: 'flex',
            flexWrap: wrap,
            gap,
            alignItems: align,
          }}
        >
          {children}
        </div>
        {code && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 6,
                padding: '0 10px',
                borderTop: `1px solid ${T.border}`,
                background: T.panel2,
                height: 30,
              }}
            >
              <button
                onClick={() => setShowCode((s) => !s)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: FM,
                  fontSize: 10,
                  color: T.textDim,
                  padding: '4px 6px',
                  borderRadius: 4,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.textDim)}
              >
                <span style={{ fontSize: 9 }}>{showCode ? '▾' : '▸'}</span>
                {showCode ? 'Hide code' : 'Show code'}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard && navigator.clipboard.writeText(code);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: FM,
                  fontSize: 10,
                  color: T.textDim,
                  padding: '4px 6px',
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.textDim)}
              >
                Copy
              </button>
            </div>
            {showCode && (
              <pre
                style={{
                  margin: 0,
                  padding: 14,
                  background: T.bg,
                  borderTop: `1px solid ${T.border}`,
                  fontFamily: FM,
                  fontSize: 11.5,
                  lineHeight: 1.6,
                  color: T.textMuted,
                  overflow: 'auto',
                  maxHeight: 360,
                }}
              >
                {code}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Grid({ cols = 3, gap = 12, children, style = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, ...style }}>
      {children}
    </div>
  );
}

function StateLabel({ children }) {
  return (
    <span
      style={{
        fontFamily: FM,
        fontSize: 9,
        color: T.textDim,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginRight: 8,
      }}
    >
      {children}
    </span>
  );
}

function StateCell({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          fontFamily: FM,
          fontSize: 9,
          color: T.textDim,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
        }}
      >
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({ children, gap = 10, align = 'center', style = {} }) {
  return <div style={{ display: 'flex', alignItems: align, gap, ...style }}>{children}</div>;
}

function Col({ children, gap = 10, style = {} }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>{children}</div>;
}

Object.assign(window, {
  T,
  FF,
  FM,
  Section,
  Subsection,
  Specimen,
  Grid,
  StateLabel,
  StateCell,
  Row,
  Col,
});
