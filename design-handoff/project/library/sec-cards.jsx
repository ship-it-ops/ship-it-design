// Library · Cards (stat, entity, profile, pricing, media, metric, action, compact/expanded).

function SecCards() {
  return (
    <Section
      id="cards"
      title="Cards"
      desc="Standardized containers for distinct chunks of content. Every card has the same base chrome (panel bg, 1px border, 12–14px radius). Variation comes from what's inside."
    >
      <Subsection title="Stat / Metric cards">
        <Specimen>
          <Grid cols={4} gap={12} style={{ width: '100%' }}>
            {[
              { label: 'Entities', value: '12,408', delta: '+284 today', positive: true },
              { label: 'Relations', value: '28,104', delta: '+812 today', positive: true },
              { label: 'Sources live', value: '4 / 6', delta: '2 pending', positive: false },
              { label: 'Avg confidence', value: '92.4%', delta: '−0.3%', positive: false },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: T.panel,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: FM,
                    fontSize: 10,
                    color: T.textDim,
                    textTransform: 'uppercase',
                    letterSpacing: 1.4,
                    marginBottom: 8,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: FM,
                    fontSize: 26,
                    fontWeight: 500,
                    letterSpacing: -0.5,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: s.positive ? T.ok : T.textMuted,
                    marginTop: 6,
                    fontFamily: FM,
                  }}
                >
                  {s.delta}
                </div>
              </div>
            ))}
          </Grid>
        </Specimen>
      </Subsection>

      <Subsection title="Entity card (ShipIt)">
        <Specimen>
          <Grid cols={2} gap={12} style={{ width: '100%' }}>
            {[
              {
                type: 'service',
                icon: '◇',
                title: 'payment-webhook-v2',
                sub: 'node · owned by Payments',
                stats: [
                  ['Files', '28'],
                  ['Owners', '4'],
                  ['Relations', '142'],
                ],
              },
              {
                type: 'person',
                icon: '○',
                title: 'Priya Khanna',
                sub: 'person · Staff · on-call',
                stats: [
                  ['Services', '4'],
                  ['Answers', '142'],
                  ['PRs', '28'],
                ],
              },
            ].map((e, i) => (
              <div
                key={i}
                style={{
                  background: T.panel,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <Row style={{ marginBottom: 14 }} gap={10}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: T.panel2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 16,
                      color: T.accent,
                    }}
                  >
                    {e.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM }}>{e.sub}</div>
                  </div>
                  <IconBtn size="sm" variant="ghost" icon="⋯" />
                </Row>
                <Row gap={20} style={{ paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                  {e.stats.map(([k, v]) => (
                    <div key={k}>
                      <div
                        style={{
                          fontFamily: FM,
                          fontSize: 9,
                          color: T.textDim,
                          textTransform: 'uppercase',
                          letterSpacing: 1.2,
                        }}
                      >
                        {k}
                      </div>
                      <div
                        style={{
                          fontFamily: FM,
                          fontSize: 16,
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </Row>
              </div>
            ))}
          </Grid>
        </Specimen>
      </Subsection>

      <Subsection title="Profile card">
        <Specimen>
          <div
            style={{
              background: T.panel,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 20,
              width: 320,
            }}
          >
            <Row gap={14} style={{ marginBottom: 14 }}>
              <Avatar initials="PK" size="xl" status="ok" />
              <Col gap={3} style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Priya Khanna</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>Staff Engineer · Payments</div>
                <Row gap={6} style={{ marginTop: 4 }}>
                  <Badge color="ok" size="sm" dot>
                    on-call
                  </Badge>
                  <Badge color="accent" size="sm">
                    team-lead
                  </Badge>
                </Row>
              </Col>
            </Row>
            <Row gap={6}>
              <UIBtn size="sm" variant="primary">
                Message
              </UIBtn>
              <UIBtn size="sm" variant="secondary">
                View graph
              </UIBtn>
              <IconBtn size="sm" icon="⋯" />
            </Row>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Action card (click-through)">
        <Specimen>
          <Grid cols={3} gap={12} style={{ width: '100%' }}>
            {[
              {
                icon: '✦',
                title: 'Ask anything',
                body: 'Natural-language queries over your graph',
                accent: true,
              },
              { icon: '◇', title: 'Browse graph', body: 'Pan, zoom, and filter 12K+ entities' },
              { icon: '↗', title: 'Add a source', body: 'Connect Notion, Slack, Jira, and more' },
            ].map((a, i) => (
              <div
                key={i}
                style={{
                  background: a.accent ? T.accentDim : T.panel,
                  border: `1px solid ${a.accent ? T.accent : T.border}`,
                  borderRadius: 10,
                  padding: 18,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{ fontSize: 22, color: a.accent ? T.accent : T.text, marginBottom: 12 }}
                >
                  {a.icon}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 4,
                    color: a.accent ? T.accent : T.text,
                  }}
                >
                  {a.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: a.accent ? T.accent : T.textMuted,
                    lineHeight: 1.5,
                    opacity: a.accent ? 0.8 : 1,
                  }}
                >
                  {a.body}
                </div>
              </div>
            ))}
          </Grid>
        </Specimen>
      </Subsection>

      <Subsection title="Media card">
        <Specimen>
          <div
            style={{
              background: T.panel,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              overflow: 'hidden',
              width: 320,
            }}
          >
            <div
              style={{
                height: 140,
                background: 'linear-gradient(135deg, oklch(0.3 0.06 260), oklch(0.22 0.08 300))',
                position: 'relative',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="100" height="60" viewBox="0 0 100 60" style={{ opacity: 0.7 }}>
                <circle cx="15" cy="15" r="6" fill={T.accent} />
                <circle cx="50" cy="30" r="8" fill={T.accent} />
                <circle cx="85" cy="15" r="5" fill={T.accent} />
                <circle cx="30" cy="50" r="5" fill={T.accent} />
                <circle cx="75" cy="50" r="6" fill={T.accent} />
                <line
                  x1="15"
                  y1="15"
                  x2="50"
                  y2="30"
                  stroke={T.accent}
                  strokeWidth="1"
                  opacity="0.5"
                />
                <line
                  x1="85"
                  y1="15"
                  x2="50"
                  y2="30"
                  stroke={T.accent}
                  strokeWidth="1"
                  opacity="0.5"
                />
                <line
                  x1="30"
                  y1="50"
                  x2="50"
                  y2="30"
                  stroke={T.accent}
                  strokeWidth="1"
                  opacity="0.5"
                />
                <line
                  x1="75"
                  y1="50"
                  x2="50"
                  y2="30"
                  stroke={T.accent}
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>
              <Badge
                color="accent"
                size="sm"
                solid
                style={{ position: 'absolute', top: 12, left: 12 }}
              >
                GRAPH
              </Badge>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Service topology</div>
              <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                A live diagram of the services that handle payment events, from webhook ingress to
                the ledger.
              </div>
              <Row style={{ marginTop: 12, justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: T.textDim, fontFamily: FM }}>
                  updated 4m ago
                </span>
                <span style={{ fontSize: 11, color: T.accent }}>Open →</span>
              </Row>
            </div>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Pricing card">
        <Specimen>
          <Grid cols={3} gap={12} style={{ width: '100%' }}>
            {[
              {
                name: 'Starter',
                price: '0',
                cta: 'Try free',
                list: ['1 workspace', '2 connectors', '1K entities', 'Community support'],
              },
              {
                name: 'Team',
                price: '29',
                cta: 'Start trial',
                list: ['Unlimited workspaces', 'All connectors', '100K entities', 'Slack support'],
                featured: true,
              },
              {
                name: 'Enterprise',
                price: 'Contact',
                cta: 'Book a call',
                list: ['On-prem option', 'SOC 2 audit log', 'Unlimited entities', 'Dedicated SE'],
              },
            ].map((p) => (
              <div
                key={p.name}
                style={{
                  background: p.featured ? T.accentDim : T.panel,
                  border: `1px solid ${p.featured ? T.accent : T.border}`,
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: FM,
                    fontSize: 10,
                    color: p.featured ? T.accent : T.textDim,
                    textTransform: 'uppercase',
                    letterSpacing: 1.4,
                    marginBottom: 10,
                  }}
                >
                  {p.name}
                </div>
                <Row align="baseline" gap={4} style={{ marginBottom: 12 }}>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 500,
                      letterSpacing: -0.8,
                      color: p.featured ? T.accent : T.text,
                    }}
                  >
                    ${p.price}
                  </span>
                  {p.price !== 'Contact' && (
                    <span style={{ fontSize: 12, color: T.textMuted }}>/ seat / mo</span>
                  )}
                </Row>
                <Col gap={6} style={{ marginBottom: 16 }}>
                  {p.list.map((l) => (
                    <Row key={l} gap={8} style={{ fontSize: 12, color: T.textMuted }}>
                      <span style={{ color: p.featured ? T.accent : T.ok }}>✓</span>
                      <span>{l}</span>
                    </Row>
                  ))}
                </Col>
                <UIBtn
                  variant={p.featured ? 'primary' : 'secondary'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {p.cta}
                </UIBtn>
              </div>
            ))}
          </Grid>
        </Specimen>
      </Subsection>

      <Subsection title="Compact / list-row card">
        <Specimen>
          <Col gap={6} style={{ width: '100%' }}>
            {[
              {
                icon: '◇',
                title: 'payment-webhook-v2',
                meta: 'service · 28 files',
                right: '142 ←',
              },
              { icon: '◇', title: 'ledger-core', meta: 'service · 94 files', right: '211 ←' },
              { icon: '◇', title: 'notify-dispatch', meta: 'service · 14 files', right: '48 ←' },
            ].map((r, i) => (
              <Row
                key={i}
                gap={12}
                style={{
                  padding: '10px 14px',
                  background: T.panel,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: T.panel2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 6,
                    display: 'grid',
                    placeItems: 'center',
                    color: T.accent,
                    fontSize: 14,
                  }}
                >
                  {r.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM }}>{r.meta}</div>
                </div>
                <span style={{ fontFamily: FM, fontSize: 11, color: T.textMuted }}>{r.right}</span>
              </Row>
            ))}
          </Col>
        </Specimen>
      </Subsection>
    </Section>
  );
}

Object.assign(window, { SecCards });
