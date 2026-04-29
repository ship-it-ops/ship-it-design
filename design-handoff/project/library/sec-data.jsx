// Library · Data — sortable table, expandable tree, kanban drag-reorder, list, timeline.

function SecData() {
  return (
    <Section id="data" title="Data Display" count="6 patterns" desc="Tables, lists, trees, kanban, timeline. Click headers to sort. Drag kanban cards between columns.">
      <Subsection title="Sortable table (live)" note="click columns">
        <Specimen pad={0} code={`<DataTable columns={…} rows={…} sortable/>`}>
          <SortableTable/>
        </Specimen>
      </Subsection>

      <Subsection title="Data grid · dense + selection">
        <Specimen pad={0} code={`<DataGrid rows={…} multiSelect/>`}>
          <SelectableGrid/>
        </Specimen>
      </Subsection>

      <Subsection title="Tree (live)" note="click to expand">
        <Specimen code={`<Tree data={…}/>`}>
          <ExpandableTree/>
        </Specimen>
      </Subsection>

      <Subsection title="Kanban (live)" note="drag cards">
        <Specimen pad={14} code={`<Kanban columns={…} onMove={…}/>`}>
          <DragKanban/>
        </Specimen>
      </Subsection>

      <Subsection title="Simple list">
        <Specimen code={`<List items={…} onSelect={…}/>`}>
          <Col gap={0} style={{ width: '100%', maxWidth: 520, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
            {[
              { t: 'Who owns payment-webhook?',  a: '142 citations',  time: '2m ago' },
              { t: 'What changed in the ledger?', a: '28 citations',   time: '1h ago' },
              { t: 'On-call this week',           a: '4 citations',    time: 'yesterday' },
              { t: 'Deploys with rollback',       a: '18 citations',   time: '2d ago' },
            ].map((q, i) => (
              <Row key={i} gap={12} style={{ padding: '12px 14px', borderBottom: i < 3 ? `1px solid ${T.border}` : 'none', cursor: 'pointer' }}>
                <span style={{ color: T.accent }}>✦</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{q.t}</div>
                  <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM }}>{q.a} · {q.time}</div>
                </div>
                <span style={{ color: T.textDim }}>›</span>
              </Row>
            ))}
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Timeline">
        <Specimen pad={22} code={`<Timeline events={…}/>`}>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 1, background: T.border }}/>
            {[
              { t: 'Connector added', m: 'github · 4 repos', time: 'just now', color: T.accent },
              { t: 'Schema extracted', m: '142 entity types · 38 relations', time: '4m ago', color: T.ok },
              { t: 'First query answered', m: 'Who owns the payment webhook?', time: '6m ago', color: T.ok },
              { t: 'Teammate joined', m: 'priya@acme.com', time: '12m ago', color: T.textDim },
            ].map((e, i) => (
              <div key={i} style={{ marginBottom: 18, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -24, top: 4, width: 14, height: 14, borderRadius: 999, background: T.bg, border: `2px solid ${e.color}` }}/>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{e.t}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{e.m}</div>
                <div style={{ fontSize: 10, color: T.textDim, fontFamily: FM, marginTop: 2 }}>{e.time}</div>
              </div>
            ))}
          </div>
        </Specimen>
      </Subsection>
    </Section>
  );
}

/* ────── Sortable Table ────── */

function SortableTable() {
  const initial = [
    { name: 'payment-webhook-v2', owner: 'Payments', runtime: 'node 20',  deploys: 2.3, status: 'ok' },
    { name: 'ledger-core',         owner: 'Payments', runtime: 'go 1.22', deploys: 0.8, status: 'ok' },
    { name: 'notify-dispatch',     owner: 'Platform', runtime: 'node 20', deploys: 4.1, status: 'warn' },
    { name: 'auth-edge',           owner: 'Platform', runtime: 'rust',    deploys: 0.2, status: 'ok' },
    { name: 'legacy-wh',           owner: 'Payments', runtime: 'node 16', deploys: 0,   status: 'off' },
  ];
  const [sortKey, setSortKey] = React.useState('deploys');
  const [sortDir, setSortDir] = React.useState('desc');

  const sorted = [...initial].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const toggle = k => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };

  const cols = [
    { k: 'name',    l: 'Name', align: 'left' },
    { k: 'owner',   l: 'Owner', align: 'left' },
    { k: 'runtime', l: 'Runtime', align: 'left' },
    { k: 'deploys', l: 'Deploys/d', align: 'right' },
    { k: 'status',  l: 'Status', align: 'left' },
  ];

  return (
    <div style={{ width: '100%', background: T.panel, borderRadius: 10, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
      <Row gap={10} style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Services</div>
        <Badge size="sm">{initial.length}</Badge>
        <div style={{ marginLeft: 'auto' }}/>
        <UIBtn size="sm" variant="ghost" leading="↓">Export</UIBtn>
        <UIBtn size="sm" variant="secondary" leading="+">New</UIBtn>
      </Row>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: T.panel2 }}>
            {cols.map(c => (
              <th key={c.k} onClick={() => toggle(c.k)} style={{
                textAlign: c.align, padding: '8px 12px',
                fontFamily: FM, fontSize: 10, fontWeight: 500,
                color: sortKey === c.k ? T.accent : T.textDim,
                textTransform: 'uppercase', letterSpacing: 1.4,
                borderBottom: `1px solid ${T.border}`, cursor: 'pointer', userSelect: 'none',
              }}>
                {c.l}
                {sortKey === c.k && <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
              </th>
            ))}
            <th style={{ width: 32, borderBottom: `1px solid ${T.border}` }}/>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={r.name} style={{ borderBottom: i < sorted.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              <td style={{ padding: '10px 12px', fontFamily: FM }}>
                <Row gap={8}><span style={{ color: T.accent }}>◇</span>{r.name}</Row>
              </td>
              <td style={{ padding: '10px 12px', color: T.textMuted }}>{r.owner}</td>
              <td style={{ padding: '10px 12px', fontFamily: FM, color: T.textMuted }}>{r.runtime}</td>
              <td style={{ padding: '10px 12px', fontFamily: FM, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.deploys === 0 ? '—' : `${r.deploys.toFixed(1)}`}</td>
              <td style={{ padding: '10px 12px' }}><StatusDot state={r.status}/></td>
              <td style={{ padding: '10px 12px', textAlign: 'right', color: T.textDim }}>⋯</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Row style={{ padding: '10px 16px', borderTop: `1px solid ${T.border}`, fontSize: 11, color: T.textDim }}>
        <span>Showing {sorted.length} of 142 · sorted by <span style={{ color: T.accent }}>{sortKey} ({sortDir})</span></span>
        <Row gap={4} style={{ marginLeft: 'auto' }}>
          <IconButton size="sm" variant="ghost" icon="‹"/>
          <span style={{ fontFamily: FM, padding: '0 8px' }}>1 / 29</span>
          <IconButton size="sm" variant="ghost" icon="›"/>
        </Row>
      </Row>
    </div>
  );
}

/* ────── Selectable Grid ────── */

function SelectableGrid() {
  const [selected, setSelected] = React.useState(new Set(['ent_0x7a32']));
  const rows = [
    ['ent_0x7a2f', 'service',    'payment-webhook-v2', 0.994, 'github', '2m'],
    ['ent_0x7a30', 'person',     'Priya Khanna',        0.981, 'okta',   '1h'],
    ['ent_0x7a31', 'document',   'runbook-oncall.md',   0.974, 'notion', '3h'],
    ['ent_0x7a32', 'service',    'ledger-core',         0.964, 'github', '4h'],
    ['ent_0x7a33', 'incident',   'inc-4812',            0.948, 'pagerduty','8h'],
    ['ent_0x7a34', 'deployment', 'ledger@v2.8.1',       0.923, 'github', '1d'],
  ];
  const toggle = id => setSelected(s => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const allSel = selected.size === rows.length;
  const indet = selected.size > 0 && !allSel;

  return (
    <div style={{ width: '100%', background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
      {selected.size > 0 && (
        <Row gap={10} style={{ padding: '8px 14px', background: T.accentDim, borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 11, color: T.accent, fontFamily: FM }}>{selected.size} selected</span>
          <UIBtn size="sm" variant="ghost">Re-extract</UIBtn>
          <UIBtn size="sm" variant="ghost">Tag</UIBtn>
          <UIBtn size="sm" variant="ghost">Delete</UIBtn>
          <span onClick={() => setSelected(new Set())} style={{ marginLeft: 'auto', fontSize: 11, color: T.textDim, cursor: 'pointer' }}>Clear</span>
        </Row>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: FM }}>
        <thead>
          <tr style={{ background: T.panel2, borderBottom: `1px solid ${T.border}` }}>
            <th style={{ ...gridHead(28), padding: '6px 10px' }}>
              <input type="checkbox" checked={allSel} ref={el => { if (el) el.indeterminate = indet; }} onChange={() => setSelected(allSel ? new Set() : new Set(rows.map(r => r[0])))}/>
            </th>
            {['id','type','name','confidence','source','updated'].map((h, i) => (
              <th key={h} style={{ ...gridHead(), textAlign: i === 3 ? 'right' : 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const sel = selected.has(r[0]);
            return (
              <tr key={r[0]} onClick={() => toggle(r[0])} style={{ background: sel ? T.accentDim : 'transparent', borderBottom: `1px solid ${T.border}`, cursor: 'pointer' }}>
                <td style={gridCell(28)}><input type="checkbox" checked={sel} onChange={() => toggle(r[0])} onClick={e => e.stopPropagation()}/></td>
                <td style={{ ...gridCell(), color: T.textDim }}>{r[0]}</td>
                <td style={gridCell()}><Badge size="sm" color={r[1] === 'person' ? 'purple' : r[1] === 'document' ? 'pink' : r[1] === 'incident' ? 'warn' : r[1] === 'deployment' ? 'ok' : 'accent'} dot>{r[1]}</Badge></td>
                <td style={gridCell()}>{r[2]}</td>
                <td style={{ ...gridCell(), textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: r[3] > 0.95 ? T.ok : T.warn }}>{r[3].toFixed(3)}</td>
                <td style={{ ...gridCell(), color: T.textMuted }}>{r[4]}</td>
                <td style={{ ...gridCell(), textAlign: 'right', color: T.textDim }}>{r[5]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const gridHead = (w) => ({ textAlign: 'left', padding: '6px 10px', fontWeight: 500, color: T.textDim, textTransform: 'uppercase', fontSize: 9, letterSpacing: 1.2, ...(w ? { width: w } : {}) });
const gridCell = (w) => ({ padding: '6px 10px', ...(w ? { width: w } : {}) });

/* ────── Expandable Tree ────── */

function ExpandableTree() {
  const [open, setOpen] = React.useState(new Set(['shipit', 'services', 'notify']));
  const tree = [
    { id: 'shipit', n: 'shipit-api', kids: [
      { id: 'services', n: 'services', kids: [
        { id: 'payment', n: 'payment-webhook-v2' },
        { id: 'ledger',  n: 'ledger-core' },
        { id: 'notify',  n: 'notify-dispatch', kids: [
          { id: 'idx',  n: 'index.ts', leaf: true },
          { id: 'hdl',  n: 'handler.ts', leaf: true },
          { id: 'sch',  n: 'schema.ts', leaf: true },
        ] },
      ] },
      { id: 'pkg', n: 'packages' },
      { id: 'rdm', n: 'README.md', leaf: true },
    ] },
  ];
  const toggle = id => setOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const renderRow = (node, depth) => {
    const isOpen = open.has(node.id);
    const hasKids = node.kids?.length;
    const glyph = node.leaf ? '▢' : isOpen ? '▾' : '▸';
    return (
      <React.Fragment key={node.id}>
        <Row gap={6} onClick={() => hasKids && toggle(node.id)} style={{
          padding: '4px 8px', paddingLeft: 8 + depth * 16, borderRadius: 4,
          cursor: hasKids ? 'pointer' : 'default', fontSize: 12,
          color: node.leaf ? T.textMuted : T.text,
        }}>
          <span style={{ color: T.textDim, width: 12 }}>{glyph}</span>
          <span>{node.n}</span>
        </Row>
        {hasKids && isOpen && node.kids.map(k => renderRow(k, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div style={{ width: 320, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, fontFamily: FM }}>
      {tree.map(n => renderRow(n, 0))}
    </div>
  );
}

/* ────── Drag Kanban ────── */

function DragKanban() {
  const [cards, setCards] = React.useState([
    { id: 1, t: 'Add Slack connector', p: 'high', col: 'backlog' },
    { id: 2, t: 'Schema migration v3', p: 'med',  col: 'backlog' },
    { id: 3, t: 'Graph rendering perf', p: 'high', col: 'progress', who: 'PK' },
    { id: 4, t: 'Incident mode polish', p: 'low',  col: 'progress', who: 'JA' },
    { id: 5, t: 'Ask bar streaming',    p: 'med',  col: 'shipped',  who: 'MT' },
  ]);
  const [dragId, setDragId] = React.useState(null);
  const [over, setOver] = React.useState(null);

  const cols = [
    { id: 'backlog',  title: 'Backlog' },
    { id: 'progress', title: 'In progress' },
    { id: 'shipped',  title: 'Shipped' },
  ];

  const drop = colId => {
    if (dragId !== null) setCards(cs => cs.map(c => c.id === dragId ? { ...c, col: colId } : c));
    setDragId(null); setOver(null);
  };

  return (
    <Grid cols={3} gap={10} style={{ width: '100%' }}>
      {cols.map(col => {
        const colCards = cards.filter(c => c.col === col.id);
        return (
          <div key={col.id}
            onDragOver={e => { e.preventDefault(); setOver(col.id); }}
            onDragLeave={() => setOver(o => o === col.id ? null : o)}
            onDrop={() => drop(col.id)}
            style={{
              background: T.panel,
              border: `1px ${over === col.id ? 'solid' : 'solid'} ${over === col.id ? T.accent : T.border}`,
              borderRadius: 8, padding: 10, minHeight: 180,
              transition: 'border-color 120ms',
            }}>
            <Row style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{col.title}</span>
              <span style={{ fontFamily: FM, fontSize: 10, color: T.textDim, marginLeft: 'auto' }}>{colCards.length}</span>
            </Row>
            <Col gap={6}>
              {colCards.map(c => (
                <div key={c.id}
                  draggable
                  onDragStart={() => setDragId(c.id)}
                  onDragEnd={() => { setDragId(null); setOver(null); }}
                  style={{
                    padding: 10, background: T.panel2, border: `1px solid ${T.border}`,
                    borderRadius: 6, cursor: 'grab',
                    opacity: dragId === c.id ? 0.4 : 1,
                  }}>
                  <div style={{ fontSize: 12, marginBottom: 8 }}>{c.t}</div>
                  <Row gap={6}>
                    <Badge size="sm" color={c.p === 'high' ? 'err' : c.p === 'med' ? 'warn' : 'neutral'}>{c.p}</Badge>
                    {c.who && <div style={{ marginLeft: 'auto' }}><Avatar size="xs" initials={c.who}/></div>}
                  </Row>
                </div>
              ))}
            </Col>
          </div>
        );
      })}
    </Grid>
  );
}

Object.assign(window, { SecData, SortableTable, SelectableGrid, ExpandableTree, DragKanban, gridHead, gridCell });
