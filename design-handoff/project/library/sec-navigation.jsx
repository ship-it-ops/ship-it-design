// Library · Navigation — live tabs, pagination, breadcrumbs, command palette.

function SecNavigation() {
  return (
    <Section id="navigation" title="Navigation" count="20+" desc="Sidebar, topbar, tabs, breadcrumbs, pagination, command palette, menubar, stepper. Navigation stays quiet — typography weight does the work, not heavy backgrounds.">

      <Subsection title="Sidebar (primary app nav)" note="live">
        <Specimen pad={0} bg={T.bg} code={`<Sidebar>
  <NavItem icon="⌂" label="Home" active/>
  <NavItem icon="◇" label="Graph" badge="3"/>
</Sidebar>`}>
          <LiveSidebar/>
        </Specimen>
      </Subsection>

      <Subsection title="Top bar">
        <Specimen pad={0} code={`<Topbar title="Graph Explorer" actions={<SearchInput/>}/>`}>
          <div style={{ width: '100%', height: 52, background: T.panel, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Graph Explorer</div>
            <div style={{ flex: 1 }}/>
            <SearchInput width={280}/>
            <IconButton variant="ghost" icon="⌕"/>
            <IconButton variant="ghost" icon="⚙"/>
            <Avatar name="Mohamed T"/>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Tabs · underline + pill" note="live">
        <Specimen code={`<Tabs value={tab} onChange={setTab}>
  <Tab value="overview">Overview</Tab>
  <Tab value="properties">Properties</Tab>
</Tabs>`}>
          <Col gap={20} style={{ width: '100%' }}>
            <LiveUnderlineTabs/>
            <LivePillTabs/>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Breadcrumbs">
        <Specimen code={`<Breadcrumbs>
  <Crumb>Workspace</Crumb>
  <Crumb>Graph</Crumb>
  <Crumb current>payment-webhook</Crumb>
</Breadcrumbs>`}>
          <Col gap={10}>
            <Row gap={6} style={{ fontSize: 13, color: T.textMuted }}>
              <span style={{ cursor: 'pointer' }}>Workspace</span>
              <span style={{ color: T.textDim }}>/</span>
              <span style={{ cursor: 'pointer' }}>Graph</span>
              <span style={{ color: T.textDim }}>/</span>
              <span style={{ cursor: 'pointer' }}>Services</span>
              <span style={{ color: T.textDim }}>/</span>
              <span style={{ color: T.text }}>payment-webhook</span>
            </Row>
            <Row gap={6} style={{ fontSize: 12, color: T.textMuted, fontFamily: FM }}>
              <span>~</span>
              <span style={{ color: T.textDim }}>›</span>
              <span>workspace</span>
              <span style={{ color: T.textDim }}>›</span>
              <span>graph</span>
              <span style={{ color: T.textDim }}>›</span>
              <span style={{ color: T.text }}>payment-webhook</span>
            </Row>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Pagination" note="live">
        <Specimen code={`<Pagination page={page} onPageChange={setPage} total={42}/>`}>
          <LivePagination/>
        </Specimen>
      </Subsection>

      <Subsection title="Command palette" note="live ⌕">
        <Specimen bg={T.bg} code={`<CommandPalette open={open} onSelect={run}/>`}>
          <LiveCommandPalette/>
        </Specimen>
      </Subsection>

      <Subsection title="Menubar">
        <Specimen pad={0} code={`<Menubar items={['File','Edit','Graph','Query','View','Help']}/>`}>
          <LiveMenubar/>
        </Specimen>
      </Subsection>

      <Subsection title="Stepper / Wizard progress">
        <Specimen code={`<Stepper current={2} steps={['Workspace','Connect','Review','Invite']}/>`}>
          <Row gap={0} style={{ width: '100%' }}>
            {['Workspace','Connect','Review','Invite'].map((s, i) => {
              const state = i < 2 ? 'done' : i === 2 ? 'current' : 'upcoming';
              return (
                <React.Fragment key={s}>
                  <Row gap={8}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 999,
                      background: state === 'done' ? T.accent : state === 'current' ? T.accentDim : T.panel,
                      border: `1px solid ${state === 'upcoming' ? T.border : T.accent}`,
                      color: state === 'done' ? '#0a0a0b' : state === 'current' ? T.accent : T.textDim,
                      display: 'grid', placeItems: 'center', fontSize: 11, fontFamily: FM, fontWeight: 600,
                    }}>{state === 'done' ? '✓' : i + 1}</div>
                    <span style={{ fontSize: 12, color: state === 'upcoming' ? T.textDim : T.text, fontWeight: state === 'current' ? 500 : 400 }}>{s}</span>
                  </Row>
                  {i < 3 && <div style={{ flex: 1, height: 1, background: i < 1 ? T.accent : T.border, margin: '0 12px' }}/>}
                </React.Fragment>
              );
            })}
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Progress dots (carousel / tour)">
        <Specimen code={`<Dots current={1} total={5}/>`}>
          <Row gap={6}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                width: i === 1 ? 18 : 6, height: 6, borderRadius: 999,
                background: i === 1 ? T.accent : T.panel2,
                transition: 'width 180ms',
              }}/>
            ))}
          </Row>
        </Specimen>
      </Subsection>

    </Section>
  );
}

/* ────── Live navigation primitives ────── */

function LiveSidebar() {
  const [active, setActive] = React.useState('Graph');
  const items = [
    { label: 'Home', icon: '⌂' },
    { label: 'Graph', icon: '◇' },
    { label: 'Ask', icon: '✦', badge: '3' },
    { label: 'Incidents', icon: '!' },
  ];
  return (
    <div style={{ width: 240, background: T.panel, borderRight: `1px solid ${T.border}`, padding: 14, height: 420 }}>
      <Row gap={8} style={{ marginBottom: 18 }}>
        <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, oklch(0.82 0.12 200), oklch(0.78 0.14 300))', borderRadius: 6, display: 'grid', placeItems: 'center', fontSize: 13, color: '#0a0a0b' }}>◆</div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>ShipIt</div>
        <div style={{ fontFamily: FM, fontSize: 9, color: T.textDim, marginLeft: 'auto' }}>acme</div>
      </Row>
      <div style={{ fontFamily: FM, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 }}>Workspace</div>
      <Col gap={2} style={{ marginBottom: 14 }}>
        {items.map(i => {
          const isActive = i.label === active;
          return (
            <div key={i.label} onClick={() => setActive(i.label)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 8px', borderRadius: 4, fontSize: 13,
              background: isActive ? T.accentDim : 'transparent',
              color: isActive ? T.accent : T.text, cursor: 'pointer',
              transition: 'all 120ms',
            }}>
              <span style={{ width: 14, textAlign: 'center', opacity: 0.8 }}>{i.icon}</span>
              <span style={{ flex: 1 }}>{i.label}</span>
              {i.badge && <span style={{ fontFamily: FM, fontSize: 10, padding: '1px 6px', background: T.accent, color: '#0a0a0b', borderRadius: 4 }}>{i.badge}</span>}
            </div>
          );
        })}
      </Col>
      <div style={{ fontFamily: FM, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 }}>Sources <span style={{ float: 'right', color: T.textDim, cursor: 'pointer' }}>+</span></div>
      <Col gap={2}>
        {['github · 4 repos','notion · 182 docs','linear · 34 issues','slack · 6 channels'].map(s => (
          <div key={s} style={{ padding: '6px 8px', fontSize: 12, color: T.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: 999, background: T.ok }}/>
            {s}
          </div>
        ))}
      </Col>
    </div>
  );
}

function LiveUnderlineTabs() {
  const [tab, setTab] = React.useState('Properties');
  const tabs = ['Overview','Properties','Relations','History','Code'];
  return (
    <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${T.border}` }}>
      {tabs.map(t => {
        const isActive = t === tab;
        return (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 2px', fontSize: 13, fontWeight: isActive ? 500 : 400,
            color: isActive ? T.text : T.textMuted,
            borderBottom: `2px solid ${isActive ? T.accent : 'transparent'}`,
            background: 'transparent', border: 'none',
            borderBottomWidth: 2, borderBottomStyle: 'solid',
            borderBottomColor: isActive ? T.accent : 'transparent',
            marginBottom: -1, cursor: 'pointer', fontFamily: FF,
          }}>{t}</button>
        );
      })}
    </div>
  );
}

function LivePillTabs() {
  const [tab, setTab] = React.useState('Graph');
  return (
    <div style={{ display: 'inline-flex', background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 3 }}>
      {['Graph','List','Table'].map(t => {
        const isActive = t === tab;
        return (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 14px', fontSize: 12, borderRadius: 5,
            background: isActive ? T.panel : 'transparent',
            boxShadow: isActive ? T.shadow : 'none',
            fontWeight: isActive ? 500 : 400,
            color: isActive ? T.text : T.textMuted,
            cursor: 'pointer', border: 'none', fontFamily: FF,
            transition: 'all 120ms',
          }}>{t}</button>
        );
      })}
    </div>
  );
}

function LivePagination() {
  const [page, setPage] = React.useState(3);
  const total = 42;
  const pages = [];
  for (let i = 1; i <= Math.min(5, total); i++) pages.push(i);
  if (total > 5) pages.push('…', total);
  return (
    <Row gap={4}>
      <IconButton size="sm" icon="‹" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}/>
      {pages.map((p, i) => {
        const isActive = p === page;
        const isEllipsis = p === '…';
        return (
          <button
            key={i}
            disabled={isEllipsis}
            onClick={() => !isEllipsis && setPage(p)}
            style={{
              minWidth: 26, height: 26, padding: '0 8px',
              display: 'grid', placeItems: 'center',
              background: isActive ? T.accentDim : 'transparent',
              color: isActive ? T.accent : T.textMuted,
              border: isActive ? `1px solid ${T.accent}` : `1px solid transparent`,
              borderRadius: 5, fontSize: 12, fontFamily: FM,
              cursor: isEllipsis ? 'default' : 'pointer',
            }}
          >{p}</button>
        );
      })}
      <IconButton size="sm" icon="›" disabled={page === total} onClick={() => setPage(p => Math.min(total, p + 1))}/>
    </Row>
  );
}

function LiveCommandPalette() {
  const [q, setQ] = React.useState('payment');
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef(null);
  const all = [
    { t: '◇ payment-webhook-v2', m: 'service · owned by Payments', kind: 'entity' },
    { t: '◇ payment-webhook-legacy', m: 'service · deprecated', kind: 'entity' },
    { t: '▢ webhook.ts', m: 'file · 312 LOC', kind: 'entity' },
    { t: '◇ payments-api', m: 'service · us-east-1', kind: 'entity' },
    { t: '◎ billing-service', m: 'service · owned by Finance', kind: 'entity' },
    { t: '◇ checkout-flow', m: 'service · 14 deploys/week', kind: 'entity' },
  ];
  const results = all.filter(r => r.t.toLowerCase().includes(q.toLowerCase()) || r.m.toLowerCase().includes(q.toLowerCase())).slice(0, 4);

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(results.length - 1, c + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(0, c - 1)); }
  };

  return (
    <div style={{ width: 540, background: T.panel, border: `1px solid ${T.borderStrong}`, borderRadius: 12, boxShadow: T.shadowLg, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: T.textDim }}>⌕</span>
        <input
          ref={inputRef}
          value={q}
          onChange={e => { setQ(e.target.value); setCursor(0); }}
          onKeyDown={onKey}
          placeholder="Search entities, docs, actions…"
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: T.text, fontSize: 14, fontFamily: FF }}
        />
        <span style={{ fontFamily: FM, fontSize: 10, color: T.textDim, padding: '2px 6px', border: `1px solid ${T.border}`, borderRadius: 4 }}>ESC</span>
      </div>
      <div style={{ padding: 8, minHeight: 220 }}>
        <div style={{ fontFamily: FM, fontSize: 9, color: T.textDim, textTransform: 'uppercase', letterSpacing: 1.4, padding: '6px 8px' }}>Entities · {results.length}</div>
        {results.length === 0 && (
          <div style={{ padding: '20px 10px', fontSize: 12, color: T.textDim, textAlign: 'center' }}>No matches</div>
        )}
        {results.map((r, i) => (
          <div key={i} onClick={() => setCursor(i)} onMouseEnter={() => setCursor(i)} style={{
            padding: '8px 10px', borderRadius: 6,
            background: i === cursor ? T.accentDim : 'transparent',
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          }}>
            <span style={{ color: i === cursor ? T.accent : T.textMuted, fontFamily: FM, fontSize: 12 }}>{r.t.split(' ')[0]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: i === cursor ? T.accent : T.text }}>{r.t.slice(2)}</div>
              <div style={{ fontSize: 11, color: T.textDim }}>{r.m}</div>
            </div>
            {i === cursor && <span style={{ fontFamily: FM, fontSize: 10, color: T.textDim }}>↵</span>}
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 16, fontFamily: FM, fontSize: 10, color: T.textDim }}>
        <span>↑↓ navigate</span><span>↵ open</span><span>⌘↵ ask about</span>
      </div>
    </div>
  );
}

function LiveMenubar() {
  const [active, setActive] = React.useState('Graph');
  return (
    <div style={{ width: '100%', display: 'flex', padding: '0 12px', height: 30, background: T.panel, borderBottom: `1px solid ${T.border}`, alignItems: 'center', gap: 2 }}>
      {['File','Edit','Graph','Query','View','Help'].map(m => {
        const isActive = m === active;
        return (
          <button key={m} onClick={() => setActive(m)} style={{
            padding: '4px 10px', fontSize: 12, borderRadius: 4,
            background: isActive ? T.panel2 : 'transparent',
            cursor: 'pointer', border: 'none', color: T.text, fontFamily: FF,
          }}>{m}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, { SecNavigation, LiveSidebar, LiveUnderlineTabs, LivePillTabs, LivePagination, LiveCommandPalette, LiveMenubar });
