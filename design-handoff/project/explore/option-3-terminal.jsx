// Option 3 — Infra Native
// Terminal DNA, monospace-heavy, high contrast. For operators.

const o3 = {
  bg: '#07080a',
  panel: '#0d0f12',
  panel2: '#11141a',
  border: '#1a1f28',
  borderStrong: '#2a3240',
  text: '#e8eef5',
  textMuted: '#7a8696',
  textDim: '#4a5463',
  accent: '#4ade80', // terminal green
  accentDim: 'rgba(74,222,128,0.12)',
  blue: '#60a5fa',
  purple: '#c084fc',
  yellow: '#fbbf24',
  red: '#f87171',
  mono: '"JetBrains Mono", "IBM Plex Mono", monospace',
  sans: '"IBM Plex Sans", "Inter", sans-serif',
};

function O3Shell({ page, children }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: o3.bg,
        color: o3.text,
        fontFamily: o3.mono,
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tab bar like a terminal */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 34,
          borderBottom: `1px solid ${o3.border}`,
          background: o3.panel,
          paddingLeft: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginRight: 16 }}>
          {['#f87171', '#fbbf24', '#4ade80'].map((c, i) => (
            <div
              key={i}
              style={{ width: 10, height: 10, borderRadius: 999, background: c, opacity: 0.6 }}
            />
          ))}
        </div>
        <div style={{ fontSize: 11, color: o3.textMuted, letterSpacing: 0.5 }}>
          shipit — acme/platform — <span style={{ color: o3.accent }}>connected</span>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: o3.textDim, paddingRight: 14 }}>
          <span style={{ color: o3.accent }}>●</span> mcp:8 · rest:200 · graph:ok
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left nav */}
        <div
          style={{
            width: 200,
            borderRight: `1px solid ${o3.border}`,
            background: o3.panel,
            padding: '14px 10px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: o3.accent,
              padding: '0 6px 14px',
              letterSpacing: 1,
            }}
          >
            ◇ SHIPIT
          </div>

          {[
            ['home', 'HOME', '~'],
            ['graph', 'GRAPH', 'g'],
            ['ask', 'ASK', '?'],
            ['conn', 'CONNECTORS', 'c'],
            ['sch', 'SCHEMA', 's'],
            ['inc', 'INCIDENT', '!'],
            ['mcp', 'MCP', 'm'],
            ['act', 'ACTIVITY', 'a'],
          ].map(([k, l, key]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px 8px',
                background: page === k ? o3.panel2 : 'transparent',
                borderLeft: page === k ? `2px solid ${o3.accent}` : '2px solid transparent',
                color: page === k ? o3.accent : o3.textMuted,
                fontSize: 11,
                letterSpacing: 0.5,
              }}
            >
              <span style={{ flex: 1 }}>
                {page === k && '> '}
                {l}
              </span>
              <span style={{ color: o3.textDim, fontSize: 10 }}>[{key}]</span>
            </div>
          ))}

          <div
            style={{
              marginTop: 'auto',
              padding: '10px 6px',
              borderTop: `1px solid ${o3.border}`,
              fontSize: 10,
              color: o3.textDim,
              lineHeight: 1.6,
            }}
          >
            <div>graph: 247 nodes</div>
            <div>edges: 1284</div>
            <div>
              sync: <span style={{ color: o3.accent }}>4m ago</span>
            </div>
            <div>usr: mo@acme</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {children}
        </div>
      </div>

      {/* Bottom ask bar */}
      <div
        style={{
          height: 36,
          borderTop: `1px solid ${o3.border}`,
          background: o3.panel,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 10,
        }}
      >
        <span style={{ color: o3.accent }}>▸</span>
        <span style={{ color: o3.textMuted, fontSize: 12 }}>ask</span>
        <span style={{ color: o3.textDim }}>:</span>
        <span style={{ color: o3.text, fontSize: 12 }}>
          what's the blast radius of deprecating auth-lib_
        </span>
        <span style={{ marginLeft: 'auto', color: o3.textDim, fontSize: 10 }}>
          ⌘K · ESC to cancel · ⏎ to run
        </span>
      </div>
    </div>
  );
}

function O3Home() {
  return (
    <div
      style={{
        flex: 1,
        overflow: 'hidden',
        padding: 18,
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gridTemplateRows: 'auto 1fr',
        gap: 12,
      }}
    >
      {/* Big header */}
      <div
        style={{
          gridColumn: '1 / -1',
          background: o3.panel,
          border: `1px solid ${o3.border}`,
          padding: '18px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
          <span style={{ color: o3.textDim }}>$</span>
          <span style={{ color: o3.accent }}>shipit</span>
          <span style={{ color: o3.textMuted }}>status --org acme</span>
          <span style={{ marginLeft: 'auto', color: o3.textDim, fontSize: 11 }}>
            [exit 0 in 142ms]
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>
          {[
            ['services', '247', o3.text],
            ['edges', '1284', o3.text],
            ['health', '98.4%', o3.accent],
            ['sources', '7/7 up', o3.accent],
            ['stale', '2', o3.yellow],
            ['incidents', '0', o3.text],
          ].map(([l, v, c], i) => (
            <div key={i}>
              <div
                style={{
                  color: o3.textDim,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {l}
              </div>
              <div style={{ color: c, fontSize: 24, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ask panel */}
      <div
        style={{
          background: o3.panel,
          border: `1px solid ${o3.border}`,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <div style={{ color: o3.accent, fontSize: 11, marginBottom: 10, letterSpacing: 1 }}>
          ── ASK ──────────────────────────────────
        </div>
        <div
          style={{
            background: o3.panel2,
            border: `1px solid ${o3.border}`,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <div style={{ color: o3.textDim, fontSize: 10, marginBottom: 4 }}>› query</div>
          <div style={{ color: o3.text, fontSize: 13 }}>
            who owns payments-api and what's the oncall?
          </div>
        </div>
        <div style={{ color: o3.textDim, fontSize: 10, marginBottom: 6 }}>› result</div>
        <div
          style={{
            background: o3.panel2,
            border: `1px solid ${o3.border}`,
            padding: 10,
            flex: 1,
            fontSize: 12,
            lineHeight: 1.7,
          }}
        >
          <div>
            <span style={{ color: o3.blue }}>owner</span>: payments-team (3 members)
          </div>
          <div>
            <span style={{ color: o3.blue }}>oncall</span>:{' '}
            <span style={{ color: o3.accent }}>maya.s@acme.co</span> until Fri 09:00
          </div>
          <div>
            <span style={{ color: o3.blue }}>repo</span>: acme/payments-api{' '}
            <span style={{ color: o3.textDim }}>(last commit 2h)</span>
          </div>
          <div>
            <span style={{ color: o3.blue }}>sla</span>: tier-1 · 99.95% · p99 &lt;200ms
          </div>
          <div style={{ color: o3.textDim, marginTop: 8, fontSize: 10 }}>
            sourced from github.owners, pagerduty.schedules, backstage.catalog
          </div>
          <div style={{ marginTop: 10, color: o3.textMuted }}>
            › next: <span style={{ color: o3.accent }}>blast-radius</span>,{' '}
            <span style={{ color: o3.accent }}>dependents</span>,{' '}
            <span style={{ color: o3.accent }}>recent-deploys</span>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div
        style={{
          background: o3.panel,
          border: `1px solid ${o3.border}`,
          padding: 16,
          overflow: 'hidden',
        }}
      >
        <div style={{ color: o3.accent, fontSize: 11, marginBottom: 10, letterSpacing: 1 }}>
          ── ACTIVITY ─────────────────────────────
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.9 }}>
          {[
            ['21:38', 'deploy', 'checkout-service@v2.14.0 → production', o3.accent],
            ['21:24', 'claim', 'payments-api.owner := payments-team (github > backstage)', o3.blue],
            ['20:51', 'sync', 'datadog: 340 monitors, 4 new', o3.textMuted],
            ['20:17', 'warn', 'auth-lib deprecated, 4 dependents', o3.yellow],
            ['19:42', 'scan', 'k8s prod: 89 workloads mapped', o3.textMuted],
            ['19:12', 'node', '+user-service (Repository)', o3.accent],
            ['18:55', 'sync', 'github: 1204 repos indexed', o3.textMuted],
          ].map(([t, k, m, c], i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: o3.textDim }}>{t}</span>
              <span style={{ color: c, width: 60 }}>{k}</span>
              <span style={{ color: o3.textMuted, flex: 1 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function O3GraphView() {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div
        style={{
          width: 240,
          borderRight: `1px solid ${o3.border}`,
          background: o3.panel,
          padding: '14px 12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ color: o3.accent, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>
          [filters]
        </div>
        <div style={{ fontSize: 10, color: o3.textDim, marginBottom: 4 }}>node.labels</div>
        {[
          ['LogicalService', 247, true],
          ['Repository', 1204, false],
          ['Deployment', 189, true],
          ['RuntimeService', 412, true],
          ['Team', 24, false],
          ['Person', 187, false],
        ].map(([l, n, on]) => (
          <div
            key={l}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '3px 4px',
              fontSize: 11,
            }}
          >
            <span style={{ color: on ? o3.accent : o3.textDim }}>{on ? '[x]' : '[ ]'}</span>
            <span style={{ color: on ? o3.text : o3.textMuted, flex: 1 }}>{l}</span>
            <span style={{ color: o3.textDim, fontSize: 10 }}>{n}</span>
          </div>
        ))}

        <div style={{ fontSize: 10, color: o3.textDim, marginTop: 14, marginBottom: 4 }}>env</div>
        {['production', 'staging', 'dev'].map((e, i) => (
          <div
            key={e}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '3px 4px',
              fontSize: 11,
            }}
          >
            <span style={{ color: i === 0 ? o3.accent : o3.textDim }}>
              {i === 0 ? '[x]' : '[ ]'}
            </span>
            <span style={{ color: i === 0 ? o3.text : o3.textMuted }}>{e}</span>
          </div>
        ))}

        <div style={{ fontSize: 10, color: o3.textDim, marginTop: 14, marginBottom: 4 }}>
          cypher
        </div>
        <div
          style={{
            background: o3.bg,
            border: `1px solid ${o3.border}`,
            padding: 8,
            fontSize: 10,
            lineHeight: 1.5,
            color: o3.textMuted,
          }}
        >
          <span style={{ color: o3.purple }}>MATCH</span> (s)-[*1..2]-(n)
          <br />
          <span style={{ color: o3.purple }}>WHERE</span> s.name =~{' '}
          <span style={{ color: o3.yellow }}>"payments.*"</span>
          <br />
          <span style={{ color: o3.purple }}>RETURN</span> n, r
        </div>

        <div
          style={{
            marginTop: 14,
            padding: '6px 8px',
            background: o3.panel2,
            border: `1px solid ${o3.border}`,
            fontSize: 11,
            color: o3.textMuted,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>34 nodes / 58 edges</span>
          <span style={{ color: o3.accent }}>run</span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          position: 'relative',
          background: `
        radial-gradient(ellipse at 50% 40%, #0f1319 0%, ${o3.bg} 70%)
      `,
          overflow: 'hidden',
        }}
      >
        {/* Subtle ascii grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <O3Graph />

        {/* Top bar */}
        <div
          style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', gap: 6 }}
        >
          <div
            style={{
              background: o3.panel,
              border: `1px solid ${o3.border}`,
              padding: '5px 10px',
              fontSize: 11,
              color: o3.textMuted,
              flex: 1,
            }}
          >
            <span style={{ color: o3.accent }}>› </span>focus: payments-api · depth 2
          </div>
          {['layout:force', 'zoom:100%', 'hops:2'].map((t) => (
            <div
              key={t}
              style={{
                background: o3.panel,
                border: `1px solid ${o3.border}`,
                padding: '5px 10px',
                fontSize: 11,
                color: o3.textMuted,
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* Detail */}
        <div
          style={{
            position: 'absolute',
            right: 12,
            top: 50,
            bottom: 12,
            width: 260,
            background: o3.panel,
            border: `1px solid ${o3.border}`,
            padding: 12,
          }}
        >
          <div style={{ color: o3.accent, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>
            [node :LogicalService]
          </div>
          <div style={{ fontSize: 16, color: o3.text, fontWeight: 500, marginBottom: 2 }}>
            payments-api
          </div>
          <div style={{ fontSize: 10, color: o3.textDim, marginBottom: 14 }}>
            id: 7f3a91c2 · tier:1
          </div>

          <div style={{ fontSize: 10, color: o3.textDim, marginBottom: 4 }}>properties</div>
          <div
            style={{
              background: o3.bg,
              border: `1px solid ${o3.border}`,
              padding: 8,
              fontSize: 11,
              lineHeight: 1.7,
              marginBottom: 10,
            }}
          >
            <div>
              <span style={{ color: o3.blue }}>owner</span>:{' '}
              <span style={{ color: o3.accent }}>payments-team</span>
            </div>
            <div>
              <span style={{ color: o3.blue }}>tier</span>: 1
            </div>
            <div>
              <span style={{ color: o3.blue }}>sla</span>: 99.95
            </div>
            <div>
              <span style={{ color: o3.blue }}>lang</span>: go
            </div>
            <div>
              <span style={{ color: o3.blue }}>runtime</span>: k8s
            </div>
          </div>

          <div style={{ fontSize: 10, color: o3.textDim, marginBottom: 4 }}>claims</div>
          <div style={{ fontSize: 10, lineHeight: 1.7 }}>
            <div>
              <span style={{ color: o3.accent }}>●</span> owner ← github.codeowners
            </div>
            <div>
              <span style={{ color: o3.textDim }}>●</span> owner ← backstage.catalog (lost)
            </div>
            <div>
              <span style={{ color: o3.accent }}>●</span> tier ← datadog.tags
            </div>
          </div>

          <div style={{ fontSize: 10, color: o3.textDim, marginTop: 10, marginBottom: 4 }}>
            blast-radius
          </div>
          <div style={{ color: o3.yellow, fontSize: 11 }}>23 services · 3 tier-1 flows</div>
        </div>
      </div>
    </div>
  );
}

function O3Graph() {
  const nodes = [
    { id: 'p', x: 400, y: 280, l: 'payments-api', c: o3.accent, r: 14, focus: true },
    { id: 'c', x: 240, y: 180, l: 'checkout-svc', c: o3.blue, r: 9 },
    { id: 'a', x: 560, y: 160, l: 'auth-svc', c: o3.blue, r: 9 },
    { id: 'u', x: 600, y: 380, l: 'user-service', c: o3.blue, r: 9 },
    { id: 'o', x: 210, y: 380, l: 'orders', c: o3.blue, r: 9 },
    { id: 'n', x: 400, y: 110, l: 'notif-queue', c: o3.purple, r: 7 },
    { id: 'd', x: 400, y: 450, l: 'payments@k8s', c: o3.yellow, r: 7 },
    { id: 'd2', x: 700, y: 280, l: 'billing@k8s', c: o3.yellow, r: 7 },
    { id: 't', x: 100, y: 280, l: 'payments-team', c: o3.purple, r: 8 },
  ];
  const edges = [
    ['p', 'c'],
    ['p', 'a'],
    ['p', 'u'],
    ['p', 'o'],
    ['c', 'n'],
    ['a', 'n'],
    ['p', 'd'],
    ['p', 'd2'],
    ['p', 't'],
    ['c', 'o'],
  ];
  const find = (id) => nodes.find((n) => n.id === id);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 820 560"
      style={{ position: 'absolute', inset: 0 }}
    >
      {edges.map(([a, b], i) => {
        const A = find(a),
          B = find(b);
        const focus = a === 'p' || b === 'p';
        return (
          <line
            key={i}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={focus ? o3.accent : o3.borderStrong}
            strokeWidth={focus ? 1 : 0.7}
            opacity={focus ? 0.6 : 0.5}
            strokeDasharray={focus ? '' : '3,3'}
          />
        );
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          {n.focus && (
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r + 10}
              fill="none"
              stroke={n.c}
              strokeWidth="0.8"
              opacity="0.4"
            />
          )}
          {n.focus && (
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r + 22}
              fill="none"
              stroke={n.c}
              strokeWidth="0.5"
              opacity="0.2"
            />
          )}
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity={n.focus ? 1 : 0.9} />
          <text
            x={n.x}
            y={n.y + n.r + 13}
            fontSize="10"
            fill={n.focus ? o3.text : o3.textMuted}
            fontFamily={o3.mono}
            textAnchor="middle"
          >
            {n.l}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Opt3Home() {
  return (
    <O3Shell page="home">
      <O3Home />
    </O3Shell>
  );
}
function Opt3Graph() {
  return (
    <O3Shell page="graph">
      <O3GraphView />
    </O3Shell>
  );
}
Object.assign(window, { Opt3Home, Opt3Graph });
