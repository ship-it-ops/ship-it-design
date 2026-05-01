// Incident Mode — focused ops view

function PageIncident({ nav, onAsk }) {
  const t = useTheme();
  const inc = INCIDENTS[0];
  return (
    <div
      className="fade-in"
      style={{
        overflow: 'auto',
        height: '100%',
        padding: '24px 32px 40px',
        background: `
      radial-gradient(ellipse at 30% 0%, ${t.err}14 0%, transparent 50%), ${t.bg}
    `,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: t.err,
              fontFamily: MONO,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Dot color={t.err} glow /> Incident mode · {inc.id}
          </div>
          <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.7, lineHeight: 1.15 }}>
            {inc.title}
          </div>
          <div style={{ color: t.textMuted, marginTop: 8, fontSize: 13 }}>
            Started {inc.started} ago · {inc.sev} · {inc.owner} · status:{' '}
            <span style={{ color: t.warn }}>{inc.status}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn>Page owner</Btn>
          <Btn>Open runbook</Btn>
          <Btn primary>Mark mitigated</Btn>
        </div>
      </div>

      <Card pad={0} style={{ marginBottom: 16, overflow: 'hidden' }}>
        <div
          style={{
            padding: '18px 22px',
            background: `radial-gradient(circle at 90% 50%, ${t.accentGlow} 0%, transparent 55%), ${t.panel}`,
          }}
        >
          <SectionLabel>
            <Dot color={t.accent} glow />{' '}
            <span style={{ marginLeft: 8 }}>Shipit · triage suggestion</span>
          </SectionLabel>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: -0.2,
              lineHeight: 1.4,
              color: t.text,
              marginBottom: 10,
            }}
          >
            The p99 spike in checkout correlates with the{' '}
            <MonoText style={{ color: t.accent }}>payments-api v2.14.0</MonoText> deploy 8 minutes
            ago. A database connection-pool config changed in that release.
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Show diff', 'Services affected', 'Who deployed this?', 'Roll back'].map((a) => (
              <div
                key={a}
                onClick={() => onAsk(a.toLowerCase())}
                style={{
                  padding: '6px 11px',
                  fontSize: 12,
                  border: `1px solid ${t.border}`,
                  borderRadius: 999,
                  color: t.text,
                  background: t.panel2,
                  cursor: 'pointer',
                }}
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 12, marginBottom: 16 }}>
        <Card>
          <SectionLabel>Impacted services</SectionLabel>
          {[
            ['checkout-service', 'p99 +320ms vs baseline', t.err, 'primary'],
            ['payments-api', 'pool exhaustion errors 4.2%', t.err, 'root'],
            ['frontend-app', 'checkout CTA latency', t.warn, 'downstream'],
            ['orders-svc', 'retries elevated', t.warn, 'downstream'],
            ['billing-worker', 'queue backlog +180', t.textMuted, 'secondary'],
          ].map((x, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '10px 180px 1fr auto auto',
                gap: 12,
                alignItems: 'center',
                padding: '11px 0',
                borderTop: i ? `1px solid ${t.border}` : 'none',
              }}
            >
              <Dot color={x[2]} glow={x[3] === 'root'} />
              <MonoText style={{ fontSize: 12 }}>{x[0]}</MonoText>
              <span style={{ color: t.textMuted, fontSize: 12 }}>{x[1]}</span>
              <Pill color={x[3] === 'root' ? t.err : t.textMuted}>{x[3]}</Pill>
              <Btn small ghost onClick={() => nav('entity', x[0])}>
                →
              </Btn>
            </div>
          ))}
        </Card>

        <Card>
          <SectionLabel>Timeline</SectionLabel>
          {[
            ['21:38', 'deploy', 'payments-api v2.14.0 → production', t.err, true],
            ['21:40', 'alert', 'p99 threshold breached (checkout)', t.err],
            ['21:41', 'alert', 'error-rate > 2% (payments-api)', t.err],
            ['21:44', 'page', 'maya.s paged', t.warn],
            ['21:46', 'ack', 'maya.s acknowledged', t.accent],
            ['21:48', 'exec', 'kubectl rollout history triggered', t.accent],
          ].map((x, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 60px 1fr',
                gap: 12,
                alignItems: 'flex-start',
                padding: '9px 0',
                borderTop: i ? `1px solid ${t.border}` : 'none',
              }}
            >
              <MonoText style={{ fontSize: 11, color: t.textDim }}>{x[0]}</MonoText>
              <MonoText
                style={{
                  fontSize: 10,
                  color: x[3],
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  paddingTop: 1,
                }}
              >
                {x[1]}
              </MonoText>
              <span style={{ color: x[4] ? t.text : t.textMuted, fontSize: 12 }}>{x[2]}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <SectionLabel>On-call map</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            ['payments-team', 'Maya S.', 'Primary · acknowledged', t.accent],
            ['identity-team', 'Jordan K.', 'Escalation path', t.textMuted],
            ['platform-team', 'Eli T.', 'Infra escalation', t.textMuted],
          ].map(([team, p, role, c]) => (
            <div
              key={team}
              style={{
                background: t.panel2,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: '14px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: t.textDim,
                  fontFamily: MONO,
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: 1.3,
                }}
              >
                {team}
              </div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{p}</div>
              <div style={{ fontSize: 11, color: c, marginTop: 4 }}>{role}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { PageIncident });
