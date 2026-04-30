// Library · AI-specific + Marketing patterns + Canonical icon grid.

function SecAI() {
  return (
    <Section
      id="ai"
      title="AI-specific"
      desc="Patterns unique to ShipIt: the ask bar, streaming answers, citations, reasoning blocks, tool-call cards. These are the surfaces where the graph meets the model."
    >
      <Subsection title="Ask bar (input)">
        <Specimen>
          <div
            style={{
              width: '100%',
              maxWidth: 620,
              background: T.panel,
              border: `1px solid ${T.borderStrong}`,
              borderRadius: 14,
              padding: 14,
              boxShadow: T.shadow,
            }}
          >
            <Row gap={10} style={{ marginBottom: 10 }}>
              <span style={{ color: T.accent, fontSize: 16 }}>✦</span>
              <div style={{ flex: 1, fontSize: 14, color: T.text }}>
                Who owns payment-webhook and what's the rollback plan?
                <span
                  style={{
                    display: 'inline-block',
                    width: 1,
                    height: 16,
                    background: T.accent,
                    marginLeft: 2,
                    verticalAlign: 'middle',
                    animation: 'pulse 1s infinite',
                  }}
                />
              </div>
            </Row>
            <Row gap={6}>
              <Chip icon="@">scoped: Payments</Chip>
              <Chip icon="#" removable>
                service:payment-webhook-v2
              </Chip>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: T.textDim, fontFamily: FM }}>⌘↵</span>
              <UIBtn size="sm" variant="primary">
                Ask
              </UIBtn>
            </Row>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Copilot message (streaming)">
        <Specimen>
          <Col gap={12} style={{ width: '100%', maxWidth: 620 }}>
            <Row gap={10}>
              <Avatar size="sm" initials="MT" />
              <div
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: T.panel2,
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                Who owns payment-webhook and what's the rollback plan?
              </div>
            </Row>
            <Row gap={10} align="flex-start">
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: T.accentDim,
                  color: T.accent,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                ✦
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  background: T.panel,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                <div>
                  <strong style={{ fontWeight: 500 }}>Priya Khanna</strong> owns{' '}
                  <code style={inlineCode}>payment-webhook-v2</code>, currently on-call through
                  Friday.<sup style={{ color: T.accent, fontSize: 10, marginLeft: 2 }}>1</sup>
                </div>
                <div style={{ marginTop: 6 }}>
                  Rollback is automated — the <code style={inlineCode}>rollback.yml</code> runbook
                  reverts to the previous tag and re-queues the last 50 events.
                  <sup style={{ color: T.accent, fontSize: 10, marginLeft: 2 }}>2</sup>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 1,
                      height: 14,
                      background: T.accent,
                      marginLeft: 2,
                      verticalAlign: 'middle',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                </div>
              </div>
            </Row>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Citation chips">
        <Specimen>
          <Col gap={8}>
            <Row gap={6}>
              <span
                style={{
                  fontFamily: FM,
                  fontSize: 10,
                  color: T.accent,
                  padding: '2px 6px',
                  background: T.accentDim,
                  borderRadius: 4,
                }}
              >
                ¹
              </span>
              <div style={{ fontSize: 12, color: T.textMuted }}>
                from <code style={inlineCode}>team-roster.md</code> · notion · updated 2d ago
              </div>
            </Row>
            <Row gap={6}>
              <span
                style={{
                  fontFamily: FM,
                  fontSize: 10,
                  color: T.accent,
                  padding: '2px 6px',
                  background: T.accentDim,
                  borderRadius: 4,
                }}
              >
                ²
              </span>
              <div style={{ fontSize: 12, color: T.textMuted }}>
                from <code style={inlineCode}>runbook-oncall.md:L42</code> · github · updated 3h ago
              </div>
            </Row>
            <Row gap={6}>
              <span
                style={{
                  fontFamily: FM,
                  fontSize: 10,
                  color: T.accent,
                  padding: '2px 6px',
                  background: T.accentDim,
                  borderRadius: 4,
                }}
              >
                ³
              </span>
              <div style={{ fontSize: 12, color: T.textMuted }}>
                from <code style={inlineCode}>#payments-oncall</code> · slack · 4h ago
              </div>
            </Row>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Reasoning block (collapsible)">
        <Specimen>
          <div
            style={{
              width: '100%',
              maxWidth: 620,
              background: T.panel2,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <Row gap={10} style={{ padding: '10px 14px', cursor: 'pointer' }}>
              <span style={{ color: T.textDim, fontFamily: FM, fontSize: 11 }}>▾</span>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Reasoning · 3 steps</span>
              <span style={{ fontFamily: FM, fontSize: 10, color: T.textDim, marginLeft: 'auto' }}>
                1.8s
              </span>
            </Row>
            <div
              style={{
                padding: '0 14px 12px 36px',
                fontSize: 11,
                color: T.textMuted,
                lineHeight: 1.7,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              <div style={{ paddingTop: 10 }}>
                <span style={{ color: T.accent, fontFamily: FM, marginRight: 6 }}>1.</span>Found
                service <code style={inlineCode}>payment-webhook-v2</code> — 1 match, high
                confidence.
              </div>
              <div>
                <span style={{ color: T.accent, fontFamily: FM, marginRight: 6 }}>2.</span>Traversed{' '}
                <code style={inlineCode}>OWNED_BY</code> edge → Priya K. (person, staff-eng).
              </div>
              <div>
                <span style={{ color: T.accent, fontFamily: FM, marginRight: 6 }}>3.</span>Traversed{' '}
                <code style={inlineCode}>DOCUMENTED_IN</code> →{' '}
                <code style={inlineCode}>runbook-oncall.md</code> § Rollback.
              </div>
            </div>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Tool-call card">
        <Specimen>
          <Col gap={8} style={{ width: '100%', maxWidth: 620 }}>
            <div
              style={{
                padding: '10px 14px',
                background: T.panel,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
              }}
            >
              <Row gap={10} style={{ marginBottom: 6 }}>
                <Badge size="sm" color="accent" solid>
                  TOOL
                </Badge>
                <span style={{ fontFamily: FM, fontSize: 12, fontWeight: 500 }}>graph.query</span>
                <span
                  style={{ fontFamily: FM, fontSize: 10, color: T.textDim, marginLeft: 'auto' }}
                >
                  94ms · 142 rows
                </span>
              </Row>
              <pre
                style={{
                  margin: 0,
                  fontFamily: FM,
                  fontSize: 11,
                  color: T.textMuted,
                  lineHeight: 1.6,
                }}
              >{`match (s:Service {name: "payment-webhook-v2"})
return s.owner, s.runbook`}</pre>
            </div>
            <div
              style={{
                padding: '10px 14px',
                background: T.panel,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
              }}
            >
              <Row gap={10}>
                <Badge size="sm" color="accent" solid>
                  TOOL
                </Badge>
                <span style={{ fontFamily: FM, fontSize: 12, fontWeight: 500 }}>docs.search</span>
                <span
                  style={{ fontFamily: FM, fontSize: 10, color: T.textDim, marginLeft: 'auto' }}
                >
                  running
                  <span
                    style={{
                      display: 'inline-block',
                      width: 1,
                      height: 12,
                      background: T.accent,
                      marginLeft: 4,
                      verticalAlign: 'middle',
                      animation: 'pulse 1s infinite',
                    }}
                  />
                </span>
              </Row>
            </div>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Streaming text">
        <Specimen>
          <div
            style={{
              width: '100%',
              maxWidth: 620,
              padding: 14,
              background: T.panel,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            The rollback path reverts to the last green tag, replays any in-flight Stripe events
            from the dead-letter queue, and then
            <span
              style={{
                display: 'inline-block',
                width: 1,
                height: 14,
                background: T.accent,
                marginLeft: 2,
                verticalAlign: 'middle',
                animation: 'pulse 1s infinite',
              }}
            />
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Confidence indicator">
        <Specimen>
          <Col gap={10}>
            {[
              { v: 99.4, label: 'High', color: T.ok },
              { v: 88.2, label: 'Medium', color: T.accent },
              { v: 62.1, label: 'Low · review', color: T.warn },
              { v: 28.4, label: 'Unverified', color: T.err },
            ].map((c) => (
              <Row key={c.label} gap={10} style={{ fontSize: 11 }}>
                <div
                  style={{
                    width: 120,
                    height: 4,
                    background: T.panel2,
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${c.v}%`,
                      height: '100%',
                      background: c.color,
                      borderRadius: 999,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: FM,
                    color: T.text,
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: 44,
                  }}
                >
                  {c.v}%
                </span>
                <span style={{ color: c.color }}>{c.label}</span>
              </Row>
            ))}
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Suggestion chips">
        <Specimen>
          <Row gap={6}>
            {[
              'What depends on ledger-core?',
              'Who is on-call tonight?',
              'Recent rollbacks',
              'Services without runbooks',
            ].map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 12,
                  padding: '6px 10px',
                  background: T.panel,
                  border: `1px solid ${T.border}`,
                  borderRadius: 999,
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: T.accent, marginRight: 6 }}>✦</span>
                {s}
              </span>
            ))}
          </Row>
        </Specimen>
      </Subsection>
    </Section>
  );
}

function SecMarketing() {
  return (
    <Section
      id="marketing"
      title="Marketing patterns"
      desc="Landing-page scaffolds for the public site. Use sparingly and only on marketing surfaces — do not bring these into the app."
    >
      <Subsection title="Hero">
        <Specimen pad={40}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <Badge color="accent" dot>
              v2.0 · shipped today
            </Badge>
            <h1
              style={{
                fontSize: 56,
                lineHeight: 1.05,
                letterSpacing: -1.6,
                fontWeight: 500,
                margin: '20px 0 16px',
              }}
            >
              Your org's knowledge, <span style={{ color: T.accent }}>as a graph.</span>
            </h1>
            <p style={{ fontSize: 17, color: T.textMuted, lineHeight: 1.6, margin: '0 0 28px' }}>
              ShipIt turns repos, docs, tickets, and chat into a queryable graph — so on-call
              engineers stop asking the same question for the twelfth time.
            </p>
            <Row gap={8} style={{ justifyContent: 'center' }}>
              <UIBtn size="lg" variant="primary">
                Start free
              </UIBtn>
              <UIBtn size="lg" variant="secondary" trailing="→">
                Book a demo
              </UIBtn>
            </Row>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Feature grid">
        <Specimen>
          <Grid cols={3} gap={12} style={{ width: '100%' }}>
            {[
              {
                i: '◇',
                t: 'Live graph',
                b: 'Append-only, time-indexed. Scrub history, diff schemas, roll back extractions.',
              },
              {
                i: '✦',
                t: 'Ask anything',
                b: 'Natural-language queries over the graph — with citations back to source lines.',
              },
              {
                i: '↗',
                t: 'Ingest everything',
                b: 'GitHub, Notion, Slack, Jira, PagerDuty, Linear. All in your VPC.',
              },
              {
                i: '!',
                t: 'Incident-first',
                b: 'Pin services + runbooks. When paged, the answer is already loaded.',
              },
              {
                i: '◉',
                t: 'SOC 2 ready',
                b: 'Audit log on every query. Redactions enforced at ingest.',
              },
              { i: '▢', t: 'Open schema', b: 'Your graph, exportable. No vendor lock.' },
            ].map((f) => (
              <div
                key={f.t}
                style={{
                  padding: 20,
                  background: T.panel,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 22, color: T.accent, marginBottom: 12 }}>{f.i}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{f.t}</div>
                <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.55 }}>{f.b}</div>
              </div>
            ))}
          </Grid>
        </Specimen>
      </Subsection>

      <Subsection title="Testimonial">
        <Specimen pad={40}>
          <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 40, color: T.accent, lineHeight: 1, marginBottom: 16 }}>"</div>
            <blockquote
              style={{
                fontSize: 22,
                lineHeight: 1.45,
                letterSpacing: -0.3,
                margin: 0,
                fontWeight: 500,
              }}
            >
              ShipIt saved us an on-call rotation's worth of Slack pings in the first week. The
              graph is the source of truth we never had time to build.
            </blockquote>
            <Row gap={10} style={{ justifyContent: 'center', marginTop: 20 }}>
              <Avatar initials="PK" size="md" />
              <Col gap={0}>
                <div style={{ fontSize: 13, fontWeight: 500, textAlign: 'left' }}>Priya Khanna</div>
                <div style={{ fontSize: 11, color: T.textDim, textAlign: 'left' }}>
                  Staff Engineer, Acme Payments
                </div>
              </Col>
            </Row>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="CTA strip">
        <Specimen pad={0}>
          <div
            style={{
              width: '100%',
              padding: 40,
              background: 'linear-gradient(135deg, oklch(0.2 0.08 260), oklch(0.16 0.06 300))',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.4, margin: '0 0 10px' }}>
              Ready to graph your org?
            </h2>
            <p style={{ fontSize: 13, color: T.textMuted, margin: '0 0 20px' }}>
              Free for 14 days · no credit card · 5-minute setup.
            </p>
            <Row gap={8} style={{ justifyContent: 'center' }}>
              <UIBtn variant="primary" size="lg">
                Start free
              </UIBtn>
              <UIBtn variant="ghost" size="lg" trailing="→">
                Read the docs
              </UIBtn>
            </Row>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Footer">
        <Specimen pad={28}>
          <div style={{ width: '100%' }}>
            <Row style={{ marginBottom: 28 }}>
              <Row gap={10}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background:
                      'linear-gradient(135deg, oklch(0.82 0.12 200), oklch(0.78 0.14 300))',
                    borderRadius: 6,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 13,
                    color: '#0a0a0b',
                  }}
                >
                  ◆
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>ShipIt</span>
              </Row>
              <Row gap={24} style={{ marginLeft: 'auto', fontSize: 12, color: T.textMuted }}>
                <Col gap={6}>
                  <div
                    style={{
                      fontFamily: FM,
                      fontSize: 10,
                      color: T.textDim,
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                    }}
                  >
                    Product
                  </div>
                  <a style={{ color: 'inherit' }}>Graph</a>
                  <a style={{ color: 'inherit' }}>Ask</a>
                  <a style={{ color: 'inherit' }}>Connectors</a>
                </Col>
                <Col gap={6}>
                  <div
                    style={{
                      fontFamily: FM,
                      fontSize: 10,
                      color: T.textDim,
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                    }}
                  >
                    Company
                  </div>
                  <a style={{ color: 'inherit' }}>About</a>
                  <a style={{ color: 'inherit' }}>Careers</a>
                  <a style={{ color: 'inherit' }}>Blog</a>
                </Col>
                <Col gap={6}>
                  <div
                    style={{
                      fontFamily: FM,
                      fontSize: 10,
                      color: T.textDim,
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                    }}
                  >
                    Legal
                  </div>
                  <a style={{ color: 'inherit' }}>Privacy</a>
                  <a style={{ color: 'inherit' }}>Terms</a>
                  <a style={{ color: 'inherit' }}>Security</a>
                </Col>
              </Row>
            </Row>
            <div
              style={{
                paddingTop: 16,
                borderTop: `1px solid ${T.border}`,
                display: 'flex',
                fontSize: 11,
                color: T.textDim,
                fontFamily: FM,
              }}
            >
              <span>© 2026 ShipIt, Inc.</span>
              <span style={{ marginLeft: 'auto' }}>made with care · san francisco</span>
            </div>
          </div>
        </Specimen>
      </Subsection>
    </Section>
  );
}

function SecIcons() {
  const glyphs = [
    { g: '◆', n: 'brand' },
    { g: '◇', n: 'service' },
    { g: '○', n: 'person' },
    { g: '▤', n: 'document' },
    { g: '▢', n: 'file' },
    { g: '↑', n: 'deploy' },
    { g: '↓', n: 'download' },
    { g: '→', n: 'next' },
    { g: '←', n: 'prev' },
    { g: '✦', n: 'ask / ai' },
    { g: '✓', n: 'confirm' },
    { g: '×', n: 'close' },
    { g: '+', n: 'add' },
    { g: '−', n: 'remove' },
    { g: '⌕', n: 'search' },
    { g: '⌘', n: 'cmd' },
    { g: '⚙', n: 'settings' },
    { g: '⋯', n: 'more' },
    { g: '!', n: 'warn / incident' },
    { g: '?', n: 'help' },
    { g: '⌂', n: 'home' },
    { g: '◱', n: 'fit-view' },
    { g: '▸', n: 'expand' },
    { g: '▾', n: 'collapse' },
    { g: '↗', n: 'external' },
    { g: '@', n: 'mention' },
    { g: '#', n: 'tag' },
    { g: '~', n: 'approx' },
    { g: '↵', n: 'enter' },
    { g: '⇧', n: 'shift' },
    { g: '⌥', n: 'option' },
    { g: '⎋', n: 'escape' },
    { g: '⏻', n: 'power' },
    { g: '◉', n: 'live / record' },
    { g: '◐', n: 'half' },
    { g: '▪', n: 'dot' },
    { g: '≡', n: 'menu' },
    { g: '⇅', n: 'sort' },
    { g: '∞', n: 'infinite' },
    { g: '§', n: 'section' },
    { g: '‹', n: 'left' },
    { g: '›', n: 'right' },
  ];
  const connectors = [
    { n: 'GitHub', g: '⎈' },
    { n: 'Notion', g: 'N' },
    { n: 'Slack', g: '#' },
    { n: 'Linear', g: 'L' },
    { n: 'Jira', g: 'J' },
    { n: 'PagerDuty', g: 'P' },
    { n: 'Confluence', g: 'C' },
    { n: 'GDrive', g: 'G' },
    { n: 'S3', g: 'S' },
    { n: 'Postgres', g: 'Ψ' },
  ];

  return (
    <Section
      id="icons"
      title="Iconography"
      desc="Our glyph vocabulary is a mix of typographic symbols and pictographs — rendered at text weight, monochromatic, always centered in a generous square. Never tinted, never gradient."
    >
      <Subsection title="Full glyph inventory">
        <Specimen pad={18}>
          <Grid cols={8} gap={8} style={{ width: '100%' }}>
            {glyphs.map((x) => (
              <Col
                key={x.g + x.n}
                gap={4}
                style={{
                  alignItems: 'center',
                  padding: '10px 6px',
                  background: T.panel2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 22, color: T.text, lineHeight: 1 }}>{x.g}</div>
                <div style={{ fontSize: 9, color: T.textDim, fontFamily: FM, textAlign: 'center' }}>
                  {x.n}
                </div>
              </Col>
            ))}
          </Grid>
        </Specimen>
      </Subsection>

      <Subsection title="Connector icons">
        <Specimen>
          <Grid cols={5} gap={10} style={{ width: '100%' }}>
            {connectors.map((c) => (
              <Row
                key={c.n}
                gap={10}
                style={{
                  padding: '10px 12px',
                  background: T.panel,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
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
                    fontFamily: FM,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {c.g}
                </div>
                <span style={{ fontSize: 12 }}>{c.n}</span>
              </Row>
            ))}
          </Grid>
        </Specimen>
      </Subsection>

      <Subsection title="Icon sizes">
        <Specimen>
          <Row gap={18} align="center">
            {[12, 14, 16, 20, 24, 32, 48].map((s) => (
              <Col key={s} gap={4} style={{ alignItems: 'center' }}>
                <div style={{ fontSize: s, color: T.text }}>✦</div>
                <span style={{ fontSize: 9, color: T.textDim, fontFamily: FM }}>{s}px</span>
              </Col>
            ))}
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Icon treatments">
        <Specimen>
          <Row gap={14}>
            {[
              { label: 'plain', node: <span style={{ fontSize: 20 }}>✦</span> },
              { label: 'muted', node: <span style={{ fontSize: 20, color: T.textDim }}>✦</span> },
              { label: 'accent', node: <span style={{ fontSize: 20, color: T.accent }}>✦</span> },
              {
                label: 'in chip',
                node: (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: T.panel2,
                      border: `1px solid ${T.border}`,
                      display: 'grid',
                      placeItems: 'center',
                      color: T.accent,
                    }}
                  >
                    ✦
                  </div>
                ),
              },
              {
                label: 'in circle',
                node: (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: T.accentDim,
                      color: T.accent,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    ✦
                  </div>
                ),
              },
              {
                label: 'glowing',
                node: (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: T.panel,
                      border: `1.5px solid ${T.accent}`,
                      boxShadow: `0 0 20px ${T.accentGlow}`,
                      color: T.accent,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 16,
                    }}
                  >
                    ✦
                  </div>
                ),
              },
            ].map((t) => (
              <Col key={t.label} gap={4} style={{ alignItems: 'center' }}>
                {t.node}
                <span style={{ fontSize: 10, color: T.textDim, fontFamily: FM }}>{t.label}</span>
              </Col>
            ))}
          </Row>
        </Specimen>
      </Subsection>
    </Section>
  );
}

Object.assign(window, { SecAI, SecMarketing, SecIcons });
