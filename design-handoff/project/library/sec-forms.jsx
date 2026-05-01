// Library · Forms — full live matrix with code snippets.
// Uses real Input, Textarea, Select, Checkbox, Radio, Switch, Slider, SearchInput from components/.

function Field({ label, hint, error, required, children, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label style={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: T.err, marginLeft: 4 }}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <div style={{ fontSize: 11, color: T.textDim }}>{hint}</div>}
      {error && <div style={{ fontSize: 11, color: T.err }}>{error}</div>}
    </div>
  );
}

/* ────── Composite pieces built on top of primitives ────── */

function Combobox({ options = [], placeholder = 'Search...' }) {
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const filtered = options.filter((o) => o.toLowerCase().includes(value.toLowerCase()));
  return (
    <div style={{ width: 260, position: 'relative' }}>
      <Input
        value={value}
        onChange={(v) => {
          setValue(v);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        trailing="⌕"
      />
      {open && filtered.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: T.panel,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            padding: 4,
            boxShadow: T.shadowLg,
            zIndex: 10,
            maxHeight: 200,
            overflow: 'auto',
          }}
        >
          {filtered.map((o, i) => (
            <div
              key={o}
              onMouseDown={() => {
                setValue(o);
                setOpen(false);
              }}
              style={{
                padding: '6px 8px',
                fontSize: 12,
                borderRadius: 4,
                cursor: 'pointer',
                color: T.text,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.accentDim)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OTP({ length = 6, onComplete }) {
  const [values, setValues] = React.useState(Array(length).fill(''));
  const refs = React.useRef([]);
  const onChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...values];
    next[i] = v;
    setValues(next);
    if (v && i < length - 1) refs.current[i + 1] && refs.current[i + 1].focus();
    if (next.every((x) => x) && onComplete) onComplete(next.join(''));
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) refs.current[i - 1].focus();
  };
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {values.map((c, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={c}
          maxLength={1}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          onFocus={(e) => e.target.select()}
          style={{
            width: 40,
            height: 48,
            textAlign: 'center',
            background: T.panel,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            fontFamily: FM,
            fontSize: 20,
            fontWeight: 500,
            color: T.text,
            outline: 'none',
            transition: 'all 120ms',
          }}
          onFocusCapture={(e) => {
            e.target.style.borderColor = T.accent;
            e.target.style.boxShadow = `0 0 0 3px ${T.accentDim}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = T.border;
            e.target.style.boxShadow = 'none';
          }}
        />
      ))}
    </div>
  );
}

function Calendar() {
  const [month, setMonth] = React.useState(3); // April
  const [selected, setSelected] = React.useState(23);
  const year = 2026;
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  return (
    <div
      style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: 16,
        width: 280,
        boxShadow: T.shadowLg,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          {monthNames[month]} {year}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <IconButton
            size="sm"
            variant="ghost"
            icon="‹"
            onClick={() => setMonth((m) => Math.max(0, m - 1))}
          />
          <IconButton
            size="sm"
            variant="ghost"
            icon="›"
            onClick={() => setMonth((m) => Math.min(11, m + 1))}
          />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontSize: 10,
              color: T.textDim,
              fontFamily: FM,
              padding: 4,
            }}
          >
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={'s' + i} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const isSelected = d === selected;
          return (
            <button
              key={d}
              onClick={() => setSelected(d)}
              style={{
                textAlign: 'center',
                fontSize: 12,
                padding: '6px 0',
                borderRadius: 4,
                background: isSelected ? T.accent : 'transparent',
                color: isSelected ? '#0a0a0b' : T.text,
                fontWeight: isSelected ? 600 : 400,
                border: 'none',
                cursor: 'pointer',
                fontFamily: FF,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = T.panel2;
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'transparent';
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Dropzone({ onFiles }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        onFiles && onFiles(e.dataTransfer.files);
      }}
      style={{
        background: hover ? T.accentDim : T.panel,
        border: `1.5px dashed ${hover ? T.accent : T.borderStrong}`,
        borderRadius: 10,
        padding: 32,
        textAlign: 'center',
        maxWidth: 420,
        transition: 'all 150ms',
      }}
    >
      <div style={{ fontSize: 28, color: hover ? T.accent : T.textDim, marginBottom: 8 }}>↥</div>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Drop files to ingest</div>
      <div style={{ fontSize: 11, color: T.textDim }}>
        or{' '}
        <span style={{ color: T.accent, textDecoration: 'underline', cursor: 'pointer' }}>
          browse
        </span>{' '}
        · .md, .pdf, .txt up to 50MB
      </div>
    </div>
  );
}

function FileChip({ name, size, progress, onRemove }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        background: T.panel2,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        maxWidth: 320,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          background: T.panel,
          border: `1px solid ${T.border}`,
          borderRadius: 4,
          display: 'grid',
          placeItems: 'center',
          fontSize: 9,
          fontFamily: FM,
          color: T.textDim,
        }}
      >
        PDF
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 10, color: T.textDim, fontFamily: FM }}>
          {size}
          {progress != null && ` · ${progress}%`}
        </div>
        {progress != null && (
          <div
            style={{
              marginTop: 4,
              height: 2,
              background: T.panel,
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: T.accent,
                transition: 'width 240ms',
              }}
            />
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        style={{
          background: 'transparent',
          border: 'none',
          color: T.textDim,
          cursor: 'pointer',
          fontSize: 14,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

function SecForms() {
  const [text, setText] = React.useState('');
  const [email, setEmail] = React.useState('invalid');
  const [area, setArea] = React.useState('Knowledge graph for our backend services.');
  const [env, setEnv] = React.useState('Production');
  const [flags, setFlags] = React.useState({ prs: true, issues: false, wiki: null });
  const [visibility, setVisibility] = React.useState('team');
  const [switches, setSwitches] = React.useState({ refresh: true, pub: false, compact: true });
  const [sliderVal, setSliderVal] = React.useState(65);
  const [search, setSearch] = React.useState('');

  return (
    <Section
      id="forms"
      title="Forms & Inputs"
      count="60+"
      desc="All form primitives: text, selection, toggles, composite inputs, and file ingestion. Focus ring uses accent with low-alpha glow; error uses err with matching glow. Everything is wired — type, tab, click, select."
    >
      <Subsection title="Text input · all states">
        <Specimen
          code={`const [v, setV] = useState('');
<Input value={v} onChange={setV} placeholder="name@org.com"/>
<Input value="ok" icon="✓" error={error}/>
<Input disabled value="Read-only"/>`}
        >
          <Col gap={12} style={{ width: 280 }}>
            <Field label="Default">
              <Input placeholder="org.shipit.com" value={text} onChange={setText} />
            </Field>
            <Field label="With icon">
              <Input placeholder="Search repos" icon="⌕" />
            </Field>
            <Field label="With trailing">
              <Input placeholder="0" trailing="USD" />
            </Field>
            <Field label="Error" error="Subdomain already taken">
              <Input value="acme" error={true} onChange={() => {}} />
            </Field>
            <Field label="Disabled">
              <Input value="Read-only value" disabled />
            </Field>
            <Field label="Password">
              <Input type="password" value="secret123" onChange={() => {}} />
            </Field>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Sizes">
        <Specimen
          code={`<Input size="sm" .../>
<Input size="md" .../>
<Input size="lg" .../>`}
        >
          <Col gap={10} style={{ width: 280 }}>
            <Input size="sm" value="Small" onChange={() => {}} placeholder="Small" />
            <Input size="md" value="Medium" onChange={() => {}} placeholder="Medium" />
            <Input size="lg" value="Large" onChange={() => {}} placeholder="Large" />
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Textarea & Select">
        <Specimen
          code={`<Textarea value={v} onChange={setV} rows={4}/>
<Select value={env} onChange={setEnv} options={['Production','Staging','Dev']}/>`}
        >
          <Col gap={10} style={{ minWidth: 320, flex: 1 }}>
            <Field label="Description">
              <Textarea value={area} onChange={setArea} rows={4} />
            </Field>
          </Col>
          <Col gap={10} style={{ width: 220 }}>
            <Field label="Environment">
              <Select
                value={env}
                onChange={setEnv}
                options={['Production', 'Staging', 'Development', 'Local']}
              />
            </Field>
            <Field label="Region">
              <Select
                placeholder="Choose region"
                options={['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1']}
              />
            </Field>
            <Field label="Size">
              <Select size="sm" placeholder="Small" options={['xs', 'sm', 'md', 'lg', 'xl']} />
            </Field>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Combobox / autocomplete" note="live filter">
        <Specimen code={`<Combobox options={['repo:shipit-api', 'repo:shipit-web', ...]}/>`}>
          <Combobox
            options={[
              'repo:shipit-api',
              'repo:shipit-web',
              'repo:shipit-ingest',
              'repo:shipit-graph',
              'repo:shipit-cli',
              'repo:shipit-docs',
            ]}
          />
        </Specimen>
      </Subsection>

      <Subsection title="Checkbox, Radio, Switch" note="live">
        <Specimen
          code={`<Checkbox checked={ingest.prs} onChange={v => setIngest({...ingest, prs: v})} label="Ingest PRs"/>
<Radio checked={vis === 'team'} onChange={() => setVis('team')} label="Everyone on team"/>
<Switch on={auto} onChange={setAuto} label="Auto-refresh"/>`}
        >
          <Col gap={16}>
            <Row gap={16}>
              <Checkbox
                checked={flags.prs}
                onChange={(v) => setFlags({ ...flags, prs: v })}
                label="Ingest PRs"
              />
              <Checkbox
                checked={flags.issues}
                onChange={(v) => setFlags({ ...flags, issues: v })}
                label="Ingest issues"
              />
              <Checkbox
                indeterminate={flags.wiki === null}
                checked={flags.wiki === true}
                onChange={(v) => setFlags({ ...flags, wiki: v })}
                label="Ingest wiki"
              />
              <Checkbox checked disabled label="Disabled" />
            </Row>
            <Row gap={16}>
              <Radio
                checked={visibility === 'team'}
                onChange={() => setVisibility('team')}
                label="Everyone on team"
              />
              <Radio
                checked={visibility === 'admins'}
                onChange={() => setVisibility('admins')}
                label="Admins only"
              />
              <Radio
                checked={visibility === 'custom'}
                onChange={() => setVisibility('custom')}
                label="Custom"
              />
              <Radio disabled label="Disabled" />
            </Row>
            <Row gap={16}>
              <Switch
                on={switches.refresh}
                onChange={(v) => setSwitches({ ...switches, refresh: v })}
                label="Auto-refresh"
              />
              <Switch
                on={switches.pub}
                onChange={(v) => setSwitches({ ...switches, pub: v })}
                label="Public to org"
              />
              <Switch
                on={switches.compact}
                onChange={(v) => setSwitches({ ...switches, compact: v })}
                size="sm"
                label="Compact"
              />
              <Switch disabled label="Disabled" />
            </Row>
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Slider" note="live">
        <Specimen code={`<Slider value={val} onChange={setVal} min={0} max={100} showValue/>`}>
          <Col gap={16}>
            <Slider value={sliderVal} onChange={setSliderVal} showValue />
            <Slider value={20} onChange={() => {}} showValue />
            <Slider
              value={sliderVal}
              onChange={setSliderVal}
              min={0}
              max={10}
              step={0.5}
              showValue
            />
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Search bar" note="⌘K">
        <Specimen code={`<SearchInput value={q} onChange={setQ} shortcut="⌘K"/>`}>
          <SearchInput value={search} onChange={setSearch} />
        </Specimen>
      </Subsection>

      <Subsection title="OTP input" note="live, auto-advance">
        <Specimen code={`<OTP length={6} onComplete={code => verify(code)}/>`}>
          <OTP length={6} />
        </Specimen>
      </Subsection>

      <Subsection title="Calendar" note="live">
        <Specimen bg={T.bg} code={`<Calendar value={date} onChange={setDate}/>`}>
          <Calendar />
        </Specimen>
      </Subsection>

      <Subsection title="File upload" note="drag me">
        <Specimen
          code={`<Dropzone onFiles={files => ingest(files)}/>
<FileChip name="runbook.pdf" size="2.4 MB" progress={100}/>`}
        >
          <Col gap={10}>
            <Dropzone />
            <FileChip name="runbook-oncall.pdf" size="2.4 MB" progress={100} onRemove={() => {}} />
            <FileChip name="architecture-v2.md" size="18 KB · uploading" progress={62} />
            <FileChip name="diagram.xlsx" size="failed" onRemove={() => {}} />
          </Col>
        </Specimen>
      </Subsection>

      <Subsection title="Empty state" desc="What to show when a form's data source is empty.">
        <Specimen
          bg={T.bg}
          code={`<EmptyState icon="⊙" title="No sources yet" description="..." action={<Button>Connect</Button>}/>`}
        >
          <div
            style={{
              padding: 48,
              textAlign: 'center',
              width: '100%',
              background: T.panel,
              border: `1px dashed ${T.border}`,
              borderRadius: 10,
            }}
          >
            <div style={{ fontSize: 28, color: T.textDim, marginBottom: 10 }}>⊙</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>No sources yet</div>
            <div
              style={{
                fontSize: 12,
                color: T.textMuted,
                maxWidth: 320,
                margin: '0 auto 16px',
                lineHeight: 1.55,
              }}
            >
              Connect GitHub, Notion, or Linear to start building your graph.
            </div>
            <Button variant="primary" icon="+">
              Connect source
            </Button>
          </div>
        </Specimen>
      </Subsection>
    </Section>
  );
}

Object.assign(window, { Field, Combobox, OTP, Calendar, Dropzone, FileChip, SecForms });
