// Onboarding · Variant C — Modal + Bold
// Editorial / oversized type. Numbered chapters. One big idea per screen.
// Feels like reading a manifesto, not filling a form.

function OnboardingVariantC({ persona = 'admin' }) {
  const t = useTheme();
  const STEPS = ['workspace', 'connect', 'schema', 'sync', 'ask', 'aha', 'invite', 'tour'];
  const [step, setStep] = React.useState(0);
  const [workspace, setWorkspace] = React.useState('acme');
  const [sources, setSources] = React.useState({
    github: true,
    k8s: true,
    datadog: true,
    backstage: false,
    pagerduty: false,
  });
  const [pct, setPct] = React.useState(0);
  const sCount = Object.values(sources).filter(Boolean).length;
  const cur = STEPS[step];

  React.useEffect(() => {
    if (cur !== 'sync') return;
    const id = setInterval(() => setPct((p) => Math.min(100, p + 1.4)), 70);
    return () => clearInterval(id);
  }, [cur]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: t.bg,
        color: t.text,
        fontFamily: FONT,
      }}
    >
      {/* Background grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
          radial-gradient(ellipse at 80% 20%, ${t.accentGlow} 0%, transparent 40%),
          radial-gradient(ellipse at 10% 90%, oklch(0.78 0.14 300 / 0.18) 0%, transparent 45%)
        `,
        }}
      />

      {/* Top */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: '22px 36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
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
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO }}>
            chapter {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, cursor: 'pointer' }}>
            skip →
          </div>
        </div>
      </div>

      {/* Big content */}
      <div style={{ position: 'relative', padding: '28px 56px 0' }}>
        {/* Chapter number — huge, screen-printed */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 36,
            fontSize: 220,
            fontWeight: 700,
            color: t.text,
            opacity: 0.04,
            fontFamily: MONO,
            lineHeight: 1,
            letterSpacing: -10,
            pointerEvents: 'none',
          }}
        >
          {String(step + 1).padStart(2, '0')}
        </div>

        {cur === 'workspace' && (
          <div style={{ maxWidth: 880 }}>
            <ChapterTag>chapter one</ChapterTag>
            <Headline>
              One name
              <br />
              for everything.
            </Headline>
            <Lede>
              The workspace is your company's home in ShipIt. Pick something that ages well.
            </Lede>
            <div
              style={{
                marginTop: 36,
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: 0,
                padding: '14px 22px',
                background: t.panel,
                border: `1px solid ${t.borderStrong}`,
                borderRadius: 12,
              }}
            >
              <input
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: t.accent,
                  fontSize: 32,
                  fontWeight: 500,
                  fontFamily: FONT,
                  width: 200,
                  letterSpacing: -0.5,
                }}
              />
              <span style={{ color: t.textDim, fontSize: 18, fontFamily: MONO }}>.shipit.ai</span>
            </div>
          </div>
        )}

        {cur === 'connect' && (
          <div style={{ maxWidth: 980 }}>
            <ChapterTag>chapter two</ChapterTag>
            <Headline>
              Plug in <span style={{ color: t.accent }}>your world</span>.
            </Headline>
            <Lede>Each source becomes a lens. The graph is the intersection of all of them.</Lede>
            <div
              style={{
                marginTop: 28,
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 8,
                maxWidth: 720,
              }}
            >
              {[
                ['github', 'GitHub', '⌨'],
                ['k8s', 'Kube', '⎔'],
                ['datadog', 'Datadog', '◉'],
                ['backstage', 'Backstage', '▨'],
                ['pagerduty', 'PD', '◔'],
              ].map(([k, n, ic]) => {
                const on = sources[k];
                return (
                  <div
                    key={k}
                    onClick={() => setSources({ ...sources, [k]: !on })}
                    style={{
                      aspectRatio: '1',
                      border: `1px solid ${on ? t.accent : t.borderStrong}`,
                      background: on ? t.accentDim : t.panel,
                      borderRadius: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 28 }}>{ic}</div>
                    <div style={{ fontSize: 11, fontWeight: 500 }}>{n}</div>
                    {on && (
                      <div style={{ fontSize: 9, color: t.accent, fontFamily: MONO }}>✓ on</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, fontSize: 12, color: t.textDim, fontFamily: MONO }}>
              {sCount} of 5 connected
            </div>
          </div>
        )}

        {cur === 'schema' && (
          <div style={{ maxWidth: 980 }}>
            <ChapterTag>chapter three</ChapterTag>
            <Headline>
              The shape of <span style={{ color: t.accent }}>truth</span>.
            </Headline>
            <Lede>Every claim, every conflict, every source — all reconciled into one schema.</Lede>
            <div style={{ marginTop: 28, display: 'flex', gap: 28, alignItems: 'flex-end' }}>
              {[
                ['247', 'services'],
                ['1.2k', 'edges'],
                ['3.9k', 'claims'],
                ['12', 'edge types'],
              ].map(([n, l]) => (
                <div key={l}>
                  <div
                    style={{
                      fontSize: 64,
                      fontWeight: 500,
                      fontFamily: MONO,
                      letterSpacing: -2,
                      lineHeight: 1,
                      color: t.text,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: t.textDim,
                      fontFamily: MONO,
                      textTransform: 'uppercase',
                      letterSpacing: 1.4,
                      marginTop: 6,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cur === 'sync' && (
          <div style={{ maxWidth: 880 }}>
            <ChapterTag>chapter four</ChapterTag>
            <Headline>{pct < 100 ? <>Building.</> : <>Built.</>}</Headline>
            <Lede>
              {pct < 100
                ? 'Reading sources, resolving claims, projecting graph.'
                : '~12 seconds. That graph would have taken you weeks.'}
            </Lede>
            <div style={{ marginTop: 32, maxWidth: 640 }}>
              <div
                style={{
                  fontSize: 60,
                  fontFamily: MONO,
                  fontWeight: 500,
                  letterSpacing: -2,
                  color: t.accent,
                }}
              >
                {Math.floor(pct)}
                <span style={{ fontSize: 32, color: t.textDim }}>%</span>
              </div>
              <div
                style={{
                  height: 4,
                  background: t.panel2,
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginTop: 12,
                  marginBottom: 18,
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
              <div
                style={{
                  display: 'flex',
                  gap: 28,
                  fontFamily: MONO,
                  fontSize: 11,
                  color: t.textMuted,
                }}
              >
                <span>
                  <span style={{ color: t.text }}>{Math.floor(pct * 2.47)}</span> services
                </span>
                <span>
                  <span style={{ color: t.text }}>{Math.floor(pct * 12.84)}</span> edges
                </span>
                <span>
                  <span style={{ color: t.text }}>{Math.floor(pct * 38.9)}</span> claims
                </span>
              </div>
            </div>
          </div>
        )}

        {cur === 'ask' && (
          <div style={{ maxWidth: 980 }}>
            <ChapterTag>chapter five</ChapterTag>
            <Headline>
              Ask it <span style={{ color: t.accent }}>anything</span>.
            </Headline>
            <Lede>Plain English. Cited answers. Sub-second.</Lede>
            <div
              style={{
                marginTop: 32,
                padding: '18px 22px',
                background: t.panel,
                border: `1px solid ${t.borderStrong}`,
                borderRadius: 12,
                maxWidth: 640,
              }}
            >
              <div style={{ fontSize: 18, color: t.text, lineHeight: 1.4 }}>
                <span style={{ color: t.accent, marginRight: 8 }}>✦</span>
                What's the blast radius if <span style={{ color: t.accent }}>
                  payments-api
                </span>{' '}
                goes down?
              </div>
            </div>
          </div>
        )}

        {cur === 'aha' && (
          <div style={{ maxWidth: 980 }}>
            <ChapterTag>chapter six</ChapterTag>
            <Headline>
              We already <span style={{ color: t.accent }}>found things</span>.
            </Headline>
            <Lede>Here's what your new graph noticed.</Lede>
            <div style={{ marginTop: 28, maxWidth: 720 }}>
              {[
                [
                  '01',
                  '3 tier-1 services have stale owners — GitHub disagrees with Backstage',
                  t.warn,
                ],
                ['02', 'billing-worker still imports a deprecated lib (auth-lib v1.2)', t.warn],
                ['03', 'PagerDuty token expires in 4 days', t.textMuted],
              ].map(([n, s, c]) => (
                <div
                  key={n}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 18,
                    padding: '16px 0',
                    borderTop: `1px solid ${t.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 26,
                      fontFamily: MONO,
                      color: c,
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div style={{ fontSize: 14, color: t.text, flex: 1, lineHeight: 1.4 }}>{s}</div>
                  <span style={{ color: t.accent, fontSize: 11, fontFamily: MONO }}>fix →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cur === 'invite' && (
          <div style={{ maxWidth: 880 }}>
            <ChapterTag>chapter seven</ChapterTag>
            <Headline>
              Better with <span style={{ color: t.accent }}>company</span>.
            </Headline>
            <Lede>Owners fix their own claims. Everyone can ask. No seat math.</Lede>
            <div
              style={{
                marginTop: 28,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                maxWidth: 540,
              }}
            >
              {['', '', '', ''].map((_, i) => (
                <input
                  key={i}
                  placeholder="teammate@acme.com"
                  style={{
                    padding: '12px 14px',
                    background: t.panel,
                    border: `1px solid ${t.border}`,
                    borderRadius: 8,
                    color: t.text,
                    fontSize: 13,
                    fontFamily: FONT,
                    outline: 'none',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {cur === 'tour' && (
          <div style={{ maxWidth: 880 }}>
            <ChapterTag>final chapter</ChapterTag>
            <Headline>
              Now go <span style={{ color: t.accent }}>look</span>.
            </Headline>
            <Lede>The cursor is yours. ⌘K opens the asker from anywhere.</Lede>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 36px',
          display: 'flex',
          alignItems: 'center',
          borderTop: `1px solid ${t.border}`,
          background: `${t.bg}cc`,
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 24 : 8,
                height: 4,
                borderRadius: 2,
                cursor: 'pointer',
                background: i <= step ? t.accent : t.panel2,
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {step > 0 && <Btn onClick={() => setStep(step - 1)}>←</Btn>}
          <Btn primary onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>
            {step === STEPS.length - 1 ? 'Open ShipIt' : 'Next chapter'} →
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ChapterTag({ children }) {
  const t = useTheme();
  return (
    <div
      style={{
        fontSize: 11,
        color: t.accent,
        fontFamily: MONO,
        textTransform: 'uppercase',
        letterSpacing: 1.6,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

function Headline({ children }) {
  const t = useTheme();
  return (
    <div
      style={{
        fontSize: 64,
        fontWeight: 500,
        letterSpacing: -2,
        lineHeight: 0.98,
        color: t.text,
        marginBottom: 18,
        maxWidth: 800,
      }}
    >
      {children}
    </div>
  );
}

function Lede({ children }) {
  const t = useTheme();
  return (
    <div style={{ fontSize: 17, color: t.textMuted, maxWidth: 540, lineHeight: 1.4 }}>
      {children}
    </div>
  );
}

Object.assign(window, { OnboardingVariantC });
