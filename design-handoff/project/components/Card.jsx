// Card primitives.

function Card({ title, description, footer, actions, children, onClick, hover, style = {} }) {
  const [h, setH] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: tokens.panel,
        border: `1px solid ${h && hover ? tokens.borderStrong : tokens.border}`,
        borderRadius: 10,
        padding: 18,
        transition: 'all 160ms',
        cursor: onClick ? 'pointer' : 'default',
        transform: h && onClick ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: h && onClick ? tokens.shadow : 'none',
        ...style,
      }}
    >
      {(title || actions) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: description || children ? 10 : 0,
          }}
        >
          {title && <div style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{title}</div>}
          {actions && <div style={{ display: 'flex', gap: 4 }}>{actions}</div>}
        </div>
      )}
      {description && (
        <div
          style={{
            fontSize: 12,
            color: tokens.textMuted,
            lineHeight: 1.55,
            marginBottom: children ? 14 : 0,
          }}
        >
          {description}
        </div>
      )}
      {children}
      {footer && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: `1px solid ${tokens.border}`,
            fontSize: 11,
            color: tokens.textDim,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, delta, trend, icon }) {
  const trendColor = trend === 'up' ? tokens.ok : trend === 'down' ? tokens.err : tokens.textDim;
  return (
    <div
      style={{
        background: tokens.panel,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10,
        padding: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontFamily: tokens.fontMono,
            fontSize: 10,
            color: tokens.textDim,
            textTransform: 'uppercase',
            letterSpacing: 1.4,
          }}
        >
          {label}
        </div>
        {icon && <div style={{ color: tokens.textDim, fontSize: 14 }}>{icon}</div>}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 300,
          letterSpacing: -0.8,
          color: tokens.text,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {delta && (
        <div style={{ marginTop: 6, fontSize: 11, color: trendColor, fontFamily: tokens.fontMono }}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {delta}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Card, StatCard });
