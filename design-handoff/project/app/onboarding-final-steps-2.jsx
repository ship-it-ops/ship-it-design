// Onboarding · Polished Final — remaining steps + backdrop

/* ─────────── Step: Ask ─────────── */

function StepAsk() {
  const t = useTheme();
  const [q, setQ] = React.useState('');
  const [typed, setTyped] = React.useState('');
  const target = 'What\'s the blast radius if payments-api goes down?';
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setTyped(target.slice(0, i++));
      if (i > target.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <Eyebrow>Step four · ask anything</Eyebrow>
      <StepHeadline>Your graph speaks English.</StepHeadline>
      <StepLede>Ask in plain words. Get answers with citations, not vibes. Every claim points back to the source that made it.</StepLede>

      <div style={{
        background: t.bg, border: `1px solid ${t.borderStrong}`, borderRadius: 12,
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.02)`,
      }}>
        <span style={{ color: t.accent, fontSize: 15 }}>✦</span>
        <span style={{ flex: 1, fontSize: 15, color: t.text, fontFamily: FONT }}>
          {typed}
          <span style={{ opacity: 0.7, animation: 'pulse 1.1s ease-in-out infinite', marginLeft: 1 }}>▊</span>
        </span>
        <span style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, padding: '4px 8px', background: t.panel2, borderRadius: 4 }}>⌘ ↵</span>
      </div>

      <div style={{ marginTop: 18, fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 10 }}>
        or try one of these
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          'Who owns auth-svc?',
          'Tier-1 services with stale owners',
          'Production deploys today',
          'Services deprecated but still used',
        ].map(s => (
          <div key={s} style={{
            padding: '7px 14px', fontSize: 12,
            border: `1px solid ${t.border}`, borderRadius: 999,
            color: t.textMuted, background: t.panel2, cursor: 'pointer',
          }}>{s}</div>
        ))}
      </div>
    </>
  );
}

/* ─────────── Step: Aha ─────────── */

function StepAha() {
  const t = useTheme();
  const findings = [
    { sev: 'high', title: '3 tier-1 services have stale owners', sub: 'GitHub and Backstage disagree. Team "payments-legacy" was retired 6mo ago.', color: t.warn },
    { sev: 'med',  title: 'billing-worker still imports auth-lib v1.2', sub: 'Deprecated 17mo ago. Replacement: auth-lib v3 (active).', color: t.warn },
    { sev: 'low',  title: 'PagerDuty token expires in 4 days', sub: 'Re-auth before Nov 28 to keep sync alive.', color: t.textMuted },
  ];
  return (
    <>
      <Eyebrow>Step five · surprise</Eyebrow>
      <StepHeadline>
        3 things your team <span style={{ color: t.accent }}>didn't</span> know.
      </StepHeadline>
      <StepLede>We poked around while you weren't watching. Here's what we found. These won't page you — they'll just sit here until someone fixes them.</StepLede>

      {findings.map((f, i) => (
        <div key={i} className="fade-in" style={{
          display: 'flex', alignItems: 'flex-start', gap: 14,
          padding: '14px 16px',
          background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 10,
          marginBottom: 8, animationDelay: `${i * 120}ms`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: `${f.color}22`, color: f.color,
            display: 'grid', placeItems: 'center',
            fontSize: 10, fontFamily: MONO, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
            flexShrink: 0,
          }}>{f.sev}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 3 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.45 }}>{f.sub}</div>
          </div>
          <span style={{ color: t.accent, fontSize: 11, fontFamily: MONO, cursor: 'pointer', whiteSpace: 'nowrap' }}>fix →</span>
        </div>
      ))}
    </>
  );
}

/* ─────────── Step: Invite ─────────── */

function StepInvite({ workspace }) {
  const t = useTheme();
  const [emails, setEmails] = React.useState(['', '', '']);
  const filled = emails.filter(e => e.trim()).length;
  return (
    <>
      <Eyebrow>Step six · teammates</Eyebrow>
      <StepHeadline>Who else should see this?</StepHeadline>
      <StepLede>Owners fix their own claims. Everyone else can just ask. No seat math — pricing is usage-based.</StepLede>

      <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 10, padding: '4px 14px' }}>
        {emails.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i ? `1px solid ${t.border}` : 'none' }}>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, width: 18 }}>{String(i + 1).padStart(2, '0')}</span>
            <input
              value={e}
              onChange={ev => { const n = [...emails]; n[i] = ev.target.value; setEmails(n); }}
              placeholder={`teammate${i+1}@${workspace}.com`}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13, fontFamily: FONT }}
            />
            <select style={{ background: 'transparent', border: 'none', color: t.textMuted, fontSize: 11, fontFamily: MONO, outline: 'none' }}>
              <option>member</option>
              <option>admin</option>
            </select>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: t.textDim, fontFamily: MONO }}>
        <span onClick={() => setEmails([...emails, ''])} style={{ cursor: 'pointer', color: t.accent }}>+ add another</span>
        <span>·</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot color={t.ok}/> anyone @{workspace}.com joins automatically
        </span>
      </div>
    </>
  );
}

/* ─────────── Step: Tour (finale) ─────────── */

function StepTour() {
  const t = useTheme();
  const cards = [
    { k: 'G', n: 'Graph', d: 'Every service, every edge. Searchable.' },
    { k: 'A', n: 'Ask',   d: 'Plain English over your whole stack.' },
    { k: 'C', n: 'Connectors', d: 'Add more sources any time.' },
    { k: 'I', n: 'Incidents', d: 'Blast radius in under a second.' },
  ];
  return (
    <>
      <Eyebrow>Finally</Eyebrow>
      <StepHeadline>That's it. <span style={{ color: t.accent }}>Go look.</span></StepHeadline>
      <StepLede>You have a graph, a team, and a very curious little AI. Press ⌘K from anywhere to start asking.</StepLede>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {cards.map(c => (
          <div key={c.k} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', background: t.panel2, border: `1px solid ${t.border}`,
            borderRadius: 10, cursor: 'pointer',
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: t.bg, border: `1px solid ${t.border}`, color: t.accent, fontFamily: MONO, fontSize: 12, fontWeight: 600, display: 'grid', placeItems: 'center' }}>{c.k}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.n}</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>{c.d}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────── Joiner steps ─────────── */

function StepJoin() {
  const t = useTheme();
  return (
    <>
      <Eyebrow>Welcome</Eyebrow>
      <StepHeadline>Maya added you to <span style={{ color: t.accent }}>acme</span>.</StepHeadline>
      <StepLede>Your graph is already built. 247 services, 3,890 claims. We just need to confirm who you are so we can wire you to your team.</StepLede>
      <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, color: '#0a0a0b', fontWeight: 700, display: 'grid', placeItems: 'center', fontSize: 15 }}>SL</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Sam Lin</div>
            <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO }}>sam@acme.com</div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 6 }}>auto-detected team</div>
        <Pill color={t.purple}>frontend-team</Pill>
      </div>
    </>
  );
}

function StepTeam() {
  const t = useTheme();
  return (
    <>
      <Eyebrow>Your team</Eyebrow>
      <StepHeadline>This is what <span style={{ color: t.accent }}>frontend-team</span> owns.</StepHeadline>
      <StepLede>Four services, one design system. We're tracking 18 claims on these — you can fix any of them with one click.</StepLede>
      <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 10, padding: '4px 14px' }}>
        {[
          ['frontend-app', 1, 'healthy'],
          ['design-system', 1, 'healthy'],
          ['docs-site', 2, 'healthy'],
          ['marketing-site', 2, 'stale owner'],
        ].map(([name, tier, status], i) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i ? `1px solid ${t.border}` : 'none' }}>
            <Dot color={status === 'healthy' ? t.ok : t.warn}/>
            <span style={{ fontFamily: MONO, fontSize: 12 }}>{name}</span>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: MONO }}>tier {tier}</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: status === 'healthy' ? t.textDim : t.warn }}>{status}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────── Backdrop (materializes during build) ─────────── */

function OnboardingBackdrop({ step, sourceCount }) {
  const t = useTheme();
  const intensity =
    step === 'workspace' ? 0 :
    step === 'connect' ? Math.min(0.25, sourceCount * 0.05) :
    step === 'build' ? 0.7 :
    step === 'ask' ? 0.5 :
    step === 'aha' ? 0.5 :
    step === 'invite' ? 0.35 :
    step === 'tour' ? 0.6 : 0.3;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(ellipse 800px 500px at 50% -10%, color-mix(in oklab, ${t.accent} ${intensity * 35}%, transparent) 0%, transparent 55%),
        radial-gradient(ellipse 600px 400px at 80% 110%, color-mix(in oklab, ${t.purple} ${intensity * 25}%, transparent) 0%, transparent 50%),
        radial-gradient(ellipse 500px 400px at 10% 100%, color-mix(in oklab, ${t.accent} ${intensity * 20}%, transparent) 0%, transparent 50%)
      `,
      transition: 'all 0.8s ease-out',
      pointerEvents: 'none',
    }}>
      {/* Subtle grid */}
      <svg width="100%" height="100%" style={{ opacity: 0.4 }}>
        <defs>
          <pattern id="obGrid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke={t.border} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#obGrid)"/>
      </svg>
    </div>
  );
}

Object.assign(window, {
  StepAsk, StepAha, StepInvite, StepTour,
  StepJoin, StepTeam, OnboardingBackdrop,
});
