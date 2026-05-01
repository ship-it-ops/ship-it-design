// Command palette (⌘K) + Tweaks panel

function CommandPalette({ open, onClose, onAsk, nav, seed }) {
  const t = useTheme();
  const [q, setQ] = React.useState(seed || '');
  React.useEffect(() => {
    setQ(seed || '');
  }, [seed, open]);
  React.useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open ? onClose() : window.__openAsk?.();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;

  const matches = SERVICES.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())).slice(
    0,
    5,
  );
  const isQuestion = q.trim().length > 0 && q.trim().split(' ').length > 2;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 120,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 640,
          maxWidth: '90vw',
          background: t.panel,
          border: `1px solid ${t.borderStrong}`,
          borderRadius: 12,
          boxShadow: t.shadow,
          overflow: 'hidden',
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 18px',
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <span style={{ color: t.accent, fontSize: 16 }}>✦</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isQuestion) {
                onAsk(q);
                onClose();
              }
              if (e.key === 'Enter' && matches.length) {
                nav('entity', matches[0].id);
                onClose();
              }
            }}
            placeholder="Ask or jump to anything…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: t.text,
              fontSize: 15,
              fontFamily: FONT,
            }}
          />
          <AskHint>ESC</AskHint>
        </div>

        <div style={{ overflow: 'auto' }}>
          {isQuestion && (
            <div
              onClick={() => {
                onAsk(q);
                onClose();
              }}
              style={{
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                background: t.panel2,
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <span style={{ color: t.accent }}>✦</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}>
                  Ask ShipIt: <span style={{ color: t.accent }}>{q}</span>
                </div>
                <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, marginTop: 2 }}>
                  natural language query · ~1.2s
                </div>
              </div>
              <AskHint>⏎</AskHint>
            </div>
          )}

          {matches.length > 0 && (
            <div>
              <div
                style={{
                  padding: '8px 18px 4px',
                  fontSize: 10,
                  color: t.textDim,
                  fontFamily: MONO,
                  textTransform: 'uppercase',
                  letterSpacing: 1.3,
                }}
              >
                services
              </div>
              {matches.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    nav('entity', s.id);
                    onClose();
                  }}
                  style={{
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                  }}
                >
                  <TypeBadge type={s.type} />
                  <MonoText style={{ fontSize: 13 }}>{s.name}</MonoText>
                  <span style={{ fontSize: 11, color: t.textMuted, flex: 1 }}>{s.owner}</span>
                  <Pill>tier {s.tier}</Pill>
                </div>
              ))}
            </div>
          )}

          {q === '' && (
            <div>
              <div
                style={{
                  padding: '8px 18px 4px',
                  fontSize: 10,
                  color: t.textDim,
                  fontFamily: MONO,
                  textTransform: 'uppercase',
                  letterSpacing: 1.3,
                }}
              >
                suggested
              </div>
              {SAMPLE_QUESTIONS.slice(0, 4).map((sq) => (
                <div
                  key={sq}
                  onClick={() => {
                    onAsk(sq);
                    onClose();
                  }}
                  style={{
                    padding: '10px 18px',
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: t.accent }}>✦</span> {sq}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            padding: '10px 18px',
            borderTop: `1px solid ${t.border}`,
            fontSize: 10,
            color: t.textDim,
            fontFamily: MONO,
            display: 'flex',
            gap: 14,
          }}
        >
          <span>⏎ open</span>
          <span>⌘⏎ ask</span>
          <span>ESC close</span>
          <span style={{ marginLeft: 'auto' }}>powered by MCP · 8 tools</span>
        </div>
      </div>
    </div>
  );
}

function TweaksPanel({ tweaks, setTweaks, mode, setMode }) {
  const t = useTheme();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  if (!open) return null;

  function update(k, v) {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 280,
        background: t.panel,
        border: `1px solid ${t.borderStrong}`,
        borderRadius: 10,
        boxShadow: t.shadow,
        padding: 14,
        zIndex: 90,
        fontFamily: FONT,
        color: t.text,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>Tweaks</div>
        <div
          onClick={() => setOpen(false)}
          style={{ marginLeft: 'auto', cursor: 'pointer', color: t.textDim, fontSize: 16 }}
        >
          ×
        </div>
      </div>

      <TweakRow label="Theme">
        <div style={{ display: 'flex', gap: 4 }}>
          {['dark', 'light'].map((m) => (
            <div
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '5px 0',
                textAlign: 'center',
                fontSize: 11,
                fontFamily: MONO,
                background: mode === m ? t.accent : t.panel2,
                color: mode === m ? '#0a0a0b' : t.textMuted,
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </TweakRow>

      <TweakRow label="Accent hue">
        <input
          type="range"
          min="0"
          max="360"
          step="10"
          value={tweaks.accentHue}
          onChange={(e) => update('accentHue', parseInt(e.target.value))}
          style={{ width: '100%', accentColor: t.accent }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: t.textDim,
            fontFamily: MONO,
          }}
        >
          <span>hue: {tweaks.accentHue}°</span>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: t.accent,
              display: 'inline-block',
            }}
          />
        </div>
      </TweakRow>

      <TweakRow label="Graph layout">
        <div style={{ display: 'flex', gap: 4 }}>
          {['radial', 'hierarchical', 'force'].map((l) => (
            <div
              key={l}
              onClick={() => update('graphLayout', l)}
              style={{
                flex: 1,
                padding: '5px 0',
                textAlign: 'center',
                fontSize: 10,
                fontFamily: MONO,
                background: tweaks.graphLayout === l ? t.accent : t.panel2,
                color: tweaks.graphLayout === l ? '#0a0a0b' : t.textMuted,
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </TweakRow>
    </div>
  );
}

function TweakRow({ label, children }) {
  const t = useTheme();
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 10,
          color: t.textDim,
          fontFamily: MONO,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { CommandPalette, TweaksPanel });
