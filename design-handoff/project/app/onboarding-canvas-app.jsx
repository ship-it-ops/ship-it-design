// Design canvas: 4 onboarding variants
// Each variant renders into a fixed 1280x800 artboard

function OnboardingCanvas() {
  const t = useTheme();
  const [personaA, setPersonaA] = React.useState('admin');
  const W = 1280, H = 800;

  // Wrap variants in a fixed-size container with theme provided.
  const Frame = ({ children }) => (
    <div style={{ width: W, height: H, background: t.bg, overflow: 'hidden' }}>
      {children}
    </div>
  );

  return (
    <DesignCanvas minScale={0.05} maxScale={2}>
      <DCSection
        id="admin"
        title="First-time admin · onboarding"
        subtitle="8 steps · workspace → connect → schema → build → ask → aha → invite → tour"
      >
        <DCArtboard id="a" label="A · Modal · Conventional" width={W} height={H}>
          <Frame><OnboardingVariantA persona="admin"/></Frame>
        </DCArtboard>
        <DCArtboard id="b" label="B · Transforming canvas · Conventional" width={W} height={H}>
          <Frame><OnboardingVariantB persona="admin"/></Frame>
        </DCArtboard>
        <DCArtboard id="c" label="C · Modal · Bold editorial" width={W} height={H}>
          <Frame><OnboardingVariantC persona="admin"/></Frame>
        </DCArtboard>
        <DCArtboard id="d" label="D · Canvas · Narrated build" width={W} height={H}>
          <Frame><OnboardingVariantD persona="admin"/></Frame>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="joiner"
        title="Invited teammate · onboarding"
        subtitle="Shortcut path — no connector setup, graph already exists"
      >
        <DCArtboard id="join-a" label="A · Join modal" width={W} height={H}>
          <Frame><OnboardingVariantA persona="joiner"/></Frame>
        </DCArtboard>
      </DCSection>

      <DCPostIt top={40} right={40} rotate={3} width={220}>
        Open any artboard fullscreen to actually click through it. Each variant is a real flow with state.
      </DCPostIt>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeCtx.Provider value={makeTheme('dark', 200)}>
    <OnboardingCanvas/>
  </ThemeCtx.Provider>
);
