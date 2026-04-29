// Graph Explorer — full interactive view

function PageGraph({ nav, onAsk, initialFocus = 'payments-api' }) {
  const t = useTheme();
  const [focus, setFocus] = React.useState(initialFocus);
  const [depth, setDepth] = React.useState(2);
  const [layout, setLayout] = React.useState('radial');
  const [selectedTypes, setSelectedTypes] = React.useState(['LogicalService','Repository','Deployment']);
  const [env, setEnv] = React.useState('production');
  const [hover, setHover] = React.useState(null);

  // Compute subgraph centered on focus within depth
  const byId = Object.fromEntries(SERVICES.map(s => [s.id, s]));
  const adj = {};
  EDGES.forEach(([a,b]) => {
    (adj[a] = adj[a] || []).push(b);
    (adj[b] = adj[b] || []).push(a);
  });
  const visited = { [focus]: 0 };
  const frontier = [focus];
  while (frontier.length) {
    const cur = frontier.shift();
    if (visited[cur] >= depth) continue;
    for (const nxt of (adj[cur] || [])) {
      if (visited[nxt] === undefined) {
        visited[nxt] = visited[cur] + 1;
        frontier.push(nxt);
      }
    }
  }
  const nodeIds = Object.keys(visited).filter(id => byId[id] && selectedTypes.includes(byId[id].type));
  const nodes = nodeIds.map(id => byId[id]);
  const edges = EDGES.filter(([a,b]) => nodeIds.includes(a) && nodeIds.includes(b));

  const focusNode = byId[focus];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Left filter panel */}
      <div style={{
        width: 260, borderRight: `1px solid ${t.border}`, background: t.panel,
        padding: '18px 16px', overflow: 'auto', flexShrink: 0,
      }}>
        <SectionLabel right={<span style={{ cursor: 'pointer' }}>clear</span>}>Focus</SectionLabel>
        <div style={{ padding: '9px 12px', borderRadius: 6, background: t.panel2, border: `1px solid ${t.borderStrong}`, fontSize: 12, fontFamily: MONO, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ color: t.accent }}>◆</span> {focus}
        </div>
        <div style={{ fontSize: 11, color: t.textDim, marginBottom: 14 }}>depth {depth} · {nodeIds.length} nodes · {edges.length} edges</div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {[1,2,3].map(d => (
            <div key={d} onClick={() => setDepth(d)} style={{
              flex: 1, padding: '6px 0', textAlign: 'center', fontSize: 11, fontFamily: MONO,
              background: depth === d ? t.accent : t.panel2,
              color: depth === d ? '#0a0a0b' : t.textMuted,
              border: `1px solid ${depth === d ? t.accent : t.border}`, borderRadius: 5, cursor: 'pointer',
            }}>depth {d}</div>
          ))}
        </div>

        <SectionLabel>Node types</SectionLabel>
        {[
          ['LogicalService', 9, t.accent],
          ['Repository', 2, t.purple],
          ['Deployment', 0, t.ok],
          ['RuntimeService', 0, t.warn],
          ['Team', 0, t.pink],
          ['Person', 0, t.textMuted],
        ].map(([l, n, c]) => {
          const on = selectedTypes.includes(l);
          return (
            <div key={l}
              onClick={() => setSelectedTypes(on ? selectedTypes.filter(x=>x!==l) : [...selectedTypes, l])}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', cursor: 'pointer', opacity: on ? 1 : 0.5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, border: `1px solid ${c}`, background: on ? c : 'transparent' }}/>
              <div style={{ fontSize: 12 }}>{l}</div>
              <div style={{ marginLeft: 'auto', fontSize: 10, color: t.textDim, fontFamily: MONO }}>{n}</div>
            </div>
          );
        })}

        <SectionLabel right={null} >Environment</SectionLabel>
        {['production','staging','dev'].map(e => (
          <div key={e} onClick={() => setEnv(e)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 4px', cursor: 'pointer' }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, border: `1px solid ${t.borderStrong}`, background: env === e ? t.accent : 'transparent' }}/>
            <div style={{ fontSize: 12, color: env === e ? t.text : t.textMuted }}>{e}</div>
          </div>
        ))}

        <SectionLabel style={{ marginTop: 20 }}>Layout</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {['radial','hierarchical','force'].map(l => (
            <div key={l} onClick={() => setLayout(l)} style={{
              padding: '6px 0', textAlign: 'center', fontSize: 11, fontFamily: MONO,
              background: layout === l ? t.panel2 : 'transparent',
              color: layout === l ? t.text : t.textMuted,
              border: `1px solid ${layout === l ? t.borderStrong : t.border}`, borderRadius: 5, cursor: 'pointer',
            }}>{l}</div>
          ))}
        </div>

        <SectionLabel style={{ marginTop: 20 }}>Cypher (advanced)</SectionLabel>
        <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, padding: 10, fontSize: 11, fontFamily: MONO, color: t.textMuted, lineHeight: 1.55 }}>
          <div><span style={{ color: t.purple }}>MATCH</span> (s)-[*1..{depth}]-(n)</div>
          <div><span style={{ color: t.purple }}>WHERE</span> s.name = <span style={{ color: t.accent }}>"{focus}"</span></div>
          <div><span style={{ color: t.purple }}>RETURN</span> n, r</div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative', background: `radial-gradient(circle at 50% 45%, ${t.panel2} 0%, ${t.bg} 70%)`, overflow: 'hidden' }}>
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `linear-gradient(${t.border} 1px, transparent 1px), linear-gradient(90deg, ${t.border} 1px, transparent 1px)`, backgroundSize: '32px 32px', maskImage: 'radial-gradient(circle at center, #000 30%, transparent 70%)' }}/>

        {/* Top toolbar */}
        <div style={{ position: 'absolute', top: 14, left: 14, right: focusNode ? 310 : 14, display: 'flex', gap: 8, zIndex: 3 }}>
          <div onClick={() => onAsk(`show everything that depends on ${focus} in ${env}`)} style={{
            background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8,
            padding: '8px 14px', fontSize: 12, color: t.textMuted, flex: 1,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'text',
          }}>
            <span style={{ color: t.accent }}>✦</span>
            <span style={{ color: t.text }}>show me everything that depends on {focus} in {env}</span>
            <AskHint style={{ marginLeft: 'auto' }}/>
          </div>
          <Btn small style={{ padding: '8px 12px' }}>{layout}</Btn>
          <Btn small ghost style={{ padding: '8px 12px' }}>⌕</Btn>
          <Btn small ghost style={{ padding: '8px 12px' }}>⊟</Btn>
          <Btn small ghost style={{ padding: '8px 12px' }}>100%</Btn>
        </div>

        <GraphCanvas
          nodes={nodes} edges={edges} focus={focus} layout={layout}
          onFocus={setFocus} onHover={setHover} hover={hover}
          onOpen={(id) => nav('entity', id)}
        />

        {/* Edge legend */}
        <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', gap: 12, fontSize: 10, fontFamily: MONO, color: t.textDim, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 6, padding: '6px 10px' }}>
          <span>DEPENDS_ON</span>
          <span>TRIGGERS</span>
          <span>IMPORTS</span>
          <span>CALLS</span>
          <span>PUBLISHES_TO</span>
        </div>

        {/* Right detail panel */}
        {focusNode && (
          <div className="slide-in" style={{
            position: 'absolute', top: 60, right: 14, bottom: 14, width: 290,
            background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10,
            padding: 18, overflow: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <TypeBadge type={focusNode.type}/>
              <Pill color={focusNode.tier === 1 ? t.err : (focusNode.tier === 2 ? t.warn : t.textMuted)}>Tier {focusNode.tier}</Pill>
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.4, marginBottom: 2 }}>{focusNode.name}</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16, lineHeight: 1.5 }}>{focusNode.desc}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
              {[
                [focusNode.deps, 'dependencies'],
                [focusNode.dependents, 'dependents'],
                [focusNode.env.length, 'environments'],
                [`${focusNode.p99}ms`, 'p99 latency'],
              ].map(([v, l], i) => (
                <div key={i} style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, fontFamily: MONO, letterSpacing: -0.3 }}>{v}</div>
                  <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            <SectionLabel>Properties</SectionLabel>
            <div style={{ background: t.panel2, border: `1px solid ${t.border}`, borderRadius: 6, padding: '10px 12px', marginBottom: 16 }}>
              <PropRow k="owner"   v={focusNode.owner}   accent/>
              <PropRow k="oncall"  v={focusNode.oncall}  accent/>
              <PropRow k="runtime" v={focusNode.runtime}/>
              <PropRow k="lang"    v={focusNode.lang}/>
              <PropRow k="sla"     v={`${focusNode.sla}%`}/>
              <PropRow k="last"    v={focusNode.change} dim last/>
            </div>

            <SectionLabel>Blast radius</SectionLabel>
            <div style={{ background: `${t.warn}11`, border: `1px solid ${t.warn}33`, borderRadius: 6, padding: '10px 12px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: t.text }}>{focusNode.dependents} services affected</div>
              <div style={{ fontSize: 11, color: t.textDim, marginTop: 2 }}>Includes 3 tier-1 customer flows</div>
            </div>

            <SectionLabel>Provenance</SectionLabel>
            {[
              ['GitHub codeowners', 'owner', true],
              ['Backstage catalog', 'owner', false],
              ['Datadog tags', 'tier', true],
              ['Kubernetes', 'runtime', true],
            ].map(([src, prop, win]) => (
              <div key={src+prop} style={{ display: 'flex', alignItems:'center', gap: 8, padding: '5px 0', fontSize: 11 }}>
                <Dot color={win ? t.ok : t.textDim}/>
                <span style={{ color: t.text }}>{src}</span>
                <span style={{ marginLeft: 'auto', color: t.textDim, fontFamily: MONO, fontSize: 10 }}>{prop}{win ? '' : ' (lost)'}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
              <Btn small primary style={{ flex: 1, justifyContent: 'center' }} onClick={() => nav('entity', focus)}>Open details →</Btn>
              <Btn small onClick={() => onAsk(`who would be impacted if ${focus} goes down?`)}>Ask ✦</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GraphCanvas({ nodes, edges, focus, layout, onFocus, onHover, hover, onOpen }) {
  const t = useTheme();
  const W = 820, H = 600;
  const cx = W/2, cy = H/2 - 20;

  // Layout positioning
  const positions = React.useMemo(() => {
    const pos = {};
    const focusIdx = nodes.findIndex(n => n.id === focus);
    if (layout === 'radial') {
      pos[focus] = { x: cx, y: cy };
      const others = nodes.filter(n => n.id !== focus);
      others.forEach((n, i) => {
        const a = (i / others.length) * Math.PI * 2 - Math.PI/2;
        const r = 230;
        pos[n.id] = { x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r*0.78 };
      });
    } else if (layout === 'hierarchical') {
      // group by type-row
      const rows = { LogicalService: [], Repository: [], Deployment: [], Team: [], Person: [], RuntimeService: [] };
      nodes.forEach(n => { (rows[n.type] = rows[n.type] || []).push(n); });
      const rowOrder = ['Team','LogicalService','Repository','Deployment','RuntimeService','Person'];
      const visible = rowOrder.filter(r => (rows[r] || []).length);
      visible.forEach((r, ri) => {
        const row = rows[r];
        const y = 100 + ri * ((H - 140) / Math.max(1, visible.length - 1));
        row.forEach((n, i) => {
          pos[n.id] = { x: 80 + (i + 0.5) * ((W - 160) / row.length), y };
        });
      });
    } else {
      // force-ish — pseudo-random deterministic
      nodes.forEach((n, i) => {
        if (n.id === focus) { pos[n.id] = { x: cx, y: cy }; return; }
        const a = ((i * 137.5) % 360) / 180 * Math.PI;
        const r = 120 + (i % 3) * 55;
        pos[n.id] = { x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r*0.75 };
      });
    }
    return pos;
  }, [nodes, edges, focus, layout]);

  const typeColor = {
    LogicalService: t.accent, Repository: t.purple, Deployment: t.ok,
    RuntimeService: t.warn, Team: t.pink, Person: t.textMuted,
  };

  // Highlight edges/nodes connected to hover
  const hoverEdges = hover ? new Set(edges.filter(e => e[0] === hover || e[1] === hover).map((_, i) => i)) : new Set();
  const hoverNeighbors = hover ? new Set(edges.filter(e => e[0] === hover || e[1] === hover).flatMap(e => [e[0], e[1]])) : null;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="focusGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={t.accent} stopOpacity="0.35"/>
          <stop offset="1" stopColor={t.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {focus && positions[focus] && (
        <circle cx={positions[focus].x} cy={positions[focus].y} r="110" fill="url(#focusGlow)"/>
      )}

      {edges.map((e, i) => {
        const a = positions[e[0]], b = positions[e[1]];
        if (!a || !b) return null;
        const isFocusEdge = e[0] === focus || e[1] === focus;
        const isHover = hover && (e[0] === hover || e[1] === hover);
        const stroke = isHover ? t.accent : (isFocusEdge ? t.borderStrong : t.border);
        const opacity = hover && !isHover ? 0.25 : (isFocusEdge ? 0.8 : 0.5);
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={stroke} strokeWidth={isHover ? 1.6 : 0.8} opacity={opacity}/>
            {isFocusEdge && (
              <text
                x={(a.x + b.x)/2} y={(a.y + b.y)/2 - 4}
                fontSize="8" fill={t.textDim} fontFamily={MONO} textAnchor="middle" opacity="0.6"
              >{e[2]}</text>
            )}
          </g>
        );
      })}

      {nodes.map(n => {
        const p = positions[n.id]; if (!p) return null;
        const isFocus = n.id === focus;
        const isHover = hover === n.id;
        const isDim = hover && !isHover && !hoverNeighbors?.has(n.id);
        const r = isFocus ? 16 : (n.tier === 1 ? 10 : (n.tier === 2 ? 8 : 6));
        const color = typeColor[n.type] || t.textMuted;
        return (
          <g key={n.id} transform={`translate(${p.x}, ${p.y})`}
            onClick={() => onFocus(n.id)}
            onDoubleClick={() => onOpen(n.id)}
            onMouseEnter={() => onHover(n.id)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor: 'pointer', opacity: isDim ? 0.3 : 1, transition: 'opacity 0.2s' }}>
            {isFocus && <circle r={r + 8} fill="none" stroke={color} strokeWidth="1" opacity="0.4"/>}
            {isFocus && <circle r={r + 18} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2"/>}
            {n.type === 'LogicalService' ? (
              <rect x={-r} y={-r} width={r*2} height={r*2} rx={r*0.3} fill={color}/>
            ) : n.type === 'Repository' ? (
              <circle r={r} fill={color}/>
            ) : (
              <rect x={-r} y={-r} width={r*2} height={r*2} rx={r*0.3} fill={color}/>
            )}
            <text y={r + 14} fontSize={isFocus ? 12 : 10} fill={isFocus ? t.text : t.textMuted} fontFamily={MONO} textAnchor="middle" fontWeight={isFocus ? 600 : 400}>{n.name}</text>
            {isFocus && <text y={r + 28} fontSize="9" fill={t.textDim} fontFamily={MONO} textAnchor="middle">{n.owner}</text>}
          </g>
        );
      })}
    </svg>
  );
}

Object.assign(window, { PageGraph });
