// Option 2 — Editorial Console
// Big serif headlines, confident brand voice. Warm ink palette.

const o2 = {
  bg: '#141210',
  paper: '#1b1815',
  panel: '#211d19',
  border: '#2a2420',
  borderStrong: '#3a3027',
  text: '#f2ede3',
  textMuted: '#a89d8b',
  textDim: '#6b6155',
  accent: '#d97757',      // terracotta (warm)
  accentDim: 'rgba(217, 119, 87, 0.12)',
  ink: '#f0d8a8',         // paper highlight
  ok: '#8dbf6e',
  warn: '#e0a96d',
  err: '#d8736b',
  serif: '"Instrument Serif", "Iowan Old Style", Georgia, serif',
  sans: '"IBM Plex Sans", "Inter", sans-serif',
  mono: '"IBM Plex Mono", monospace',
};

function O2Shell({ page, children }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: o2.bg, color: o2.text,
      fontFamily: o2.sans, fontSize: 13, display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '14px 24px',
        borderBottom: `1px solid ${o2.border}`, gap: 28, background: o2.paper,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{ fontFamily: o2.serif, fontSize: 22, fontStyle: 'italic', letterSpacing: -0.5 }}>ShipIt</div>
          <div style={{ fontSize: 10, color: o2.textDim, fontFamily: o2.mono, textTransform: 'uppercase', letterSpacing: 1.2 }}>Knowledge Graph</div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {[
            ['Home', 'home'],
            ['Graph', 'graph'],
            ['Ask', 'ask'],
            ['Connectors', 'conn'],
            ['Incidents', 'inc'],
          ].map(([l, k]) => (
            <div key={k} style={{
              padding: '6px 12px', fontSize: 13,
              color: page===k ? o2.text : o2.textMuted,
              borderBottom: page===k ? `2px solid ${o2.accent}` : '2px solid transparent',
              marginBottom: -15, paddingBottom: 14,
            }}>{l}</div>
          ))}
        </div>

        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10,
          background: o2.panel, border: `1px solid ${o2.border}`, borderRadius: 999,
          padding: '6px 14px', fontSize: 12, color: o2.textMuted, minWidth: 280,
        }}>
          <span style={{ color: o2.accent }}>✦</span>
          <span>Ask in natural language…</span>
          <span style={{ marginLeft: 'auto', fontFamily: o2.mono, fontSize: 10, color: o2.textDim }}>⌘K</span>
        </div>
        <div style={{ fontFamily: o2.mono, fontSize: 11, color: o2.textMuted }}>acme · platform</div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>{children}</div>
    </div>
  );
}

function O2Home() {
  return (
    <div style={{ flex: 1, padding: '36px 48px', overflow: 'hidden' }}>
      {/* Editorial header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40, marginBottom: 36 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: o2.mono, fontSize: 11, color: o2.accent, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Tuesday, April 19 · 9:42pm</div>
          <div style={{ fontFamily: o2.serif, fontSize: 72, lineHeight: 0.95, letterSpacing: -2, marginBottom: 8 }}>
            Your graph is<br/><span style={{ fontStyle: 'italic', color: o2.ink }}>breathing.</span>
          </div>
          <div style={{ fontSize: 14, color: o2.textMuted, maxWidth: 500, marginTop: 16 }}>
            247 services mapped across 7 sources. 3 connectors synced in the last hour. Two deployments rolling to production as we speak.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ padding: '10px 16px', border: `1px solid ${o2.border}`, borderRadius: 3, fontSize: 12, color: o2.textMuted, fontFamily: o2.mono }}>Download report</div>
          <div style={{ padding: '10px 16px', background: o2.accent, color: '#1b1815', borderRadius: 3, fontSize: 12, fontWeight: 600, fontFamily: o2.mono, textTransform: 'uppercase', letterSpacing: 1 }}>Open graph →</div>
        </div>
      </div>

      {/* Figure strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: `1px solid ${o2.border}`, borderBottom: `1px solid ${o2.border}`, marginBottom: 32 }}>
        {[
          ['247', 'services', 'across 3 tiers'],
          ['1,284', 'edges', '4.2 avg depth'],
          ['98.4', 'health %', '2 stale sources'],
          ['23', 'owners', '7 teams'],
        ].map(([n, l, d], i) => (
          <div key={i} style={{
            padding: '22px 20px',
            borderLeft: i ? `1px solid ${o2.border}` : 'none',
          }}>
            <div style={{ fontFamily: o2.serif, fontSize: 48, letterSpacing: -1.5, lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: o2.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: o2.accent, marginTop: 6 }}>{l}</div>
            <div style={{ fontSize: 12, color: o2.textMuted, marginTop: 4 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Body: two cols */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 40 }}>
        {/* The dispatch */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: o2.serif, fontSize: 24, letterSpacing: -0.3 }}>The dispatch</div>
            <div style={{ fontFamily: o2.mono, fontSize: 10, color: o2.textDim, textTransform: 'uppercase', letterSpacing: 1.2 }}>last 24 hours</div>
          </div>

          {[
            { h: 'checkout-service rolled to production', b: 'v2.14.0 from main@a3f91c2. Owned by payments-team. Blast radius: 23 services.', t: '12 min', cat: 'DEPLOY' },
            { h: 'auth-lib marked deprecated', b: '4 downstream services still depend on it. Oldest dependency: billing-worker (17 months).', t: '3 hours', cat: 'SCHEMA' },
            { h: 'Datadog provenance: 4 conflicts resolved', b: 'PropertyClaim picked GitHub as winning source for owner field across 4 services.', t: '6 hours', cat: 'GRAPH' },
          ].map((x, i) => (
            <div key={i} style={{
              padding: '18px 0', borderTop: `1px solid ${o2.border}`,
              display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 16, alignItems: 'baseline',
            }}>
              <div style={{ fontFamily: o2.mono, fontSize: 10, color: o2.accent, letterSpacing: 1.5 }}>{x.cat}</div>
              <div>
                <div style={{ fontFamily: o2.serif, fontSize: 18, letterSpacing: -0.2, marginBottom: 4 }}>{x.h}</div>
                <div style={{ fontSize: 12, color: o2.textMuted, lineHeight: 1.45 }}>{x.b}</div>
              </div>
              <div style={{ fontFamily: o2.mono, fontSize: 10, color: o2.textDim }}>{x.t}</div>
            </div>
          ))}
        </div>

        {/* Right column: ask + connectors */}
        <div>
          <div style={{
            background: o2.paper, border: `1px solid ${o2.border}`,
            padding: 22, borderRadius: 3, marginBottom: 20,
          }}>
            <div style={{ fontFamily: o2.mono, fontSize: 10, color: o2.accent, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 12 }}>✦ Ask the graph</div>
            <div style={{ fontFamily: o2.serif, fontSize: 24, letterSpacing: -0.3, lineHeight: 1.15, marginBottom: 14 }}>
              "What changes in the last week could explain our p99 spike in checkout?"
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Who owns X?', 'Dependencies of Y', 'Services with stale docs'].map(q => (
                <div key={q} style={{
                  padding: '4px 10px', fontSize: 11, border: `1px solid ${o2.borderStrong}`,
                  color: o2.textMuted, fontFamily: o2.mono,
                }}>{q}</div>
              ))}
            </div>
          </div>

          <div style={{ fontFamily: o2.serif, fontSize: 20, letterSpacing: -0.2, marginBottom: 14 }}>Connectors</div>
          {[
            ['GitHub', '1,204 repos', 'fresh'],
            ['Kubernetes', '89 workloads', 'fresh'],
            ['Datadog', '340 monitors', 'stale 2h'],
            ['Backstage', '247 entities', 'fresh'],
          ].map(([n, s, st], i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'baseline', gap: 12,
              padding: '10px 0', borderTop: i ? `1px solid ${o2.border}` : `1px solid ${o2.border}`,
            }}>
              <div style={{ fontSize: 13 }}>{n}</div>
              <div style={{ fontFamily: o2.mono, fontSize: 11, color: o2.textMuted, flex: 1 }}>{s}</div>
              <div style={{
                fontFamily: o2.mono, fontSize: 10, color: st.includes('stale') ? o2.warn : o2.ok,
                textTransform: 'uppercase', letterSpacing: 1.2,
              }}>{st}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function O2GraphView() {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      {/* Left column: ask + filters */}
      <div style={{ width: 320, borderRight: `1px solid ${o2.border}`, background: o2.paper, padding: '28px 24px', overflow: 'hidden' }}>
        <div style={{ fontFamily: o2.mono, fontSize: 10, color: o2.accent, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 10 }}>✦ Current view</div>
        <div style={{ fontFamily: o2.serif, fontSize: 28, letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 16 }}>
          Everything touching <span style={{ fontStyle: 'italic', color: o2.ink }}>payments-api</span> in production.
        </div>
        <div style={{
          background: o2.panel, border: `1px solid ${o2.border}`, padding: '8px 12px',
          fontFamily: o2.mono, fontSize: 11, color: o2.textMuted, marginBottom: 24,
        }}>
          MATCH (s:LogicalService {'{'}name:"payments-api"{'}'})-[*1..2]-(n) RETURN n
        </div>

        <div style={{ fontFamily: o2.mono, fontSize: 10, color: o2.textDim, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Node types</div>
        {[
          ['LogicalService', 14, o2.accent],
          ['Repository', 22, o2.ink],
          ['Deployment', 8, o2.ok],
          ['RuntimeService', 6, o2.warn],
          ['Team', 3, '#b48fd1'],
        ].map(([l, n, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${o2.border}` }}>
            <div style={{ width: 8, height: 8, background: c }}/>
            <div style={{ fontSize: 13 }}>{l}</div>
            <div style={{ marginLeft: 'auto', fontFamily: o2.mono, fontSize: 11, color: o2.textDim }}>{n}</div>
          </div>
        ))}

        <div style={{ fontFamily: o2.mono, fontSize: 10, color: o2.textDim, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 22, marginBottom: 10 }}>Suggested follow-ups</div>
        {[
          'Which deps are tier-1?',
          'Who would I wake up at 3am?',
          'What changed this week?',
        ].map((q, i) => (
          <div key={i} style={{
            padding: '10px 12px', fontSize: 12, color: o2.text,
            background: i===0 ? o2.panel : 'transparent',
            border: `1px solid ${o2.border}`, marginBottom: 6,
          }}>
            <span style={{ color: o2.accent, marginRight: 6 }}>→</span> {q}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative', background: o2.bg, overflow: 'hidden' }}>
        {/* Subtle paper texture via gradient */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 60% 40%, rgba(217,119,87,0.08), transparent 70%)` }}/>

        <O2Graph />

        {/* Floating detail card */}
        <div style={{
          position: 'absolute', bottom: 20, left: 20, width: 340,
          background: o2.paper, border: `1px solid ${o2.border}`, padding: 20,
        }}>
          <div style={{ fontFamily: o2.mono, fontSize: 10, color: o2.accent, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>LogicalService · Tier 1</div>
          <div style={{ fontFamily: o2.serif, fontSize: 28, letterSpacing: -0.4, marginBottom: 4 }}>payments-api</div>
          <div style={{ fontSize: 12, color: o2.textMuted, marginBottom: 14 }}>Processes all customer-facing payment flows. Owned by payments-team. On call: Maya S.</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, borderTop: `1px solid ${o2.border}`, paddingTop: 14 }}>
            {[['14','dependencies'],['23','dependents'],['p99 82','ms latency']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: o2.serif, fontSize: 22, letterSpacing: -0.5 }}>{v}</div>
                <div style={{ fontFamily: o2.mono, fontSize: 9, color: o2.textDim, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top-right mini controls */}
        <div style={{
          position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8,
        }}>
          {['Hierarchical', 'Force', 'Radial'].map((l, i) => (
            <div key={l} style={{
              padding: '6px 12px', fontSize: 11, fontFamily: o2.mono,
              background: i===0 ? o2.accent : o2.panel,
              color: i===0 ? '#1b1815' : o2.textMuted,
              border: `1px solid ${i===0 ? o2.accent : o2.border}`,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function O2Graph() {
  // Hierarchical: teams -> services -> deployments
  const rows = [
    { y: 120, items: [
      { x: 200, label: 'platform-team', type: 'team' },
      { x: 460, label: 'payments-team', type: 'team', focus: true },
      { x: 720, label: 'frontend-team', type: 'team' },
    ]},
    { y: 290, items: [
      { x: 140, label: 'shared-lib', type: 'svc' },
      { x: 320, label: 'checkout-service', type: 'svc' },
      { x: 500, label: 'payments-api', type: 'svc', focus: true },
      { x: 680, label: 'frontend-app', type: 'svc' },
      { x: 820, label: 'user-service', type: 'svc' },
    ]},
    { y: 460, items: [
      { x: 220, label: 'checkout@k8s', type: 'dep' },
      { x: 400, label: 'payments@k8s', type: 'dep' },
      { x: 580, label: 'frontend@vercel', type: 'dep' },
    ]},
  ];

  const typeColor = { team: '#b48fd1', svc: o2.accent, dep: o2.ok };

  const edges = [
    [0,0,1,1],[0,1,1,2],[0,1,1,3],[0,2,1,3],[0,2,1,4],
    [1,1,2,0],[1,2,2,1],[1,3,2,2],[1,0,1,1],[1,1,1,2],[1,2,1,3],
  ];

  return (
    <svg width="100%" height="100%" viewBox="0 0 960 600" style={{ position: 'absolute', inset: 0 }}>
      {edges.map((e, i) => {
        const a = rows[e[0]].items[e[1]];
        const b = rows[e[2]].items[e[3]];
        if (!a || !b) return null;
        const focus = a.focus || b.focus;
        return <line key={i} x1={a.x} y1={rows[e[0]].y} x2={b.x} y2={rows[e[2]].y} stroke={focus ? o2.accent : o2.borderStrong} strokeWidth={focus ? 1.2 : 0.6} opacity={focus ? 0.9 : 0.5}/>;
      })}
      {rows.map((row, ri) => row.items.map((it, ii) => (
        <g key={ri+'-'+ii}>
          {it.type === 'team' ? (
            <circle cx={it.x} cy={row.y} r={it.focus ? 20 : 14} fill={it.focus ? o2.accent : typeColor[it.type]} opacity={it.focus ? 1 : 0.85}/>
          ) : it.type === 'svc' ? (
            <rect x={it.x-18} y={row.y-18} width={36} height={36} rx={4} fill={it.focus ? o2.accent : typeColor[it.type]} opacity={it.focus ? 1 : 0.85}/>
          ) : (
            <rect x={it.x-16} y={row.y-16} width={32} height={32} rx={2} fill={typeColor[it.type]} opacity="0.85"/>
          )}
          {it.focus && (
            <circle cx={it.x} cy={row.y} r={30} fill="none" stroke={o2.accent} strokeWidth="1" opacity="0.4"/>
          )}
          <text x={it.x} y={row.y + 42} fontSize="11" fontFamily={o2.mono} fill={it.focus ? o2.text : o2.textMuted} textAnchor="middle">{it.label}</text>
        </g>
      )))}
    </svg>
  );
}

function Opt2Home() { return <O2Shell page="home"><O2Home/></O2Shell>; }
function Opt2Graph() { return <O2Shell page="graph"><O2GraphView/></O2Shell>; }
Object.assign(window, { Opt2Home, Opt2Graph });
