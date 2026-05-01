// Option 4 — Paper + Copilot
// Light-first paper workspace with a permanent dark AI copilot rail.

const o4 = {
  paper: '#f7f4ec', // warm off-white
  paperDeep: '#efeadd',
  ink: '#1a1612',
  textMuted: '#6b6458',
  textDim: '#9a9384',
  line: '#d9d2bf',
  lineSoft: '#e5dfcb',
  accent: '#3b5bdb', // deep indigo
  accentSoft: '#eaeeff',
  ok: '#4a8f47',
  warn: '#c98a2b',
  err: '#c0453d',
  // copilot (dark)
  cBg: '#0f1014',
  cPanel: '#181a20',
  cBorder: '#23262e',
  cText: '#e8e8ec',
  cMuted: '#8a8a94',
  cDim: '#53535a',
  cAccent: '#8cb4ff',
  serif: '"Instrument Serif", Georgia, serif',
  sans: '"IBM Plex Sans", "Inter", sans-serif',
  mono: '"IBM Plex Mono", monospace',
};

function O4Shell({ page, children }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: o4.paper,
        color: o4.ink,
        fontFamily: o4.sans,
        fontSize: 13,
        display: 'flex',
      }}
    >
      {/* Left sidebar (paper) */}
      <div
        style={{
          width: 60,
          borderRight: `1px solid ${o4.line}`,
          background: o4.paperDeep,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '18px 0',
          gap: 6,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: o4.ink,
            color: o4.paper,
            display: 'grid',
            placeItems: 'center',
            fontFamily: o4.serif,
            fontSize: 18,
            fontStyle: 'italic',
            marginBottom: 10,
          }}
        >
          s
        </div>
        {[
          ['home', '◱'],
          ['graph', '⋈'],
          ['conn', '⌁'],
          ['sch', '≡'],
          ['inc', '◎'],
        ].map(([k, g]) => (
          <div
            key={k}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              display: 'grid',
              placeItems: 'center',
              background: page === k ? o4.ink : 'transparent',
              color: page === k ? o4.paper : o4.textMuted,
              fontSize: 15,
            }}
          >
            {g}
          </div>
        ))}
        <div
          style={{
            marginTop: 'auto',
            width: 28,
            height: 28,
            borderRadius: 999,
            background: '#c9bfa7',
            display: 'grid',
            placeItems: 'center',
            fontSize: 10,
            fontWeight: 600,
            color: o4.ink,
          }}
        >
          MA
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </div>

      {/* Right copilot rail (dark) */}
      <O4Copilot />
    </div>
  );
}

function O4Copilot() {
  return (
    <div
      style={{
        width: 340,
        background: o4.cBg,
        color: o4.cText,
        borderLeft: `1px solid ${o4.line}`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: o4.sans,
      }}
    >
      <div
        style={{
          padding: '16px 18px',
          borderBottom: `1px solid ${o4.cBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: o4.cAccent,
            boxShadow: `0 0 10px ${o4.cAccent}`,
          }}
        />
        <div style={{ fontWeight: 500, fontSize: 13 }}>Copilot</div>
        <div style={{ marginLeft: 'auto', fontSize: 10, color: o4.cDim, fontFamily: o4.mono }}>
          MCP · 8 tools
        </div>
      </div>

      <div style={{ padding: 16, flex: 1, overflow: 'hidden', fontSize: 12 }}>
        <div
          style={{
            fontSize: 10,
            color: o4.cDim,
            fontFamily: o4.mono,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 8,
          }}
        >
          You asked
        </div>
        <div style={{ color: o4.cText, marginBottom: 16, lineHeight: 1.5 }}>
          What's the blast radius if we deprecate{' '}
          <span style={{ color: o4.cAccent }}>auth-lib</span>?
        </div>

        <div
          style={{
            fontSize: 10,
            color: o4.cDim,
            fontFamily: o4.mono,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 8,
          }}
        >
          Shipit ·
        </div>
        <div style={{ lineHeight: 1.5, marginBottom: 12 }}>
          Four services depend on <span style={{ color: o4.cAccent }}>auth-lib</span> directly.
          Three of them are tier-1. The oldest dep is{' '}
          <span style={{ fontFamily: o4.mono, fontSize: 11 }}>billing-worker</span> — it pins v1.2.0
          (17 months old).
        </div>

        <div
          style={{
            background: o4.cPanel,
            border: `1px solid ${o4.cBorder}`,
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 10, color: o4.cDim, marginBottom: 8, fontFamily: o4.mono }}>
            ◆ traced through graph
          </div>
          {[
            ['billing-worker', 'tier-1', o4.cAccent],
            ['payments-api', 'tier-1', o4.cAccent],
            ['checkout-service', 'tier-1', o4.cAccent],
            ['admin-portal', 'tier-3', o4.cMuted],
          ].map(([s, t, c], i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 0',
                borderTop: i ? `1px solid ${o4.cBorder}` : 'none',
              }}
            >
              <div style={{ width: 5, height: 5, borderRadius: 999, background: c }} />
              <div style={{ fontFamily: o4.mono, fontSize: 11 }}>{s}</div>
              <div style={{ marginLeft: 'auto', fontSize: 10, color: o4.cDim }}>{t}</div>
            </div>
          ))}
        </div>

        <div style={{ color: o4.cMuted, fontSize: 11, marginBottom: 10 }}>
          I'd recommend giving billing-worker a 4-week runway before flipping the switch.
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Show in graph →', 'Who to notify?', 'Draft migration plan'].map((a) => (
            <div
              key={a}
              style={{
                padding: '5px 10px',
                border: `1px solid ${o4.cBorder}`,
                borderRadius: 999,
                fontSize: 11,
                color: o4.cText,
                background: o4.cPanel,
              }}
            >
              {a}
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${o4.cBorder}`, padding: 12 }}>
        <div
          style={{
            background: o4.cPanel,
            border: `1px solid ${o4.cBorder}`,
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: o4.cAccent }}>✦</span>
          <span style={{ fontSize: 12, color: o4.cMuted, flex: 1 }}>
            Ask about anything in the graph…
          </span>
          <span style={{ fontSize: 10, color: o4.cDim, fontFamily: o4.mono }}>↑</span>
        </div>
      </div>
    </div>
  );
}

function O4Home() {
  return (
    <div style={{ flex: 1, padding: '28px 36px', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: o4.mono,
              fontSize: 10,
              color: o4.textDim,
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            Overview · acme
          </div>
          <div style={{ fontFamily: o4.serif, fontSize: 44, letterSpacing: -1, lineHeight: 1 }}>
            247 services, <span style={{ fontStyle: 'italic', color: o4.accent }}>one graph.</span>
          </div>
        </div>
        <div
          style={{
            padding: '8px 14px',
            border: `1px solid ${o4.line}`,
            borderRadius: 999,
            fontSize: 12,
            fontFamily: o4.mono,
            color: o4.textMuted,
            background: '#fff',
          }}
        >
          synced 4 min ago
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          ['247', 'Services', '+3 wk'],
          ['1,284', 'Edges', 'avg depth 4.2'],
          ['98.4%', 'Health', '2 stale'],
          ['7', 'Connectors', 'all syncing'],
        ].map(([v, l, d], i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              border: `1px solid ${o4.line}`,
              borderRadius: 12,
              padding: '16px 18px',
            }}
          >
            <div style={{ fontSize: 11, color: o4.textMuted, marginBottom: 8 }}>{l}</div>
            <div style={{ fontFamily: o4.serif, fontSize: 36, letterSpacing: -1, lineHeight: 1 }}>
              {v}
            </div>
            <div style={{ fontSize: 11, color: o4.textDim, marginTop: 8, fontFamily: o4.mono }}>
              {d}
            </div>
          </div>
        ))}
      </div>

      {/* Latest activity */}
      <div
        style={{
          background: '#fff',
          border: `1px solid ${o4.line}`,
          borderRadius: 12,
          padding: '18px 22px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div style={{ fontFamily: o4.serif, fontSize: 20, letterSpacing: -0.2 }}>
            Latest activity
          </div>
          <div style={{ fontSize: 11, color: o4.textDim, fontFamily: o4.mono }}>view all →</div>
        </div>
        {[
          ['21:38', 'DEPLOY', 'checkout-service', 'v2.14.0 → production', o4.ok],
          ['21:24', 'OWNER', 'payments-api', 'payments-team (was platform-team)', o4.accent],
          ['20:51', 'SYNC', 'datadog', '340 monitors, 4 new this hour', o4.textMuted],
          ['20:17', 'DEPREC', 'auth-lib', '4 dependents still pinned', o4.warn],
        ].map((x, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 70px 180px 1fr auto',
              gap: 14,
              alignItems: 'center',
              padding: '10px 0',
              borderTop: i ? `1px solid ${o4.lineSoft}` : 'none',
              fontSize: 13,
            }}
          >
            <span style={{ fontFamily: o4.mono, fontSize: 11, color: o4.textDim }}>{x[0]}</span>
            <span style={{ fontFamily: o4.mono, fontSize: 10, color: x[4], letterSpacing: 1 }}>
              {x[1]}
            </span>
            <span style={{ fontFamily: o4.mono, fontSize: 12 }}>{x[2]}</span>
            <span style={{ color: o4.textMuted }}>{x[3]}</span>
            <span style={{ fontFamily: o4.mono, fontSize: 10, color: o4.textDim }}>→</span>
          </div>
        ))}
      </div>

      {/* Connector strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          ['GitHub', '1,204 repos', 100],
          ['Kubernetes', '89 workloads', 100],
          ['Datadog', '340 monitors', 92],
          ['Backstage', '247 entities', 100],
        ].map(([n, s, v], i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              border: `1px solid ${o4.line}`,
              borderRadius: 10,
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: v < 100 ? o4.warn : o4.ok,
                }}
              />
              <div style={{ fontSize: 13, fontWeight: 500 }}>{n}</div>
            </div>
            <div
              style={{ fontSize: 11, color: o4.textMuted, marginBottom: 8, fontFamily: o4.mono }}
            >
              {s}
            </div>
            <div
              style={{ height: 3, background: o4.lineSoft, borderRadius: 999, overflow: 'hidden' }}
            >
              <div
                style={{ width: `${v}%`, height: '100%', background: v < 100 ? o4.warn : o4.ok }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function O4GraphView() {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div
        style={{
          width: 220,
          borderRight: `1px solid ${o4.line}`,
          background: '#fff',
          padding: '22px 18px',
        }}
      >
        <div
          style={{
            fontFamily: o4.mono,
            fontSize: 10,
            color: o4.textDim,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 10,
          }}
        >
          Node types
        </div>
        {[
          ['LogicalService', 247, o4.accent],
          ['Repository', 1204, '#7a9cff'],
          ['Deployment', 189, o4.ok],
          ['RuntimeService', 412, o4.warn],
          ['Team', 24, '#a56ebf'],
          ['Person', 187, o4.textMuted],
        ].map(([l, n, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
            <div style={{ fontSize: 13 }}>{l}</div>
            <div
              style={{ marginLeft: 'auto', fontFamily: o4.mono, fontSize: 11, color: o4.textDim }}
            >
              {n}
            </div>
          </div>
        ))}
        <div
          style={{
            fontFamily: o4.mono,
            fontSize: 10,
            color: o4.textDim,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginTop: 22,
            marginBottom: 10,
          }}
        >
          Env
        </div>
        {['production', 'staging', 'dev'].map((e, i) => (
          <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                border: `1px solid ${o4.line}`,
                background: i === 0 ? o4.accent : '#fff',
              }}
            />
            <div style={{ fontSize: 13 }}>{e}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, position: 'relative', background: o4.paper, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 45% 40%, #fff 0%, transparent 60%)`,
          }}
        />
        <O4Graph />

        <div
          style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', gap: 8 }}
        >
          <div
            style={{
              background: '#fff',
              border: `1px solid ${o4.line}`,
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 12,
              color: o4.textMuted,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ color: o4.accent }}>◆</span>{' '}
            <span style={{ color: o4.ink, fontFamily: o4.mono, fontSize: 12 }}>payments-api</span>
            <span style={{ color: o4.textDim, fontFamily: o4.mono, fontSize: 11 }}>
              · depth 2 · 34 neighbors
            </span>
          </div>
          <div
            style={{
              background: '#fff',
              border: `1px solid ${o4.line}`,
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 11,
              fontFamily: o4.mono,
              color: o4.textMuted,
            }}
          >
            Radial
          </div>
          <div
            style={{
              background: o4.accent,
              color: '#fff',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Ask about this →
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 18,
            left: 18,
            right: 18,
            background: '#fff',
            border: `1px solid ${o4.line}`,
            borderRadius: 12,
            padding: '14px 18px',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: o4.mono,
                fontSize: 10,
                color: o4.textDim,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                marginBottom: 4,
              }}
            >
              Logical Service
            </div>
            <div style={{ fontFamily: o4.serif, fontSize: 22, letterSpacing: -0.3 }}>
              payments-api
            </div>
            <div style={{ fontSize: 11, color: o4.textMuted, marginTop: 2 }}>
              payments-team · tier 1
            </div>
          </div>
          {[
            ['14', 'deps'],
            ['23', 'dependents'],
            ['p99 82', 'ms'],
          ].map(([v, l]) => (
            <div key={l}>
              <div
                style={{
                  fontFamily: o4.mono,
                  fontSize: 10,
                  color: o4.textDim,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: 4,
                }}
              >
                {l}
              </div>
              <div style={{ fontFamily: o4.serif, fontSize: 22, letterSpacing: -0.3 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function O4Graph() {
  // Hierarchical layout similar to current UI but cleaner
  const rows = [
    {
      y: 110,
      label: 'TEAMS',
      items: [
        { x: 200, n: 'platform' },
        { x: 380, n: 'payments', focus: true },
        { x: 560, n: 'frontend' },
      ],
    },
    {
      y: 250,
      label: 'SERVICES',
      items: [
        { x: 140, n: 'shared-lib' },
        { x: 300, n: 'checkout' },
        { x: 460, n: 'payments-api', focus: true },
        { x: 620, n: 'frontend' },
        { x: 760, n: 'user-svc' },
      ],
    },
    {
      y: 400,
      label: 'DEPLOYMENTS',
      items: [
        { x: 220, n: 'checkout@ci' },
        { x: 460, n: 'payments@ci' },
        { x: 640, n: 'frontend@ci' },
      ],
    },
  ];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 860 500"
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Row labels */}
      {rows.map((r, i) => (
        <text
          key={'l' + i}
          x={20}
          y={r.y + 4}
          fontSize="9"
          fill={o4.textDim}
          fontFamily={o4.mono}
          letterSpacing="1.5"
        >
          {r.label}
        </text>
      ))}
      {/* Edges */}
      {[
        [0, 1, 1, 2],
        [0, 0, 1, 1],
        [0, 1, 1, 1],
        [0, 2, 1, 3],
        [0, 2, 1, 4],
        [1, 0, 1, 1],
        [1, 1, 1, 2],
        [1, 2, 1, 3],
        [1, 1, 2, 0],
        [1, 2, 2, 1],
        [1, 3, 2, 2],
      ].map((e, i) => {
        const a = rows[e[0]].items[e[1]];
        const b = rows[e[2]].items[e[3]];
        const focus = a.focus || b.focus;
        return (
          <line
            key={'e' + i}
            x1={a.x}
            y1={rows[e[0]].y}
            x2={b.x}
            y2={rows[e[2]].y}
            stroke={focus ? o4.accent : o4.line}
            strokeWidth={focus ? 1.2 : 0.8}
            opacity={focus ? 0.7 : 0.9}
          />
        );
      })}
      {/* Nodes */}
      {rows.map((r, ri) =>
        r.items.map((it, ii) => {
          const colors = [ri === 0 ? '#a56ebf' : ri === 1 ? o4.accent : o4.ok];
          return (
            <g key={ri + '-' + ii}>
              {ri === 0 ? (
                <circle
                  cx={it.x}
                  cy={r.y}
                  r={it.focus ? 18 : 13}
                  fill={it.focus ? o4.accent : colors[0]}
                />
              ) : ri === 1 ? (
                <rect
                  x={it.x - 18}
                  y={r.y - 18}
                  width={36}
                  height={36}
                  rx={5}
                  fill={it.focus ? o4.accent : colors[0]}
                  opacity={it.focus ? 1 : 0.85}
                />
              ) : (
                <rect
                  x={it.x - 15}
                  y={r.y - 15}
                  width={30}
                  height={30}
                  rx={4}
                  fill={colors[0]}
                  opacity="0.8"
                />
              )}
              {it.focus && (
                <circle
                  cx={it.x}
                  cy={r.y}
                  r={30}
                  fill="none"
                  stroke={o4.accent}
                  strokeWidth="1"
                  opacity="0.3"
                />
              )}
              <text
                x={it.x}
                y={r.y + ri === 0 ? 32 : 40}
                fontSize="10"
                fontFamily={o4.mono}
                fill={it.focus ? o4.ink : o4.textMuted}
                textAnchor="middle"
                dy={30}
              >
                {it.n}
              </text>
            </g>
          );
        }),
      )}
    </svg>
  );
}

function Opt4Home() {
  return (
    <O4Shell page="home">
      <O4Home />
    </O4Shell>
  );
}
function Opt4Graph() {
  return (
    <O4Shell page="graph">
      <O4GraphView />
    </O4Shell>
  );
}
Object.assign(window, { Opt4Home, Opt4Graph });
