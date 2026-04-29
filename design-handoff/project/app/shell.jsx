// Main shell: sidebar + ask command bar + copilot rail.

function Shell({ page, nav, children, onAsk, askSeed, onRestartOnboarding }) {
  const t = useTheme();
  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex',
      background: t.bg, color: t.text, fontFamily: FONT,
    }}>
      <Sidebar page={page} nav={nav} onAsk={onAsk} onRestartOnboarding={onRestartOnboarding} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar page={page} />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ page, nav, onAsk, onRestartOnboarding }) {
  const t = useTheme();
  return (
    <div style={{
      width: 230, borderRight: `1px solid ${t.border}`, padding: '14px 10px',
      display: 'flex', flexDirection: 'column', gap: 2, background: t.panel,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 10px 16px' }}>
        <div style={{
          width: 24, height: 24, borderRadius: 7,
          background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`,
          display: 'grid', placeItems: 'center',
          fontSize: 12, fontWeight: 700, color: '#0a0a0b',
        }}>◆</div>
        <div style={{ fontWeight: 600, letterSpacing: -0.2, fontSize: 14 }}>ShipIt</div>
        <div style={{ fontSize: 10, color: t.textDim, marginLeft: 'auto', fontFamily: MONO }}>v2.4</div>
      </div>

      <div
        onClick={() => onAsk && onAsk()}
        style={{
          margin: '0 0 14px', padding: '8px 10px',
          background: t.panel2, border: `1px solid ${t.border}`,
          borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: t.textMuted, cursor: 'pointer',
        }}>
        <span style={{ color: t.accent }}>✦</span>
        <span>Ask anything…</span>
        <AskHint style={{ marginLeft: 'auto' }}/>
      </div>

      <NavItem icon="◱" label="Home"           k="home"      page={page} nav={nav} />
      <NavItem icon="⋈" label="Graph Explorer" k="graph"     page={page} nav={nav} badge="1.2k" />
      <NavItem icon="✦" label="Ask"            k="ask"       page={page} nav={nav} accent />

      <GroupLabel>Configure</GroupLabel>
      <NavItem icon="⌁" label="Connectors"     k="connectors" page={page} nav={nav} badge="7" />
      <NavItem icon="≡" label="Schema"         k="schema"     page={page} nav={nav} dim />

      <GroupLabel>Operations</GroupLabel>
      <NavItem icon="◎" label="Incident Mode"  k="incident"   page={page} nav={nav} />
      <NavItem icon="↗" label="Activity"       k="activity"   page={page} nav={nav} dim />

      <div onClick={onRestartOnboarding} style={{ marginTop: 'auto', padding: '7px 10px', fontSize: 11, color: t.textDim, fontFamily: MONO, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>↻</span> replay onboarding
      </div>
      <div style={{ padding: '10px 8px', borderTop: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 999, background: t.borderStrong, display:'grid', placeItems:'center', fontSize: 10, fontWeight: 600, color: t.text }}>MA</div>
        <div style={{ fontSize: 12, lineHeight: 1.3 }}>
          <div>Mo A.</div>
          <div style={{ color: t.textDim, fontSize: 10 }}>acme · platform</div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, k, page, nav, badge, accent, dim }) {
  const t = useTheme();
  const active = page === k;
  return (
    <div
      onClick={() => nav(k)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
        borderRadius: 6, fontSize: 13, cursor: 'pointer',
        background: active ? t.panel2 : 'transparent',
        color: active ? t.text : (accent ? t.accent : (dim ? t.textDim : t.textMuted)),
        border: active ? `1px solid ${t.border}` : '1px solid transparent',
      }}>
      <span style={{ fontSize: 12, width: 14, textAlign: 'center', opacity: 0.9 }}>{icon}</span>
      <span>{label}</span>
      {badge && (
        <span style={{
          marginLeft: 'auto', fontSize: 10, color: t.textDim, fontFamily: MONO,
        }}>{badge}</span>
      )}
    </div>
  );
}

function GroupLabel({ children }) {
  const t = useTheme();
  return (
    <div style={{ fontSize: 10, color: t.textDim, padding: '14px 10px 6px', letterSpacing: 1.3, textTransform: 'uppercase', fontFamily: MONO }}>
      {children}
    </div>
  );
}

function TopBar({ page }) {
  const t = useTheme();
  const titles = {
    home: ['Overview', null],
    graph: ['Graph Explorer', null],
    ask: ['Ask ShipIt', null],
    connectors: ['Connector Hub', null],
    schema: ['Schema', null],
    incident: ['Incident Mode', null],
    activity: ['Activity', null],
    entity: ['Entity', null],
  };
  const crumb = titles[page] || ['', null];
  return (
    <div style={{
      height: 48, borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14,
      background: t.bg, flexShrink: 0,
    }}>
      <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO }}>acme / platform</div>
      <span style={{ color: t.textDim }}>/</span>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{crumb[0]}</div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot color={t.ok} glow/> synced 4m ago
        </div>
        <div style={{ width: 1, height: 14, background: t.border, marginLeft: 6, marginRight: 6 }}/>
        <Btn small icon="⚙" ghost>Settings</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { Shell });
