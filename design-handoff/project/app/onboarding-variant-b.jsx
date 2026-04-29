// Onboarding · Variant B — Transforming Canvas + Conventional
// One canvas that morphs. Sidebar persists. Right panel evolves from form → graph as data flows in.
// The "screen" never changes — the graph is always there, getting more real.

function OnboardingVariantB({ persona = 'admin' }) {
  const t = useTheme();
  const STEPS = ['workspace','connect','schema','sync','ask','aha','invite','tour'];
  const [step, setStep] = React.useState(0);
  const [workspace, setWorkspace] = React.useState('acme');
  const [sources, setSources] = React.useState({ github: true, k8s: true, datadog: false, backstage: false, pagerduty: false });
  const [pct, setPct] = React.useState(0);
  const sCount = Object.values(sources).filter(Boolean).length;
  const cur = STEPS[step];

  // Auto-advance the sync progress
  React.useEffect(() => {
    if (cur !== 'sync') { if (step < 3) setPct(0); return; }
    const id = setInterval(() => setPct(p => Math.min(100, p + 1.5)), 60);
    return () => clearInterval(id);
  }, [cur, step]);

  // Density of graph reveals across the flow
  const reveal = cur === 'workspace' ? 0
    : cur === 'connect' ? Math.min(0.2, sCount * 0.04)
    : cur === 'schema' ? 0.35
    : cur === 'sync' ? 0.4 + (pct / 100) * 0.6
    : 1;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: t.bg, color: t.text, fontFamily: FONT, overflow: 'hidden',
    }}>
      {/* Left rail */}
      <div style={{ width: 280, padding: '22px 20px', borderRight: `1px solid ${t.border}`, background: t.panel, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: '#0a0a0b' }}>◆</div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>ShipIt</div>
          <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, marginLeft: 'auto' }}>setup</div>
        </div>

        <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 10 }}>Setup · {step + 1}/{STEPS.length}</div>
        {STEPS.map((s, i) => {
          const done = i < step, active = i === step;
          return (
            <div key={s} onClick={() => i <= step && setStep(i)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px',
              fontSize: 12, cursor: i <= step ? 'pointer' : 'default',
              color: active ? t.text : (done ? t.textMuted : t.textDim),
              background: active ? t.accentDim : 'transparent',
              borderRadius: 5, marginBottom: 1,
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: 999,
                border: `1px solid ${active || done ? t.accent : t.borderStrong}`,
                background: done ? t.accent : 'transparent',
                color: '#0a0a0b', fontSize: 8, display: 'grid', placeItems: 'center', fontWeight: 700,
              }}>{done ? '✓' : ''}</div>
              <span style={{ textTransform: 'capitalize' }}>{s}</span>
              {active && <span style={{ marginLeft: 'auto', fontSize: 9, fontFamily: MONO, color: t.accent }}>now</span>}
            </div>
          );
        })}

        <div style={{ marginTop: 'auto', fontSize: 10, color: t.textDim, fontFamily: MONO, lineHeight: 1.6 }}>
          The graph at right is real. It builds as you set up.
        </div>
      </div>

      {/* Main canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minWidth: 0 }}>
        {/* Persistent graph viewport */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.45 + reveal * 0.55, transition: 'opacity 0.6s' }}>
          <CanvasGraph reveal={reveal}/>
        </div>

        {/* Top: contextual prompt */}
        <div style={{ position: 'relative', padding: '24px 32px 0', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.4 }}>
            {cur === 'workspace' && 'starting from zero'}
            {cur === 'connect' && `${sCount} of 5 sources`}
            {cur === 'schema' && 'preview · what we\'ll import'}
            {cur === 'sync' && `building · ${Math.floor(pct)}%`}
            {cur === 'ask' && 'graph is live'}
            {cur === 'aha' && 'we found something'}
            {cur === 'invite' && 'who else needs this?'}
            {cur === 'tour' && 'ready'}
          </div>
        </div>

        {/* Floating panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', padding: 32, position: 'relative' }}>
          <div style={{
            width: 460, maxWidth: '100%',
            background: `${t.panel}f0`, backdropFilter: 'blur(12px)',
            border: `1px solid ${t.borderStrong}`, borderRadius: 12,
            boxShadow: t.shadow, padding: 22,
          }}>
            {cur === 'workspace' && (
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5, marginBottom: 14 }}>What do we call this place?</div>
                <div style={{ display: 'flex', alignItems: 'center', background: t.panel2, border: `1px solid ${t.borderStrong}`, borderRadius: 8, padding: '10px 12px' }}>
                  <input value={workspace} onChange={e => setWorkspace(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 15, fontFamily: FONT }}/>
                  <span style={{ color: t.textDim, fontSize: 12, fontFamily: MONO }}>.shipit.ai</span>
                </div>
              </div>
            )}
            {cur === 'connect' && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.4, marginBottom: 4 }}>Plug in your sources.</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14 }}>Each one adds nodes to the graph behind this panel.</div>
                {[
                  ['github', 'GitHub', '⌨'],
                  ['k8s', 'Kubernetes', '⎔'],
                  ['datadog', 'Datadog', '◉'],
                  ['backstage', 'Backstage', '▨'],
                  ['pagerduty', 'PagerDuty', '◔'],
                ].map(([k, n, ic]) => {
                  const on = sources[k];
                  return (
                    <div key={k} onClick={() => setSources({ ...sources, [k]: !on })} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                      borderRadius: 6, cursor: 'pointer',
                      background: on ? t.accentDim : 'transparent',
                    }}>
                      <span style={{ fontSize: 13, width: 16, textAlign: 'center' }}>{ic}</span>
                      <span style={{ fontSize: 12, flex: 1 }}>{n}</span>
                      <div style={{
                        width: 14, height: 14, borderRadius: 4,
                        border: `1px solid ${on ? t.accent : t.borderStrong}`,
                        background: on ? t.accent : 'transparent',
                        color: '#0a0a0b', fontSize: 9, display: 'grid', placeItems: 'center', fontWeight: 700,
                      }}>{on ? '✓' : ''}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {cur === 'schema' && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.4, marginBottom: 4 }}>Here's the shape.</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14 }}>Each source maps into the same schema. Conflicts get resolved with PropertyClaims.</div>
                <div style={{ fontFamily: MONO, fontSize: 11, lineHeight: 1.9 }}>
                  <div><span style={{ color: t.purple }}>LogicalService</span> <span style={{ color: t.textDim }}>· 247</span></div>
                  <div><span style={{ color: t.purple }}>Repository</span> <span style={{ color: t.textDim }}>· 1,204</span></div>
                  <div><span style={{ color: t.purple }}>Deployment</span> <span style={{ color: t.textDim }}>· 89</span></div>
                  <div><span style={{ color: t.purple }}>Monitor</span> <span style={{ color: t.textDim }}>· 340</span></div>
                </div>
              </div>
            )}
            {cur === 'sync' && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.4, marginBottom: 12 }}>
                  {pct < 100 ? 'Building your graph…' : 'Done. The graph is live.'}
                </div>
                <div style={{ height: 6, background: t.panel2, borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${t.accent}, ${t.purple})`, transition: 'width 0.2s' }}/>
                </div>
                <div style={{ display: 'flex', gap: 16, fontFamily: MONO, fontSize: 11, color: t.textMuted }}>
                  <span><span style={{ color: t.accent }}>{Math.floor(pct * 2.47)}</span> services</span>
                  <span><span style={{ color: t.accent }}>{Math.floor(pct * 12.84)}</span> edges</span>
                  <span><span style={{ color: t.accent }}>{Math.floor(pct * 38.9)}</span> claims</span>
                </div>
              </div>
            )}
            {cur === 'ask' && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.4, marginBottom: 4 }}>Ask your graph anything.</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14 }}>It's all real now.</div>
                <div style={{ background: t.panel2, border: `1px solid ${t.borderStrong}`, borderRadius: 6, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: t.accent }}>✦</span>
                  <span style={{ flex: 1, fontSize: 12 }}>What's the blast radius if payments-api goes down?</span>
                </div>
                <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO }}>↩ try a starter, or write your own</div>
              </div>
            )}
            {cur === 'aha' && (
              <div>
                <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, marginBottom: 12 }}>Three things worth your attention:</div>
                {[
                  ['3 tier-1 services have stale owners', t.warn],
                  ['1 deprecated lib still in use', t.warn],
                  ['PagerDuty token expires in 4 days', t.textMuted],
                ].map(([s, c]) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                    <Dot color={c}/>
                    <span style={{ fontSize: 12, flex: 1 }}>{s}</span>
                    <span style={{ color: t.accent, fontSize: 10, fontFamily: MONO }}>fix →</span>
                  </div>
                ))}
              </div>
            )}
            {cur === 'invite' && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.4, marginBottom: 14 }}>Bring your team in.</div>
                {['','',''].map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '7px 0', borderTop: i ? `1px solid ${t.border}` : 'none' }}>
                    <input placeholder="teammate@acme.com" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 12, fontFamily: FONT }}/>
                  </div>
                ))}
              </div>
            )}
            {cur === 'tour' && (
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5, marginBottom: 12 }}>You're in. The rest is yours.</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14 }}>Hit ⌘K anywhere to ask. Press G to jump to the graph.</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              {step > 0 && <Btn small onClick={() => setStep(step - 1)}>← back</Btn>}
              <div style={{ flex: 1 }}/>
              <Btn small ghost onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>skip</Btn>
              <Btn small primary onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>continue →</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CanvasGraph({ reveal }) {
  const t = useTheme();
  const all = SERVICES;
  const visible = Math.max(0, Math.floor(all.length * reveal));
  const nodes = all.slice(0, visible).map((s, i, a) => {
    const ang = (i / a.length) * Math.PI * 2;
    const r = 160;
    return { ...s, x: 360 + Math.cos(ang) * r, y: 240 + Math.sin(ang) * r * 0.8 };
  });
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const edges = EDGES.filter(e => byId[e[0]] && byId[e[1]]);
  const typeColor = { LogicalService: t.accent, Repository: t.purple, Deployment: t.ok };
  return (
    <svg width="100%" height="100%" viewBox="0 0 720 480" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="cgGlow"><stop offset="0" stopColor={t.accent} stopOpacity="0.25"/><stop offset="1" stopColor={t.accent} stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="360" cy="240" r={120 + reveal * 80} fill="url(#cgGlow)"/>
      {edges.map((e, i) => {
        const a = byId[e[0]], b = byId[e[1]];
        return <line key={i} className="fade-in" x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={t.borderStrong} strokeWidth="0.7" opacity="0.55"/>;
      })}
      {nodes.map((n, i) => (
        <g key={n.id} className="fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <circle cx={n.x} cy={n.y} r={n.tier === 1 ? 9 : 6} fill={typeColor[n.type] || t.textMuted}/>
          <text x={n.x} y={n.y + 19} fontSize="9" fill={t.textMuted} textAnchor="middle" fontFamily={MONO}>{n.name}</text>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { OnboardingVariantB });
