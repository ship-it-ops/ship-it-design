// Avatar, AvatarGroup.

function _hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}
function _initials(name) {
  return (name || '?').split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function Avatar({ name = '?', src, size = 'md', status, style = {} }) {
  const dim = { xs: 20, sm: 24, md: 32, lg: 40, xl: 56 }[size] || size;
  const hue = _hashHue(name);
  const statusColor = {
    online: tokens.ok, busy: tokens.err, away: tokens.warn, offline: tokens.textDim,
  }[status];
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: dim, height: dim, ...style }}>
      <span style={{
        width: dim, height: dim, borderRadius: 999,
        background: src ? `url(${src}) center/cover no-repeat` : `oklch(0.4 0.1 ${hue})`,
        color: '#fff', display: 'grid', placeItems: 'center',
        fontSize: dim * 0.38, fontWeight: 600, fontFamily: tokens.fontSans,
        border: `1px solid ${tokens.border}`,
      }}>{!src && _initials(name)}</span>
      {status && (
        <span style={{
          position: 'absolute', bottom: 0, right: 0,
          width: dim * 0.3, height: dim * 0.3, borderRadius: 999,
          background: statusColor, border: `2px solid ${tokens.bg}`,
        }}/>
      )}
    </span>
  );
}

function AvatarGroup({ names = [], max = 3, size = 'md' }) {
  const dim = { xs: 20, sm: 24, md: 32, lg: 40, xl: 56 }[size] || size;
  const visible = names.slice(0, max);
  const rest = names.length - visible.length;
  return (
    <div style={{ display: 'inline-flex' }}>
      {visible.map((n, i) => (
        <span key={i} style={{ marginLeft: i === 0 ? 0 : -dim * 0.35 }}>
          <Avatar name={n} size={size}/>
        </span>
      ))}
      {rest > 0 && (
        <span style={{
          marginLeft: -dim * 0.35,
          width: dim, height: dim, borderRadius: 999,
          background: tokens.panel2, border: `1px solid ${tokens.border}`,
          color: tokens.textMuted, display: 'grid', placeItems: 'center',
          fontSize: dim * 0.35, fontFamily: tokens.fontMono,
        }}>+{rest}</span>
      )}
    </div>
  );
}

Object.assign(window, { Avatar, AvatarGroup });
