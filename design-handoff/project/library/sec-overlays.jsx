// Library · Overlays — live modals, drawers, popovers, tooltips, menus.

function SecOverlays() {
  return (
    <Section id="overlays" title="Overlays" count="9 patterns" desc="Click any trigger to open the real overlay. All are dismissable with ESC or backdrop click.">

      <Subsection title="Dialog (modal)" note="live">
        <Specimen code={`<Dialog open={open} onClose={…} title="Disconnect github">
  Are you sure?
</Dialog>`}>
          <LiveDialogDemo/>
        </Specimen>
      </Subsection>

      <Subsection title="Drawer" note="live">
        <Specimen code={`<Drawer open={open} onClose={…} side="right" title="Filters"/>`}>
          <LiveDrawerDemo/>
        </Specimen>
      </Subsection>

      <Subsection title="Sheet (bottom)" note="live">
        <Specimen code={`<Sheet open={open} onClose={…}/>`}>
          <LiveSheetDemo/>
        </Specimen>
      </Subsection>

      <Subsection title="Popover" note="live">
        <Specimen code={`<Popover anchor={btn} open={open}>…</Popover>`}>
          <LivePopoverDemo/>
        </Specimen>
      </Subsection>

      <Subsection title="Tooltip" note="live · hover">
        <Specimen code={`<Tooltip content="Add new source">
  <IconButton icon="+"/>
</Tooltip>`}>
          <Row gap={20}>
            <Tooltip content="Add new source"><IconButton icon="+"/></Tooltip>
            <Tooltip content="Settings · ⌘,"><IconButton icon="⚙"/></Tooltip>
            <Tooltip content="On call · Priya K."><Avatar name="Priya Khanna" status="ok"/></Tooltip>
            <Tooltip content="3 unresolved incidents"><Badge variant="warn">3</Badge></Tooltip>
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Dropdown menu" note="live">
        <Specimen code={`<DropdownMenu trigger={<Button trailing="▾">Actions</Button>}>
  <MenuItem>Open</MenuItem>
  <MenuItem>Duplicate</MenuItem>
  <MenuSeparator/>
  <MenuItem destructive>Delete</MenuItem>
</DropdownMenu>`}>
          <LiveDropdownDemo/>
        </Specimen>
      </Subsection>

      <Subsection title="Context menu" note="right-click">
        <Specimen code={`<ContextMenu items={[…]}>
  <Card>Right-click me</Card>
</ContextMenu>`}>
          <LiveContextMenuDemo/>
        </Specimen>
      </Subsection>

      <Subsection title="Hover card">
        <Specimen code={`<HoverCard content={<EntityPreview id="…"/>}>
  <Mention>@priya</Mention>
</HoverCard>`}>
          <Row gap={4} style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>
            <span>Owner is</span>
            <LiveHoverCardDemo/>
            <span>· on-call through Friday.</span>
          </Row>
        </Specimen>
      </Subsection>

      <Subsection title="Toast positions">
        <Specimen code={`<Toast position="top-right" variant="ok" title="Saved"/>`}>
          <Row gap={10} wrap>
            {[
              { v: 'ok', t: 'Schema saved', d: '142 entity types committed.' },
              { v: 'info', t: 'Sync running', d: 'github · 4 repos remaining' },
              { v: 'warn', t: 'Token expiring', d: 'GitHub PAT expires in 3 days.' },
              { v: 'err', t: 'Sync failed', d: 'Notion · token rejected' },
            ].map(t => (
              <div key={t.t} style={{ width: 280, padding: 12, background: T.panel, border: `1px solid ${T.border}`, borderLeft: `2px solid var(--${t.v})`, borderRadius: 8, boxShadow: T.shadow }}>
                <Row gap={10} style={{ alignItems: 'flex-start' }}>
                  <span style={{ color: `var(--${t.v})`, fontSize: 14, marginTop: 1 }}>{t.v === 'ok' ? '✓' : t.v === 'warn' ? '!' : t.v === 'err' ? '×' : 'ℹ'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{t.t}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{t.d}</div>
                  </div>
                  <span style={{ color: T.textDim, cursor: 'pointer' }}>×</span>
                </Row>
              </div>
            ))}
          </Row>
        </Specimen>
      </Subsection>

    </Section>
  );
}

/* ────── Live demos ────── */

function LiveDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Row gap={10}>
      <UIBtn variant="secondary" onClick={() => setOpen(true)}>Open dialog</UIBtn>
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'oklch(0 0 0 / 0.55)', backdropFilter: 'blur(4px)',
          display: 'grid', placeItems: 'center', zIndex: 100,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 460, background: T.panel, border: `1px solid ${T.borderStrong}`, borderRadius: 14,
            boxShadow: T.shadowLg, padding: 24,
          }}>
            <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.3, marginBottom: 4 }}>Disconnect github?</div>
            <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.55, marginBottom: 20 }}>This stops live sync immediately. Your existing graph won't change, but new commits, PRs, and code references won't appear.</div>
            <Row gap={8} style={{ justifyContent: 'flex-end' }}>
              <UIBtn variant="ghost" onClick={() => setOpen(false)}>Cancel</UIBtn>
              <UIBtn variant="danger" onClick={() => setOpen(false)}>Disconnect</UIBtn>
            </Row>
          </div>
        </div>
      )}
    </Row>
  );
}

function LiveDrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <UIBtn variant="secondary" onClick={() => setOpen(true)}>Open drawer (right)</UIBtn>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0 / 0.4)', zIndex: 100 }}/>
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 360,
            background: T.panel, borderLeft: `1px solid ${T.borderStrong}`,
            zIndex: 101, padding: 22, boxShadow: T.shadowLg,
          }}>
            <Row style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Filters</div>
              <span onClick={() => setOpen(false)} style={{ marginLeft: 'auto', cursor: 'pointer', color: T.textDim }}>×</span>
            </Row>
            <Col gap={16}>
              <Col gap={6}>
                <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM, textTransform: 'uppercase', letterSpacing: 1.2 }}>Entity type</div>
                <Col gap={4}>
                  {['Service','Person','Document','Deployment'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={t !== 'Deployment'}/> {t}
                    </label>
                  ))}
                </Col>
              </Col>
            </Col>
          </div>
        </>
      )}
    </>
  );
}

function LiveSheetDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <UIBtn variant="secondary" onClick={() => setOpen(true)}>Open sheet (bottom)</UIBtn>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'oklch(0 0 0 / 0.4)', zIndex: 100 }}/>
          <div style={{
            position: 'fixed', left: '50%', bottom: 0, transform: 'translateX(-50%)',
            width: 'min(640px, 90vw)', background: T.panel,
            borderTop: `1px solid ${T.borderStrong}`,
            borderTopLeftRadius: 14, borderTopRightRadius: 14,
            zIndex: 101, padding: 20, boxShadow: T.shadowLg,
          }}>
            <div style={{ width: 36, height: 4, background: T.border, borderRadius: 999, margin: '0 auto 14px' }}/>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Quick actions</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14 }}>Press a key to run.</div>
            <Col gap={6}>
              {[['↵','Run query'],['/','Filter results'],['⌘E','Export CSV'],['⌘.','Close sheet']].map(([k, l]) => (
                <Row key={l} gap={10} onClick={k === '⌘.' ? () => setOpen(false) : undefined} style={{ padding: '8px 12px', background: T.panel2, borderRadius: 6, cursor: 'pointer' }}>
                  <kbd style={{ fontFamily: FM, fontSize: 11, padding: '2px 6px', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4 }}>{k}</kbd>
                  <span style={{ fontSize: 13 }}>{l}</span>
                </Row>
              ))}
            </Col>
          </div>
        </>
      )}
    </>
  );
}

function LivePopoverDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <UIBtn variant="secondary" onClick={() => setOpen(o => !o)} trailing="▾">Show popover</UIBtn>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          width: 280, padding: 14, background: T.panel,
          border: `1px solid ${T.borderStrong}`, borderRadius: 10, boxShadow: T.shadowLg, zIndex: 10,
        }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Service · payment-webhook</div>
          <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginBottom: 10 }}>Owned by Payments. Last deployed 2h ago. 142 dependents.</div>
          <Row gap={6}>
            <UIBtn size="sm" variant="primary">Open</UIBtn>
            <UIBtn size="sm" variant="ghost" onClick={() => setOpen(false)}>Close</UIBtn>
          </Row>
        </div>
      )}
    </div>
  );
}

function LiveDropdownDemo() {
  const [open, setOpen] = React.useState(false);
  const items = [
    { l: 'Open in graph', k: '↵' },
    { l: 'Copy entity ID', k: '⌘C' },
    { l: 'View source', k: '⌘O' },
    { type: 'sep' },
    { l: 'Re-extract', k: 'R' },
    { type: 'sep' },
    { l: 'Delete', destructive: true, k: '⌫' },
  ];
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <UIBtn variant="secondary" onClick={() => setOpen(o => !o)} trailing="▾">Actions</UIBtn>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0,
            width: 220, padding: 4, background: T.panel,
            border: `1px solid ${T.borderStrong}`, borderRadius: 8, boxShadow: T.shadowLg, zIndex: 10,
          }}>
            {items.map((it, i) => it.type === 'sep' ? (
              <div key={i} style={{ height: 1, background: T.border, margin: '4px 0' }}/>
            ) : (
              <Row key={i} onClick={() => setOpen(false)} style={{
                padding: '6px 10px', borderRadius: 4, cursor: 'pointer',
                color: it.destructive ? T.err : T.text, fontSize: 12,
              }}>
                <span>{it.l}</span>
                <span style={{ fontFamily: FM, fontSize: 10, color: T.textDim, marginLeft: 'auto' }}>{it.k}</span>
              </Row>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LiveContextMenuDemo() {
  const [menu, setMenu] = React.useState(null);
  return (
    <div onContextMenu={e => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }); }} onClick={() => setMenu(null)} style={{
      width: 320, height: 90, padding: 16, background: T.panel, border: `1px dashed ${T.border}`, borderRadius: 10,
      display: 'grid', placeItems: 'center', cursor: 'context-menu',
      fontSize: 12, color: T.textMuted,
    }}>Right-click anywhere in this card</div>
  );
}

function LiveHoverCardDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span style={{ color: T.accent, cursor: 'pointer' }}>@priya</span>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          width: 280, padding: 14, background: T.panel,
          border: `1px solid ${T.borderStrong}`, borderRadius: 10, boxShadow: T.shadowLg, zIndex: 10,
        }}>
          <Row gap={10} style={{ marginBottom: 8 }}>
            <Avatar name="Priya Khanna" size="md" status="ok"/>
            <Col gap={0}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Priya Khanna</div>
              <div style={{ fontSize: 11, color: T.textDim, fontFamily: FM }}>staff eng · payments</div>
            </Col>
          </Row>
          <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.55 }}>Owns 4 services. On-call rotation Wed–Fri. Last commit 2h ago.</div>
        </div>
      )}
    </span>
  );
}

Object.assign(window, { SecOverlays, LiveDialogDemo, LiveDrawerDemo, LiveSheetDemo, LivePopoverDemo, LiveDropdownDemo, LiveContextMenuDemo, LiveHoverCardDemo });
