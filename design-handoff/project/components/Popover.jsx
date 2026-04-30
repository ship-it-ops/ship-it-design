// Popover, Tooltip, Dropdown, ContextMenu. Click-outside to close.

function _useOutsideClick(ref, handler, active) {
  React.useEffect(() => {
    if (!active) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [ref, handler, active]);
}

function Popover({ open, onClose, trigger, children, placement = 'bottom-start', width = 240 }) {
  const [anchor, setAnchor] = React.useState(null);
  const popRef = React.useRef(null);
  _useOutsideClick(popRef, () => onClose && onClose(), open);

  const triggerEl = React.cloneElement(trigger, {
    ref: setAnchor,
    onClick: (e) => {
      trigger.props.onClick && trigger.props.onClick(e);
    },
  });

  return (
    <span style={{ position: 'relative', display: 'inline-block' }} ref={popRef}>
      {triggerEl}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: placement.startsWith('bottom') ? 'calc(100% + 6px)' : 'auto',
            bottom: placement.startsWith('top') ? 'calc(100% + 6px)' : 'auto',
            left: placement.endsWith('start') ? 0 : 'auto',
            right: placement.endsWith('end') ? 0 : 'auto',
            width,
            zIndex: 40,
            background: tokens.panel,
            border: `1px solid ${tokens.border}`,
            borderRadius: 8,
            boxShadow: tokens.shadowLg,
            padding: 6,
            animation: 'popIn 140ms cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          {children}
        </div>
      )}
    </span>
  );
}

function Tooltip({ content, children, placement = 'top' }) {
  const [show, setShow] = React.useState(false);
  const [timer, setTimer] = React.useState(null);
  const onEnter = () => {
    setTimer(setTimeout(() => setShow(true), 400));
  };
  const onLeave = () => {
    timer && clearTimeout(timer);
    setShow(false);
  };
  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {children}
      {show && (
        <div
          style={{
            position: 'absolute',
            [placement]: 'calc(100% + 6px)',
            left: placement === 'top' || placement === 'bottom' ? '50%' : 'auto',
            transform: placement === 'top' || placement === 'bottom' ? 'translateX(-50%)' : 'none',
            padding: '5px 8px',
            fontSize: 11,
            background: tokens.text,
            color: tokens.bg,
            borderRadius: 5,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 60,
            animation: 'popIn 120ms',
          }}
        >
          {content}
        </div>
      )}
    </span>
  );
}

function MenuItem({ icon, trailing, onClick, danger, disabled, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 5,
        fontSize: 12,
        color: danger ? tokens.err : tokens.text,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        background: hover && !disabled ? tokens.panel2 : 'transparent',
      }}
    >
      {icon && <span style={{ fontSize: 12, width: 14, opacity: 0.7 }}>{icon}</span>}
      <span style={{ flex: 1 }}>{children}</span>
      {trailing && (
        <span style={{ fontSize: 10, color: tokens.textDim, fontFamily: tokens.fontMono }}>
          {trailing}
        </span>
      )}
    </div>
  );
}

function MenuSeparator() {
  return <div style={{ height: 1, background: tokens.border, margin: '4px 0' }} />;
}

Object.assign(window, { Popover, Tooltip, MenuItem, MenuSeparator });
