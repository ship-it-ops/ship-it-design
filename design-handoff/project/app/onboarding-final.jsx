// Onboarding · Polished Final — Modal + Conventional
// Confident, brand-forward. Crafted motion. Magical build moment.
// 7 steps: workspace → connect → build → ask → aha → invite → tour

const STEPS_ADMIN = ['workspace', 'connect', 'build', 'ask', 'aha', 'invite', 'tour'];
const STEPS_JOINER = ['join', 'team', 'ask', 'aha', 'tour'];

function OnboardingFinal({ persona = 'admin', onFinish }) {
  const t = useTheme();
  const STEPS = persona === 'admin' ? STEPS_ADMIN : STEPS_JOINER;
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [workspace, setWorkspace] = React.useState('acme');
  const [sources, setSources] = React.useState({
    github: true,
    k8s: true,
    datadog: true,
    backstage: false,
    pagerduty: false,
  });
  const sCount = Object.values(sources).filter(Boolean).length;
  const cur = STEPS[step];

  const go = (d) => {
    const next = Math.max(0, Math.min(STEPS.length, step + d));
    if (next === STEPS.length) {
      onFinish && onFinish();
      return;
    }
    setDir(d);
    setStep(next);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: t.bg,
        color: t.text,
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      {/* Ambient background — graph materializes behind everything during build */}
      <OnboardingBackdrop step={cur} sourceCount={sCount} />

      {/* Top chrome */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '22px 28px',
          display: 'flex',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`,
              display: 'grid',
              placeItems: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#0a0a0b',
            }}
          >
            ◆
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: -0.1 }}>ShipIt</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, letterSpacing: 0.3 }}>
            {String(step + 1).padStart(2, '0')}
            <span style={{ opacity: 0.4 }}> / {String(STEPS.length).padStart(2, '0')}</span>
          </div>
          <div
            onClick={() => onFinish && onFinish()}
            style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, cursor: 'pointer' }}
          >
            skip setup →
          </div>
        </div>
      </div>

      {/* Centered modal */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(84%, 860px)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: `color-mix(in oklab, ${t.panel} 92%, transparent)`,
            border: `1px solid ${t.borderStrong}`,
            borderRadius: 18,
            boxShadow: `0 40px 120px -20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)`,
            overflow: 'hidden',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Progress hairline */}
          <StepProgress steps={STEPS} step={step} />

          {/* Animated step body */}
          <div style={{ position: 'relative', minHeight: 360 }}>
            <StepTransition stepKey={cur} dir={dir}>
              {cur === 'workspace' && (
                <StepWorkspace workspace={workspace} setWorkspace={setWorkspace} />
              )}
              {cur === 'connect' && <StepConnect sources={sources} setSources={setSources} />}
              {cur === 'build' && <StepBuild sources={sources} onDone={() => {}} />}
              {cur === 'ask' && <StepAsk />}
              {cur === 'aha' && <StepAha />}
              {cur === 'invite' && <StepInvite workspace={workspace} />}
              {cur === 'tour' && <StepTour />}
              {cur === 'join' && <StepJoin />}
              {cur === 'team' && <StepTeam />}
            </StepTransition>
          </div>

          {/* Footer */}
          <StepFooter
            step={step}
            total={STEPS.length}
            cur={cur}
            sources={sources}
            sCount={sCount}
            workspace={workspace}
            onBack={() => go(-1)}
            onNext={() => go(1)}
            onFinish={() => onFinish && onFinish()}
          />
        </div>

        {/* Decorative caption below card */}
        <div
          style={{
            marginTop: 18,
            textAlign: 'center',
            fontSize: 11,
            color: t.textDim,
            fontFamily: MONO,
            letterSpacing: 0.5,
          }}
        >
          {footerCaption(cur)}
        </div>
      </div>
    </div>
  );
}

function footerCaption(cur) {
  return (
    {
      workspace: '↵ enter to continue',
      connect: 'pick one or twelve · you can add more later',
      build: 'this would have taken your team three weeks',
      ask: 'every answer shows its sources',
      aha: "we looked around while you weren't watching",
      invite: 'your teammates already have services in the graph',
      tour: '⌘ K reaches ShipIt from anywhere',
      join: 'the graph already knows who you are',
      team: 'this is what you own',
    }[cur] || ''
  );
}

/* ─────────── Chrome ─────────── */

function StepProgress({ steps, step }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 4, padding: '18px 28px 0' }}>
      {steps.map((s, i) => (
        <div
          key={s}
          style={{
            flex: 1,
            height: 2,
            borderRadius: 2,
            background: i <= step ? t.accent : t.panel2,
            opacity: i < step ? 0.55 : 1,
            transition: 'background 0.4s, opacity 0.4s',
          }}
        />
      ))}
    </div>
  );
}

function StepFooter({ step, total, cur, sources, sCount, workspace, onBack, onNext, onFinish }) {
  const t = useTheme();
  const isLast = step === total - 1;
  const disabled =
    (cur === 'connect' && sCount === 0) || (cur === 'workspace' && !workspace.trim());
  const primaryLabel =
    cur === 'build'
      ? 'Continue →'
      : isLast
        ? 'Open ShipIt →'
        : cur === 'workspace'
          ? 'Set up workspace →'
          : cur === 'connect'
            ? `Build graph · ${sCount} source${sCount === 1 ? '' : 's'} →`
            : cur === 'invite'
              ? 'Send invites →'
              : 'Continue →';

  return (
    <div
      style={{
        borderTop: `1px solid ${t.border}`,
        padding: '14px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: t.panel2,
      }}
    >
      <div>
        {step > 0 ? (
          <span
            onClick={onBack}
            style={{
              fontSize: 11,
              color: t.textMuted,
              fontFamily: MONO,
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 5,
            }}
          >
            ← back
          </span>
        ) : (
          <span style={{ fontSize: 11, color: t.textDim, fontFamily: MONO, padding: '6px 10px' }}>
            ⌘⌥1 · setup
          </span>
        )}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        {!isLast && cur !== 'build' && cur !== 'connect' && cur !== 'workspace' && (
          <Btn small ghost onClick={onNext}>
            Skip
          </Btn>
        )}
        <Btn
          small
          primary
          onClick={isLast ? onFinish : onNext}
          style={disabled ? { opacity: 0.4, pointerEvents: 'none' } : {}}
        >
          {primaryLabel}
        </Btn>
      </div>
    </div>
  );
}

function StepTransition({ children, stepKey, dir }) {
  // Cross-fade + slide on step change. Keyed by stepKey so React remounts.
  const [prev, setPrev] = React.useState(null);
  const [curKey, setCurKey] = React.useState(stepKey);
  const [curChildren, setCurChildren] = React.useState(children);
  React.useEffect(() => {
    if (stepKey !== curKey) {
      setPrev({ key: curKey, children: curChildren, dir });
      setCurKey(stepKey);
      setCurChildren(children);
      const tid = setTimeout(() => setPrev(null), 360);
      return () => clearTimeout(tid);
    } else {
      setCurChildren(children); // same step, re-render
    }
    // eslint-disable-next-line
  }, [stepKey, children]);

  return (
    <div style={{ position: 'relative', padding: '34px 40px 32px' }}>
      {prev && (
        <div
          key={prev.key + '-out'}
          className="step-out"
          style={{
            position: 'absolute',
            inset: '34px 40px 32px',
            animationDirection: prev.dir > 0 ? 'normal' : 'reverse',
          }}
        >
          {prev.children}
        </div>
      )}
      <div key={curKey + '-in'} className={dir >= 0 ? 'step-in' : 'step-in-rev'}>
        {curChildren}
      </div>
      <style>{`
        @keyframes stepIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes stepInRev { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
        @keyframes stepOut { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-10px); } }
        .step-in { animation: stepIn 0.36s cubic-bezier(.2,.7,.2,1) both; }
        .step-in-rev { animation: stepInRev 0.36s cubic-bezier(.2,.7,.2,1) both; }
        .step-out { animation: stepOut 0.28s cubic-bezier(.4,.1,.8,.3) both; pointer-events: none; }
      `}</style>
    </div>
  );
}

Object.assign(window, { OnboardingFinal });
