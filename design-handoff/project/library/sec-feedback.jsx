// Library · Feedback — live toasts, alerts, progress, spinners, skeletons, empty states.

function SecFeedback() {
  return (
    <Section
      id="feedback"
      title="Feedback"
      count="9 patterns"
      desc="Live demos for everything noisy: toasts, alerts, progress, loaders, empty states. All animations respect prefers-reduced-motion in production."
    >
      <Subsection title="Toast (live)" note="click to fire">
        <Specimen
          code={`toast.success('Schema saved', { description: '142 entity types committed.' })`}
        >
          <LiveToasts />
        </Specimen>
      </Subsection>

      <Subsection title="Alert · inline (4 variants)">
        <Specimen code={`<Alert variant="warn" title="…" description="…"/>`}>
          <Col gap={10} style={{ width: '100%', maxWidth: 640 }}>
            {[
              {
                v: 'info',
                icon: 'ℹ',
                t: 'Schema preview ready',
                d: 'Review proposed entity types before we commit them to your graph.',
              },
              {
                v: 'ok',
                icon: '✓',
                t: 'GitHub connected',
                d: '4 repos imported · 12,841 files indexed.',
              },
              {
                v: 'warn',
                icon: '!',
                t: 'GitHub token expires in 3 days',
                d: 'Generate a new token to avoid sync interruption.',
              },
              {
                v: 'err',
                icon: '×',
                t: 'Notion sync failed',
                d: 'Token rejected. Re-authorize the connector to continue.',
              },
            ].map((a) => (
              <Row
                key={a.v}
                gap={12}
                style={{
                  padding: '12px 14px',
                  alignItems: 'flex-start',
                  background: T.panel,
                  border: `1px solid ${T.border}`,
                  borderLeft: `2px solid var(--${a.v})`,
                  borderRadius: 8,
                }}
              >
                <span style={{ color: `var(--${a.v})`, fontSize: 14, marginTop: 1 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.t}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{a.d}</div>
                </div>
                <UIBtn size="sm" variant="ghost">
                  Dismiss
                </UIBtn>
              </Row>
            ))}
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Banner (top-of-page)">
        <Specimen pad={0} code={`<Banner variant="warn" sticky>…</Banner>`}>
          <Col gap={1} style={{ width: '100%' }}>
            <Row
              gap={10}
              style={{
                padding: '8px 14px',
                background: 'oklch(0.5 0.16 50 / 0.18)',
                borderBottom: `1px solid ${T.border}`,
                color: T.warn,
                fontSize: 12,
              }}
            >
              <span>!</span>
              <span>
                You're on the trial plan — <strong>4 days remaining</strong>.{' '}
              </span>
              <a
                style={{
                  marginLeft: 'auto',
                  color: T.warn,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Upgrade →
              </a>
            </Row>
            <Row
              gap={10}
              style={{
                padding: '8px 14px',
                background: 'oklch(0.5 0.16 240 / 0.18)',
                borderBottom: `1px solid ${T.border}`,
                color: T.accent,
                fontSize: 12,
              }}
            >
              <span>✦</span>
              <span>
                New: <strong>incident pinning</strong> in the graph.{' '}
              </span>
              <a
                style={{
                  marginLeft: 'auto',
                  color: T.accent,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                What's new →
              </a>
            </Row>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Progress · linear (live)" note="determinate">
        <Specimen code={`<Progress value={progress} label="Indexing repos"/>`}>
          <LiveProgress />
        </Specimen>
      </Subsection>

      <Subsection title="Progress · indeterminate">
        <Specimen code={`<Progress indeterminate/>`}>
          <Col gap={12} style={{ width: '100%', maxWidth: 360 }}>
            <div style={{ height: 4, background: T.panel2, borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: '40%',
                  height: '100%',
                  background: T.accent,
                  borderRadius: 999,
                  animation: 'indeterminate 1.4s linear infinite',
                }}
              />
            </div>
            <div style={{ height: 4, background: T.panel2, borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: '40%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                  borderRadius: 999,
                  animation: 'indeterminate 1.4s linear infinite',
                }}
              />
            </div>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Progress · radial">
        <Specimen code={`<RadialProgress value={68}/>`}>
          <Row gap={20}>
            {[28, 58, 84, 100].map((v) => {
              const r = 26;
              const c = 2 * Math.PI * r;
              return (
                <div key={v} style={{ position: 'relative', width: 64, height: 64 }}>
                  <svg width="64" height="64" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r={r} fill="none" stroke={T.panel2} strokeWidth="4" />
                    <circle
                      cx="32"
                      cy="32"
                      r={r}
                      fill="none"
                      stroke={v === 100 ? T.ok : T.accent}
                      strokeWidth="4"
                      strokeDasharray={`${(v / 100) * c} ${c}`}
                      transform="rotate(-90 32 32)"
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 360ms' }}
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: FM,
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {v}%
                  </div>
                </div>
              );
            })}
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Spinner">
        <Specimen code={`<Spinner size="md"/>`}>
          <Row gap={20} align="center">
            {[12, 16, 22, 32].map((s) => (
              <div
                key={s}
                style={{
                  width: s,
                  height: s,
                  borderRadius: '50%',
                  border: `${Math.max(2, s / 10)}px solid ${T.panel2}`,
                  borderTopColor: T.accent,
                  animation: 'spin 700ms linear infinite',
                }}
              />
            ))}
            <Row gap={6}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: T.accent,
                  animation: 'pulse 1s infinite',
                }}
              />
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: T.accent,
                  animation: 'pulse 1s 0.2s infinite',
                }}
              />
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: T.accent,
                  animation: 'pulse 1s 0.4s infinite',
                }}
              />
            </Row>
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Skeleton">
        <Specimen code={`<Skeleton width="60%" height={14}/>`}>
          <Col gap={20} style={{ width: '100%', maxWidth: 480 }}>
            <Col gap={10}>
              <div
                style={{
                  width: '70%',
                  height: 14,
                  background: T.panel2,
                  borderRadius: 4,
                  animation: 'skel 1.4s infinite',
                }}
              />
              <div
                style={{
                  width: '90%',
                  height: 10,
                  background: T.panel2,
                  borderRadius: 4,
                  animation: 'skel 1.4s 0.1s infinite',
                }}
              />
              <div
                style={{
                  width: '60%',
                  height: 10,
                  background: T.panel2,
                  borderRadius: 4,
                  animation: 'skel 1.4s 0.2s infinite',
                }}
              />
            </Col>
            <Row gap={12}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: T.panel2,
                  animation: 'skel 1.4s infinite',
                }}
              />
              <Col gap={6} style={{ flex: 1 }}>
                <div
                  style={{
                    width: '40%',
                    height: 12,
                    background: T.panel2,
                    borderRadius: 4,
                    animation: 'skel 1.4s 0.1s infinite',
                  }}
                />
                <div
                  style={{
                    width: '70%',
                    height: 10,
                    background: T.panel2,
                    borderRadius: 4,
                    animation: 'skel 1.4s 0.2s infinite',
                  }}
                />
              </Col>
            </Row>
            <Col gap={6}>
              <div
                style={{
                  height: 80,
                  background: T.panel2,
                  borderRadius: 8,
                  animation: 'skel 1.4s infinite',
                }}
              />
              <div
                style={{
                  height: 14,
                  width: '50%',
                  background: T.panel2,
                  borderRadius: 4,
                  animation: 'skel 1.4s 0.1s infinite',
                }}
              />
            </Col>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Empty state · 4 variants">
        <Specimen code={`<EmptyState icon="◇" title="…" description="…" action={…}/>`}>
          <Grid cols={2} gap={12} style={{ width: '100%' }}>
            {[
              {
                i: '◇',
                t: 'No services yet',
                d: 'Connect a code source to start. Most teams begin with GitHub.',
                a: 'Connect GitHub',
              },
              {
                i: '✦',
                t: 'Ask anything',
                d: 'Try one of these to start, or write your own question above.',
                a: null,
                chips: ['Who owns checkout?', 'Recent rollbacks', 'On-call this week'],
              },
              {
                i: '⌕',
                t: 'No results',
                d: 'Try a broader search. We looked across services, people, and docs.',
                a: 'Clear filters',
              },
              {
                i: '!',
                t: 'Sync failed',
                d: 'GitHub returned a 401. Your token may have expired.',
                a: 'Re-authorize',
                danger: true,
              },
            ].map((e) => (
              <Col
                key={e.t}
                gap={10}
                style={{
                  padding: 24,
                  background: T.panel,
                  border: `1px dashed ${T.border}`,
                  borderRadius: 10,
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: e.danger ? 'oklch(0.4 0.16 30 / 0.15)' : T.accentDim,
                    color: e.danger ? T.err : T.accent,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 22,
                  }}
                >
                  {e.i}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{e.t}</div>
                <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, maxWidth: 240 }}>
                  {e.d}
                </div>
                {e.chips && (
                  <Col gap={4} style={{ width: '100%' }}>
                    {e.chips.map((c) => (
                      <div
                        key={c}
                        style={{
                          padding: '6px 10px',
                          fontSize: 11,
                          background: T.panel2,
                          border: `1px solid ${T.border}`,
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        {c}
                      </div>
                    ))}
                  </Col>
                )}
                {e.a && (
                  <UIBtn size="sm" variant={e.danger ? 'danger' : 'primary'}>
                    {e.a}
                  </UIBtn>
                )}
              </Col>
            ))}
          </Grid>
        </Specimen>
      </Subsection>
    </Section>
  );
}

/* ────── Live demos ────── */

function LiveToasts() {
  const [toasts, setToasts] = React.useState([]);
  const fire = (variant, title, desc) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, variant, title, desc }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };
  return (
    <>
      <Row gap={6} wrap>
        <UIBtn
          size="sm"
          variant="secondary"
          onClick={() => fire('ok', 'Schema saved', '142 entity types committed.')}
        >
          Success
        </UIBtn>
        <UIBtn
          size="sm"
          variant="secondary"
          onClick={() => fire('info', 'Sync running', 'github · 4 repos remaining')}
        >
          Info
        </UIBtn>
        <UIBtn
          size="sm"
          variant="secondary"
          onClick={() => fire('warn', 'Token expiring', 'GitHub PAT expires in 3 days.')}
        >
          Warning
        </UIBtn>
        <UIBtn
          size="sm"
          variant="secondary"
          onClick={() => fire('err', 'Sync failed', 'Notion · token rejected')}
        >
          Error
        </UIBtn>
      </Row>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 200,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              width: 320,
              padding: 12,
              background: T.panel,
              border: `1px solid ${T.border}`,
              borderLeft: `2px solid var(--${t.variant})`,
              borderRadius: 8,
              boxShadow: T.shadowLg,
              pointerEvents: 'auto',
            }}
          >
            <Row gap={10} style={{ alignItems: 'flex-start' }}>
              <span style={{ color: `var(--${t.variant})`, fontSize: 14, marginTop: 1 }}>
                {t.variant === 'ok'
                  ? '✓'
                  : t.variant === 'warn'
                    ? '!'
                    : t.variant === 'err'
                      ? '×'
                      : 'ℹ'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{t.desc}</div>
              </div>
              <span
                onClick={() => setToasts((s) => s.filter((x) => x.id !== t.id))}
                style={{ color: T.textDim, cursor: 'pointer', fontSize: 14 }}
              >
                ×
              </span>
            </Row>
          </div>
        ))}
      </div>
    </>
  );
}

function LiveProgress() {
  const [progress, setProgress] = React.useState(0);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setRunning(false);
          return 100;
        }
        return p + Math.random() * 6 + 2;
      });
    }, 220);
    return () => clearInterval(id);
  }, [running]);

  return (
    <Col gap={14} style={{ width: '100%', maxWidth: 480 }}>
      <Row>
        <span style={{ fontSize: 12, color: T.textMuted }}>Indexing repos</span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: FM,
            fontSize: 11,
            color: T.text,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.min(100, Math.round(progress))}%
        </span>
      </Row>
      <div style={{ height: 4, background: T.panel2, borderRadius: 999, overflow: 'hidden' }}>
        <div
          style={{
            width: `${Math.min(100, progress)}%`,
            height: '100%',
            background: progress >= 100 ? T.ok : T.accent,
            borderRadius: 999,
            transition: 'width 220ms',
          }}
        />
      </div>
      <Row gap={6}>
        <UIBtn
          size="sm"
          variant="primary"
          onClick={() => {
            setProgress(0);
            setRunning(true);
          }}
          disabled={running}
        >
          {running ? 'Running…' : progress >= 100 ? 'Run again' : 'Start'}
        </UIBtn>
        <UIBtn
          size="sm"
          variant="ghost"
          onClick={() => {
            setProgress(0);
            setRunning(false);
          }}
        >
          Reset
        </UIBtn>
      </Row>
    </Col>
  );
}

Object.assign(window, { SecFeedback, LiveToasts, LiveProgress });
