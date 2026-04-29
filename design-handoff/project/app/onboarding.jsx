// Onboarding flow — 6 steps. Full-screen centered stage.
// 1 workspace → 2 connect primary → 3 connect more → 4 live build → 5 first question → 6 invite

function Onboarding({ onFinish }) {
  const t = useTheme();
  const [step, setStep] = React.useState(0);
  const [workspace, setWorkspace] = React.useState('acme');
  const [sources, setSources] = React.useState({ github: true, k8s: false, datadog: false, backstage: false, pagerduty: false });
  const [firstQ, setFirstQ] = React.useState('');

  const steps = [
    { k: 'workspace',  label: 'Workspace' },
    { k: 'primary',    label: 'Primary source' },
    { k: 'additional', label: 'More sources' },
    { k: 'building',   label: 'Build graph' },
    { k: 'ask',        label: 'First question' },
    { k: 'invite',     label: 'Invite team' },
  ];

  function next() { setStep(s => Math.min(s + 1, steps.length - 1)); }
  function back() { setStep(s => Math.max(s - 1, 0)); }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: t.bg, color: t.text,
      fontFamily: FONT, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      zIndex: 200,
    }}>
      {/* Ambient background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 60% 40% at 20% 0%, ${t.accentGlow} 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 90% 100%, oklch(0.78 0.14 300 / 0.15) 0%, transparent 50%)
        `,
      }}/>

      {/* Top bar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '18px 28px', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`,
            display: 'grid', placeItems: 'center',
            fontSize: 12, fontWeight: 700, color: '#0a0a0b',
          }}>◆</div>
          <div style={{ fontWeight: 600, letterSpacing: -0.2, fontSize: 14 }}>ShipIt</div>
        </div>
        <StepTrack steps={steps} current={step} onJump={setStep}/>
        <div onClick={onFinish} style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, cursor: 'pointer' }}>exit setup →</div>
      </div>

      {/* Body */}
      <div className="fade-in" key={step} style={{
        position: 'relative', flex: 1, overflow: 'auto', zIndex: 1,
        display: 'flex', alignItems: 'stretch', justifyContent: 'center',
        padding: '20px 40px 0',
      }}>
        {step === 0 && <StepWorkspace workspace={workspace} setWorkspace={setWorkspace}/>}
        {step === 1 && <StepPrimary sources={sources} setSources={setSources}/>}
        {step === 2 && <StepAdditional sources={sources} setSources={setSources}/>}
        {step === 3 && <StepBuild sources={sources} onDone={next}/>}
        {step === 4 && <StepAsk firstQ={firstQ} setFirstQ={setFirstQ}/>}
        {step === 5 && <StepInvite workspace={workspace}/>}
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        padding: '16px 28px', borderTop: `1px solid ${t.border}`,
        background: t.bg, zIndex: 2,
      }}>
        <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO }}>
          step {step + 1} of {steps.length} · {steps[step].label}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {step > 0 && <Btn onClick={back}>← Back</Btn>}
          {step < 3 && <Btn ghost onClick={next}>Skip</Btn>}
          {step !== 3 && (
            <Btn primary onClick={() => step === steps.length - 1 ? onFinish() : next()}>
              {step === steps.length - 1 ? 'Open ShipIt →' : 'Continue →'}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

function StepTrack({ steps, current, onJump }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto' }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s.k}>
            <div onClick={() => i <= current && onJump(i)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              cursor: i <= current ? 'pointer' : 'default',
              opacity: done || active ? 1 : 0.4,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 999,
                border: `1px solid ${active ? t.accent : (done ? t.accent : t.borderStrong)}`,
                background: done ? t.accent : (active ? t.accentDim : 'transparent'),
                display: 'grid', placeItems: 'center',
                fontSize: 9, color: done ? '#0a0a0b' : t.textMuted, fontFamily: MONO,
              }}>{done ? '✓' : i + 1}</div>
              <span style={{ fontSize: 11, color: active ? t.text : t.textMuted, fontFamily: MONO }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 16, height: 1, background: t.border }}/>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// STEP 1 — workspace
function StepWorkspace({ workspace, setWorkspace }) {
  const t = useTheme();
  return (
    <div style={{ width: '100%', maxWidth: 560, margin: '40px auto 0' }}>
      <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
        welcome · let's get set up
      </div>
      <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: -0.9, lineHeight: 1.15, marginBottom: 12 }}>
        Name your <span style={{ color: t.accent }}>workspace</span>.
      </div>
      <div style={{ color: t.textMuted, fontSize: 14, marginBottom: 28, maxWidth: 460 }}>
        This is the home for everyone at your company. You can invite teammates later — start with a name.
      </div>

      <div style={{ marginBottom: 12, fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.3 }}>Workspace name</div>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: t.panel, border: `1px solid ${t.borderStrong}`, borderRadius: 10,
        padding: '14px 18px',
      }}>
        <input value={workspace} onChange={e => setWorkspace(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 18, fontFamily: FONT }}/>
        <span style={{ color: t.textDim, fontSize: 13, fontFamily: MONO }}>.shipit.ai</span>
      </div>

      <div style={{ marginTop: 20, padding: '14px 16px', background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 8 }}>Region</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {['us-east-1','eu-west-1','ap-south-1'].map((r, i) => (
            <div key={r} style={{
              padding: '10px 12px', textAlign: 'center', borderRadius: 6, cursor: 'pointer',
              background: i === 0 ? t.accentDim : t.panel2,
              border: `1px solid ${i === 0 ? t.accent : t.border}`,
              fontSize: 12, fontFamily: MONO,
              color: i === 0 ? t.accentText : t.textMuted,
            }}>{r}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// STEP 2 — primary source
function StepPrimary({ sources, setSources }) {
  const t = useTheme();
  return (
    <div style={{ width: '100%', maxWidth: 680, margin: '40px auto 0' }}>
      <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>step 2 · connect your code</div>
      <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: -0.9, lineHeight: 1.15, marginBottom: 12 }}>
        Start with <span style={{ color: t.accent }}>GitHub</span>.
      </div>
      <div style={{ color: t.textMuted, fontSize: 14, marginBottom: 28, maxWidth: 520 }}>
        ShipIt needs to see your repos to map services, ownership, and dependencies. Everything else builds on this.
      </div>

      <Card pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: t.panel2, border: `1px solid ${t.border}`, display: 'grid', placeItems: 'center', fontSize: 20 }}>⌨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500 }}>GitHub</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>1,204 repositories · codeowners, dependency graph, workflows</div>
          </div>
          <Btn primary onClick={() => setSources({ ...sources, github: true })}>
            {sources.github ? '✓ Connected' : 'Connect →'}
          </Btn>
        </div>

        {sources.github && (
          <div className="fade-in" style={{ borderTop: `1px solid ${t.border}`, padding: '18px 24px', background: t.panel2 }}>
            <SectionLabel>What we'll import</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['repositories', '1,204', 'all of acme-org'],
                ['codeowners', '892 files', '→ ownership edges'],
                ['dependency manifests', '2,150', '→ imports graph'],
                ['workflows', '480', '→ deployment edges'],
              ].map(([k, v, d]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Dot color={t.ok}/>
                  <MonoText style={{ fontSize: 11, color: t.accent }}>{k}</MonoText>
                  <MonoText style={{ fontSize: 11, color: t.text }}>{v}</MonoText>
                  <span style={{ fontSize: 11, color: t.textDim }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div style={{ marginTop: 16, fontSize: 11, color: t.textDim, fontFamily: MONO, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Dot color={t.accent}/>
        read-only OAuth · audit-logged · you can revoke anytime
      </div>
    </div>
  );
}

// STEP 3 — additional sources
function StepAdditional({ sources, setSources }) {
  const t = useTheme();
  const opts = [
    { k: 'k8s', icon: '⎔', name: 'Kubernetes', desc: 'Live runtime mapping + deployments', count: '89 workloads' },
    { k: 'datadog', icon: '◉', name: 'Datadog', desc: 'Tags, monitors, SLOs', count: '340 monitors' },
    { k: 'backstage', icon: '▨', name: 'Backstage', desc: 'Your existing service catalog', count: '247 entities' },
    { k: 'pagerduty', icon: '◔', name: 'PagerDuty', desc: 'On-call + escalation policies', count: '18 services' },
  ];
  return (
    <div style={{ width: '100%', maxWidth: 820, margin: '40px auto 0' }}>
      <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>step 3 · enrich the graph</div>
      <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: -0.9, lineHeight: 1.15, marginBottom: 12 }}>
        Add more sources. <span style={{ color: t.textMuted }}>More is better.</span>
      </div>
      <div style={{ color: t.textMuted, fontSize: 14, marginBottom: 28, maxWidth: 560 }}>
        Each connector adds PropertyClaims. When sources disagree, ShipIt picks the most authoritative one — and shows you why.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {opts.map(o => {
          const on = sources[o.k];
          return (
            <div key={o.k} onClick={() => setSources({ ...sources, [o.k]: !on })} style={{
              background: t.panel, border: `1px solid ${on ? t.accent : t.border}`, borderRadius: 10,
              padding: '16px 18px', cursor: 'pointer', position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: t.panel2, border: `1px solid ${t.border}`, display: 'grid', placeItems: 'center', fontSize: 16 }}>{o.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{o.name}</div>
                  <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO }}>{o.count}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: 5,
                  border: `1px solid ${on ? t.accent : t.borderStrong}`,
                  background: on ? t.accent : 'transparent',
                  display: 'grid', placeItems: 'center', fontSize: 12, color: '#0a0a0b', fontWeight: 700,
                }}>{on ? '✓' : ''}</div>
              </div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{o.desc}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: t.textMuted, display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ color: t.accent }}>✦</span>
        <span>Don't see what you need? <span style={{ color: t.text, borderBottom: `1px dashed ${t.borderStrong}`, cursor: 'pointer' }}>browse all 14 connectors</span> — or connect later from the hub.</span>
      </div>
    </div>
  );
}

// STEP 4 — live build
function StepBuild({ sources, onDone }) {
  const t = useTheme();
  const active = Object.entries(sources).filter(([_, v]) => v).map(([k]) => k);
  const [phase, setPhase] = React.useState(0);
  const [counts, setCounts] = React.useState({ services: 0, edges: 0, claims: 0 });
  const [log, setLog] = React.useState([]);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const ticks = [
      { t: 200, msg: 'connecting to github…', phase: 1 },
      { t: 500, msg: 'fetching 1,204 repositories', phase: 1 },
      { t: 900, msg: 'parsing codeowners → 892 ownership claims', phase: 1 },
      { t: 1400, msg: 'resolving dependency manifests', phase: 2 },
      { t: 1900, msg: 'querying kubernetes workloads', phase: 2 },
      { t: 2400, msg: 'matching runtime → logical services', phase: 3 },
      { t: 2900, msg: 'resolving PropertyClaim conflicts (3 sources)', phase: 3 },
      { t: 3400, msg: 'building graph projection in neo4j', phase: 4 },
      { t: 3900, msg: 'ready.', phase: 4, final: true },
    ];
    const timers = ticks.map(tk => setTimeout(() => {
      setLog(l => [...l, tk.msg].slice(-8));
      setPhase(tk.phase);
      if (tk.final) setDone(true);
    }, tk.t));
    return () => timers.forEach(clearTimeout);
  }, []);

  React.useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setCounts(c => ({
        services: Math.min(247, c.services + 8 + Math.floor(Math.random() * 5)),
        edges: Math.min(1284, c.edges + 30 + Math.floor(Math.random() * 20)),
        claims: Math.min(3890, c.claims + 90 + Math.floor(Math.random() * 60)),
      }));
    }, 100);
    return () => clearInterval(id);
  }, [done]);

  React.useEffect(() => {
    if (done) setCounts({ services: 247, edges: 1284, claims: 3890 });
  }, [done]);

  return (
    <div style={{ width: '100%', maxWidth: 980, margin: '20px auto 0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
        {done ? 'ready' : 'building your graph…'}
      </div>
      <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 18 }}>
        {done ? (
          <>Your graph is <span style={{ color: t.accent }}>alive.</span></>
        ) : (
          <>Mapping <span style={{ color: t.accent }}>{active.length}</span> sources into one graph.</>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          ['services', counts.services],
          ['relationships', counts.edges],
          ['property claims', counts.claims],
        ].map(([l, v]) => (
          <Card key={l} pad={16}>
            <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 8 }}>{l}</div>
            <div style={{ fontSize: 30, fontFamily: MONO, fontWeight: 500, letterSpacing: -0.5 }}>{v.toLocaleString()}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12, flex: 1, minHeight: 320 }}>
        {/* Live graph */}
        <Card pad={0} style={{ overflow: 'hidden', minHeight: 320 }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center' }}>
            <SectionLabel style={{ marginBottom: 0 }}>live graph · {active.length} sources</SectionLabel>
            <div style={{ marginLeft: 'auto', fontSize: 10, color: t.textDim, fontFamily: MONO, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dot color={done ? t.ok : t.accent} glow/>
              {done ? 'synced' : 'streaming'}
            </div>
          </div>
          <div style={{ height: 290, position: 'relative', background: `radial-gradient(ellipse at 50% 50%, ${t.panel2} 0%, ${t.panel} 70%)` }}>
            <BuildingGraph phase={phase} done={done}/>
          </div>
        </Card>

        {/* Log */}
        <Card pad={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${t.border}` }}>
            <SectionLabel style={{ marginBottom: 0 }}>ingestion log</SectionLabel>
          </div>
          <div style={{ flex: 1, padding: '12px 16px', fontFamily: MONO, fontSize: 11, lineHeight: 1.8, overflow: 'auto' }}>
            {log.map((l, i) => (
              <div key={i} className="fade-in" style={{ display: 'flex', gap: 8, color: i === log.length - 1 && !done ? t.text : t.textMuted }}>
                <span style={{ color: t.textDim }}>{String(i).padStart(2, '0')}</span>
                <span>{l}</span>
              </div>
            ))}
            {!done && (
              <div style={{ color: t.accent, marginTop: 4, display: 'flex', gap: 6 }}>
                <span style={{ animation: 'pulse 1s infinite' }}>▌</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {done && (
        <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <Btn primary onClick={onDone} style={{ padding: '10px 18px', fontSize: 13 }}>
            See your graph →
          </Btn>
        </div>
      )}
    </div>
  );
}

function BuildingGraph({ phase, done }) {
  const t = useTheme();
  const allNodes = SERVICES;
  const shown = Math.min(allNodes.length, 2 + phase * 3);
  const nodes = allNodes.slice(0, shown).map((s, i, a) => {
    const ang = (i / a.length) * Math.PI * 2;
    const r = 90;
    return { ...s, x: 350 + Math.cos(ang) * r, y: 145 + Math.sin(ang) * r * 0.75 };
  });
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const edges = EDGES.filter(e => byId[e[0]] && byId[e[1]]);
  const typeColor = { LogicalService: t.accent, Repository: t.purple, Deployment: t.ok };
  return (
    <svg width="100%" height="100%" viewBox="0 0 700 290" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="bgGlow">
          <stop offset="0" stopColor={t.accent} stopOpacity="0.3"/>
          <stop offset="1" stopColor={t.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {done && <circle cx="350" cy="145" r="140" fill="url(#bgGlow)"/>}
      {edges.map((e, i) => {
        const a = byId[e[0]], b = byId[e[1]];
        return <line key={i} className="fade-in" x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={t.borderStrong} strokeWidth="0.7" opacity="0.6"/>;
      })}
      {nodes.map((n, i) => (
        <g key={n.id} className="fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <circle cx={n.x} cy={n.y} r={n.tier === 1 ? 9 : 6} fill={typeColor[n.type] || t.textMuted}/>
          {done && <text x={n.x} y={n.y + 20} fontSize="9" fill={t.textMuted} textAnchor="middle" fontFamily={MONO}>{n.name}</text>}
        </g>
      ))}
    </svg>
  );
}

// STEP 5 — first question
function StepAsk({ firstQ, setFirstQ }) {
  const t = useTheme();
  const [submitted, setSubmitted] = React.useState(false);
  const starters = [
    "What are our most critical services right now?",
    "Which services have stale ownership?",
    "What changed in production this week?",
    "Show me everything tier-1 in production",
  ];
  return (
    <div style={{ width: '100%', maxWidth: 720, margin: '40px auto 0' }}>
      <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>step 5 · ask your graph</div>
      <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: -0.9, lineHeight: 1.15, marginBottom: 12 }}>
        Try your <span style={{ color: t.accent }}>first question.</span>
      </div>
      <div style={{ color: t.textMuted, fontSize: 14, marginBottom: 28, maxWidth: 520 }}>
        Natural language query across your new graph. Every answer shows its sources and which graph tools it called.
      </div>

      <div style={{
        background: t.panel, border: `1px solid ${t.borderStrong}`, borderRadius: 10,
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
      }}>
        <span style={{ color: t.accent, fontSize: 15 }}>✦</span>
        <input value={firstQ} onChange={e => setFirstQ(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && firstQ.trim()) setSubmitted(true); }}
          placeholder="Ask anything about your infra…"
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 15, fontFamily: FONT }}/>
        <Btn small primary onClick={() => firstQ.trim() && setSubmitted(true)}>Ask</Btn>
      </div>

      {!submitted && (
        <div>
          <SectionLabel>Starter questions</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {starters.map(s => (
              <div key={s} onClick={() => { setFirstQ(s); setSubmitted(true); }} style={{
                padding: '8px 14px', fontSize: 12, border: `1px solid ${t.border}`,
                borderRadius: 999, color: t.text, background: t.panel, cursor: 'pointer',
              }}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {submitted && (
        <div className="fade-in">
          <Card style={{ marginBottom: 10, background: `radial-gradient(circle at 85% 50%, ${t.accentGlow} 0%, transparent 55%), ${t.panel}` }}>
            <SectionLabel><Dot color={t.accent} glow/> shipit</SectionLabel>
            <div style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 14 }}>
              You have <span style={{ color: t.accent }}>9 tier-1 services</span> in production. Three have stale owner fields where GitHub and Backstage disagree. I'd start with <MonoText style={{ color: t.accent }}>payments-api</MonoText> — it has 23 dependents and touches 3 customer flows.
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['graph.search_services', 'graph.get_tier', 'claims.find_conflicts'].map(tool => (
                <div key={tool} style={{ padding: '4px 10px', fontSize: 10, fontFamily: MONO, background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 4, color: t.textMuted }}>
                  <span style={{ color: t.ok }}>✓</span> {tool}
                </div>
              ))}
            </div>
          </Card>
          <div style={{ fontSize: 12, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dot color={t.ok} glow/>
            That's it. You just queried a graph built from 5 sources in &lt;2 seconds.
          </div>
        </div>
      )}
    </div>
  );
}

// STEP 6 — invite
function StepInvite({ workspace }) {
  const t = useTheme();
  const [emails, setEmails] = React.useState(['', '', '']);
  return (
    <div style={{ width: '100%', maxWidth: 640, margin: '40px auto 0' }}>
      <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>step 6 · last one</div>
      <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: -0.9, lineHeight: 1.15, marginBottom: 12 }}>
        Bring your <span style={{ color: t.accent }}>team in.</span>
      </div>
      <div style={{ color: t.textMuted, fontSize: 14, marginBottom: 28, maxWidth: 520 }}>
        ShipIt is more useful when the people who know the services can fix their own claims. No seats, no credit card — invite who you like.
      </div>

      <Card style={{ marginBottom: 14 }}>
        <SectionLabel right={<span style={{ color: t.accent, cursor: 'pointer' }}>+ add row</span>}>Invite by email</SectionLabel>
        {emails.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i ? `1px solid ${t.border}` : 'none' }}>
            <input value={e} onChange={ev => setEmails(emails.map((x, j) => j === i ? ev.target.value : x))}
              placeholder="teammate@acme.com"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13, fontFamily: FONT }}/>
            <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO }}>member</div>
          </div>
        ))}
      </Card>

      <Card>
        <SectionLabel>Or share the link</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 6, fontFamily: MONO, fontSize: 12 }}>
          <span style={{ color: t.textDim }}>https://</span>
          <span style={{ color: t.accent }}>{workspace || 'acme'}</span>
          <span style={{ color: t.textMuted }}>.shipit.ai/join</span>
          <span style={{ marginLeft: 'auto', color: t.accent, cursor: 'pointer', fontSize: 10 }}>copy</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: t.textDim, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dot color={t.ok}/>
          anyone with <MonoText>@acme.com</MonoText> email can join without approval
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { Onboarding });
