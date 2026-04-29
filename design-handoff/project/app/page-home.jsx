// Home page — Overview. Hero ask + stats + activity + connectors + quick graph preview.

function PageHome({ nav, onAsk }) {
  const t = useTheme();
  return (
    <div className="fade-in" style={{ overflow: 'auto', height: '100%', padding: '28px 36px 40px' }}>
      {/* Hero */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Tuesday, April 19 · 21:42
          </div>
          <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: -0.9, lineHeight: 1.1 }}>
            Good evening, Mo.
          </div>
          <div style={{ color: t.textMuted, marginTop: 8, fontSize: 14, maxWidth: 560 }}>
            247 services mapped across 7 sources. Your graph is fresh — two deployments rolled this hour.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn ghost>Export report</Btn>
          <Btn primary onClick={() => nav('graph')}>Open Graph →</Btn>
        </div>
      </div>

      {/* Ask hero */}
      <Card pad={0} style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{
          padding: '22px 24px',
          background: `
            radial-gradient(circle at 85% 50%, ${t.accentGlow} 0%, transparent 55%),
            ${t.panel}
          `,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Dot color={t.accent} glow/>
            <SectionLabel>Ask ShipIt</SectionLabel>
          </div>
          <div
            onClick={() => onAsk("What's the blast radius if payments-api goes down?")}
            style={{
              fontSize: 24, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.3, cursor: 'pointer',
              marginBottom: 6,
            }}>
            What's the blast radius if <span style={{ color: t.accent }}>payments-api</span> goes down?
          </div>
          <div style={{ color: t.textDim, fontSize: 12 }}>
            Natural language · across 7 sources · typically answered in ~1.2s
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            {SAMPLE_QUESTIONS.slice(0, 4).map(q => (
              <div key={q} onClick={() => onAsk(q)} style={{
                padding: '7px 12px', fontSize: 12, border: `1px solid ${t.border}`,
                borderRadius: 999, color: t.textMuted, background: t.panel2,
                cursor: 'pointer',
              }}>{q}</div>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { n: '247', l: 'Services', d: '+3 this week' },
          { n: '1,284', l: 'Edges', d: 'avg depth 4.2' },
          { n: '98.4%', l: 'Graph health', d: '2 stale sources', warn: true },
          { n: '7', l: 'Connectors', d: '1 error', err: true },
        ].map((s, i) => (
          <Card key={i}>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 12, display:'flex', alignItems:'center', gap: 6 }}>
              {s.warn && <Dot color={t.warn}/>}
              {s.err && <Dot color={t.err}/>}
              {s.l}
            </div>
            <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: -1, fontFamily: MONO }}>{s.n}</div>
            <div style={{ fontSize: 11, color: t.textDim, marginTop: 6 }}>{s.d}</div>
          </Card>
        ))}
      </div>

      {/* Two-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 12, marginBottom: 20 }}>
        {/* Activity */}
        <Card>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Recent activity</div>
            <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, cursor: 'pointer' }}>view all →</div>
          </div>
          {ACTIVITY.slice(0, 6).map((x, i) => {
            const cmap = { ok: t.ok, accent: t.accent, warn: t.warn, muted: t.textMuted, err: t.err };
            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '50px 58px 160px 1fr auto',
                gap: 12, alignItems: 'center',
                padding: '10px 0', borderTop: i ? `1px solid ${t.border}` : 'none',
              }}>
                <MonoText style={{ fontSize: 11, color: t.textDim }}>{x.t}</MonoText>
                <MonoText style={{ fontSize: 10, color: cmap[x.c], letterSpacing: 1 }}>{x.k}</MonoText>
                <MonoText style={{ fontSize: 12 }}>{x.s}</MonoText>
                <span style={{ color: t.textMuted, fontSize: 12, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{x.m}</span>
                <span style={{ color: t.textDim, fontSize: 11 }}>→</span>
              </div>
            );
          })}
        </Card>

        {/* Connector strip */}
        <Card>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Connector health</div>
            <div onClick={() => nav('connectors')} style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, cursor: 'pointer' }}>manage →</div>
          </div>
          {CONNECTORS.slice(0, 6).map((c, i) => (
            <div key={c.id} style={{
              display:'flex', alignItems:'center', gap: 10,
              padding: '9px 0', borderTop: i ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: t.panel2, border: `1px solid ${t.border}`, display: 'grid', placeItems: 'center', fontSize: 10 }}>{c.icon}</div>
              <div style={{ fontSize: 12 }}>{c.name}</div>
              <div style={{ color: t.textDim, fontSize: 10, fontFamily: MONO, flex: 1 }}>{c.items}</div>
              <div style={{ width: 50, height: 3, background: t.panel2, borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: c.status==='healthy' ? t.ok : (c.status==='degraded' ? t.warn : t.err) }}/>
              </div>
              <StatusDot status={c.status}/>
            </div>
          ))}
        </Card>
      </div>

      {/* Graph preview */}
      <Card pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Your graph</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 11, color: t.textMuted }}>
            <span><Dot color={t.accent}/> services</span>
            <span><Dot color={t.purple}/> repos</span>
            <span><Dot color={t.ok}/> deployments</span>
            <span><Dot color={t.pink}/> teams</span>
          </div>
          <div style={{ marginLeft: 16 }}>
            <Btn small onClick={() => nav('graph')}>Explore →</Btn>
          </div>
        </div>
        <div style={{ height: 320, position: 'relative', background: `
          radial-gradient(ellipse at 50% 50%, ${t.panel2} 0%, ${t.panel} 70%)
        ` }}>
          <MiniGraph onNodeClick={(id) => nav('entity', id)}/>
        </div>
      </Card>
    </div>
  );
}

function MiniGraph({ onNodeClick }) {
  const t = useTheme();
  // Compute radial layout
  const nodes = SERVICES.map((s, i, a) => {
    const n = a.length;
    const a_ = (i / n) * Math.PI * 2;
    const r = 130;
    return { ...s, x: 460 + Math.cos(a_) * r, y: 160 + Math.sin(a_) * r * 0.75 };
  });
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const typeColor = { LogicalService: t.accent, Repository: t.purple, Deployment: t.ok };

  return (
    <svg width="100%" height="100%" viewBox="0 0 920 320" preserveAspectRatio="xMidYMid meet">
      {EDGES.map((e, i) => {
        const a = byId[e[0]], b = byId[e[1]];
        if (!a || !b) return null;
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={t.borderStrong} strokeWidth="0.6" opacity="0.5"/>;
      })}
      {nodes.map(n => (
        <g key={n.id} onClick={() => onNodeClick && onNodeClick(n.id)} style={{ cursor: 'pointer' }}>
          <circle cx={n.x} cy={n.y} r={n.tier===1 ? 9 : 6} fill={typeColor[n.type] || t.textMuted} opacity="0.92"/>
          <text x={n.x} y={n.y + 20} fontSize="9" fill={t.textMuted} textAnchor="middle" fontFamily={MONO}>{n.name}</text>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { PageHome });
