// Ask — dedicated AI query page. Conversation-style + graph-aware results.

function PageAsk({ nav, seed }) {
  const t = useTheme();
  const [query, setQuery] = React.useState(seed || '');
  const [conversation, setConversation] = React.useState(() =>
    seed ? [{ role: 'user', text: seed }, makeAssistantReply(seed)] : [],
  );
  const [thinking, setThinking] = React.useState(false);

  React.useEffect(() => {
    if (seed && conversation.length === 0) {
      submit(seed);
    }
  }, []);

  function submit(q) {
    if (!q.trim()) return;
    const userMsg = { role: 'user', text: q };
    setConversation((c) => [...c, userMsg]);
    setQuery('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setConversation((c) => [...c, makeAssistantReply(q)]);
    }, 900);
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Left: history / suggestions */}
      <div
        style={{
          width: 240,
          borderRight: `1px solid ${t.border}`,
          background: t.panel,
          padding: '18px 14px',
          overflow: 'auto',
          flexShrink: 0,
        }}
      >
        <Btn
          primary
          style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}
          onClick={() => setConversation([])}
        >
          + New query
        </Btn>

        <SectionLabel>Suggested</SectionLabel>
        {SAMPLE_QUESTIONS.map((q) => (
          <div
            key={q}
            onClick={() => submit(q)}
            style={{
              padding: '8px 10px',
              fontSize: 12,
              color: t.textMuted,
              borderRadius: 6,
              cursor: 'pointer',
              marginBottom: 2,
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: t.accent, marginRight: 6 }}>✦</span>
            {q}
          </div>
        ))}

        <SectionLabel style={{ marginTop: 22 }}>Recent</SectionLabel>
        {['dependencies of auth-svc', 'who owns user-service', 'services in staging only'].map(
          (q) => (
            <div
              key={q}
              style={{
                padding: '8px 10px',
                fontSize: 12,
                color: t.textMuted,
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              {q}
            </div>
          ),
        )}
      </div>

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {conversation.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: t.textDim,
                fontFamily: MONO,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                marginBottom: 14,
              }}
            >
              Ask ShipIt
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 500,
                letterSpacing: -0.8,
                textAlign: 'center',
                marginBottom: 10,
                maxWidth: 700,
              }}
            >
              Ask anything about your <span style={{ color: t.accent }}>software ecosystem.</span>
            </div>
            <div
              style={{
                color: t.textMuted,
                fontSize: 14,
                maxWidth: 520,
                textAlign: 'center',
                marginBottom: 30,
              }}
            >
              Natural language queries over 247 services, 1,284 relationships, and 7 data sources.
              Uses the MCP server + Neo4j graph under the hood.
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: 780,
              }}
            >
              {SAMPLE_QUESTIONS.map((q) => (
                <div
                  key={q}
                  onClick={() => submit(q)}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    border: `1px solid ${t.border}`,
                    borderRadius: 999,
                    color: t.text,
                    background: t.panel,
                    cursor: 'pointer',
                  }}
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflow: 'auto', padding: '28px 40px 20px' }}>
            {conversation.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="fade-in" style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: t.textDim,
                      fontFamily: MONO,
                      textTransform: 'uppercase',
                      letterSpacing: 1.5,
                      marginBottom: 6,
                    }}
                  >
                    You asked
                  </div>
                  <div
                    style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.3 }}
                  >
                    {m.text}
                  </div>
                </div>
              ) : (
                <AssistantReply key={i} msg={m} nav={nav} />
              ),
            )}
            {thinking && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: t.textMuted,
                  fontSize: 12,
                  padding: '12px 0',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: t.accent,
                    animation: 'pulse 1s infinite',
                  }}
                />
                Traversing graph…
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div style={{ borderTop: `1px solid ${t.border}`, padding: 16, background: t.bg }}>
          <div
            style={{
              background: t.panel,
              border: `1px solid ${t.borderStrong}`,
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              maxWidth: 920,
              margin: '0 auto',
            }}
          >
            <span style={{ color: t.accent, fontSize: 14 }}>✦</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit(query);
              }}
              placeholder="Ask anything about your graph…"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: t.text,
                fontSize: 14,
                fontFamily: FONT,
              }}
            />
            <div style={{ fontSize: 10, color: t.textDim, fontFamily: MONO }}>⏎</div>
            <Btn small primary onClick={() => submit(query)}>
              Ask
            </Btn>
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 10,
              color: t.textDim,
              fontFamily: MONO,
              marginTop: 8,
            }}
          >
            Powered by MCP · 8 graph tools · results include full provenance
          </div>
        </div>
      </div>
    </div>
  );
}

function AssistantReply({ msg, nav }) {
  const t = useTheme();
  return (
    <div className="fade-in" style={{ marginBottom: 28 }}>
      <div
        style={{
          fontSize: 10,
          color: t.accent,
          fontFamily: MONO,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Dot color={t.accent} glow /> Shipit
      </div>

      <div
        style={{ fontSize: 15, lineHeight: 1.55, color: t.text, marginBottom: 18, maxWidth: 780 }}
      >
        {msg.lead}
      </div>

      {/* Tool calls */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {msg.tools.map((tool) => (
          <div
            key={tool}
            style={{
              padding: '4px 10px',
              fontSize: 10,
              fontFamily: MONO,
              background: t.panel2,
              border: `1px solid ${t.border}`,
              borderRadius: 4,
              color: t.textMuted,
            }}
          >
            <span style={{ color: t.ok }}>✓</span> {tool}
          </div>
        ))}
      </div>

      {/* Results card */}
      {msg.kind === 'impact' && (
        <Card style={{ marginBottom: 14 }}>
          <SectionLabel
            right={<span style={{ color: t.warn, fontFamily: MONO }}>BLAST RADIUS</span>}
          >
            Impacted services
          </SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {msg.items.map((i) => (
              <div
                key={i.name}
                onClick={() => nav('entity', i.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: t.panel2,
                  border: `1px solid ${t.border}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                <Dot color={i.tier === 1 ? t.err : i.tier === 2 ? t.warn : t.textMuted} />
                <MonoText style={{ fontSize: 12 }}>{i.name}</MonoText>
                <Pill style={{ marginLeft: 'auto' }}>tier {i.tier}</Pill>
              </div>
            ))}
          </div>
        </Card>
      )}

      {msg.kind === 'owner' && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {msg.facts.map(([k, v, c], i) => (
              <div
                key={k}
                style={{ padding: '4px 16px', borderLeft: i ? `1px solid ${t.border}` : 'none' }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: t.textDim,
                    fontFamily: MONO,
                    textTransform: 'uppercase',
                    letterSpacing: 1.3,
                    marginBottom: 4,
                  }}
                >
                  {k}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: c || t.text }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {msg.kind === 'list' && (
        <Card style={{ marginBottom: 14 }}>
          {msg.items.map((it, i) => (
            <div
              key={it.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '16px 180px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: '10px 0',
                borderTop: i ? `1px solid ${t.border}` : 'none',
              }}
            >
              <Dot color={t.accent} />
              <MonoText style={{ fontSize: 12 }}>{it.name}</MonoText>
              <span style={{ color: t.textMuted, fontSize: 12 }}>{it.note}</span>
              <span style={{ color: t.textDim, fontSize: 11, fontFamily: MONO }}>{it.meta}</span>
            </div>
          ))}
        </Card>
      )}

      {/* Follow-ups */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {msg.follows.map((f) => (
          <div
            key={f}
            style={{
              padding: '5px 10px',
              fontSize: 11,
              border: `1px solid ${t.border}`,
              borderRadius: 999,
              color: t.textMuted,
              background: t.panel,
              cursor: 'pointer',
            }}
          >
            → {f}
          </div>
        ))}
      </div>

      {/* Provenance */}
      <div
        style={{
          fontSize: 10,
          color: t.textDim,
          fontFamily: MONO,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>sourced from:</span>
        {msg.sources.map((s) => (
          <span
            key={s}
            style={{
              background: t.panel2,
              border: `1px solid ${t.border}`,
              borderRadius: 4,
              padding: '2px 6px',
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function makeAssistantReply(q) {
  const lower = q.toLowerCase();
  if (
    lower.includes('blast') ||
    lower.includes('impact') ||
    lower.includes('goes down') ||
    lower.includes('impacted')
  ) {
    return {
      role: 'assistant',
      lead: 'If payments-api goes down, 23 services lose functionality — 9 immediately, 14 transitively. Three are tier-1 customer flows: checkout, orders, and billing.',
      kind: 'impact',
      items: [
        { name: 'checkout-service', tier: 1 },
        { name: 'frontend-app', tier: 1 },
        { name: 'orders-svc', tier: 1 },
        { name: 'billing-worker', tier: 1 },
        { name: 'notif-queue', tier: 2 },
        { name: 'user-service', tier: 2 },
      ],
      tools: ['graph.get_blast_radius', 'graph.get_service', 'graph.traverse_depth'],
      sources: ['neo4j', 'github.codeowners', 'datadog.tags'],
      follows: ['Which SLOs would breach?', 'Who do I wake up?', 'Show me on the graph'],
    };
  }
  if (lower.includes('who owns') || lower.includes('owner') || lower.includes('on call')) {
    return {
      role: 'assistant',
      lead: 'checkout-service is owned by the payments-team. Maya S. is on-call until Friday 09:00 UTC. Escalation goes to Jordan K. (identity-team) for auth failures.',
      kind: 'owner',
      facts: [
        ['owner', 'payments-team', null],
        ['on-call', 'Maya S.', null],
        ['until', 'Fri 09:00', null],
        ['escalation', 'Jordan K.'],
      ],
      tools: ['graph.get_owner', 'pagerduty.get_schedule'],
      sources: ['github.codeowners', 'pagerduty.schedules'],
      follows: ['Page Maya now', "What's in the runbook?", 'See all payments-team services'],
    };
  }
  if (lower.includes('depend') || lower.includes('import')) {
    return {
      role: 'assistant',
      lead: 'Four services still depend on auth-lib. Three are tier-1. The oldest pin is 17 months, in billing-worker. Recommend a 4-week migration runway.',
      kind: 'list',
      items: [
        { name: 'billing-worker', note: 'pins v1.2.0 — oldest dependency', meta: '17mo' },
        { name: 'payments-api', note: 'pins v2.4.1', meta: '9mo' },
        { name: 'checkout-service', note: 'pins v2.4.1', meta: '9mo' },
        { name: 'admin-portal', note: 'pins v2.0.0', meta: '12mo' },
      ],
      tools: ['graph.find_dependents', 'github.get_deps'],
      sources: ['github.dependency-graph', 'neo4j'],
      follows: ['Draft migration plan', 'Who owns each?', 'Show me on the graph'],
    };
  }
  return {
    role: 'assistant',
    lead: "Here's what I found. Four services were deployed in the last 24 hours, two connectors are degraded, and one tier-1 service has a stale owner field (Backstage disagrees with GitHub).",
    kind: 'list',
    items: [
      { name: 'checkout-service', note: 'deployed v2.14.0 → production', meta: '12m' },
      { name: 'search-svc', note: 'deployed v1.8.3 → production', meta: '31m' },
      { name: 'user-service', note: 'new deployment in eu-west-1', meta: '2h' },
      { name: 'auth-svc', note: 'config change — session TTL +5m', meta: '6h' },
    ],
    tools: ['graph.search', 'graph.recent_changes'],
    sources: ['github', 'kubernetes', 'datadog'],
    follows: ['Show only tier-1', 'What broke in staging?', 'Who deployed these?'],
  };
}

Object.assign(window, { PageAsk });
