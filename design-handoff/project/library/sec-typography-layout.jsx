// Library · Typography specimen + Layout primitives.

function SecTypography() {
  return (
    <Section
      id="typography"
      title="Typography"
      desc="Geist for UI, Geist Mono for data, tokens, and diagnostic text. Complete hierarchy from display to caption, plus editorial elements."
    >
      <Subsection title="Display & headings">
        <Specimen pad={28} wrap="nowrap" align="flex-start">
          <Col gap={20} style={{ flex: 1 }}>
            <div>
              <StateLabel>display · 56/60 · 500 · -1.5</StateLabel>
              <div style={{ fontSize: 56, lineHeight: 1.08, letterSpacing: -1.5, fontWeight: 500 }}>
                Graph your org.
              </div>
            </div>
            <div>
              <StateLabel>h1 · 40/44 · 500 · -0.8</StateLabel>
              <div style={{ fontSize: 40, lineHeight: 1.1, letterSpacing: -0.8, fontWeight: 500 }}>
                The answer exists. We find it.
              </div>
            </div>
            <div>
              <StateLabel>h2 · 28/34 · 500 · -0.4</StateLabel>
              <div style={{ fontSize: 28, lineHeight: 1.2, letterSpacing: -0.4, fontWeight: 500 }}>
                Connect a source to begin.
              </div>
            </div>
            <div>
              <StateLabel>h3 · 20/28 · 500 · -0.2</StateLabel>
              <div style={{ fontSize: 20, lineHeight: 1.4, letterSpacing: -0.2, fontWeight: 500 }}>
                Schema preview
              </div>
            </div>
            <div>
              <StateLabel>h4 · 16/24 · 500</StateLabel>
              <div style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 500 }}>
                Team members with access
              </div>
            </div>
            <div>
              <StateLabel>h5 · 14/20 · 500</StateLabel>
              <div style={{ fontSize: 14, lineHeight: 1.4, fontWeight: 500 }}>Recently queried</div>
            </div>
            <div>
              <StateLabel>h6 · 12/16 · 500 · uppercase · 1.4</StateLabel>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.3,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 1.4,
                }}
              >
                Sources
              </div>
            </div>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Body & prose">
        <Specimen pad={28}>
          <Col gap={18} style={{ maxWidth: 620 }}>
            <div>
              <StateLabel>lead · 18/28</StateLabel>
              <p style={{ fontSize: 18, lineHeight: 1.55, color: T.textMuted, margin: 0 }}>
                ShipIt turns your repos, docs, tickets, and Slack into a living graph — so on-call
                engineers stop re-asking the same questions every incident.
              </p>
            </div>
            <div>
              <StateLabel>body · 14/22</StateLabel>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Every connector emits entities and relations. The graph is append-only and
                time-indexed, so you can scrub history. Nothing is ever silently reshaped —
                migrations run as explicit operations you can review and roll back.
              </p>
            </div>
            <div>
              <StateLabel>small · 13/20</StateLabel>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: T.textMuted, margin: 0 }}>
                Connectors run in your VPC by default. Raw content never leaves your perimeter; only
                derived entities and redacted spans are persisted in the graph store.
              </p>
            </div>
            <div>
              <StateLabel>caption · 11/16 · mono</StateLabel>
              <p
                style={{
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: T.textDim,
                  fontFamily: FM,
                  margin: 0,
                }}
              >
                updated 2m ago · synced via github-app@v4.2
              </p>
            </div>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Editorial elements">
        <Specimen pad={28}>
          <Col gap={22} style={{ maxWidth: 620 }}>
            <div>
              <StateLabel>blockquote</StateLabel>
              <blockquote
                style={{
                  margin: 0,
                  paddingLeft: 16,
                  borderLeft: `2px solid ${T.accent}`,
                  fontSize: 15,
                  lineHeight: 1.55,
                  fontStyle: 'italic',
                  color: T.textMuted,
                }}
              >
                Before ShipIt, answering "who owns the payment webhook?" took 20 minutes and two
                Slack pings. Now it's a single question.
              </blockquote>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 6 }}>
                — Priya K, Staff Engineer
              </div>
            </div>

            <div>
              <StateLabel>unordered list</StateLabel>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
                <li>Entities are typed and immutable</li>
                <li>Relations carry provenance and confidence</li>
                <li>Every query returns cited source spans</li>
              </ul>
            </div>

            <div>
              <StateLabel>ordered list</StateLabel>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
                <li>Connect a source</li>
                <li>Review the extracted schema</li>
                <li>Ask your first question</li>
              </ol>
            </div>

            <div>
              <StateLabel>inline code · kbd · link</StateLabel>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Run{' '}
                <code
                  style={{
                    background: T.panel2,
                    padding: '1px 6px',
                    borderRadius: 4,
                    fontFamily: FM,
                    fontSize: 12,
                  }}
                >
                  shipit sync --force
                </code>{' '}
                or press{' '}
                <kbd
                  style={{
                    background: T.panel,
                    border: `1px solid ${T.border}`,
                    borderBottom: `2px solid ${T.border}`,
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontFamily: FM,
                    fontSize: 11,
                  }}
                >
                  ⌘ R
                </kbd>{' '}
                to refresh.{' '}
                <a style={{ color: T.accent, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Read the docs →
                </a>
              </p>
            </div>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Weights × families">
        <Specimen pad={24}>
          <Col gap={8} style={{ fontSize: 22, lineHeight: 1.3 }}>
            <div style={{ fontWeight: 300 }}>Light 300 — The quick brown fox</div>
            <div style={{ fontWeight: 400 }}>Regular 400 — The quick brown fox</div>
            <div style={{ fontWeight: 500 }}>Medium 500 — The quick brown fox</div>
            <div style={{ fontWeight: 600 }}>Semibold 600 — The quick brown fox</div>
            <div style={{ fontWeight: 700 }}>Bold 700 — The quick brown fox</div>
            <div style={{ fontFamily: FM, fontWeight: 400, marginTop: 8 }}>
              Mono Regular — query_01.graphql
            </div>
            <div style={{ fontFamily: FM, fontWeight: 500 }}>Mono Medium — query_01.graphql</div>
            <div style={{ fontFamily: FM, fontWeight: 600 }}>Mono Semibold — query_01.graphql</div>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Numeric specimens">
        <Specimen pad={24}>
          <Row gap={32} align="baseline">
            <div>
              <div
                style={{
                  fontFamily: FM,
                  fontSize: 48,
                  fontWeight: 500,
                  letterSpacing: -1.5,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                14,219
              </div>
              <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM, marginTop: 4 }}>
                entities · mono 48
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: FM,
                  fontSize: 32,
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                92.4%
              </div>
              <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM, marginTop: 4 }}>
                uptime · mono 32
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: FM,
                  fontSize: 22,
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                00:04:21
              </div>
              <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM, marginTop: 4 }}>
                duration · mono 22
              </div>
            </div>
          </Row>
        </Specimen>
      </Subsection>
    </Section>
  );
}

function SecLayout() {
  return (
    <Section
      id="layout"
      title="Layout primitives"
      desc="Container widths, grid, stacks, dividers, and split-pane scaffolds. These are the bones — compose everything else inside them."
    >
      <Subsection title="Container widths">
        <Specimen bg={T.bg} pad={0}>
          <Col gap={1} style={{ width: '100%' }}>
            {[
              { label: 'xs · 480', w: 480 },
              { label: 'sm · 640', w: 640 },
              { label: 'md · 800', w: 800 },
              { label: 'lg · 1024', w: 1024 },
              { label: 'xl · 1280', w: 1280 },
            ].map((c) => (
              <div
                key={c.w}
                style={{
                  position: 'relative',
                  height: 32,
                  background: T.panel,
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    width: Math.min(c.w / 2, 560),
                    height: '100%',
                    background: T.accentDim,
                    borderRight: `1px solid ${T.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 10,
                    fontSize: 11,
                    fontFamily: FM,
                    color: T.accent,
                  }}
                >
                  {c.label}
                </div>
              </div>
            ))}
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Grid (12-col)">
        <Specimen>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 8,
              width: '100%',
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 48,
                  background: T.panel2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 4,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 10,
                  fontFamily: FM,
                  color: T.textDim,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Stack, divider, section">
        <Specimen>
          <Col gap={10} style={{ width: 420 }}>
            <div
              style={{
                padding: 12,
                background: T.panel2,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              Stack item 1
            </div>
            <div
              style={{
                padding: 12,
                background: T.panel2,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              Stack item 2
            </div>
            <div style={{ height: 1, background: T.border, margin: '4px 0' }} />
            <div
              style={{
                padding: 12,
                background: T.panel2,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              After divider
            </div>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Split pane (resizable)">
        <Specimen pad={0}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: 180,
              background: T.bg,
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <div style={{ flex: 1, padding: 16, fontSize: 12, color: T.textMuted }}>
              Left pane · graph canvas
            </div>
            <div
              style={{ width: 6, background: T.border, cursor: 'col-resize', position: 'relative' }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 2,
                  height: 24,
                  background: T.borderStrong,
                  borderRadius: 999,
                }}
              />
            </div>
            <div
              style={{
                width: 260,
                padding: 16,
                fontSize: 12,
                color: T.textMuted,
                background: T.panel,
              }}
            >
              Right pane · inspector
            </div>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Spacing scale (4pt)">
        <Specimen>
          <Col gap={8}>
            {[4, 8, 12, 16, 24, 32, 48, 64].map((s) => (
              <Row key={s} gap={16}>
                <span style={{ fontFamily: FM, fontSize: 11, color: T.textDim, width: 36 }}>
                  {s}px
                </span>
                <div style={{ height: 10, width: s, background: T.accent, borderRadius: 2 }} />
              </Row>
            ))}
          </Col>
        </Specimen>
      </Subsection>
    </Section>
  );
}

Object.assign(window, { SecTypography, SecLayout });
