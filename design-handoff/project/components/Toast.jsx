// Toast system with provider + hook. Usage:
//   <ToastProvider>... app ...</ToastProvider>
//   const toast = useToast(); toast({ title: 'Saved', variant: 'success' });

const ToastCtx = React.createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const push = React.useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    const toast = { id, duration: 4000, ...t };
    setToasts((ts) => [...ts, toast]);
    if (toast.duration > 0) {
      setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), toast.duration);
    }
    return id;
  }, []);
  const dismiss = React.useCallback((id) => setToasts((ts) => ts.filter((x) => x.id !== id)), []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 70,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function useToast() {
  const push = React.useContext(ToastCtx);
  if (!push) throw new Error('useToast must be inside <ToastProvider>');
  return push;
}

function ToastCard({ toast, onDismiss }) {
  const variants = {
    default: { bg: tokens.panel, border: tokens.border, icon: '●', iconColor: tokens.textDim },
    success: { bg: tokens.panel, border: tokens.border, icon: '✓', iconColor: tokens.ok },
    error: { bg: tokens.panel, border: tokens.border, icon: '×', iconColor: tokens.err },
    warn: { bg: tokens.panel, border: tokens.border, icon: '!', iconColor: tokens.warn },
    info: { bg: tokens.panel, border: tokens.border, icon: 'i', iconColor: tokens.accent },
  };
  const v = variants[toast.variant || 'default'];
  return (
    <div
      style={{
        minWidth: 280,
        maxWidth: 380,
        padding: 12,
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: 8,
        boxShadow: tokens.shadowLg,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        pointerEvents: 'auto',
        animation: 'toastIn 220ms cubic-bezier(0.2,0.8,0.2,1)',
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          background: 'color-mix(in oklab, currentColor, transparent 85%)',
          color: v.iconColor,
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          fontWeight: 600,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {v.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && <div style={{ fontSize: 13, fontWeight: 500 }}>{toast.title}</div>}
        {toast.description && (
          <div style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2, lineHeight: 1.5 }}>
            {toast.description}
          </div>
        )}
        {toast.action && <div style={{ marginTop: 8 }}>{toast.action}</div>}
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: tokens.textDim,
          cursor: 'pointer',
          fontSize: 15,
          padding: 0,
          lineHeight: 1,
          marginTop: -2,
        }}
      >
        ×
      </button>
    </div>
  );
}

Object.assign(window, { ToastProvider, useToast, ToastCard, ToastCtx });
