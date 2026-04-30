// Polished onboarding — standalone page

function PolishedOnboardingApp() {
  const [done, setDone] = React.useState(false);
  if (done) {
    return <DoneScreen onRestart={() => setDone(false)} />;
  }
  return <OnboardingFinal persona="admin" onFinish={() => setDone(true)} />;
}

function DoneScreen({ onRestart }) {
  const t = useTheme();
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        background: t.bg,
        color: t.text,
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>◆</div>
        <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.5, marginBottom: 8 }}>
          You're in.
        </div>
        <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 24 }}>
          The main app would load here — this is just the onboarding preview.
        </div>
        <Btn primary onClick={onRestart}>
          ↻ Replay onboarding
        </Btn>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeCtx.Provider value={makeTheme('dark', 200)}>
    <PolishedOnboardingApp />
  </ThemeCtx.Provider>,
);
