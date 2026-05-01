// Onboarding · Variant D — Canvas + Bold
// Terminal-style "graph being built live in front of you" with conversational AI narration.
// Feels like watching a build agent work. Steps are inline interjections.

function OnboardingVariantD({ persona = 'admin' }) {
  const t = useTheme();
  const STEPS = ['workspace', 'connect', 'schema', 'sync', 'ask', 'aha', 'invite', 'tour'];
  const [step, setStep] = React.useState(0);
  const [workspace, setWorkspace] = React.useState('acme');
  const [sources, setSources] = React.useState({
    github: true,
    k8s: true,
    datadog: true,
    backstage: true,
    pagerduty: false,
  });
  const [pct, setPct] = React.useState(0);
  const sCount = Object.values(sources).filter(Boolean).length;
  const cur = STEPS[step];

  React.useEffect(() => {
    if (cur !== 'sync') return;
    const id = setInterval(() => setPct((p) => Math.min(100, p + 1.6)), 60);
    return () => clearInterval(id);
  }, [cur]);

  // Conversational log accumulates as user moves through
  const allMessages = [
    { at: 'workspace', who: 'shipit', text: "Hi. I'm ShipIt. Let's name your workspace." },
    {
      at: 'connect',
      who: 'shipit',
      text: 'Plug in some sources. The more you give me, the more I can show you.',
    },
    {
      at: 'schema',
      who: 'shipit',
      text: "Here's the unified schema I'll use. Any conflicts get tracked as PropertyClaims.",
    },
    { at: 'sync', who: 'shipit', text: "Building your graph now. I'll narrate." },
    { at: 'ask', who: 'shipit', text: "Try a question. I'll show every tool I called." },
    { at: 'aha', who: 'shipit', text: 'I noticed a few things while building. Worth a look.' },
    { at: 'invite', who: 'shipit', text: 'Owners can fix their own claims. Want to invite a few?' },
    { at: 'tour', who: 'shipit', text: 'All set. ⌘K reaches me anywhere. Have fun.' },
  ];
  const visibleMessages = allMessages.slice(0, step + 1);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: t.bg,
        color: t.text,
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      {/* Left: conversational rail */}
      <div
        style={{
          width: 360,
          padding: '22px 24px',
          borderRight: `1px solid ${t.border}`,
          background: t.panel,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`,
              display: 'grid',
              placeItems: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#0a0a0b',
            }}
          >
            ◆
          </div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>ShipIt</div>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 10,
              color: t.textDim,
              fontFamily: MONO,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Dot color={t.ok} glow /> live
          </div>
        </div>

        <div
          style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          {visibleMessages.map((m, i) => (
            <div key={i} className="fade-in" style={{ display: 'flex', gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: t.accentDim,
                  color: t.accent,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 10,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                ✦
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: t.text, lineHeight: 1.4 }}>{m.text}</div>

                {/* Inline interactions per step */}
                {m.at === cur && cur === 'workspace' && (
                  <div
                    style={{
                      marginTop: 10,
                      display: 'flex',
                      alignItems: 'center',
                      background: t.panel2,
                      border: `1px solid ${t.borderStrong}`,
                      borderRadius: 6,
                      padding: '8px 10px',
                    }}
                  >
                    <input
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: t.text,
                        fontSize: 13,
                        fontFamily: FONT,
                      }}
                    />
                    <span style={{ color: t.textDim, fontSize: 11, fontFamily: MONO }}>
                      .shipit.ai
                    </span>
                  </div>
                )}

                {m.at === cur && cur === 'connect' && (
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[
                      ['github', 'GitHub', '⌨'],
                      ['k8s', 'K8s', '⎔'],
                      ['datadog', 'DD', '◉'],
                      ['backstage', 'Backstage', '▨'],
                      ['pagerduty', 'PD', '◔'],
                    ].map(([k, n, ic]) => {
                      const on = sources[k];
                      return (
                        <div
                          key={k}
                          onClick={() => setSources({ ...sources, [k]: !on })}
                          style={{
                            padding: '6px 10px',
                            fontSize: 11,
                            borderRadius: 999,
                            cursor: 'pointer',
                            background: on ? t.accent : t.panel2,
                            color: on ? '#0a0a0b' : t.textMuted,
                            border: `1px solid ${on ? t.accent : t.border}`,
                          }}
                        >
                          {ic} {n}
                        </div>
                      );
                    })}
                  </div>
                )}

                {m.at === cur && cur === 'sync' && (
                  <div style={{ marginTop: 10 }}>
                    <div
                      style={{
                        height: 4,
                        background: t.panel2,
                        borderRadius: 999,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: t.accent,
                          transition: 'width 0.2s',
                        }}
                      />
                    </div>
                    <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 10, color: t.textDim }}>
                      {Math.floor(pct)}% · {Math.floor(pct * 2.47)} services ·{' '}
                      {Math.floor(pct * 12.84)} edges
                    </div>
                  </div>
                )}

                {m.at === cur && cur === 'ask' && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: '8px 10px',
                      background: t.panel2,
                      border: `1px solid ${t.borderStrong}`,
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    What's the blast radius if payments-api goes down?
                  </div>
                )}

                {m.at === cur && cur === 'aha' && (
                  <div style={{ marginTop: 10 }}>
                    {[
                      ['3 tier-1 services have stale owners', t.warn],
                      ['1 deprecated lib in use', t.warn],
                      ['PagerDuty token expires in 4d', t.textMuted],
                    ].map(([s, c]) => (
                      <div
                        key={s}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '5px 0',
                          fontSize: 11,
                        }}
                      >
                        <Dot color={c} />
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {m.at === cur && cur === 'invite' && (
                  <div style={{ marginTop: 10 }}>
                    <input
                      placeholder="teammate@acme.com"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: t.panel2,
                        border: `1px solid ${t.borderStrong}`,
                        borderRadius: 6,
                        color: t.text,
                        fontSize: 12,
                        fontFamily: FONT,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: `1px solid ${t.border}`,
            display: 'flex',
            gap: 6,
          }}
        >
          {step > 0 && (
            <Btn small onClick={() => setStep(step - 1)}>
              ←
            </Btn>
          )}
          <Btn small ghost onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>
            skip
          </Btn>
          <div style={{ flex: 1 }} />
          <Btn small primary onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>
            {step === STEPS.length - 1 ? 'open' : 'next'} →
          </Btn>
        </div>
      </div>

      {/* Right: live build canvas */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          minWidth: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${t.panel} 0%, ${t.bg} 80%)`,
        }}
      >
        {/* Stat overlay */}
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 22,
            display: 'flex',
            gap: 18,
            fontFamily: MONO,
            fontSize: 11,
            color: t.textMuted,
            zIndex: 2,
          }}
        >
          <span>
            workspace=<span style={{ color: t.accent }}>{workspace}</span>
          </span>
          <span>
            sources=<span style={{ color: t.accent }}>{sCount}</span>
          </span>
          <span>
            chapter=
            <span style={{ color: t.accent }}>
              {step + 1}/{STEPS.length}
            </span>
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 18,
            right: 22,
            fontFamily: MONO,
            fontSize: 10,
            color: t.textDim,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Dot color={cur === 'sync' && pct < 100 ? t.warn : t.ok} glow />
          {cur === 'sync' && pct < 100 ? 'building' : 'idle'}
        </div>

        {/* Big graph */}
        <CanvasGraphBuild step={step} pct={pct} sourceCount={sCount} />

        {/* Bottom log */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 22px',
            borderTop: `1px solid ${t.border}`,
            background: `${t.bg}cc`,
            backdropFilter: 'blur(6px)',
            fontFamily: MONO,
            fontSize: 11,
            color: t.textMuted,
            lineHeight: 1.7,
            maxHeight: 130,
            overflow: 'hidden',
          }}
        >
          <BuildLog step={step} pct={pct} />
        </div>
      </div>
    </div>
  );
}

function CanvasGraphBuild({ step, pct, sourceCount }) {
  const t = useTheme();
  const reveal =
    step === 0
      ? 0
      : step === 1
        ? Math.min(0.25, sourceCount * 0.05)
        : step === 2
          ? 0.4
          : step === 3
            ? 0.4 + (pct / 100) * 0.6
            : 1;
  const all = SERVICES;
  const visible = Math.max(0, Math.floor(all.length * reveal));
  const nodes = all.slice(0, visible).map((s, i, a) => {
    const ang = (i / a.length) * Math.PI * 2;
    const r = 170;
    return { ...s, x: 380 + Math.cos(ang) * r, y: 240 + Math.sin(ang) * r * 0.85 };
  });
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges = EDGES.filter((e) => byId[e[0]] && byId[e[1]]);
  const typeColor = { LogicalService: t.accent, Repository: t.purple, Deployment: t.ok };
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 760 480"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <radialGradient id="dGlow">
          <stop offset="0" stopColor={t.accent} stopOpacity="0.3" />
          <stop offset="1" stopColor={t.accent} stopOpacity="0" />
        </radialGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={t.border} strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.4" />
      <circle cx="380" cy="240" r={120 + reveal * 100} fill="url(#dGlow)" />
      {edges.map((e, i) => {
        const a = byId[e[0]],
          b = byId[e[1]];
        return (
          <line
            key={i}
            className="fade-in"
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={t.borderStrong}
            strokeWidth="0.7"
            opacity="0.6"
          />
        );
      })}
      {nodes.map((n, i) => (
        <g key={n.id} className="fade-in" style={{ animationDelay: `${i * 50}ms` }}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.tier === 1 ? 9 : 6}
            fill={typeColor[n.type] || t.textMuted}
          />
          <text
            x={n.x}
            y={n.y + 19}
            fontSize="9"
            fill={t.textMuted}
            textAnchor="middle"
            fontFamily={MONO}
          >
            {n.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BuildLog({ step, pct }) {
  const t = useTheme();
  const lines = [];
  if (step >= 0) lines.push('$ shipit init');
  if (step >= 1) lines.push('→ resolving connector configs');
  if (step >= 1) lines.push('→ oauth handshake → github ✓');
  if (step >= 2) lines.push('→ schema-mapping/v2.json loaded');
  if (step >= 3) {
    lines.push(
      `→ ingesting · ${Math.floor(pct)}% · ${Math.floor(pct * 2.47)} services · ${Math.floor(pct * 38.9)} claims`,
    );
    if (pct < 100) lines.push('  resolving PropertyClaim conflicts…');
  }
  if (step >= 4) lines.push('→ graph projection ready (neo4j) · query latency 1.2s');
  if (step >= 5) lines.push('→ recommendations engine warm · 3 findings');
  if (step >= 6) lines.push('→ team invites queued');
  if (step >= 7) lines.push('✓ ready');
  return (
    <>
      {lines.slice(-6).map((l, i, a) => (
        <div key={i} style={{ color: i === a.length - 1 ? t.text : t.textMuted }}>
          <span style={{ color: t.textDim, marginRight: 6 }}>{String(i).padStart(2, '0')}</span>
          {l}
        </div>
      ))}
    </>
  );
}

Object.assign(window, { OnboardingVariantD });
