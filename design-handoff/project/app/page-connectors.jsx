// Connector Hub — list connected + available.

function PageConnectors({ nav }) {
  const t = useTheme();
  const [selected, setSelected] = React.useState('datadog');
  const sel = CONNECTORS.find((c) => c.id === selected);
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px 40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 22,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: t.textDim,
                fontFamily: MONO,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              7 connected · 2 issues
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.7 }}>Connector Hub</div>
            <div style={{ color: t.textMuted, marginTop: 6, fontSize: 13 }}>
              Data sources feeding the graph. Each connector normalizes into the unified schema via
              PropertyClaims.
            </div>
          </div>
          <Btn primary>+ Add connector</Btn>
        </div>

        <SectionLabel>Connected</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 28,
          }}
        >
          {CONNECTORS.map((c) => {
            const active = selected === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelected(c.id)}
                style={{
                  background: t.panel,
                  border: `1px solid ${active ? t.borderStrong : t.border}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: t.panel2,
                      border: `1px solid ${t.border}`,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 14,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div style={{ fontWeight: 500 }}>{c.name}</div>
                  <StatusDot status={c.status} />
                  <div
                    style={{ marginLeft: 'auto', fontSize: 10, color: t.textDim, fontFamily: MONO }}
                  >
                    {c.lastSync}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 14,
                    fontSize: 11,
                    color: t.textMuted,
                    fontFamily: MONO,
                  }}
                >
                  <span>{c.items}</span>
                  <span>·</span>
                  <span>{c.rate}</span>
                  {c.note && (
                    <span
                      style={{
                        color: c.status === 'degraded' ? t.warn : t.err,
                        marginLeft: 'auto',
                      }}
                    >
                      {c.note}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    height: 3,
                    background: t.panel2,
                    borderRadius: 999,
                    overflow: 'hidden',
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      width: `${c.pct}%`,
                      height: '100%',
                      background:
                        c.status === 'healthy' ? t.ok : c.status === 'degraded' ? t.warn : t.err,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <SectionLabel>Available</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {AVAILABLE_CONNECTORS.map((c) => (
            <div
              key={c.id}
              style={{
                background: t.panel,
                border: `1px dashed ${t.borderStrong}`,
                borderRadius: 10,
                padding: '14px 16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 10 }}>{c.desc}</div>
              <div style={{ fontSize: 11, color: t.accent, fontFamily: MONO }}>+ connect</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div
          style={{
            width: 340,
            borderLeft: `1px solid ${t.border}`,
            background: t.panel,
            padding: 20,
            overflow: 'auto',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: t.panel2,
                border: `1px solid ${t.border}`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 16,
              }}
            >
              {sel.icon}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{sel.name}</div>
              <div
                style={{
                  fontSize: 11,
                  color: t.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <StatusDot status={sel.status} /> {sel.status}
              </div>
            </div>
            <Btn small ghost style={{ marginLeft: 'auto' }}>
              ⚙
            </Btn>
          </div>

          <SectionLabel>Sync</SectionLabel>
          <Card style={{ background: t.panel2, marginBottom: 16 }} pad={12}>
            <PropRow k="last sync" v={sel.lastSync} />
            <PropRow k="rate" v={sel.rate} />
            <PropRow k="items" v={sel.items} />
            <PropRow k="status" v={sel.status} accent={sel.status === 'healthy'} />
            <PropRow k="coverage" v={`${sel.pct}%`} last />
          </Card>

          {sel.note && (
            <div
              style={{
                background: `${sel.status === 'error' ? t.err : t.warn}11`,
                border: `1px solid ${sel.status === 'error' ? t.err : t.warn}44`,
                borderRadius: 6,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: sel.status === 'error' ? t.err : t.warn,
                  fontFamily: MONO,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Issue
              </div>
              <div style={{ fontSize: 12 }}>{sel.note}</div>
              <Btn small style={{ marginTop: 10 }}>
                Retry sync
              </Btn>
            </div>
          )}

          <SectionLabel>Schema mapping</SectionLabel>
          <Card style={{ background: t.panel2, marginBottom: 16 }} pad={12}>
            {[
              ['monitor.service_name', 'LogicalService.name'],
              ['monitor.tags.tier', 'LogicalService.tier'],
              ['monitor.tags.team', 'LogicalService.owner'],
              ['monitor.slo', 'Monitor.sla'],
            ].map(([from, to], i) => (
              <div
                key={from}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 0',
                  borderTop: i ? `1px solid ${t.border}` : 'none',
                  fontFamily: MONO,
                  fontSize: 11,
                }}
              >
                <span style={{ color: t.textMuted, flex: 1 }}>{from}</span>
                <span style={{ color: t.textDim }}>→</span>
                <span style={{ color: t.accent, flex: 1 }}>{to}</span>
              </div>
            ))}
          </Card>

          <SectionLabel>Recent events</SectionLabel>
          <div style={{ fontFamily: MONO, fontSize: 11, lineHeight: 1.8, color: t.textMuted }}>
            <div>
              <span style={{ color: t.textDim }}>14m</span> rate-limited (429)
            </div>
            <div>
              <span style={{ color: t.textDim }}>22m</span> synced 12 monitors
            </div>
            <div>
              <span style={{ color: t.textDim }}>34m</span> synced 28 monitors
            </div>
            <div>
              <span style={{ color: t.textDim }}>1h</span> rate-limited (429)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PageConnectors });
