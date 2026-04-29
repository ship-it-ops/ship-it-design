// Input primitives: Input, Textarea, Select, Checkbox, Radio, Switch, Slider, SearchInput.
// All controlled + keyboard accessible. Load after tokens.jsx.

const _inputSizes = {
  sm: { h: 28, fs: 12, px: 8 },
  md: { h: 34, fs: 13, px: 10 },
  lg: { h: 40, fs: 14, px: 12 },
};

function Input({
  value = '', onChange, onFocus, onBlur,
  placeholder, icon, trailing,
  error, disabled, size = 'md',
  type = 'text', autoFocus,
  style = {}, inputStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const s = _inputSizes[size];
  const border = error ? tokens.err : focus ? tokens.accent : tokens.border;
  const ring = focus ? (error
    ? `0 0 0 3px oklch(0.55 0.18 30 / 0.18)`
    : `0 0 0 3px ${tokens.accentDim}`) : 'none';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: disabled ? tokens.panel2 : tokens.panel,
      border: `1px solid ${border}`,
      borderRadius: 6, padding: `0 ${s.px}px`, height: s.h,
      boxShadow: ring, opacity: disabled ? 0.5 : 1,
      fontFamily: tokens.fontSans,
      transition: 'border-color 120ms, box-shadow 120ms',
      ...style,
    }}>
      {icon && <span style={{ color: tokens.textDim, fontSize: s.fs, lineHeight: 1 }}>{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        onFocus={e => { setFocus(true); onFocus && onFocus(e); }}
        onBlur={e => { setFocus(false); onBlur && onBlur(e); }}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        style={{
          flex: 1, fontSize: s.fs, color: tokens.text,
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: tokens.fontSans, minWidth: 0,
          ...inputStyle,
        }}
        {...rest}
      />
      {trailing && <span style={{ color: tokens.textDim, fontSize: s.fs - 1 }}>{trailing}</span>}
    </div>
  );
}

function Textarea({ value = '', onChange, placeholder, rows = 4, disabled, style = {} }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      style={{
        width: '100%', resize: 'vertical',
        background: tokens.panel,
        border: `1px solid ${focus ? tokens.accent : tokens.border}`,
        boxShadow: focus ? `0 0 0 3px ${tokens.accentDim}` : 'none',
        borderRadius: 6, padding: 10,
        fontSize: 13, color: tokens.text, lineHeight: 1.5,
        fontFamily: tokens.fontSans, outline: 'none',
        transition: 'all 120ms',
        ...style,
      }}
    />
  );
}

function Select({ value, onChange, options = [], placeholder = 'Select…', size = 'md', disabled, style = {} }) {
  const [focus, setFocus] = React.useState(false);
  const s = _inputSizes[size];
  return (
    <div style={{
      position: 'relative',
      height: s.h,
      background: disabled ? tokens.panel2 : tokens.panel,
      border: `1px solid ${focus ? tokens.accent : tokens.border}`,
      borderRadius: 6,
      boxShadow: focus ? `0 0 0 3px ${tokens.accentDim}` : 'none',
      transition: 'all 120ms',
      ...style,
    }}>
      <select
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        disabled={disabled}
        style={{
          width: '100%', height: '100%',
          padding: `0 ${s.px + 18}px 0 ${s.px}px`,
          background: 'transparent', border: 'none', outline: 'none',
          appearance: 'none', WebkitAppearance: 'none',
          fontSize: s.fs, color: value ? tokens.text : tokens.textDim,
          fontFamily: tokens.fontSans, cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {!value && <option value="">{placeholder}</option>}
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{
        position: 'absolute', right: s.px, top: '50%', transform: 'translateY(-50%)',
        color: tokens.textDim, fontSize: s.fs - 1, pointerEvents: 'none',
      }}>▾</span>
    </div>
  );
}

function Checkbox({ checked, onChange, label, indeterminate, disabled }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1, userSelect: 'none',
    }}>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={e => onChange && onChange(e.target.checked)}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{
        width: 16, height: 16, borderRadius: 4,
        background: checked || indeterminate ? tokens.accent : tokens.panel,
        border: `1px solid ${checked || indeterminate ? tokens.accent : tokens.borderStrong}`,
        display: 'grid', placeItems: 'center',
        color: '#0a0a0b', fontSize: 11,
        transition: 'all 120ms',
      }}>{indeterminate ? '−' : checked ? '✓' : ''}</div>
      {label && <span style={{ fontSize: 13 }}>{label}</span>}
    </label>
  );
}

function Radio({ checked, onChange, label, value, name, disabled }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1, userSelect: 'none',
    }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={!!checked}
        onChange={e => onChange && onChange(value ?? e.target.checked)}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{
        width: 16, height: 16, borderRadius: 999,
        background: tokens.panel,
        border: `1px solid ${checked ? tokens.accent : tokens.borderStrong}`,
        display: 'grid', placeItems: 'center',
        transition: 'all 120ms',
      }}>{checked && <div style={{ width: 7, height: 7, background: tokens.accent, borderRadius: 999 }}/>}</div>
      {label && <span style={{ fontSize: 13 }}>{label}</span>}
    </label>
  );
}

function Switch({ on, onChange, label, size = 'md', disabled }) {
  const w = size === 'sm' ? 28 : 36;
  const h = size === 'sm' ? 16 : 20;
  const knob = h - 4;
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1, userSelect: 'none',
    }}>
      <input
        type="checkbox"
        checked={!!on}
        onChange={e => onChange && onChange(e.target.checked)}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{
        width: w, height: h, borderRadius: 999,
        background: on ? tokens.accent : tokens.panel2,
        border: `1px solid ${on ? tokens.accent : tokens.border}`,
        position: 'relative', transition: 'all 160ms',
      }}>
        <div style={{
          position: 'absolute', top: 1, left: on ? w - knob - 3 : 1,
          width: knob, height: knob, borderRadius: 999,
          background: on ? '#0a0a0b' : tokens.text,
          transition: 'all 160ms',
        }}/>
      </div>
      {label && <span style={{ fontSize: 13 }}>{label}</span>}
    </label>
  );
}

function Slider({ value = 0, min = 0, max = 100, step = 1, onChange, showValue, disabled, style = {} }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 240, ...style }}>
      <div style={{ flex: 1, position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: '50% 0 0 0', transform: 'translateY(-50%)', height: 4, background: tokens.panel2, borderRadius: 999 }}/>
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0, width: `${pct}%`, height: 4, background: tokens.accent, borderRadius: 999 }}/>
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)',
          width: 14, height: 14, borderRadius: 999, background: tokens.text,
          border: `2px solid ${tokens.accent}`, boxShadow: tokens.shadow,
          pointerEvents: 'none',
        }}/>
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange && onChange(Number(e.target.value))}
          disabled={disabled}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
      </div>
      {showValue && <span style={{ fontFamily: tokens.fontMono, fontSize: 11, color: tokens.textMuted, minWidth: 28, textAlign: 'right' }}>{value}</span>}
    </div>
  );
}

function SearchInput({ value = '', onChange, placeholder = 'Search…', shortcut = '⌘K', width = 360, style = {} }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: tokens.panel2,
      border: `1px solid ${focus ? tokens.accent : tokens.border}`,
      boxShadow: focus ? `0 0 0 3px ${tokens.accentDim}` : 'none',
      borderRadius: 8, padding: '0 12px', height: 36,
      width, transition: 'all 120ms',
      ...style,
    }}>
      <span style={{ color: tokens.textDim }}>⌕</span>
      <input
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        style={{
          flex: 1, fontSize: 13, color: tokens.text,
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: tokens.fontSans,
        }}
      />
      {shortcut && (
        <span style={{
          fontFamily: tokens.fontMono, fontSize: 10, color: tokens.textDim,
          padding: '2px 6px', border: `1px solid ${tokens.border}`, borderRadius: 4,
        }}>{shortcut}</span>
      )}
    </div>
  );
}

Object.assign(window, { Input, Textarea, Select, Checkbox, Radio, Switch, Slider, SearchInput });
