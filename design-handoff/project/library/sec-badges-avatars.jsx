// Library · Badges, pills, chips, tags, status indicators, avatars.

function Badge({ color = 'neutral', children, size = 'md', dot, solid, icon }) {
  const colors = {
    neutral: { bg: T.panel2, fg: T.textMuted, dot: T.textDim },
    accent: { bg: T.accentDim, fg: T.accent, dot: T.accent },
    ok: { bg: 'oklch(0.22 0.06 150 / 0.4)', fg: T.ok, dot: T.ok },
    warn: { bg: 'oklch(0.22 0.06 70 / 0.4)', fg: T.warn, dot: T.warn },
    err: { bg: 'oklch(0.22 0.06 30 / 0.4)', fg: T.err, dot: T.err },
    purple: { bg: 'oklch(0.22 0.06 300 / 0.35)', fg: 'var(--purple)', dot: 'var(--purple)' },
    pink: { bg: 'oklch(0.22 0.06 350 / 0.35)', fg: 'var(--pink)', dot: 'var(--pink)' },
  }[color];
  const sizes = {
    sm: { px: 6, py: 1, fs: 10, h: 18 },
    md: { px: 8, py: 2, fs: 11, h: 22 },
    lg: { px: 10, py: 3, fs: 12, h: 26 },
  }[size];
  if (solid)
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: `${sizes.py}px ${sizes.px}px`,
          background: colors.dot,
          color: '#0a0a0b',
          borderRadius: 999,
          fontSize: sizes.fs,
          fontFamily: FM,
          fontWeight: 500,
          lineHeight: 1,
          height: sizes.h,
        }}
      >
        {icon}
        {children}
      </span>
    );
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: `${sizes.py}px ${sizes.px}px`,
        background: colors.bg,
        color: colors.fg,
        borderRadius: 4,
        fontSize: sizes.fs,
        fontFamily: FM,
        lineHeight: 1,
        height: sizes.h,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: colors.dot }} />}
      {icon}
      {children}
    </span>
  );
}

function Chip({ children, removable, icon }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 4px 4px 10px',
        background: T.panel2,
        border: `1px solid ${T.border}`,
        borderRadius: 999,
        fontSize: 12,
        height: 26,
      }}
    >
      {icon && <span style={{ fontSize: 10, color: T.textDim }}>{icon}</span>}
      {children}
      {removable && (
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: T.panel,
            display: 'grid',
            placeItems: 'center',
            fontSize: 10,
            color: T.textDim,
            cursor: 'pointer',
          }}
        >
          ×
        </span>
      )}
    </span>
  );
}

function StatusDot({ state = 'ok', label, pulse }) {
  const colors = { ok: T.ok, warn: T.warn, err: T.err, off: T.textDim, sync: T.accent };
  return (
    <Row gap={6}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: colors[state],
          boxShadow: pulse ? `0 0 0 0 ${colors[state]}` : 'none',
          animation: pulse ? 'pulse-ring 1.6s infinite' : 'none',
        }}
      />
      {label && <span style={{ fontSize: 12, color: T.textMuted }}>{label}</span>}
    </Row>
  );
}

function Avatar({ initials = 'MT', size = 'md', status, variant = 'gradient', ring }) {
  const s = { xs: 20, sm: 24, md: 32, lg: 40, xl: 56 }[size];
  const fs = { xs: 9, sm: 10, md: 12, lg: 14, xl: 20 }[size];
  const bg =
    variant === 'gradient'
      ? 'linear-gradient(135deg, oklch(0.78 0.14 300), oklch(0.82 0.12 200))'
      : variant === 'muted'
        ? T.panel2
        : T.accent;
  return (
    <div style={{ position: 'relative', width: s, height: s }}>
      <div
        style={{
          width: s,
          height: s,
          borderRadius: 999,
          background: bg,
          color: variant === 'muted' ? T.textMuted : '#0a0a0b',
          display: 'grid',
          placeItems: 'center',
          fontSize: fs,
          fontWeight: 600,
          fontFamily: FF,
          border: ring ? `2px solid ${T.accent}` : 'none',
          boxShadow: ring ? `0 0 0 2px ${T.bg}` : 'none',
        }}
      >
        {initials}
      </div>
      {status && (
        <div
          style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            width: s / 3.5,
            height: s / 3.5,
            borderRadius: 999,
            background: { ok: T.ok, warn: T.warn, err: T.err, off: T.textDim }[status],
            border: `2px solid ${T.bg}`,
          }}
        />
      )}
    </div>
  );
}

function AvatarGroup({ people, size = 'md', max = 4 }) {
  const s = { sm: 24, md: 32, lg: 40 }[size];
  const shown = people.slice(0, max);
  const extra = people.length - max;
  return (
    <div style={{ display: 'flex' }}>
      {shown.map((p, i) => (
        <div
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : -8,
            position: 'relative',
            zIndex: shown.length - i,
            borderRadius: 999,
            boxShadow: `0 0 0 2px ${T.bg}`,
          }}
        >
          <Avatar initials={p} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            marginLeft: -8,
            width: s,
            height: s,
            borderRadius: 999,
            background: T.panel2,
            border: `1px solid ${T.border}`,
            display: 'grid',
            placeItems: 'center',
            fontSize: 10,
            fontFamily: FM,
            color: T.textMuted,
            boxShadow: `0 0 0 2px ${T.bg}`,
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

function SecBadges() {
  return (
    <Section
      id="badges"
      title="Badges, Chips & Status"
      desc="Compact labels for metadata, state, and categorical tagging. Use color semantically: accent for brand/info, ok/warn/err for state."
    >
      <Subsection title="Badge · colors">
        <Specimen>
          <Row gap={8}>
            {['neutral', 'accent', 'ok', 'warn', 'err', 'purple', 'pink'].map((c) => (
              <Badge key={c} color={c}>
                {c}
              </Badge>
            ))}
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Badge · sizes & styles">
        <Specimen>
          <Row gap={8}>
            <Badge size="sm" color="accent">
              sm
            </Badge>
            <Badge size="md" color="accent">
              md
            </Badge>
            <Badge size="lg" color="accent">
              lg
            </Badge>
          </Row>
          <Row gap={8}>
            <Badge color="ok" dot>
              synced
            </Badge>
            <Badge color="warn" dot>
              stale
            </Badge>
            <Badge color="err" dot>
              error
            </Badge>
            <Badge color="accent" dot>
              live
            </Badge>
          </Row>
          <Row gap={8}>
            <Badge color="ok" solid>
              ✓ LIVE
            </Badge>
            <Badge color="err" solid>
              BROKEN
            </Badge>
            <Badge color="accent" solid>
              BETA
            </Badge>
            <Badge color="warn" solid>
              DEPRECATED
            </Badge>
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Entity-type badges (ShipIt-specific)">
        <Specimen>
          <Row gap={8}>
            <Badge color="accent" dot>
              service
            </Badge>
            <Badge color="purple" dot>
              person
            </Badge>
            <Badge color="pink" dot>
              document
            </Badge>
            <Badge color="ok" dot>
              deployment
            </Badge>
            <Badge color="warn" dot>
              incident
            </Badge>
            <Badge color="neutral" dot>
              ticket
            </Badge>
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Chips / Tags (removable)">
        <Specimen>
          <Row gap={6}>
            <Chip icon="#">backend</Chip>
            <Chip icon="#">payments</Chip>
            <Chip icon="@">on-call</Chip>
            <Chip icon="✦" removable>
              auto-tag: infra
            </Chip>
            <Chip removable>v2.0</Chip>
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Status dots">
        <Specimen>
          <Col gap={10}>
            <StatusDot state="ok" label="Synced · 2m ago" />
            <StatusDot state="sync" label="Syncing 182 / 1,204" pulse />
            <StatusDot state="warn" label="Stale · last sync 4h ago" />
            <StatusDot state="err" label="Failed · token expired" />
            <StatusDot state="off" label="Paused" />
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="KBD / Keyboard shortcuts">
        <Specimen>
          <Row gap={14} align="center">
            <Row gap={4}>
              <kbd style={kbdStyle}>⌘</kbd>
              <kbd style={kbdStyle}>K</kbd>
              <span style={{ fontSize: 12, color: T.textMuted }}>Command palette</span>
            </Row>
            <Row gap={4}>
              <kbd style={kbdStyle}>⌘</kbd>
              <kbd style={kbdStyle}>/</kbd>
              <span style={{ fontSize: 12, color: T.textMuted }}>Focus ask bar</span>
            </Row>
            <Row gap={4}>
              <kbd style={kbdStyle}>⌘</kbd>
              <kbd style={kbdStyle}>⇧</kbd>
              <kbd style={kbdStyle}>G</kbd>
              <span style={{ fontSize: 12, color: T.textMuted }}>Graph view</span>
            </Row>
            <Row gap={4}>
              <kbd style={kbdStyle}>ESC</kbd>
              <span style={{ fontSize: 12, color: T.textMuted }}>Close</span>
            </Row>
          </Row>
        </Specimen>
      </Subsection>
    </Section>
  );
}

const kbdStyle = {
  fontFamily: FM,
  fontSize: 10,
  padding: '2px 6px',
  background: T.panel,
  border: `1px solid ${T.border}`,
  borderBottom: `2px solid ${T.border}`,
  borderRadius: 4,
  color: T.textMuted,
  fontWeight: 500,
};

function SecAvatars() {
  return (
    <Section
      id="avatars"
      title="Avatars"
      desc="Initials-based avatars (gradient / solid / muted) with status indicators and group stacks."
    >
      <Subsection title="Sizes">
        <Specimen>
          <Row gap={14} align="center">
            <Avatar size="xs" initials="MT" />
            <Avatar size="sm" initials="PK" />
            <Avatar size="md" initials="JA" />
            <Avatar size="lg" initials="ES" />
            <Avatar size="xl" initials="AB" />
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Variants & status">
        <Specimen>
          <Row gap={14}>
            <Avatar initials="MT" variant="gradient" />
            <Avatar initials="PK" variant="solid" />
            <Avatar initials="JA" variant="muted" />
            <Avatar initials="ES" status="ok" />
            <Avatar initials="RB" status="warn" />
            <Avatar initials="DN" status="err" />
            <Avatar initials="AB" ring />
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Group / stack">
        <Specimen>
          <Col gap={16}>
            <AvatarGroup people={['MT', 'PK', 'JA', 'ES']} size="md" />
            <AvatarGroup
              people={['MT', 'PK', 'JA', 'ES', 'RB', 'DN', 'AB', 'XY']}
              size="md"
              max={5}
            />
            <AvatarGroup people={['MT', 'PK', 'JA']} size="lg" max={3} />
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="In context · comment row">
        <Specimen>
          <Row gap={12} style={{ width: '100%' }}>
            <Avatar initials="PK" status="ok" />
            <Col gap={3} style={{ flex: 1 }}>
              <Row gap={8}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Priya K.</span>
                <Badge color="accent" size="sm">
                  Payments
                </Badge>
                <span style={{ fontSize: 11, color: T.textDim, fontFamily: FM }}>2m ago</span>
              </Row>
              <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>
                Confirmed the payment-webhook-v2 is owned by us. Legacy one is decommissioned Q3.
              </div>
            </Col>
          </Row>
        </Specimen>
      </Subsection>
    </Section>
  );
}

Object.assign(window, {
  Badge,
  Chip,
  StatusDot,
  Avatar,
  AvatarGroup,
  kbdStyle,
  SecBadges,
  SecAvatars,
});
