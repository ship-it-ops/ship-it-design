// Button primitives: Button, IconButton, ButtonGroup, SplitButton, FAB.
// Real hover + focus + keyboard behavior. Load after tokens.jsx.

const _btnSizes = {
  sm: { padding: '0 10px', fontSize: 11, height: 26, radius: 5, iconSize: 11, gap: 5 },
  md: { padding: '0 12px', fontSize: 12, height: 32, radius: 6, iconSize: 12, gap: 6 },
  lg: { padding: '0 16px', fontSize: 13, height: 38, radius: 7, iconSize: 13, gap: 7 },
};

const _btnVariants = {
  primary: {
    bg: tokens.accent,
    color: '#0a0a0b',
    border: tokens.accent,
    hoverFilter: 'brightness(1.08)',
  },
  secondary: {
    bg: tokens.panel2,
    color: tokens.text,
    border: tokens.border,
    hoverBg: 'color-mix(in oklab, var(--panel-2), white 4%)',
  },
  ghost: { bg: 'transparent', color: tokens.text, border: 'transparent', hoverBg: tokens.panel2 },
  outline: {
    bg: 'transparent',
    color: tokens.text,
    border: tokens.borderStrong,
    hoverBg: tokens.panel2,
  },
  destructive: {
    bg: tokens.err,
    color: '#0a0a0b',
    border: tokens.err,
    hoverFilter: 'brightness(1.08)',
  },
  link: { bg: 'transparent', color: tokens.accent, border: 'transparent', underline: true },
  success: { bg: tokens.ok, color: '#0a0a0b', border: tokens.ok, hoverFilter: 'brightness(1.08)' },
};

function Button({
  variant = 'primary',
  size = 'md',
  icon,
  trailing,
  loading,
  disabled,
  children,
  onClick,
  type = 'button',
  fullWidth,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = _btnSizes[size];
  const v = _btnVariants[variant];
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        height: s.height,
        background: hover && !isDisabled && v.hoverBg ? v.hoverBg : v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: s.radius,
        fontWeight: 500,
        fontFamily: tokens.fontSans,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled && !loading ? 0.4 : 1,
        textDecoration: v.underline ? 'underline' : 'none',
        textUnderlineOffset: 3,
        filter: hover && !isDisabled && v.hoverFilter ? v.hoverFilter : 'none',
        boxShadow: focus && !isDisabled ? `0 0 0 3px ${tokens.accentDim}` : 'none',
        outline: 'none',
        width: fullWidth ? '100%' : 'auto',
        transition: 'background 120ms, filter 120ms, box-shadow 120ms',
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <span
          style={{
            width: s.iconSize,
            height: s.iconSize,
            border: `1.5px solid ${v.color}`,
            borderTopColor: 'transparent',
            borderRadius: 999,
            animation: 'spin 0.7s linear infinite',
          }}
        />
      )}
      {!loading && icon && (
        <span style={{ fontSize: s.iconSize, opacity: 0.9, lineHeight: 1 }}>{icon}</span>
      )}
      {children}
      {trailing && (
        <span style={{ fontSize: s.iconSize, opacity: 0.6, lineHeight: 1 }}>{trailing}</span>
      )}
    </button>
  );
}

function IconButton({
  icon,
  size = 'md',
  variant = 'secondary',
  onClick,
  title,
  disabled,
  style = {},
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const dim = { sm: 26, md: 32, lg: 38 }[size];
  const v = _btnVariants[variant];
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: dim,
        height: dim,
        display: 'grid',
        placeItems: 'center',
        background: hover && !disabled && v.hoverBg ? v.hoverBg : v.bg,
        color: v.color === '#0a0a0b' ? '#0a0a0b' : tokens.textMuted,
        border: `1px solid ${v.border}`,
        borderRadius: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: size === 'sm' ? 12 : size === 'lg' ? 15 : 13,
        filter: hover && !disabled && v.hoverFilter ? v.hoverFilter : 'none',
        boxShadow: focus && !disabled ? `0 0 0 3px ${tokens.accentDim}` : 'none',
        outline: 'none',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 120ms',
        ...style,
      }}
    >
      {icon}
    </button>
  );
}

function ButtonGroup({ children }) {
  const arr = React.Children.toArray(children);
  return (
    <div
      style={{
        display: 'inline-flex',
        borderRadius: 6,
        overflow: 'hidden',
        border: `1px solid ${tokens.border}`,
      }}
    >
      {arr.map((c, i) =>
        React.cloneElement(c, {
          key: i,
          style: {
            borderRadius: 0,
            borderLeft: i === 0 ? 'none' : `1px solid ${tokens.border}`,
            borderTop: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            ...(c.props.style || {}),
          },
        }),
      )}
    </div>
  );
}

function SplitButton({ children, onClick, onMenu, variant = 'primary' }) {
  return (
    <div style={{ display: 'inline-flex' }}>
      <Button
        variant={variant}
        onClick={onClick}
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRight: '1px solid rgba(0,0,0,0.2)',
        }}
      >
        {children}
      </Button>
      <Button
        variant={variant}
        onClick={onMenu}
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          padding: '0 8px',
        }}
      >
        ▾
      </Button>
    </div>
  );
}

function FAB({ icon = '✦', onClick, style = {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 48,
        height: 48,
        borderRadius: 999,
        background: tokens.accent,
        color: '#0a0a0b',
        display: 'grid',
        placeItems: 'center',
        fontSize: 18,
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        boxShadow: hover
          ? `0 14px 36px ${tokens.accentGlow}, 0 4px 10px rgba(0,0,0,0.45)`
          : `0 10px 30px ${tokens.accentGlow}, 0 2px 6px rgba(0,0,0,0.4)`,
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 180ms',
        ...style,
      }}
    >
      {icon}
    </button>
  );
}

Object.assign(window, { Button, IconButton, ButtonGroup, SplitButton, FAB });
