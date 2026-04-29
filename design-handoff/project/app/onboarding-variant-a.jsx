// Onboarding · Variant A — Modal + Conventional (Admin)
// Centered modal that fades between steps. Familiar SaaS pattern, clean execution.

function OnboardingVariantA({ persona = 'admin' }) {
  const t = useTheme();
  const STEPS = persona === 'admin'
    ? ['workspace','connect','schema','sync','ask','aha','invite','tour']
    : ['join','team','sync','ask','aha','tour'];
  const [step, setStep] = React.useState(0);
  const [workspace, setWorkspace] = React.useState('acme');
  const [sources, setSources] = React.useState({ github: true, k8s: true, datadog: true, backstage: false, pagerduty: false });
  const sCount = Object.values(sources).filter(Boolean).length;

  const cur = STEPS[step];

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: `radial-gradient(ellipse at 50% -10%, ${t.accentGlow} 0%, transparent 50%), ${t.bg}`,
      color: t.text, fontFamily: FONT, overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ position: 'absolute', top: 24, left: 28, display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`,
          display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: '#0a0a0b',
        }}>◆</div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>ShipIt</div>
        <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, marginLeft: 8 }}>setup</div>
      </div>

      {/* Skip */}
      <div style={{ position: 'absolute', top: 24, right: 28, fontSize: 11, color: t.textDim, fontFamily: MONO, cursor: 'pointer' }}>
        skip for now →
      </div>

      {/* Centered card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '78%', maxWidth: 720,
        background: t.panel, border: `1px solid ${t.borderStrong}`, borderRadius: 14,
        boxShadow: t.shadow, overflow: 'hidden',
      }}>
        {/* Mini step rail */}
        <div style={{ display: 'flex', gap: 4, padding: '14px 22px 0' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? t.accent : t.panel2,
              opacity: i === step ? 1 : (i < step ? 0.7 : 1),
            }}/>
          ))}
        </div>

        <div style={{ padding: '28px 32px 26px', minHeight: 320 }}>
          <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 10 }}>
            step {step + 1} of {STEPS.length} · {cur}
          </div>

          {cur === 'workspace' && <ModalStepWorkspace workspace={workspace} setWorkspace={setWorkspace}/>}
          {cur === 'connect' && <ModalStepConnect sources={sources} setSources={setSources}/>}
          {cur === 'schema' && <ModalStepSchema/>}
          {cur === 'sync' && <ModalStepSync sources={sources}/>}
          {cur === 'ask' && <ModalStepAsk/>}
          {cur === 'aha' && <ModalStepAha/>}
          {cur === 'invite' && <ModalStepInvite workspace={workspace}/>}
          {cur === 'tour' && <ModalStepTour/>}
          {cur === 'join' && <ModalStepJoin/>}
          {cur === 'team' && <ModalStepTeam/>}
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${t.border}`, padding: '12px 22px', display: 'flex', alignItems: 'center', background: t.panel2 }}>
          <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO }}>
            {step > 0 ? <span onClick={() => setStep(step - 1)} style={{ cursor: 'pointer' }}>← back</span> : <span>&nbsp;</span>}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Btn small ghost onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>Skip step</Btn>
            <Btn small primary onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>
              {step === STEPS.length - 1 ? 'Open ShipIt →' : 'Continue →'}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalStepWorkspace({ workspace, setWorkspace }) {
  const t = useTheme();
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.15, marginBottom: 6 }}>
        Welcome. Let's name your workspace.
      </div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 22, maxWidth: 480 }}>
        This is the home for everyone at your company. You can invite teammates later.
      </div>
      <div style={{ marginBottom: 8, fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.3 }}>workspace</div>
      <div style={{ display: 'flex', alignItems: 'center', background: t.panel2, border: `1px solid ${t.borderStrong}`, borderRadius: 8, padding: '12px 14px' }}>
        <input value={workspace} onChange={e => setWorkspace(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 16, fontFamily: FONT }}/>
        <span style={{ color: t.textDim, fontSize: 12, fontFamily: MONO }}>.shipit.ai</span>
      </div>
    </>
  );
}

function ModalStepConnect({ sources, setSources }) {
  const t = useTheme();
  const list = [
    ['github', 'GitHub', '⌨', '1,204 repos · required'],
    ['k8s', 'Kubernetes', '⎔', '89 workloads · runtime'],
    ['datadog', 'Datadog', '◉', '340 monitors · SLOs'],
    ['backstage', 'Backstage', '▨', '247 entities · catalog'],
    ['pagerduty', 'PagerDuty', '◔', '18 services · on-call'],
  ];
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, marginBottom: 6 }}>Connect your data.</div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 18, maxWidth: 480 }}>
        Pick at least one. More sources = a richer graph. You can add more later.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {list.map(([k, n, ic, d]) => {
          const on = sources[k];
          return (
            <div key={k} onClick={() => setSources({ ...sources, [k]: !on })} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              background: on ? t.accentDim : t.panel2,
              border: `1px solid ${on ? t.accent : t.border}`, borderRadius: 8, cursor: 'pointer',
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: t.bg, border: `1px solid ${t.border}`, display: 'grid', placeItems: 'center', fontSize: 13 }}>{ic}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{n}</div>
                <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d}</div>
              </div>
              <div style={{
                width: 16, height: 16, borderRadius: 4,
                border: `1px solid ${on ? t.accent : t.borderStrong}`,
                background: on ? t.accent : 'transparent',
                color: '#0a0a0b', fontSize: 10, display: 'grid', placeItems: 'center', fontWeight: 700,
              }}>{on ? '✓' : ''}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ModalStepSchema() {
  const t = useTheme();
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, marginBottom: 6 }}>Here's what we'll import.</div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 18, maxWidth: 500 }}>
        Each source maps into our unified schema. Conflicts are resolved with PropertyClaims.
      </div>
      <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 8, padding: 14, fontFamily: MONO, fontSize: 11, lineHeight: 2 }}>
        <div><span style={{ color: t.purple }}>LogicalService</span> <span style={{ color: t.textDim }}>×247</span></div>
        <div style={{ paddingLeft: 14, color: t.textMuted }}>name, owner, tier, oncall, sla, runtime…</div>
        <div><span style={{ color: t.purple }}>Repository</span> <span style={{ color: t.textDim }}>×1,204</span></div>
        <div><span style={{ color: t.purple }}>Deployment</span> <span style={{ color: t.textDim }}>×89</span></div>
        <div><span style={{ color: t.purple }}>Monitor</span> <span style={{ color: t.textDim }}>×340</span></div>
        <div style={{ color: t.textDim, marginTop: 6 }}>+ 1,284 relationships across 12 edge types</div>
      </div>
    </>
  );
}

function ModalStepSync({ sources }) {
  const t = useTheme();
  const sCount = Object.values(sources).filter(Boolean).length;
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setPct(p => Math.min(100, p + 2 + Math.random() * 4)), 80);
    return () => clearInterval(id);
  }, []);
  const phases = [
    { at: 0, label: 'connecting to sources' },
    { at: 25, label: 'fetching repositories' },
    { at: 50, label: 'resolving dependencies' },
    { at: 75, label: 'matching PropertyClaims' },
    { at: 95, label: 'building graph projection' },
  ];
  const cur = [...phases].reverse().find(p => pct >= p.at) || phases[0];
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, marginBottom: 6 }}>Building your graph.</div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 22 }}>
        {pct < 100 ? `${cur.label}…` : 'Done. 247 services, 1,284 relationships, 3,890 claims.'}
      </div>
      <div style={{ height: 8, background: t.panel2, borderRadius: 999, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${t.accent}, ${t.purple})`, transition: 'width 0.2s' }}/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          ['sources', sCount],
          ['records', Math.floor(pct * 38)],
          ['claims', Math.floor(pct * 39)],
        ].map(([l, v]) => (
          <div key={l} style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 6, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 22, fontFamily: MONO, fontWeight: 500 }}>{v.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ModalStepAsk() {
  const t = useTheme();
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, marginBottom: 6 }}>Try your first question.</div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 18, maxWidth: 500 }}>
        Natural language across your new graph. Every answer cites its sources.
      </div>
      <div style={{ background: t.panel2, border: `1px solid ${t.borderStrong}`, borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ color: t.accent }}>✦</span>
        <span style={{ flex: 1, fontSize: 13 }}>What are our most critical services right now?</span>
        <Btn small primary>Ask</Btn>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['Stale ownership?', 'Production changes today', 'Tier-1 services'].map(s => (
          <div key={s} style={{ padding: '6px 12px', fontSize: 11, border: `1px solid ${t.border}`, borderRadius: 999, color: t.textMuted, background: t.panel2 }}>{s}</div>
        ))}
      </div>
    </>
  );
}

function ModalStepAha() {
  const t = useTheme();
  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4, marginBottom: 6 }}>
        ShipIt found something you'll want to know.
      </div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 18, maxWidth: 500 }}>
        Based on your graph, here are 3 actions worth your attention this week.
      </div>
      {[
        ['HIGH', '3 tier-1 services have stale owners', 'GitHub and Backstage disagree', t.warn],
        ['MED', '1 deprecated lib still used by billing-worker', 'auth-lib v1.2 — 17mo old', t.warn],
        ['LOW', 'PagerDuty token expires in 4 days', 're-auth before sync breaks', t.textMuted],
      ].map(([sev, title, sub, c]) => (
        <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 6, marginBottom: 6 }}>
          <Pill color={c}>{sev}</Pill>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{title}</div>
            <div style={{ fontSize: 11, color: t.textDim }}>{sub}</div>
          </div>
          <span style={{ color: t.accent, fontSize: 11, fontFamily: MONO }}>fix →</span>
        </div>
      ))}
    </>
  );
}

function ModalStepInvite({ workspace }) {
  const t = useTheme();
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, marginBottom: 6 }}>Bring your team in.</div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 18 }}>
        Owners can fix their own claims. Everyone can ask.
      </div>
      <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 8, padding: 14 }}>
        {['','',''].map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${t.border}` : 'none' }}>
            <input placeholder="teammate@acme.com" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13, fontFamily: FONT }}/>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: MONO }}>member</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: t.textDim, fontFamily: MONO, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Dot color={t.ok}/> anyone @{workspace}.com joins automatically
      </div>
    </>
  );
}

function ModalStepTour() {
  const t = useTheme();
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, marginBottom: 6 }}>You're all set.</div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 22 }}>
        Quick tour of the four surfaces you'll spend time in.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {[
          ['Graph Explorer', 'See your whole infra'],
          ['Ask', 'Natural language queries'],
          ['Connector Hub', 'Manage data sources'],
          ['Incident Mode', 'Triage faster'],
        ].map(([n, d]) => (
          <div key={n} style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 8, padding: 12, cursor: 'pointer' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{n}</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>{d}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ModalStepJoin() {
  const t = useTheme();
  return (
    <>
      <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, marginBottom: 6 }}>Join <span style={{ color: t.accent }}>acme</span>.</div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 22, maxWidth: 480 }}>
        Maya invited you. The graph already has your services mapped — just confirm who you are.
      </div>
      <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 999, background: t.accent, display: 'grid', placeItems: 'center', color: '#0a0a0b', fontWeight: 700, fontSize: 14 }}>SL</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Sam Lin</div>
            <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO }}>sam@acme.com</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>your team</div>
        <Pill color={t.purple}>frontend-team</Pill>
      </div>
    </>
  );
}

function ModalStepTeam() {
  const t = useTheme();
  return (
    <>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4, marginBottom: 6 }}>Here's what your team owns.</div>
      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 18 }}>frontend-team · 4 services in the graph</div>
      <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 8, padding: 12 }}>
        {['frontend-app','design-system','docs-site','marketing-site'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${t.border}` : 'none' }}>
            <Dot color={t.accent}/>
            <MonoText style={{ fontSize: 12 }}>{s}</MonoText>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: t.textDim, fontFamily: MONO }}>tier {i < 2 ? 1 : 2}</span>
          </div>
        ))}
      </div>
    </>
  );
}

Object.assign(window, { OnboardingVariantA });
