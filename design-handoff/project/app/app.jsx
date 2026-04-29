// Root app — routing + state

function App() {
  const [mode, setMode] = React.useState(() => localStorage.getItem('shipit-mode') || 'dark');
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState(() => {
    const saved = localStorage.getItem('shipit-page');
    return saved || 'home';
  });
  const [onboarding, setOnboarding] = React.useState(() => localStorage.getItem('shipit-onboarding') === '1');
  const [entityId, setEntityId] = React.useState(() => localStorage.getItem('shipit-entity') || 'payments-api');
  const [focusId, setFocusId] = React.useState(() => localStorage.getItem('shipit-focus') || 'payments-api');
  const [askSeed, setAskSeed] = React.useState('');
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [paletteSeed, setPaletteSeed] = React.useState('');

  const theme = React.useMemo(() => makeTheme(mode, tweaks.accentHue), [mode, tweaks.accentHue]);

  React.useEffect(() => localStorage.setItem('shipit-mode', mode), [mode]);
  React.useEffect(() => localStorage.setItem('shipit-page', page), [page]);
  React.useEffect(() => localStorage.setItem('shipit-entity', entityId), [entityId]);
  React.useEffect(() => localStorage.setItem('shipit-focus', focusId), [focusId]);

  React.useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
  }, [theme]);

  function nav(p, arg) {
    if (p === 'entity') setEntityId(arg || entityId);
    if (p === 'graph' && arg) setFocusId(arg);
    setPage(p);
  }

  function onAsk(seed) {
    if (seed) {
      setAskSeed(seed);
      setPage('ask');
    } else {
      setPaletteSeed('');
      setPaletteOpen(true);
    }
  }

  window.__openAsk = () => { setPaletteSeed(''); setPaletteOpen(true); };

  React.useEffect(() => localStorage.setItem('shipit-onboarding', onboarding ? '1' : '0'), [onboarding]);

  if (onboarding) {
    return (
      <ThemeCtx.Provider value={theme}>
        <Onboarding onFinish={() => { setOnboarding(false); setPage('home'); }}/>
        <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} mode={mode} setMode={setMode}/>
      </ThemeCtx.Provider>
    );
  }

  return (
    <ThemeCtx.Provider value={theme}>
      <Shell page={page} nav={nav} onAsk={onAsk} onRestartOnboarding={() => setOnboarding(true)}>
        {page === 'home' && <PageHome nav={nav} onAsk={onAsk}/>}
        {page === 'graph' && <PageGraph nav={nav} onAsk={onAsk} initialFocus={focusId}/>}
        {page === 'ask' && <PageAsk nav={nav} seed={askSeed}/>}
        {page === 'connectors' && <PageConnectors nav={nav}/>}
        {page === 'incident' && <PageIncident nav={nav} onAsk={onAsk}/>}
        {page === 'entity' && <PageEntity id={entityId} nav={nav} onAsk={onAsk}/>}
        {page === 'schema' && <ComingSoon label="Schema editor"/>}
        {page === 'activity' && <ComingSoon label="Activity stream"/>}
      </Shell>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onAsk={(q) => { setAskSeed(q); setPage('ask'); setPaletteOpen(false); }}
        nav={nav}
        seed={paletteSeed}
      />
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} mode={mode} setMode={setMode}/>
    </ThemeCtx.Provider>
  );
}

function ComingSoon({ label }) {
  const t = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>Not in this prototype.</div>
      <div style={{ color: t.textMuted, fontSize: 13 }}>Say the word and I'll design this surface too.</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
