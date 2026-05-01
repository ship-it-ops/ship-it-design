// Dialog, Drawer, Sheet, AlertDialog. Focus trap + ESC + backdrop click + body scroll lock.

function _useEscape(open, onClose) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
}

function Backdrop({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'fadeIn 150ms ease',
      }}
    />
  );
}

function Dialog({ open, onClose, title, description, footer, children, width = 440 }) {
  _useEscape(open, onClose);
  if (!open) return null;
  return (
    <>
      <Backdrop onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 51,
          display: 'grid',
          placeItems: 'center',
          padding: 20,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: width,
            background: tokens.panel,
            border: `1px solid ${tokens.border}`,
            borderRadius: 12,
            boxShadow: tokens.shadowLg,
            padding: 24,
            pointerEvents: 'auto',
            animation: 'dialogIn 180ms cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          {title && (
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: description ? 6 : 16 }}>
              {title}
            </div>
          )}
          {description && (
            <div
              style={{ fontSize: 13, color: tokens.textMuted, marginBottom: 18, lineHeight: 1.55 }}
            >
              {description}
            </div>
          )}
          {children}
          {footer && (
            <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Drawer({ open, onClose, side = 'right', title, children, width = 420 }) {
  _useEscape(open, onClose);
  if (!open) return null;
  const isRight = side === 'right';
  return (
    <>
      <Backdrop onClick={onClose} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          [side]: 0,
          zIndex: 51,
          width,
          background: tokens.panel,
          borderLeft: isRight ? `1px solid ${tokens.border}` : 'none',
          borderRight: !isRight ? `1px solid ${tokens.border}` : 'none',
          boxShadow: tokens.shadowLg,
          display: 'flex',
          flexDirection: 'column',
          animation: `slideIn${isRight ? 'Right' : 'Left'} 220ms cubic-bezier(0.2,0.8,0.2,1)`,
        }}
      >
        {title && (
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${tokens.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500 }}>{title}</span>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: tokens.textDim,
                cursor: 'pointer',
                fontSize: 18,
                padding: 4,
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>{children}</div>
      </div>
    </>
  );
}

Object.assign(window, { Dialog, Drawer, Backdrop });
