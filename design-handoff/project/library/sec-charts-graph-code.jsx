// Library · Charts, Graph-specific, Code specimens.

function Spark({ values, color = T.accent, height = 28, width = 120, fill }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {fill && <polygon points={`0,${height} ${points} ${width},${height}`} fill={color} opacity="0.15"/>}
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function SecCharts() {
  const line = [8, 12, 10, 14, 18, 16, 22, 20, 26, 24, 30, 28, 34, 38];
  const bars = [42, 68, 54, 82, 76, 94, 88];
  return (
    <Section id="charts" title="Charts (stylized)" desc="Graph-flavored visualizations. Minimal axes, thin strokes, accent for primary series, neutrals for context. Real dashboards stay restrained — one accent color carries the eye.">

      <Subsection title="Sparklines">
        <Specimen>
          <Grid cols={4} gap={12} style={{ width: '100%' }}>
            {[
              { label: 'Queries / hr',   value: '182', spark: line, color: T.accent },
              { label: 'Avg latency',    value: '94ms', spark: [...line].reverse(), color: T.ok },
              { label: 'Error rate',     value: '0.2%', spark: line.map(v => v * 0.3 + Math.random() * 2), color: T.warn },
              { label: 'Entities / day', value: '284', spark: line, color: 'var(--purple)' },
            ].map(s => (
              <div key={s.label} style={{ padding: 14, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ fontFamily: FM, fontSize: 10, color: T.textDim, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: FM, fontSize: 20, fontWeight: 500, marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                <Spark values={s.spark} color={s.color} fill width={160} height={32}/>
              </div>
            ))}
          </Grid>
        </Specimen>
      </Subsection>

      <Subsection title="Line chart">
        <Specimen>
          <div style={{ width: '100%', padding: 20, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10 }}>
            <Row style={{ marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Queries per hour</div>
                <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM }}>last 14 hours · 3 sources</div>
              </div>
              <Row gap={12} style={{ marginLeft: 'auto', fontSize: 11, color: T.textMuted }}>
                <Row gap={6}><div style={{ width: 10, height: 2, background: T.accent }}/><span>graph</span></Row>
                <Row gap={6}><div style={{ width: 10, height: 2, background: 'var(--purple)' }}/><span>ask</span></Row>
                <Row gap={6}><div style={{ width: 10, height: 2, background: T.textDim }}/><span>search</span></Row>
              </Row>
            </Row>
            <svg width="100%" height="160" viewBox="0 0 480 160" preserveAspectRatio="none">
              {[0, 1, 2, 3].map(i => <line key={i} x1="0" y1={i * 40} x2="480" y2={i * 40} stroke={T.border} strokeWidth="1"/>)}
              <polyline fill="none" stroke={T.accent} strokeWidth="2" points="0,120 34,110 68,115 102,95 136,100 170,75 204,80 238,55 272,62 306,40 340,48 374,28 408,32 442,12 476,18"/>
              <polyline fill="none" stroke="var(--purple)" strokeWidth="1.5" points="0,140 34,130 68,135 102,120 136,125 170,110 204,108 238,90 272,94 306,78 340,80 374,65 408,68 442,55 476,58"/>
              <polyline fill="none" stroke={T.textDim} strokeWidth="1.5" strokeDasharray="3 3" points="0,150 34,148 68,152 102,145 136,142 170,140 204,138 238,132 272,130 306,125 340,123 374,118 408,115 442,110 476,108"/>
            </svg>
            <Row style={{ marginTop: 8, fontSize: 10, color: T.textDim, fontFamily: FM }}>
              <span>9am</span><span style={{ marginLeft: 'auto' }}>12pm</span><span style={{ marginLeft: 'auto' }}>3pm</span><span style={{ marginLeft: 'auto' }}>6pm</span><span style={{ marginLeft: 'auto' }}>now</span>
            </Row>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Bar chart">
        <Specimen>
          <div style={{ width: '100%', padding: 20, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Extractions per day</div>
            <Row gap={10} style={{ alignItems: 'flex-end', height: 140 }}>
              {bars.map((b, i) => (
                <Col key={i} gap={6} style={{ flex: 1, alignItems: 'center' }}>
                  <div style={{ width: '100%', height: `${b}%`, background: i === 5 ? T.accent : T.panel2, borderRadius: 3, position: 'relative' }}>
                    {i === 5 && <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontFamily: FM, fontSize: 10, color: T.accent }}>{b * 12}</div>}
                  </div>
                  <span style={{ fontFamily: FM, fontSize: 10, color: T.textDim }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                </Col>
              ))}
            </Row>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Donut">
        <Specimen>
          <Row gap={24} align="center">
            {[
              { label: 'Entity composition', data: [['Services', 42, T.accent], ['People', 18, 'var(--purple)'], ['Docs', 28, 'var(--pink)'], ['Deploys', 12, T.ok]] },
            ].map((d, idx) => {
              let acc = 0;
              const r = 42, c = 2 * Math.PI * r;
              return (
                <Row key={idx} gap={18} style={{ padding: 20, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={r} fill="none" stroke={T.panel2} strokeWidth="14"/>
                    {d.data.map(([, v, color], i) => {
                      const len = (v / 100) * c;
                      const off = (acc / 100) * c;
                      acc += v;
                      return <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="14" strokeDasharray={`${len} ${c}`} strokeDashoffset={-off} transform="rotate(-90 50 50)"/>;
                    })}
                    <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="500" fill={T.text} fontFamily={FM}>12.4K</text>
                    <text x="50" y="62" textAnchor="middle" fontSize="9" fill={T.textDim}>entities</text>
                  </svg>
                  <Col gap={6}>
                    {d.data.map(([label, v, color]) => (
                      <Row key={label} gap={8} style={{ fontSize: 11 }}>
                        <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }}/>
                        <span style={{ flex: 1, color: T.textMuted }}>{label}</span>
                        <span style={{ fontFamily: FM, color: T.text, fontVariantNumeric: 'tabular-nums' }}>{v}%</span>
                      </Row>
                    ))}
                  </Col>
                </Row>
              );
            })}
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Heatmap (activity)">
        <Specimen>
          <div style={{ padding: 20, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12 }}>Query activity · last 12 weeks</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
              {Array.from({ length: 7 * 12 }).map((_, i) => {
                const intensity = Math.random();
                const bg = intensity < 0.2 ? T.panel2 : intensity < 0.4 ? 'oklch(0.5 0.08 200 / 0.3)' : intensity < 0.65 ? 'oklch(0.65 0.1 200 / 0.55)' : intensity < 0.85 ? 'oklch(0.75 0.12 200 / 0.8)' : T.accent;
                return <div key={i} style={{ aspectRatio: '1 / 1', background: bg, borderRadius: 2 }}/>;
              })}
            </div>
            <Row gap={4} style={{ marginTop: 10, fontSize: 10, color: T.textDim, fontFamily: FM, alignItems: 'center' }}>
              <span>less</span>
              {[T.panel2, 'oklch(0.5 0.08 200 / 0.3)', 'oklch(0.65 0.1 200 / 0.55)', 'oklch(0.75 0.12 200 / 0.8)', T.accent].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, background: c, borderRadius: 2 }}/>
              ))}
              <span>more</span>
            </Row>
          </div>
        </Specimen>
      </Subsection>
    </Section>
  );
}

function SecGraph() {
  return (
    <Section id="graph" title="Graph-specific" desc="Primitives for the core graph experience: nodes, edges, minimap, legend, inspector, path overlays.">

      <Subsection title="Node styles">
        <Specimen>
          <Row gap={18} align="center">
            {[
              { t: 'service', c: T.accent, i: '◇' },
              { t: 'person', c: 'var(--purple)', i: '○' },
              { t: 'document', c: 'var(--pink)', i: '▤' },
              { t: 'deployment', c: T.ok, i: '↑' },
              { t: 'incident', c: T.warn, i: '!' },
              { t: 'ticket', c: T.textMuted, i: '#' },
            ].map(n => (
              <Col key={n.t} gap={6} style={{ alignItems: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: T.panel, border: `1.5px solid ${n.c}`, boxShadow: `0 0 20px ${n.c}40`, display: 'grid', placeItems: 'center', fontSize: 22, color: n.c }}>{n.i}</div>
                <span style={{ fontSize: 10, color: T.textDim, fontFamily: FM }}>{n.t}</span>
              </Col>
            ))}
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Node states">
        <Specimen>
          <Row gap={18}>
            {[
              { s: 'default' }, { s: 'hover', glow: 1.5 }, { s: 'selected', ring: true }, { s: 'path', ring: true, color: 'var(--purple)' }, { s: 'dim', opacity: 0.35 },
            ].map((n, i) => (
              <Col key={i} gap={6} style={{ alignItems: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: T.panel, border: `1.5px solid ${n.color || T.accent}`,
                  boxShadow: `0 0 ${20 * (n.glow || 1)}px ${n.color || T.accent}${n.glow ? '80' : '40'}`,
                  outline: n.ring ? `2px solid ${n.color || T.accent}` : 'none',
                  outlineOffset: 4,
                  opacity: n.opacity || 1,
                  display: 'grid', placeItems: 'center', fontSize: 22, color: n.color || T.accent,
                }}>◇</div>
                <span style={{ fontSize: 10, color: T.textDim, fontFamily: FM }}>{n.s}</span>
              </Col>
            ))}
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Edge styles">
        <Specimen>
          <svg width="100%" height="180" viewBox="0 0 520 180">
            <g fontFamily={FM} fontSize="10" fill={T.textDim}>
              <line x1="20" y1="30" x2="200" y2="30" stroke={T.accent} strokeWidth="1.5"/>
              <text x="210" y="34">solid · 1.5px</text>

              <line x1="20" y1="60" x2="200" y2="60" stroke={T.accent} strokeWidth="1.5" strokeDasharray="4 3"/>
              <text x="210" y="64">dashed · async</text>

              <line x1="20" y1="90" x2="200" y2="90" stroke="var(--purple)" strokeWidth="2.5"/>
              <text x="210" y="94">highlighted · in path</text>

              <line x1="20" y1="120" x2="200" y2="120" stroke={T.textDim} strokeWidth="1" opacity="0.4"/>
              <text x="210" y="124">dim · out of scope</text>

              <path d="M20 150 Q 110 130 200 150" stroke={T.accent} strokeWidth="1.5" fill="none" markerEnd="url(#arr)"/>
              <text x="210" y="154">directed · arrowhead</text>

              <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={T.accent}/></marker></defs>
            </g>
          </svg>
        </Specimen>
      </Subsection>

      <Subsection title="Minimap + legend">
        <Specimen pad={0} bg={T.bg}>
          <div style={{ width: '100%', height: 280, position: 'relative', background: 'radial-gradient(circle at 50% 50%, oklch(0.18 0.02 260) 0%, oklch(0.12 0.01 260) 100%)', borderRadius: 8, overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 600 280">
              {Array.from({ length: 12 }).map((_, i) => {
                const x = 80 + (i % 4) * 120 + Math.random() * 40;
                const y = 60 + Math.floor(i / 4) * 70 + Math.random() * 30;
                return <g key={i}><circle cx={x} cy={y} r="5" fill={T.accent} opacity="0.8"/></g>;
              })}
            </svg>
            <div style={{ position: 'absolute', top: 12, left: 12, padding: 10, background: 'oklch(0.15 0.01 260 / 0.85)', backdropFilter: 'blur(8px)', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11 }}>
              <div style={{ fontFamily: FM, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 6 }}>Legend</div>
              <Col gap={4}>
                <Row gap={6}><div style={{ width: 8, height: 8, borderRadius: 999, background: T.accent }}/><span>service</span></Row>
                <Row gap={6}><div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--purple)' }}/><span>person</span></Row>
                <Row gap={6}><div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--pink)' }}/><span>document</span></Row>
              </Col>
            </div>
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 120, height: 72, background: 'oklch(0.15 0.01 260 / 0.85)', border: `1px solid ${T.border}`, borderRadius: 6, padding: 4 }}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ position: 'absolute', left: `${(i % 4) * 25 + 8}%`, top: `${Math.floor(i / 4) * 30 + 15}%`, width: 2, height: 2, borderRadius: 999, background: T.accent }}/>
                ))}
                <div style={{ position: 'absolute', left: '30%', top: '20%', width: '40%', height: '55%', border: `1px solid ${T.accent}`, borderRadius: 2, background: 'oklch(0.8 0.12 200 / 0.12)' }}/>
              </div>
            </div>
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <IconBtn size="sm" icon="+"/>
              <IconBtn size="sm" icon="−"/>
              <IconBtn size="sm" icon="◱"/>
            </div>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Inspector (node drill-in)">
        <Specimen>
          <div style={{ width: 340, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
            <Row style={{ marginBottom: 12 }}>
              <Badge color="accent" dot>service</Badge>
              <span style={{ fontFamily: FM, fontSize: 10, color: T.textDim, marginLeft: 'auto' }}>ent_0x7a2f</span>
            </Row>
            <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 2 }}>payment-webhook-v2</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14 }}>Handles incoming Stripe webhook events, dedupes, forwards to ledger-core.</div>
            <div style={{ fontFamily: FM, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 }}>Properties</div>
            <Col gap={4} style={{ marginBottom: 14, fontSize: 11, fontFamily: FM }}>
              {[['owner', 'Payments'], ['runtime', 'node 20.8'], ['runs', 'k8s://prod-us-east'], ['sla', '99.9%']].map(([k, v]) => (
                <Row key={k} style={{ padding: '4px 0', borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ color: T.textDim, width: 70 }}>{k}</span>
                  <span>{v}</span>
                </Row>
              ))}
            </Col>
            <div style={{ fontFamily: FM, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 }}>Relations · 142</div>
            <Col gap={4} style={{ fontSize: 11 }}>
              {[['→ depends on', 'ledger-core'], ['← called by', 'api-gateway'], ['owned by', 'Priya K.'], ['documented in', 'runbook-oncall.md']].map(([r, e], i) => (
                <Row key={i} gap={8}><span style={{ color: T.textDim, width: 100, fontFamily: FM }}>{r}</span><span>{e}</span></Row>
              ))}
            </Col>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Path overlay">
        <Specimen pad={16}>
          <div style={{ width: '100%', padding: 16, background: 'oklch(0.12 0.01 260)', borderRadius: 8 }}>
            <svg width="100%" height="120" viewBox="0 0 600 120">
              <g>
                {[{ x: 60, l: 'api-gw' }, { x: 200, l: 'payment-wh' }, { x: 340, l: 'ledger' }, { x: 480, l: 'notify' }].map((n, i) => (
                  <g key={i}>
                    <circle cx={n.x} cy="60" r="16" fill={T.panel} stroke="var(--purple)" strokeWidth="2"/>
                    <text x={n.x} y="64" textAnchor="middle" fontSize="11" fill="var(--purple)" fontFamily={FM}>◇</text>
                    <text x={n.x} y="96" textAnchor="middle" fontSize="10" fill={T.textMuted} fontFamily={FM}>{n.l}</text>
                  </g>
                ))}
                <line x1="76" y1="60" x2="184" y2="60" stroke="var(--purple)" strokeWidth="2"/>
                <line x1="216" y1="60" x2="324" y2="60" stroke="var(--purple)" strokeWidth="2"/>
                <line x1="356" y1="60" x2="464" y2="60" stroke="var(--purple)" strokeWidth="2"/>
              </g>
            </svg>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--purple)', fontFamily: FM, marginTop: 8 }}>4-hop path · webhook receipt → customer notification</div>
          </div>
        </Specimen>
      </Subsection>
    </Section>
  );
}

function SecCode() {
  return (
    <Section id="code" title="Code, Diffs, Shortcuts" desc="Code specimens use Geist Mono with ordered line numbers. Inline code, blocks, diffs, and terminal outputs all share a muted panel background.">

      <Subsection title="Inline code">
        <Specimen>
          <div style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 540 }}>
            Run <code style={inlineCode}>shipit sync github</code> to backfill. Configure retries with the <code style={inlineCode}>--retries</code> flag or set <code style={inlineCode}>SHIPIT_MAX_RETRIES</code> in your env.
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Code block">
        <Specimen pad={0}>
          <pre style={{
            width: '100%', margin: 0, padding: '14px 0',
            background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 8,
            fontFamily: FM, fontSize: 12, lineHeight: 1.7, overflow: 'hidden',
          }}>
            {[
              { ln: 1, t: <><span style={{ color: 'var(--purple)' }}>const</span> <span style={{ color: T.accent }}>graph</span> = <span style={{ color: 'var(--purple)' }}>await</span> shipit.<span style={{ color: T.accent }}>query</span>({`{`}</> },
              { ln: 2, t: <>  <span style={{ color: T.ok }}>match</span>: <span style={{ color: T.warn }}>'(s:Service)-[:DEPENDS_ON]-&gt;(d:Service)'</span>,</> },
              { ln: 3, t: <>  <span style={{ color: T.ok }}>where</span>: {`{ s: { owner: `}<span style={{ color: T.warn }}>'Payments'</span>{` } }`},</> },
              { ln: 4, t: <>  <span style={{ color: T.ok }}>return</span>: [<span style={{ color: T.warn }}>'s.name'</span>, <span style={{ color: T.warn }}>'d.name'</span>],</> },
              { ln: 5, t: <>{`});`}</> },
              { ln: 6, t: <></> },
              { ln: 7, t: <><span style={{ color: T.textDim }}>// 142 rows in 94ms</span></> },
            ].map(r => (
              <div key={r.ln} style={{ display: 'flex', padding: '0 16px' }}>
                <span style={{ color: T.textDim, width: 28, textAlign: 'right', marginRight: 16, userSelect: 'none' }}>{r.ln}</span>
                <span>{r.t}</span>
              </div>
            ))}
          </pre>
        </Specimen>
      </Subsection>

      <Subsection title="Diff">
        <Specimen pad={0}>
          <pre style={{
            width: '100%', margin: 0, padding: '14px 0',
            background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 8,
            fontFamily: FM, fontSize: 12, lineHeight: 1.7,
          }}>
            {[
              { k: ' ', t: '  where: {', ln: 12 },
              { k: '-', t: "    s: { owner: 'Platform' }", ln: 13, bg: 'oklch(0.2 0.08 30 / 0.3)', color: T.err },
              { k: '+', t: "    s: { owner: 'Payments' }", ln: 13, bg: 'oklch(0.2 0.08 150 / 0.3)', color: T.ok },
              { k: '+', t: "    d: { runtime: 'node 20' }", ln: 14, bg: 'oklch(0.2 0.08 150 / 0.3)', color: T.ok },
              { k: ' ', t: '  },', ln: 15 },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', padding: '0 16px', background: r.bg || 'transparent' }}>
                <span style={{ color: T.textDim, width: 28, textAlign: 'right', marginRight: 8, userSelect: 'none' }}>{r.ln}</span>
                <span style={{ width: 16, color: r.color || T.textDim, userSelect: 'none' }}>{r.k}</span>
                <span style={{ color: r.color || T.text }}>{r.t}</span>
              </div>
            ))}
          </pre>
        </Specimen>
      </Subsection>

      <Subsection title="Terminal">
        <Specimen pad={0}>
          <div style={{ width: '100%', background: '#000', borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.border}` }}>
            <Row gap={6} style={{ padding: '8px 14px', borderBottom: `1px solid ${T.border}`, background: 'oklch(0.1 0.005 260)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 999, background: '#ff5f56' }}/>
              <div style={{ width: 10, height: 10, borderRadius: 999, background: '#ffbd2e' }}/>
              <div style={{ width: 10, height: 10, borderRadius: 999, background: '#27c93f' }}/>
              <span style={{ fontFamily: FM, fontSize: 11, color: T.textDim, marginLeft: 8 }}>~/shipit · zsh</span>
            </Row>
            <div style={{ padding: 16, fontFamily: FM, fontSize: 12, lineHeight: 1.7 }}>
              <div><span style={{ color: T.ok }}>$</span> shipit sync github --all</div>
              <div style={{ color: T.textDim }}>▸ discovering repos</div>
              <div style={{ color: T.textMuted }}>  found 4 repos in acme org</div>
              <div style={{ color: T.textDim }}>▸ ingesting</div>
              <div style={{ color: T.textMuted }}>  shipit-api       <span style={{ color: T.ok }}>✓</span> 2,841 files</div>
              <div style={{ color: T.textMuted }}>  shipit-web       <span style={{ color: T.ok }}>✓</span> 1,208 files</div>
              <div style={{ color: T.textMuted }}>  shipit-ingest    <span style={{ color: T.ok }}>✓</span>   482 files</div>
              <div style={{ color: T.textMuted }}>  shipit-graph     <span style={{ color: T.accent }}>⚙</span>   ingesting ...<span style={{ display: 'inline-block', width: 1, height: 14, background: T.accent, marginLeft: 4, verticalAlign: 'middle', animation: 'pulse 1s infinite' }}/></div>
            </div>
          </div>
        </Specimen>
      </Subsection>
    </Section>
  );
}

const inlineCode = {
  background: T.panel2, padding: '1px 6px', borderRadius: 4,
  fontFamily: FM, fontSize: 12, color: T.accent,
  border: `1px solid ${T.border}`,
};

Object.assign(window, { Spark, SecCharts, SecGraph, SecCode, inlineCode });
