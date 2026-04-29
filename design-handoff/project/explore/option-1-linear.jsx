// Option 1 — Quiet Workstation
// Dark minimalism, single cyan accent, refined type. Linear/Vercel DNA.

const o1 = {
  bg: '#0a0a0b',
  panel: '#111113',
  panel2: '#16161a',
  border: '#1f1f24',
  borderStrong: '#2a2a31',
  text: '#ededef',
  textMuted: '#8a8a94',
  textDim: '#55555d',
  accent: '#7dd3fc',      // cyan
  accentDim: 'rgba(125, 211, 252, 0.12)',
  warn: '#fbbf24',
  err: '#f87171',
  ok: '#86efac',
  purple: '#c4b5fd',
  font: '"Geist", "Inter", system-ui, sans-serif',
  mono: '"Geist Mono", "JetBrains Mono", monospace',
};

function O1Shell({ page, children }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: o1.bg, color: o1.text,
      fontFamily: o1.font, fontSize: 13, display: 'flex',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 220, borderRight: `1px solid ${o1.border}`, padding: '16px 12px',
        display: 'flex', flexDirection: 'column', gap: 2, background: o1.panel,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px 18px' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: `linear-gradient(135deg, ${o1.accent}, #a78bfa)`,
            display: 'grid', placeItems: 'center',
            fontSize: 11, fontWeight: 700, color: '#000',
          }}>◆</div>
          <div style={{ fontWeight: 600, letterSpacing: -0.2 }}>ShipIt</div>
          <div style={{ fontSize: 10, color: o1.textDim, marginLeft: 'auto', fontFamily: o1.mono }}>v2.4</div>
        </div>

        {/* Ask bar */}
        <div style={{
          margin: '0 0 16px', padding: '8px 10px',
          background: o1.panel2, border: `1px solid ${o1.border}`,
          borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: o1.textMuted, cursor: 'text',
        }}>
          <span style={{ color: o1.accent }}>✦</span>
          <span>Ask anything…</span>
          <span style={{ marginLeft: 'auto', fontFamily: o1.mono, fontSize: 10, color: o1.textDim }}>⌘K</span>
        </div>

        <O1NavItem label="Home" icon="◱" active={page==='home'} />
        <O1NavItem label="Graph Explorer" icon="⋈" active={page==='graph'} badge="1.2k" />
        <O1NavItem label="Ask" icon="✦" accent />
        <div style={{ fontSize: 10, color: o1.textDim, padding: '14px 10px 6px', letterSpacing: 1, textTransform: 'uppercase' }}>Configure</div>
        <O1NavItem label="Connectors" icon="⌁" badge="7" />
        <O1NavItem label="Schema" icon="≡" />
        <div style={{ fontSize: 10, color: o1.textDim, padding: '14px 10px 6px', letterSpacing: 1, textTransform: 'uppercase' }}>Operations</div>
        <O1NavItem label="Incident Mode" icon="◎" />
        <O1NavItem label="Activity" icon="↗" />

        <div style={{ marginTop: 'auto', padding: '10px', borderTop: `1px solid ${o1.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 999, background: '#2a2a31', display:'grid', placeItems:'center', fontSize: 10, fontWeight: 600 }}>MA</div>
          <div style={{ fontSize: 12 }}>
            <div>Mo A.</div>
            <div style={{ color: o1.textDim, fontSize: 10 }}>acme · platform</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

function O1NavItem({ label, icon, active, badge, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
      borderRadius: 6, fontSize: 13,
      background: active ? o1.panel2 : 'transparent',
      color: active ? o1.text : (accent ? o1.accent : o1.textMuted),
      border: active ? `1px solid ${o1.border}` : '1px solid transparent',
      cursor: 'pointer',
    }}>
      <span style={{ fontSize: 12, width: 14, textAlign: 'center', opacity: 0.9 }}>{icon}</span>
      <span>{label}</span>
      {badge && (
        <span style={{
          marginLeft: 'auto', fontSize: 10, color: o1.textDim,
          fontFamily: o1.mono,
        }}>{badge}</span>
      )}
    </div>
  );
}

function O1Home() {
  return (
    <div style={{ padding: '24px 32px', overflow: 'hidden', flex: 1 }}>
      {/* Breadcrumb / title row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: o1.textDim, fontFamily: o1.mono, marginBottom: 6 }}>acme / platform</div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6 }}>Good evening, Mo.</div>
          <div style={{ color: o1.textMuted, marginTop: 4 }}>247 services, last indexed <span style={{ color: o1.text }}>4m ago</span></div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ padding: '7px 12px', border: `1px solid ${o1.border}`, borderRadius: 6, fontSize: 12, color: o1.textMuted }}>Last 24h ▾</div>
          <div style={{ padding: '7px 12px', background: o1.accent, color: '#000', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>Open Graph →</div>
        </div>
      </div>

      {/* Ask hero */}
      <div style={{
        background: o1.panel, border: `1px solid ${o1.border}`, borderRadius: 10,
        padding: '18px 20px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: o1.accent, boxShadow: `0 0 16px ${o1.accent}` }} />
          <div style={{ fontSize: 12, color: o1.textMuted, fontFamily: o1.mono }}>ASK SHIPIT</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.3, color: o1.text, marginBottom: 4 }}>
          What's the blast radius if <span style={{ color: o1.accent }}>payments-api</span> goes down?
        </div>
        <div style={{ color: o1.textDim, fontSize: 12 }}>Natural language · across 7 sources · typically answered in ~1.2s</div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {['Who owns checkout-service?', 'What broke in staging today?', 'Services with stale docs', 'Dependencies of auth-svc'].map(q => (
            <div key={q} style={{
              padding: '6px 10px', fontSize: 11, border: `1px solid ${o1.border}`,
              borderRadius: 999, color: o1.textMuted, background: o1.panel2,
            }}>{q}</div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { n: '247', l: 'Services', d: '+3 this week', ok: true },
          { n: '1,284', l: 'Edges', d: 'Avg depth 4.2' },
          { n: '98.4%', l: 'Graph health', d: '2 stale sources', warn: true },
          { n: '7', l: 'Connectors', d: 'All syncing' },
        ].map((s, i) => (
          <div key={i} style={{
            background: o1.panel, border: `1px solid ${o1.border}`, borderRadius: 10,
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: 11, color: o1.textMuted, marginBottom: 10, display:'flex', alignItems:'center', gap: 6 }}>
              {s.warn && <span style={{ width: 6, height: 6, borderRadius: 999, background: o1.warn }}/>}
              {s.l}
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.8, fontFamily: o1.mono }}>{s.n}</div>
            <div style={{ fontSize: 11, color: o1.textDim, marginTop: 6 }}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Two-col bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: o1.panel, border: `1px solid ${o1.border}`, borderRadius: 10, padding: '16px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
            <div style={{ fontWeight: 500 }}>Recent changes</div>
            <div style={{ fontSize: 11, color: o1.textDim }}>view all →</div>
          </div>
          {[
            { t: 'checkout-service', s: 'v2.14.0 deployed to production', ago: '12m', d: o1.ok },
            { t: 'payments-api', s: 'owner changed to payments-team', ago: '1h', d: o1.accent },
            { t: 'auth-lib', s: 'deprecated, 4 dependents flagged', ago: '3h', d: o1.warn },
            { t: 'search-svc', s: 'new runtime in eu-west-1', ago: '5h', d: o1.ok },
          ].map((x, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderTop: i ? `1px solid ${o1.border}` : 'none',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: x.d }}/>
              <div style={{ fontFamily: o1.mono, fontSize: 12 }}>{x.t}</div>
              <div style={{ color: o1.textMuted, fontSize: 12, flex: 1 }}>{x.s}</div>
              <div style={{ color: o1.textDim, fontSize: 11, fontFamily: o1.mono }}>{x.ago}</div>
            </div>
          ))}
        </div>

        <div style={{ background: o1.panel, border: `1px solid ${o1.border}`, borderRadius: 10, padding: '16px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
            <div style={{ fontWeight: 500 }}>Connector health</div>
            <div style={{ fontSize: 11, color: o1.textDim, fontFamily: o1.mono }}>7 active</div>
          </div>
          {[
            { t: 'GitHub', n: '1,204 repos', s: 100, ok: true },
            { t: 'Kubernetes (prod)', n: '89 workloads', s: 100, ok: true },
            { t: 'Datadog', n: '340 monitors', s: 92 },
            { t: 'Backstage', n: '247 entities', s: 100, ok: true },
            { t: 'PagerDuty', n: '18 services', s: 74, warn: true },
          ].map((x, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: 12,
              padding: '10px 0', borderTop: i ? `1px solid ${o1.border}` : 'none',
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: o1.panel2, border: `1px solid ${o1.border}` }}/>
              <div style={{ fontSize: 12 }}>{x.t}</div>
              <div style={{ color: o1.textDim, fontSize: 11, flex: 1 }}>{x.n}</div>
              <div style={{ width: 80, height: 4, background: o1.panel2, borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${x.s}%`, height: '100%', background: x.warn ? o1.warn : o1.ok }}/>
              </div>
              <div style={{ fontFamily: o1.mono, fontSize: 11, color: o1.textMuted, width: 36, textAlign: 'right' }}>{x.s}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function O1GraphView() {
  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* Left tools rail */}
      <div style={{ width: 240, borderRight: `1px solid ${o1.border}`, background: o1.panel, padding: '20px 16px', overflow: 'hidden' }}>
        <div style={{ fontSize: 11, color: o1.textDim, fontFamily: o1.mono, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Layers</div>
        {[
          ['LogicalService', 247, o1.accent],
          ['Repository', 1204, '#c4b5fd'],
          ['Deployment', 189, '#86efac'],
          ['RuntimeService', 412, '#fbbf24'],
          ['Team', 24, '#fb7185'],
          ['Person', 187, o1.textMuted],
        ].map(([l, n, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: c }}/>
            <div style={{ fontSize: 12 }}>{l}</div>
            <div style={{ marginLeft: 'auto', fontFamily: o1.mono, fontSize: 11, color: o1.textDim }}>{n}</div>
          </div>
        ))}

        <div style={{ fontSize: 11, color: o1.textDim, fontFamily: o1.mono, textTransform: 'uppercase', letterSpacing: 1, marginTop: 22, marginBottom: 10 }}>Focus</div>
        <div style={{ padding: '8px 10px', borderRadius: 6, background: o1.panel2, border: `1px solid ${o1.borderStrong}`, fontSize: 12, fontFamily: o1.mono, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: o1.accent }}>◆</span> payments-api
          <span style={{ marginLeft: 'auto', color: o1.textDim }}>×</span>
        </div>
        <div style={{ fontSize: 11, color: o1.textMuted, padding: '8px 10px 0' }}>Depth 2 · 34 neighbors</div>

        <div style={{ fontSize: 11, color: o1.textDim, fontFamily: o1.mono, textTransform: 'uppercase', letterSpacing: 1, marginTop: 22, marginBottom: 10 }}>Environment</div>
        {['production', 'staging', 'dev'].map((e, i) => (
          <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <div style={{ width: 12, height: 12, border: `1px solid ${o1.borderStrong}`, borderRadius: 3, background: i===0 ? o1.accent : 'transparent' }}/>
            <div style={{ fontSize: 12 }}>{e}</div>
          </div>
        ))}
      </div>

      {/* Graph canvas */}
      <div style={{ flex: 1, position: 'relative', background: `radial-gradient(circle at 50% 40%, #141418 0%, ${o1.bg} 70%)`, overflow: 'hidden' }}>
        {/* Top toolbar */}
        <div style={{
          position: 'absolute', top: 14, left: 14, right: 14,
          display: 'flex', alignItems: 'center', gap: 8, zIndex: 2,
        }}>
          <div style={{ background: o1.panel, border: `1px solid ${o1.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 12, fontFamily: o1.mono, color: o1.textMuted, flex: 1, display:'flex', alignItems:'center', gap: 8 }}>
            <span style={{ color: o1.accent }}>✦</span>
            <span style={{ color: o1.text }}>show me everything that depends on payments-api in production</span>
          </div>
          <div style={{ background: o1.panel, border: `1px solid ${o1.border}`, borderRadius: 8, padding: '7px 10px', fontSize: 11, fontFamily: o1.mono, color: o1.textMuted }}>Hierarchical</div>
          <div style={{ background: o1.panel, border: `1px solid ${o1.border}`, borderRadius: 8, padding: '7px 10px', fontSize: 11, fontFamily: o1.mono, color: o1.textMuted }}>100%</div>
        </div>

        <O1Graph />

        {/* Right detail panel */}
        <div style={{
          position: 'absolute', top: 60, right: 14, bottom: 14, width: 280,
          background: o1.panel, border: `1px solid ${o1.border}`, borderRadius: 10,
          padding: 16, overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, color: o1.textDim, fontFamily: o1.mono, marginBottom: 4 }}>LogicalService</div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, marginBottom: 4 }}>payments-api</div>
          <div style={{ fontSize: 11, color: o1.textMuted, marginBottom: 14 }}>Tier 1 · payments-team</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[['14','deps'],['23','dependents'],['3','envs'],['p99 82ms','latency']].map(([v, l]) => (
              <div key={l} style={{ background: o1.panel2, border: `1px solid ${o1.border}`, borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: o1.mono }}>{v}</div>
                <div style={{ fontSize: 10, color: o1.textDim }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: o1.textDim, fontFamily: o1.mono, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Blast radius</div>
          <div style={{ background: o1.panel2, border: `1px solid ${o1.border}`, borderRadius: 6, padding: '10px 12px', marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: o1.text }}>23 services would be affected</div>
            <div style={{ fontSize: 11, color: o1.textDim, marginTop: 2 }}>Including 3 tier-1 customer flows</div>
          </div>
          <div style={{ fontSize: 11, color: o1.textDim, fontFamily: o1.mono, textTransform: 'uppercase', letterSpacing: 1, marginTop: 14, marginBottom: 8 }}>Provenance</div>
          {['GitHub', 'Kubernetes', 'Datadog'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems:'center', gap: 8, padding: '4px 0', fontSize: 11, color: o1.textMuted }}>
              <div style={{ width: 5, height: 5, borderRadius: 999, background: o1.ok }}/> {s}
              <span style={{ marginLeft: 'auto', fontFamily: o1.mono, color: o1.textDim }}>fresh</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function O1Graph() {
  // Simple fake graph: center node + radial neighbors
  const center = { x: 440, y: 320 };
  const ring1 = Array.from({length: 6}).map((_, i) => {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    return { x: center.x + Math.cos(a)*140, y: center.y + Math.sin(a)*140, id: i };
  });
  const ring2 = Array.from({length: 10}).map((_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return { x: center.x + Math.cos(a)*260, y: center.y + Math.sin(a)*260, id: i };
  });
  return (
    <svg width="100%" height="100%" viewBox="0 0 900 660" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="glow1" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={o1.accent} stopOpacity="0.3"/>
          <stop offset="1" stopColor={o1.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={center.x} cy={center.y} r="90" fill="url(#glow1)" />

      {/* edges from center */}
      {ring1.map((p, i) => (
        <line key={'e1'+i} x1={center.x} y1={center.y} x2={p.x} y2={p.y} stroke={o1.borderStrong} strokeWidth="1" />
      ))}
      {ring2.map((p, i) => {
        const anchor = ring1[i % 6];
        return <line key={'e2'+i} x1={anchor.x} y1={anchor.y} x2={p.x} y2={p.y} stroke={o1.border} strokeWidth="0.8" />;
      })}

      {/* ring2 nodes */}
      {ring2.map((p, i) => (
        <g key={'r2'+i}>
          <circle cx={p.x} cy={p.y} r="6" fill={o1.panel2} stroke={o1.borderStrong} strokeWidth="1"/>
          <text x={p.x} y={p.y+20} fontSize="10" fill={o1.textDim} textAnchor="middle" fontFamily={o1.mono}>svc-{i+1}</text>
        </g>
      ))}

      {/* ring1 nodes */}
      {ring1.map((p, i) => {
        const colors = [o1.accent, '#c4b5fd', '#86efac', '#fbbf24', '#fb7185', o1.accent];
        return (
          <g key={'r1'+i}>
            <circle cx={p.x} cy={p.y} r="11" fill={colors[i]} opacity="0.95"/>
            <text x={p.x} y={p.y+28} fontSize="11" fill={o1.text} textAnchor="middle" fontFamily={o1.mono}>
              {['checkout','auth-svc','search','notif-q','billing','orders'][i]}
            </text>
          </g>
        );
      })}

      {/* center node */}
      <circle cx={center.x} cy={center.y} r="20" fill={o1.accent} />
      <circle cx={center.x} cy={center.y} r="28" fill="none" stroke={o1.accent} strokeWidth="1" opacity="0.5"/>
      <text x={center.x} y={center.y+48} fontSize="13" fontWeight="600" fill={o1.text} textAnchor="middle" fontFamily={o1.mono}>payments-api</text>
    </svg>
  );
}

function Opt1Home() {
  return <O1Shell page="home"><O1Home /></O1Shell>;
}
function Opt1Graph() {
  return <O1Shell page="graph"><O1GraphView /></O1Shell>;
}

Object.assign(window, { Opt1Home, Opt1Graph });
