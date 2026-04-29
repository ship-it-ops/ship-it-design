// Entity detail page — click-through from graph or search

function PageEntity({ id, nav, onAsk }) {
  const t = useTheme();
  const s = SERVICES.find(x => x.id === id) || SERVICES[0];
  const incoming = EDGES.filter(e => e[1] === s.id).map(e => ({ from: e[0], rel: e[2] }));
  const outgoing = EDGES.filter(e => e[0] === s.id).map(e => ({ to: e[1], rel: e[2] }));
  return (
    <div className="fade-in" style={{ overflow: 'auto', height: '100%', padding: '24px 32px 40px' }}>
      <div onClick={() => nav('graph', s.id)} style={{ fontSize: 12, color: t.textDim, fontFamily: MONO, marginBottom: 14, cursor: 'pointer' }}>← back to graph</div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <TypeBadge type={s.type}/>
            <Pill color={s.tier === 1 ? t.err : (s.tier === 2 ? t.warn : t.textMuted)}>Tier {s.tier}</Pill>
            {s.env.map(e => <Pill key={e}>{e}</Pill>)}
          </div>
          <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: -0.9, fontFamily: MONO }}>{s.name}</div>
          <div style={{ color: t.textMuted, marginTop: 6, fontSize: 14, maxWidth: 640 }}>{s.desc}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn onClick={() => nav('graph', s.id)}>Focus in graph</Btn>
          <Btn onClick={() => onAsk(`explain ${s.name} for me`)} primary>Ask about this ✦</Btn>
        </div>
      </div>

      {/* Key facts strip */}
      <Card pad={0} style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {[
            ['owner', s.owner, t.accent],
            ['on-call', s.oncall, t.accent],
            ['lang', s.lang],
            ['runtime', s.runtime],
            ['sla', `${s.sla}%`],
            ['p99', `${s.p99}ms`],
          ].map(([k, v, c], i) => (
            <div key={k} style={{ padding: '16px 20px', borderLeft: i ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 6 }}>{k}</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: c || t.text, letterSpacing: -0.3 }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Ask panel */}
      <Card style={{ marginBottom: 16, background: `radial-gradient(circle at 85% 50%, ${t.accentGlow} 0%, transparent 55%), ${t.panel}` }}>
        <SectionLabel><Dot color={t.accent} glow/> <span style={{ marginLeft: 8 }}>Shipit · context</span></SectionLabel>
        <div style={{ fontSize: 16, color: t.text, lineHeight: 1.5, marginBottom: 10 }}>
          {s.name} sits in the critical path for checkout. It depends on {s.deps} services and has {s.dependents} dependents. Last change was {s.change}.
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Blast radius', 'Who to page', 'Recent deploys', 'Show in graph'].map(a => (
            <div key={a} onClick={() => onAsk(`${a.toLowerCase()} for ${s.name}`)} style={{ padding: '6px 11px', fontSize: 12, border: `1px solid ${t.border}`, borderRadius: 999, color: t.text, background: t.panel2, cursor: 'pointer' }}>{a}</div>
          ))}
        </div>
      </Card>

      {/* Relationships + provenance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <Card>
          <SectionLabel right={`${incoming.length} inbound`}>Dependents</SectionLabel>
          {incoming.map((e, i) => (
            <div key={i} onClick={() => nav('entity', e.from)} style={{
              display: 'grid', gridTemplateColumns: '10px 1fr auto', gap: 10, alignItems: 'center',
              padding: '9px 0', borderTop: i ? `1px solid ${t.border}` : 'none', cursor: 'pointer',
            }}>
              <Dot color={t.purple}/>
              <MonoText style={{ fontSize: 12 }}>{e.from}</MonoText>
              <Pill>{e.rel}</Pill>
            </div>
          ))}
        </Card>
        <Card>
          <SectionLabel right={`${outgoing.length} outbound`}>Dependencies</SectionLabel>
          {outgoing.map((e, i) => (
            <div key={i} onClick={() => nav('entity', e.to)} style={{
              display: 'grid', gridTemplateColumns: '10px 1fr auto', gap: 10, alignItems: 'center',
              padding: '9px 0', borderTop: i ? `1px solid ${t.border}` : 'none', cursor: 'pointer',
            }}>
              <Dot color={t.accent}/>
              <MonoText style={{ fontSize: 12 }}>{e.to}</MonoText>
              <Pill>{e.rel}</Pill>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <SectionLabel>PropertyClaims · how we know what we know</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 120px 1fr 80px 80px', gap: 12, fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.3, paddingBottom: 8, borderBottom: `1px solid ${t.border}` }}>
          <span>PROPERTY</span><span>VALUE</span><span>SOURCE</span><span>CONF</span><span>STATUS</span>
        </div>
        {[
          ['owner', s.owner, 'github.codeowners', '0.98', 'winning', t.ok],
          ['owner', 'platform-team', 'backstage.catalog', '0.72', 'lost', t.textMuted],
          ['tier', s.tier.toString(), 'datadog.tags', '0.95', 'winning', t.ok],
          ['runtime', s.runtime, 'kubernetes', '1.00', 'winning', t.ok],
          ['oncall', s.oncall, 'pagerduty.schedules', '1.00', 'winning', t.ok],
          ['sla', `${s.sla}%`, 'backstage.catalog', '0.88', 'winning', t.ok],
        ].map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '120px 120px 1fr 80px 80px', gap: 12, padding: '9px 0',
            borderTop: i ? `1px solid ${t.border}` : 'none', fontSize: 12,
            opacity: r[4] === 'lost' ? 0.5 : 1,
          }}>
            <MonoText style={{ color: t.accent }}>{r[0]}</MonoText>
            <span>{r[1]}</span>
            <MonoText style={{ color: t.textMuted, fontSize: 11 }}>{r[2]}</MonoText>
            <MonoText style={{ color: t.textDim, fontSize: 11 }}>{r[3]}</MonoText>
            <span style={{ color: r[5], fontSize: 11, fontFamily: MONO }}>{r[4]}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

Object.assign(window, { PageEntity });
