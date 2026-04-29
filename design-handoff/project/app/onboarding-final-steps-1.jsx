// Onboarding · Polished Final — step content + backdrop

/* ─────────── Reusable atoms ─────────── */

function Eyebrow({ children }) {
  const t = useTheme();
  return <div style={{ fontSize: 10, color: t.accent, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 16 }}>{children}</div>;
}

function StepHeadline({ children }) {
  const t = useTheme();
  return (
    <div style={{
      fontSize: 34, fontWeight: 500, letterSpacing: -0.9,
      lineHeight: 1.08, color: t.text, marginBottom: 10,
      textWrap: 'balance', maxWidth: 620,
    }}>{children}</div>
  );
}

function StepLede({ children, maxWidth = 520 }) {
  const t = useTheme();
  return (
    <div style={{
      fontSize: 14, lineHeight: 1.5, color: t.textMuted,
      marginBottom: 28, maxWidth, textWrap: 'pretty',
    }}>{children}</div>
  );
}

/* ─────────── Step: Workspace ─────────── */

function StepWorkspace({ workspace, setWorkspace }) {
  const t = useTheme();
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);
  return (
    <>
      <Eyebrow>Step one · workspace</Eyebrow>
      <StepHeadline>Let's give your graph a home.</StepHeadline>
      <StepLede>This is your company's workspace — everyone joins here. You can change it later (but you probably won't).</StepLede>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: t.bg, border: `1px solid ${t.borderStrong}`, borderRadius: 10,
        padding: '14px 18px', maxWidth: 520,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.02)`,
      }}>
        <input
          ref={inputRef}
          value={workspace}
          onChange={e => setWorkspace(e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase())}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 20, fontFamily: FONT, fontWeight: 500, letterSpacing: -0.3 }}
        />
        <span style={{ color: t.textDim, fontSize: 15, fontFamily: MONO }}>.shipit.ai</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: t.textDim, fontFamily: MONO, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Dot color={t.ok} glow/> available
      </div>
    </>
  );
}

/* ─────────── Step: Connect ─────────── */

function StepConnect({ sources, setSources }) {
  const t = useTheme();
  const list = [
    ['github',    'GitHub',     'required',  'repos, PRs, code owners',        '1,204 repos'],
    ['k8s',       'Kubernetes', 'runtime',   'workloads, pods, deployments',   '89 workloads'],
    ['datadog',   'Datadog',    'telemetry', 'monitors, SLOs, dashboards',     '340 monitors'],
    ['backstage', 'Backstage',  'catalog',   'service ownership, teams',       '247 entities'],
    ['pagerduty', 'PagerDuty',  'on-call',   'escalation policies, schedules', '18 services'],
  ];
  const sCount = Object.values(sources).filter(Boolean).length;
  return (
    <>
      <Eyebrow>Step two · connect</Eyebrow>
      <StepHeadline>Plug in what you have. All of it.</StepHeadline>
      <StepLede>Each source becomes a lens on your infra. We reconcile them into one graph — with full provenance, so you can always see who said what.</StepLede>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {list.map(([k, name, role, desc, count]) => {
          const on = sources[k];
          return (
            <div
              key={k}
              onClick={() => setSources({ ...sources, [k]: !on })}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '13px 14px', borderRadius: 10, cursor: 'pointer',
                background: on ? t.accentDim : t.panel2,
                border: `1px solid ${on ? t.accent : t.border}`,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: t.bg, border: `1px solid ${t.border}`,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <ConnectorIcon name={k}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
                  <span style={{ fontSize: 9, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1, padding: '1px 5px', border: `1px solid ${t.border}`, borderRadius: 3 }}>{role}</span>
                </div>
                <div style={{ fontSize: 11, color: t.textDim, lineHeight: 1.35 }}>{desc}</div>
              </div>
              <div style={{
                width: 18, height: 18, borderRadius: 5,
                border: `1.5px solid ${on ? t.accent : t.borderStrong}`,
                background: on ? t.accent : 'transparent',
                color: '#0a0a0b', fontSize: 11, display: 'grid', placeItems: 'center', fontWeight: 700,
                marginTop: 2, transition: 'all 0.15s',
              }}>{on ? '✓' : ''}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color: t.textDim, fontFamily: MONO, display: 'flex', justifyContent: 'space-between' }}>
        <span>{sCount} of 5 · more any time</span>
        <span style={{ color: t.textDim }}>+ 40 others in the connector hub</span>
      </div>
    </>
  );
}

function ConnectorIcon({ name }) {
  const map = { github: '⌨', k8s: '⎔', datadog: '◉', backstage: '▨', pagerduty: '◔' };
  return <span style={{ fontSize: 16 }}>{map[name] || '◇'}</span>;
}

/* ─────────── Step: Build — the magical moment ─────────── */

function StepBuild({ sources }) {
  const t = useTheme();
  const sCount = Object.values(sources).filter(Boolean).length;
  const [pct, setPct] = React.useState(0);
  const [logLines, setLogLines] = React.useState([]);

  const phases = React.useMemo(() => [
    { at: 0,   text: 'connecting to sources',          tone: 'info' },
    { at: 8,   text: 'handshake · github ✓',           tone: 'ok'   },
    { at: 14,  text: 'handshake · kubernetes ✓',       tone: 'ok'   },
    { at: 20,  text: 'handshake · datadog ✓',          tone: 'ok'   },
    { at: 26,  text: 'ingesting · 247 services',       tone: 'info' },
    { at: 38,  text: 'ingesting · 1,204 repositories', tone: 'info' },
    { at: 50,  text: 'projecting · LogicalService',    tone: 'info' },
    { at: 58,  text: 'projecting · Deployment edges',  tone: 'info' },
    { at: 66,  text: 'resolving · PropertyClaims',     tone: 'warn' },
    { at: 74,  text: '  ↳ 47 conflicts (auto-merged)', tone: 'dim'  },
    { at: 82,  text: 'computing · blast radii',        tone: 'info' },
    { at: 90,  text: 'building · search index',        tone: 'info' },
    { at: 96,  text: 'indexing claims · 3,890 total',  tone: 'info' },
    { at: 100, text: '✓ graph is live',                tone: 'ok'   },
  ], []);

  React.useEffect(() => {
    const start = performance.now();
    const duration = 8200;
    let raf;
    const tick = (now) => {
      const p = Math.min(100, ((now - start) / duration) * 100);
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  React.useEffect(() => {
    const revealed = phases.filter(p => pct >= p.at);
    setLogLines(revealed);
  }, [pct, phases]);

  const cur = phases.filter(p => pct >= p.at).slice(-1)[0] || phases[0];
  const done = pct >= 100;

  // Counters
  const nServices = Math.floor((pct / 100) * 247);
  const nEdges = Math.floor((pct / 100) * 1284);
  const nClaims = Math.floor((pct / 100) * 3890);

  return (
    <>
      <Eyebrow>Step three · building</Eyebrow>
      <StepHeadline>
        {done ? 'Your graph is alive.' : 'Building your graph.'}
      </StepHeadline>
      <StepLede>
        {done
          ? 'Eight seconds. Your team couldn\'t have done this by hand in a month.'
          : <>Reading every source, resolving every claim. <span style={{ color: t.text }}>{cur.text}</span>…</>
        }
      </StepLede>

      {/* Live graph preview + progress */}
      <div style={{
        position: 'relative',
        height: 180,
        background: `linear-gradient(180deg, ${t.panel2} 0%, ${t.bg} 100%)`,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 18,
      }}>
        <BuildGraphPreview pct={pct}/>
        {/* Progress bar overlay */}
        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
          <div style={{
            height: 2, background: `${t.borderStrong}`, borderRadius: 999, overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              width: `${pct}%`, height: '100%',
              background: `linear-gradient(90deg, ${t.accent}, ${t.purple})`,
              transition: 'width 0.12s linear',
              boxShadow: `0 0 12px ${t.accent}`,
            }}/>
          </div>
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 10, color: t.textDim }}>
            <span>{cur.text}</span>
            <span>{Math.floor(pct)}%</span>
          </div>
        </div>
      </div>

      {/* Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        <TickCounter label="services"     value={nServices} accent={t.accent}/>
        <TickCounter label="relationships" value={nEdges}   accent={t.purple}/>
        <TickCounter label="claims"        value={nClaims}  accent={t.ok}/>
      </div>

      {/* Mini log */}
      <div style={{
        fontFamily: MONO, fontSize: 10.5, lineHeight: 1.65,
        background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8,
        padding: '10px 14px', height: 68, overflow: 'hidden',
        maskImage: 'linear-gradient(to bottom, transparent, black 30%)',
      }}>
        {logLines.slice(-5).map((line, i, a) => {
          const color = line.tone === 'ok' ? t.ok : line.tone === 'warn' ? t.warn : line.tone === 'dim' ? t.textDim : t.textMuted;
          const head = i === a.length - 1 && !done ? '→' : '·';
          return (
            <div key={line.at} className="fade-in" style={{ color }}>
              <span style={{ color: t.textDim, marginRight: 8 }}>{head}</span>{line.text}
            </div>
          );
        })}
      </div>
    </>
  );
}

function TickCounter({ label, value, accent }) {
  const t = useTheme();
  return (
    <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: 9, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontFamily: MONO, fontWeight: 500, color: t.text, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function BuildGraphPreview({ pct }) {
  const t = useTheme();
  const all = (window.SERVICES || []).slice(0, 16);
  const count = Math.max(0, Math.floor((pct / 100) * all.length));
  const W = 780, H = 180;
  const nodes = all.slice(0, count).map((s, i, arr) => {
    const x = 40 + (i / Math.max(1, arr.length - 1 || 1)) * (W - 80);
    const seed = (i * 9301 + 49297) % 233280;
    const y = 30 + (seed / 233280) * (H - 60);
    return { ...s, x, y };
  });
  const typeColor = { LogicalService: t.accent, Repository: t.purple, Deployment: t.ok };
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="bgGlow">
          <stop offset="0" stopColor={t.accent} stopOpacity="0.35"/>
          <stop offset="1" stopColor={t.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={W/2} cy={H/2} r={60 + pct * 0.8} fill="url(#bgGlow)"/>
      {/* Edges */}
      {nodes.slice(1).map((n, i) => {
        const prev = nodes[Math.max(0, i - (i % 3))];
        return (
          <line key={`e${i}`}
            className="fade-in"
            x1={prev.x} y1={prev.y} x2={n.x} y2={n.y}
            stroke={t.borderStrong} strokeWidth="0.8" opacity="0.5"/>
        );
      })}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={n.id} className="fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <circle cx={n.x} cy={n.y} r={n.tier === 1 ? 6 : 4} fill={typeColor[n.type] || t.textMuted}/>
          <circle cx={n.x} cy={n.y} r={n.tier === 1 ? 12 : 8} fill={typeColor[n.type] || t.textMuted} opacity="0.2"/>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, {
  StepWorkspace, StepConnect, StepBuild,
});
