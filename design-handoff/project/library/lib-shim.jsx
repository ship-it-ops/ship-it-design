// Shim: UIBtn / IconBtn — aliases that bridge older library specimens to
// the canonical components/ Button + IconButton primitives.
//
// Maps:
//   leading → icon
//   danger  → destructive
// Loads AFTER components/Button.jsx so window.Button is defined.

function UIBtn({ leading, variant = 'primary', children, ...rest }) {
  const v = variant === 'danger' ? 'destructive' : variant;
  return (
    <Button variant={v} icon={leading || rest.icon} {...rest}>{children}</Button>
  );
}

function IconBtn(props) {
  return <IconButton {...props}/>;
}

Object.assign(window, { UIBtn, IconBtn });
