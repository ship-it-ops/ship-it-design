// Library · Buttons — full variant × size × state matrix, live + code snippets.
// Uses the real Button, IconButton, ButtonGroup, SplitButton, FAB from components/.

function SecButtons() {
  const [toastMsg, setToastMsg] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <Section
      id="buttons"
      title="Buttons"
      count="48+"
      desc="Seven variants × three sizes × five states. Icon-only, split, groups, and FAB. One primary per surface — everything else defers."
    >
      <Subsection
        title="Variants"
        desc="primary, secondary, ghost, outline, destructive, success, link."
      >
        <Specimen
          code={`<Button variant="primary" icon="✦">Build graph</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="outline">More info</Button>
<Button variant="destructive" icon="×">Disconnect</Button>
<Button variant="success" icon="✓">Approve</Button>
<Button variant="link" trailing="→">Changelog</Button>`}
        >
          <Button variant="primary" icon="✦" onClick={() => setToastMsg('Primary clicked')}>
            Build graph
          </Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="outline">More info</Button>
          <Button variant="destructive" icon="×">
            Disconnect
          </Button>
          <Button variant="success" icon="✓">
            Approve
          </Button>
          <Button variant="link" trailing="→">
            Changelog
          </Button>
        </Specimen>
      </Subsection>

      <Subsection title="Sizes">
        <Specimen
          code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
        >
          <Button size="sm" variant="primary">
            Small
          </Button>
          <Button size="md" variant="primary">
            Medium
          </Button>
          <Button size="lg" variant="primary">
            Large
          </Button>
          <div style={{ width: 24 }} />
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <div style={{ width: 24 }} />
          <Button size="sm" variant="ghost">
            Small
          </Button>
          <Button size="md" variant="ghost">
            Medium
          </Button>
          <Button size="lg" variant="ghost">
            Large
          </Button>
        </Specimen>
      </Subsection>

      <Subsection
        title="States"
        desc="Hover and focus are live — tab into them. Loading and disabled don't accept clicks."
      >
        <Specimen
          gap={20}
          code={`<Button>Default</Button>
<Button loading>Running</Button>
<Button disabled>Disabled</Button>
<Button onClick={async () => { setLoading(true); await fetch(...); setLoading(false); }} loading={loading}>
  Run query
</Button>`}
        >
          <StateCell label="default">
            <Button variant="primary">Run query</Button>
          </StateCell>
          <StateCell label="hover (→)">
            <Button variant="primary" style={{ filter: 'brightness(1.08)' }}>
              Run query
            </Button>
          </StateCell>
          <StateCell label="focus (tab here)">
            <Button variant="primary">Run query</Button>
          </StateCell>
          <StateCell label="loading">
            <Button variant="primary" loading>
              Running
            </Button>
          </StateCell>
          <StateCell label="disabled">
            <Button variant="primary" disabled>
              Run query
            </Button>
          </StateCell>
          <StateCell label="live async">
            <Button
              variant="primary"
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1400);
              }}
            >
              {loading ? 'Running' : 'Click me'}
            </Button>
          </StateCell>
        </Specimen>
      </Subsection>

      <Subsection title="Full matrix" desc="Every variant × every size. For visual QA.">
        <Specimen code={`// variants × sizes × states — see variants above.`}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto repeat(3, 1fr)',
              gap: 12,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div />
            {['sm', 'md', 'lg'].map((sz) => (
              <div
                key={sz}
                style={{
                  fontFamily: FM,
                  fontSize: 9,
                  color: T.textDim,
                  textTransform: 'uppercase',
                }}
              >
                {sz}
              </div>
            ))}
            {['primary', 'secondary', 'ghost', 'outline', 'destructive', 'success', 'link'].map(
              (v) => (
                <React.Fragment key={v}>
                  <div style={{ fontFamily: FM, fontSize: 10, color: T.textMuted }}>{v}</div>
                  {['sm', 'md', 'lg'].map((sz) => (
                    <div key={sz}>
                      <Button variant={v} size={sz} icon={v === 'link' ? null : '✦'}>
                        Action
                      </Button>
                    </div>
                  ))}
                </React.Fragment>
              ),
            )}
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Icon buttons">
        <Specimen
          code={`<IconButton size="md" icon="✦"/>
<IconButton variant="ghost" icon="⌕"/>
<IconButton variant="outline" icon="⚙"/>`}
        >
          <IconButton size="sm" icon="✦" title="Ask" />
          <IconButton size="md" icon="✦" title="Ask" />
          <IconButton size="lg" icon="✦" title="Ask" />
          <div style={{ width: 24 }} />
          <IconButton variant="ghost" icon="⌕" title="Search" />
          <IconButton variant="outline" icon="⚙" title="Settings" />
          <IconButton icon="⋯" title="More" />
          <IconButton icon="+" title="Add" />
          <IconButton icon="×" title="Close" />
          <IconButton icon="↑" variant="ghost" />
          <IconButton icon="↓" variant="ghost" />
        </Specimen>
      </Subsection>

      <Subsection
        title="Button groups"
        desc="Segmented controls. Highlighted child indicates current selection."
      >
        <Specimen
          code={`<ButtonGroup>
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>`}
        >
          <LiveButtonGroup items={['Day', 'Week', 'Month', 'Year']} />
          <LiveButtonGroup items={['⊞', '☰', '⋮']} size="md" />
        </Specimen>
      </Subsection>

      <Subsection title="Split & compound">
        <Specimen
          code={`<SplitButton>Deploy</SplitButton>
<Button icon="↓" trailing="⌘S">Save</Button>`}
        >
          <SplitButton>Deploy</SplitButton>
          <Button variant="primary" icon="↓" trailing="⌘S">
            Save
          </Button>
          <Button variant="secondary" icon="⌘" trailing="⌘K">
            Command
          </Button>
          <Button variant="outline" trailing="→">
            Continue
          </Button>
        </Specimen>
      </Subsection>

      <Subsection title="Full-width">
        <Specimen code={`<Button fullWidth variant="primary">Sign in with Google</Button>`}>
          <div
            style={{
              width: '100%',
              maxWidth: 360,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <Button fullWidth variant="primary" icon="✦">
              Sign in with SSO
            </Button>
            <Button fullWidth variant="secondary">
              Continue with email
            </Button>
            <Button fullWidth variant="ghost">
              Skip for now
            </Button>
          </div>
        </Specimen>
      </Subsection>

      <Subsection title="Floating action button">
        <Specimen code={`<FAB icon="✦" onClick={...}/>`}>
          <FAB icon="✦" />
          <FAB icon="+" />
          <FAB icon="↑" />
        </Specimen>
      </Subsection>
    </Section>
  );
}

function LiveButtonGroup({ items, size = 'md' }) {
  const [i, setI] = React.useState(1);
  return (
    <ButtonGroup>
      {items.map((it, idx) => (
        <Button
          key={idx}
          size={size}
          variant="secondary"
          onClick={() => setI(idx)}
          style={i === idx ? { background: T.accentDim, color: T.accent } : {}}
        >
          {it}
        </Button>
      ))}
    </ButtonGroup>
  );
}

Object.assign(window, { SecButtons, LiveButtonGroup });
